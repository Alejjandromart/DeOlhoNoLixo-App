from fastapi import APIRouter, File, UploadFile, Form, HTTPException, Depends, Request
from typing import List, Optional
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.config import settings
from app.middleware.auth import verify_api_key
from app.models import AnalysisResult
from app.services import gemini_client
from app.utils.file_utils import validate_mime, stream_to_spooled
import json

from pydantic import BaseModel
import base64

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="", tags=["analyze"]) 

class AnalyzeBase64Request(BaseModel):
    images: List[str]
    latitude: Optional[float] = None
    longitude: Optional[float] = None

@router.post("/analyze-base64", response_model=AnalysisResult)
@limiter.limit(settings.RATE_LIMIT)
async def analyze_image_base64(
    request: Request,
    payload: AnalyzeBase64Request,
    _ = Depends(verify_api_key),
):
    if not payload.images:
        raise HTTPException(status_code=400, detail="No images provided")

    image_parts = []
    try:
        for img_str in payload.images:
            if "," in img_str:
                header, data_str = img_str.split(",", 1)
                mime_type = header.split(";")[0].split(":")[1]
            else:
                data_str = img_str
                mime_type = "image/jpeg"

            data = base64.b64decode(data_str)
            image_parts.append({
                "mime_type": mime_type,
                "data": data,
            })

        location_context = "Localização desconhecida."
        if payload.latitude is not None and payload.longitude is not None:
            location_context = f"Coordenadas GPS: Latitude {payload.latitude}, Longitude {payload.longitude}."

        prompt = f"""
        Analise esta(s) imagem(ns) de uma potencial denúncia ambiental de descarte irregular de lixo.

        Contexto Geográfico: {location_context}

        Regras Rígidas:
        - Não invente elementos que não apareçam claramente na imagem.
        - Não mencione o usuário.
        - Considere a localização apenas como contexto, sem criar fatos inexistentes.
        - Responda SOMENTE com um único objeto JSON (NUNCA retorne um array/lista "[ ... ]").
        - A resposta deve começar obrigatoriamente com o caractere '{{' e terminar com '}}'.
        - Não adicione texto, comentários ou markdown antes ou depois do JSON.

        Regra Especial para Imagens sem Lixo:
        - Se a imagem claramente NÃO contiver lixo, entulho, poluição ou descarte irregular (ex: fotos de pessoas, selfies, animais, interiores limpos, objetos domésticos isolados), você deve retornar APENAS:
        {{
          "noTrashDetected": true,
          "objectsDetected": []
        }}
        NÃO inclua mais nenhuma outra chave no JSON nesse caso. Isso é fundamental para evitar falhas ou truncamento de geração.

        Esquema do JSON para Imagens COM Lixo:
        O JSON gerado deve ter exatamente as seguintes chaves em inglês:
        - "noTrashDetected": false
        - "objectsDetected": lista de no máximo 5 strings com os principais objetos detectados na imagem que sejam EXCLUSIVAMENTE lixos, resíduos ou focos de poluição (ex: "pneu", "sofá", "plástico", "entulho"). NUNCA ultrapasse o limite de 5 itens. NUNCA inclua elementos de cenário/infraestrutura (ex: "muro", "arame farpado", "poste", "árvore", "estrada").
        - "geographicContext": descrição curta do local físico da denúncia (ex: calçada pública, terreno baldio, acostamento de rodovia).
        - "environmentalImpact": descrição realista do impacto ambiental provocado pelo acúmulo (ex: obstrução de escoamento de água gerando risco de alagamento, proliferação de focos de mosquito da dengue (Aedes aegypti) devido à água parada em recipientes/pneus, risco de incêndio por vegetação seca misturada ao lixo, contaminação do solo e lençol freático por chorume, atração de roedores e insetos nocivos).
        - "severity": classificação de gravidade ("Baixo", "Médio" ou "Crítico").
        - "suggestedCategory": sugestão de categoria exata da denúncia (deve ser obrigatoriamente um destes: "Doméstico", "Hospitalar", "Industrial", "Entulho", "Eletrônico" ou "Ambiental").
        - "suggestedDescription": uma descrição de no máximo 500 caracteres, muito detalhada, específica e objetiva do problema observado, escrita em português formal sob a perspectiva de um cidadão indignado com o descaso ambiental e a falta de limpeza no local. O texto deve expressar preocupação e urgência em relação ao acúmulo de sujeira e os perigos que isso traz para a comunidade. NUNCA ultrapasse o limite de 500 caracteres.
        """

        from app.services.gemini_client import sanitize_prompt
        safe_prompt = sanitize_prompt(prompt)

        contents = [safe_prompt] + image_parts
        data = gemini_client.generate_analysis(contents)

        if not isinstance(data, dict):
            raise HTTPException(status_code=502, detail="Invalid AI response format")

        if data.get("noTrashDetected") is True or not data.get("objectsDetected"):
            raise HTTPException(status_code=400, detail="Esta imagem não parece conter focos de lixo ou poluição. Por favor, envie uma foto de um descarte de lixo real.")

        required = {"objectsDetected","geographicContext","environmentalImpact","severity","suggestedCategory","suggestedDescription"}
        if not required.issubset(data.keys()):
            raise HTTPException(status_code=502, detail="AI response missing required fields")

        data.pop("noTrashDetected", None)
        return AnalysisResult(**data)

    except HTTPException:
        raise
    except json.JSONDecodeError as jde:
        print(f"JSONDecodeError base64: {jde}")
        raise HTTPException(
            status_code=502,
            detail="A resposta da inteligência artificial foi incompleta ou inválida. Por favor, tente enviar a foto novamente."
        )
    except Exception as e:
        print(f"Error base64: {e}")
        error_msg = str(e)
        if "credits are depleted" in error_msg or "429" in error_msg:
            raise HTTPException(status_code=502, detail="API do Gemini sem créditos ou limite atingido. Verifique o AI Studio.")
        raise HTTPException(status_code=500, detail=f"Failed to analyze images: {error_msg}")

# Rate limit decorator (usa settings.RATE_LIMIT)
@router.post("/analyze", response_model=AnalysisResult)
@limiter.limit(settings.RATE_LIMIT)
async def analyze_image(
    request: Request, # Required for limiter
    files: List[UploadFile] = File(...),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    _ = Depends(verify_api_key),
):
    if not files:
        raise HTTPException(status_code=400, detail="No images provided")

    # Validate files one by one and stream to temp
    image_parts = []
    try:
        for file in files:
            if not validate_mime(file.content_type, settings.ALLOWED_MIME):
                raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}")

            # stream to temp to avoid large memory usage
            try:
                spooled = await stream_to_spooled(file)
            except ValueError:
                raise HTTPException(status_code=400, detail="File too large")

            # read bytes in controlled manner
            data = spooled.read()
            image_parts.append({
                "mime_type": file.content_type,
                "data": data,
            })
            spooled.close()

        location_context = "Localização desconhecida."
        if latitude is not None and longitude is not None:
            location_context = f"Coordenadas GPS: Latitude {latitude}, Longitude {longitude}."

        prompt = f"""
        Analise esta(s) imagem(ns) de uma potencial denúncia ambiental de descarte irregular de lixo.

        Contexto Geográfico: {location_context}

        Regras Rígidas:
        - Não invente elementos que não apareçam claramente na imagem.
        - Não mencione o usuário.
        - Considere a localização apenas como contexto, sem criar fatos inexistentes.
        - Responda SOMENTE com um único objeto JSON (NUNCA retorne um array/lista "[ ... ]").
        - A resposta deve começar obrigatoriamente com o caractere '{{' e terminar com '}}'.
        - Não adicione texto, comentários ou markdown antes ou depois do JSON.

        Regra Especial para Imagens sem Lixo:
        - Se a imagem claramente NÃO contiver lixo, entulho, poluição ou descarte irregular (ex: fotos de pessoas, selfies, animais, interiores limpos, objetos domésticos isolados), você deve retornar APENAS o seguinte JSON:
        {{
          "noTrashDetected": true,
          "objectsDetected": []
        }}
        NÃO inclua nenhuma outra chave no JSON nesse caso. Isso é extremamente importante para evitar problemas de limite ou truncamento de geração.

        Esquema do JSON para Imagens COM Lixo:
        O JSON gerado deve ter exatamente as seguintes chaves em inglês:
        - "noTrashDetected": false
        - "objectsDetected": lista de no máximo 5 strings com os principais objetos detectados na imagem que sejam EXCLUSIVAMENTE lixos, resíduos ou focos de poluição (ex: "pneu", "sofá", "plástico", "entulho"). NUNCA ultrapasse o limite de 5 itens. NUNCA inclua elementos de cenário/infraestrutura (ex: "muro", "arame farpado", "poste", "árvore", "estrada").
        - "geographicContext": descrição curta do local físico da denúncia (ex: calçada pública, terreno baldio, acostamento de rodovia).
        - "environmentalImpact": descrição realista do impacto ambiental provocado pelo acúmulo (ex: obstrução de escoamento de água gerando risco de alagamento, proliferação de focos de mosquito da dengue (Aedes aegypti) devido à água parada em recipientes/pneus, risco de incêndio por vegetação seca misturada ao lixo, contaminação do solo e lençol freático por chorume, atração de roedores e insetos nocivos).
        - "severity": classificação de gravidade ("Baixo", "Médio" ou "Crítico").
        - "suggestedCategory": sugestão de categoria exata da denúncia (deve ser obrigatoriamente um destes: "Doméstico", "Hospitalar", "Industrial", "Entulho", "Eletrônico" ou "Ambiental").
        - "suggestedDescription": uma descrição de no máximo 500 caracteres, muito detalhada, específica e objetiva do problema observado, escrita em português formal sob a perspectiva de um cidadão indignado com o descaso ambiental e a falta de limpeza no local. O texto deve expressar preocupação e urgência em relação ao acúmulo de sujeira e os perigos que isso traz para a comunidade. NUNCA ultrapasse o limite de 500 caracteres.
        """

        # sanitize prompt
        from app.services.gemini_client import sanitize_prompt
        safe_prompt = sanitize_prompt(prompt)

        contents = [safe_prompt] + image_parts

        data = gemini_client.generate_analysis(contents)
        print("Parsed Data from Gemini:", data)

        # Basic sanity checks on response
        if not isinstance(data, dict):
            print("Validation Error: parsed data is not a dictionary. Type found:", type(data))
            raise HTTPException(status_code=502, detail="Invalid AI response format")

        if data.get("noTrashDetected") is True or not data.get("objectsDetected"):
            raise HTTPException(status_code=400, detail="Esta imagem não parece conter focos de lixo ou poluição. Por favor, envie uma foto de um descarte de lixo real.")

        # Validate required keys
        required = {"objectsDetected","geographicContext","environmentalImpact","severity","suggestedCategory","suggestedDescription"}
        if not required.issubset(data.keys()):
            missing = required - data.keys()
            print("Validation Error: missing required fields in Gemini response:", missing)
            raise HTTPException(status_code=502, detail=f"AI response missing required fields: {missing}")

        data.pop("noTrashDetected", None)
        return AnalysisResult(**data)

    except HTTPException:
        raise
    except json.JSONDecodeError as jde:
        print(f"JSONDecodeError: {jde}")
        raise HTTPException(
            status_code=502,
            detail="A resposta da inteligência artificial foi incompleta ou inválida. Por favor, tente enviar a foto novamente."
        )
    except Exception as e:
        # Any unexpected error
        print(f"Error: {e}")
        error_msg = str(e)
        if "credits are depleted" in error_msg or "429" in error_msg:
            raise HTTPException(status_code=502, detail="API do Gemini sem créditos ou limite atingido. Verifique o AI Studio.")
        raise HTTPException(status_code=500, detail=f"Failed to analyze images: {error_msg}")

from fastapi import BackgroundTasks
from app.services.email_service import send_report_email

class EmailReportRequest(BaseModel):
    category: str
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    description: str
    images: List[str] = []

@router.post("/send-report-email")
async def send_report_email_endpoint(
    payload: EmailReportRequest,
    background_tasks: BackgroundTasks,
    _ = Depends(verify_api_key),
):
    background_tasks.add_task(
        send_report_email,
        category=payload.category,
        location=payload.location,
        latitude=payload.latitude,
        longitude=payload.longitude,
        description=payload.description,
        images=payload.images
    )
    return {"status": "enqueuing", "message": "Email sending queued in background"}

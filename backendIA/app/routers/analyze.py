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

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="", tags=["analyze"]) 

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
        Analise esta(s) imagem(ns) de uma potencial denúncia ambiental.

        Contexto Geográfico: {location_context}

        Regras Rígidas:
        - Não invente elementos que não apareçam claramente na imagem.
        - Não mencione o usuário.
        - Considere a localização apenas como contexto, sem criar fatos inexistentes.
        - Responda SOMENTE no formato JSON.

        Tarefas:
        1. Detecte os objetos visíveis relacionados a lixo ou poluição (ex: garrafas plásticas, entulho, lixo hospitalar).
        2. Analise o contexto geográfico visual (ex: perto de rio, área urbana, floresta).
        3. Calcule o impacto ambiental combinando os objetos e o local.
        4. Classifique a gravidade em: \"Nenhuma\", \"Baixo\", \"Médio\" ou \"Crítico\".
        5. Sugira uma categoria para a denúncia (ex: Doméstico, Hospitalar, Industrial, Entulho, Eletrônico, Ambiental).
        6. Escreva uma descrição curta e formal sugerida para a denúncia.
        """

        # sanitize prompt
        from app.services.gemini_client import sanitize_prompt
        safe_prompt = sanitize_prompt(prompt)

        contents = [safe_prompt] + image_parts

        data = gemini_client.generate_analysis(contents)

        # Basic sanity checks on response
        if not isinstance(data, dict):
            raise HTTPException(status_code=502, detail="Invalid AI response format")

        # Validate required keys
        required = {"objectsDetected","geographicContext","environmentalImpact","severity","suggestedCategory","suggestedDescription"}
        if not required.issubset(data.keys()):
            raise HTTPException(status_code=502, detail="AI response missing required fields")

        return AnalysisResult(**data)

    except HTTPException:
        raise
    except Exception as e:
        # Any unexpected error
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to analyze images")

import os
import json
import uuid
from typing import List, Optional
from datetime import datetime
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from pydantic import BaseModel
from dotenv import load_dotenv
from services.orgao_service import OrgaoService
from services.notificacao_service import NotificacaoService
from models.denuncia import Denuncia

load_dotenv()

app = FastAPI(
    title="DeOlhoNoLixo AI API",
    description="API de Análise de Denúncias com Inteligência Artificial",
    version="2.0.0"
)

# Inicializar serviços
orgao_service = OrgaoService()
notificacao_service = NotificacaoService()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
# Using the provided key as fallback
API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=API_KEY)

# Generation Config
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 4096,
    "response_mime_type": "application/json",
}

model = genai.GenerativeModel(
    model_name="gemini-2.5-flash",
    generation_config=generation_config,
)

class AnalysisResult(BaseModel):
    objectsDetected: List[str]
    geographicContext: str
    environmentalImpact: str
    severity: str
    suggestedCategory: str
    suggestedDescription: str

@app.post("/analyze", response_model=AnalysisResult)
async def analyze_image(
    files: List[UploadFile] = File(...),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None)
):
    if not files:
        raise HTTPException(status_code=400, detail="No images provided")

    try:
        # Prepare images for Gemini
        image_parts = []
        for file in files:
            content = await file.read()
            image_parts.append({
                "mime_type": file.content_type,
                "data": content
            })

        # Context
        location_context = "Localização desconhecida."
        if latitude is not None and longitude is not None:
            location_context = f"Coordenadas GPS: Latitude {latitude}, Longitude {longitude}."

        prompt = f"""
        Analyze this image(s) of a potential environmental complaint.
        
        Geographic Context: {location_context}
        
        Strict Rules:
        - Do not invent elements that are not clearly visible in the image.
        - Do not mention the user.
        - Consider the location only as context, without creating non-existent facts.
        - Respond ONLY in JSON format with the exact field names specified below.
        
        Tasks:
        1. Detect visible objects related to trash or pollution (e.g., plastic bottles, debris, medical waste).
        2. Analyze the visual geographic context (e.g., near river, urban area, forest).
        3. Calculate the environmental impact by combining the objects and location.
        4. Classify severity as: "Nenhuma", "Baixo", "Médio", or "Crítico".
        5. Suggest a category for the complaint (e.g., Doméstico, Hospitalar, Industrial, Entulho, Eletrônico, Ambiental).
        6. Write a short, formal suggested description for the complaint IN PORTUGUESE.
        
        REQUIRED JSON FORMAT (use these exact field names):
        {{
            "objectsDetected": ["object1", "object2"],
            "geographicContext": "description of location",
            "environmentalImpact": "impact analysis",
            "severity": "Baixo/Médio/Crítico",
            "suggestedCategory": "category name",
            "suggestedDescription": "formal description in Portuguese"
        }}
        """

        response = model.generate_content(
            contents=[prompt] + image_parts
        )
        
        result_text = response.text
        # Clean up json if needed
        if result_text.startswith("```json"):
            result_text = result_text[7:]
        if result_text.endswith("```"):
            result_text = result_text[:-3]
            
        data = json.loads(result_text)
        
        return data

    except Exception as e:
        print(f"Error analyzing image: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {
        "status": "online", 
        "service": "DeOlhoNoLixo AI API",
        "version": "2.0.0",
        "endpoints": {
            "analyze": "/analyze",
            "analyze_and_notify": "/analyze-and-notify",
            "orgaos": "/orgaos"
        }
    }

@app.post("/analyze-and-notify")
async def analyze_and_notify(
    files: List[UploadFile] = File(...),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    localizacao: str = Form(None),
    usuario: str = Form(None),
    categoria: str = Form("ambiental"),
):
    """
    Analisa imagens com IA E notifica órgão responsável automaticamente
    Implementa o fluxo completo: Análise → Identificação do órgão → Notificação
    """
    try:
        print("🤖 Iniciando análise e notificação...")
        
        # Preparar imagens para Gemini
        image_parts = []
        for file in files:
            content = await file.read()
            image_parts.append({
                "mime_type": file.content_type,
                "data": content
            })
        
        # Context
        location_context = "Localização desconhecida."
        if latitude is not None and longitude is not None:
            location_context = f"Coordenadas GPS: Latitude {latitude}, Longitude {longitude}."
        
        prompt = f"""
        Analyze this image(s) of a potential environmental complaint.
        
        Geographic Context: {location_context}
        
        Strict Rules:
        - Do not invent elements that are not clearly visible in the image.
        - Do not mention the user.
        - Consider the location only as context, without creating non-existent facts.
        - Respond ONLY in JSON format with the exact field names specified below.
        
        Tasks:
        1. Detect visible objects related to trash or pollution (e.g., plastic bottles, debris, medical waste).
        2. Analyze the visual geographic context (e.g., near river, urban area, forest).
        3. Calculate the environmental impact by combining the objects and location.
        4. Classify severity as: "Nenhuma", "Baixo", "Médio", or "Crítico".
        5. Suggest a category for the complaint (e.g., Doméstico, Hospitalar, Industrial, Entulho, Eletrônico, Ambiental).
        6. Write a short, formal suggested description for the complaint IN PORTUGUESE.
        
        REQUIRED JSON FORMAT (use these exact field names):
        {{
            "objectsDetected": ["object1", "object2"],
            "geographicContext": "description of location",
            "environmentalImpact": "impact analysis",
            "severity": "Baixo/Médio/Crítico",
            "suggestedCategory": "category name",
            "suggestedDescription": "formal description in Portuguese"
        }}
        """
        
        response = model.generate_content(
            contents=[prompt] + image_parts
        )
        
        result_text = response.text
        if result_text.startswith("```json"):
            result_text = result_text[7:]
        if result_text.endswith("```"):
            result_text = result_text[:-3]
        
        analise = json.loads(result_text)
        
        # Criar objeto Denuncia
        denuncia = Denuncia(
            id=str(uuid.uuid4()),
            nomeUsuario=usuario or "Anônimo",
            descricao=analise.get("suggestedDescription", ""),
            localizacao=localizacao or "Não especificada",
            coordenadas=f"{latitude},{longitude}" if latitude and longitude else "",
            imagens=[],  # URLs das imagens (já carregadas)
            status="pendente",
            dataCriacao=datetime.now(),
            categoria=categoria,
            gravidade=analise.get("severity", "Médio"),
            tags=analise.get("objectsDetected", []),
            impactoAmbiental=analise.get("environmentalImpact", ""),
            contextoGeografico=analise.get("geographicContext", "")
        )
        
        # Obter órgão responsável
        cidade = "Manaus"  # Extrair da localização se possível
        orgao = orgao_service.obter_orgao_por_categoria(categoria, cidade)
        
        if not orgao:
            print("⚠️ Nenhum órgão responsável encontrado")
            return {
                "analise": analise,
                "notificacao": "nenhum_orgao_encontrado",
                "denuncia_id": denuncia.id
            }
        
        # Notificar órgão (implementa receberNotificacao do UML)
        resumo = f"{analise.get('environmentalImpact', '')} {analise.get('geographicContext', '')}"
        
        try:
            await notificacao_service.receberNotificacao(orgao, denuncia, resumo)
            notificacao_status = "enviada_com_sucesso"
        except Exception as e:
            print(f"⚠️ Erro ao notificar: {e}")
            notificacao_status = "erro_ao_enviar"
        
        return {
            "analise": analise,
            "orgao": orgao.to_dict(),
            "notificacao": notificacao_status,
            "denuncia_id": denuncia.id
        }
        
    except Exception as e:
        print(f"❌ Erro: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/orgaos")
async def listar_orgaos(cidade: Optional[str] = None):
    """Lista órgãos responsáveis cadastrados"""
    orgaos = orgao_service.listar_orgaos_ativos(cidade)
    return {
        "total": len(orgaos),
        "orgaos": [o.to_dict() for o in orgaos]
    }

@app.get("/orgaos/{orgao_id}")
async def obter_orgao(orgao_id: str):
    """Obtém detalhes de um órgão específico"""
    orgao = orgao_service.obter_orgao_por_id(orgao_id)
    if not orgao:
        raise HTTPException(status_code=404, detail="Órgão não encontrado")
    return orgao.to_dict()

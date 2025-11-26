import os
import json
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

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
        4. Classifique a gravidade em: "Nenhuma", "Baixo", "Médio" ou "Crítico".
        5. Sugira uma categoria para a denúncia (ex: Doméstico, Hospitalar, Industrial, Entulho, Eletrônico, Ambiental).
        6. Escreva uma descrição curta e formal sugerida para a denúncia.
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
    return {"status": "online", "service": "DeOlho NoLixo AI API"}

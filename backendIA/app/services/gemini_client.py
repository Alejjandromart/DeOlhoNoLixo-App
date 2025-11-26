import os
import json
import logging
from typing import List
from app.config import settings

import google.generativeai as genai

logger = logging.getLogger("deolho.gemini")

if not settings.GEMINI_API_KEY:
    # We will log a warning instead of crashing, to allow app to start even if key is missing (for dev)
    logger.warning("Gemini API key missing. Set GEMINI_API_KEY in env.")
else:
    genai.configure(api_key=settings.GEMINI_API_KEY)

# Geração de prompt segura: sanitização simples (com possibilidade de ampliar)
DANGEROUS_PATTERNS = ["ignore previous", "forget rules", "system:", "developer:"]

def sanitize_prompt(text: str) -> str:
    t = text
    for p in DANGEROUS_PATTERNS:
        t = t.replace(p, "")
    # mais regras podem ser adicionadas
    return t


def generate_analysis(contents: List[dict]) -> dict:
    """contents: lista que começa com prompt string e depois imagens como dicts {mime_type, data}
    Retorna JSON decodificado com checagem.
    """
    try:
        generation_config = {
            "temperature": 0.2,
            "top_p": 0.9,
            "top_k": 40,
            "max_output_tokens": 1024,
            "response_mime_type": "application/json",
        }

        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash", # Using 1.5 flash as requested/used previously
            generation_config=generation_config,
        )

        response = model.generate_content(contents=contents)
        result_text = response.text

        # remove ``` markers
        if result_text.startswith("```json"):
            result_text = result_text[7:]
        if result_text.endswith("```"):
            result_text = result_text[:-3]

        data = json.loads(result_text)
        return data
    except Exception as e:
        logger.exception("Gemini request failed: %s", e)
        raise

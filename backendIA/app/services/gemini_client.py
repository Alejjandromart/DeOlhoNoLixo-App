import os
import json
import logging
from typing import List
from app.config import settings

import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

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
            "max_output_tokens": 2048,
            "response_mime_type": "application/json",
        }

        safety_settings = {
            HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
        }

        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash-lite",
            generation_config=generation_config,
            safety_settings=safety_settings,
        )

        response = model.generate_content(contents=contents)
        result_text = response.text
        print("Gemini Raw Response:", result_text)

        # Extract JSON: always prefer a single object '{...}'
        first_brace = result_text.find("{")
        first_bracket = result_text.find("[")

        start_idx = -1
        end_idx = -1
        is_list = False

        if first_brace != -1 and (first_bracket == -1 or first_brace < first_bracket):
            # Starts with object - ideal
            start_idx = first_brace
            end_idx = result_text.rfind("}")
        elif first_bracket != -1:
            # Gemini returned a list - extract it, then take first element
            start_idx = first_bracket
            end_idx = result_text.rfind("]")
            is_list = True

        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            json_str = result_text[start_idx:end_idx + 1]
        else:
            json_str = result_text

        data = json.loads(json_str)

        # If Gemini returned a list, extract the first element
        if isinstance(data, list):
            if len(data) == 0:
                raise ValueError("Gemini returned an empty list instead of a JSON object")
            logger.warning("Gemini returned a list instead of an object - extracting first element")
            data = data[0]

        return data
    except Exception as e:
        logger.exception("Gemini request failed: %s", e)
        raise

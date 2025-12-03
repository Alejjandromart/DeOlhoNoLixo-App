import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    BACKEND_API_KEY: str = os.getenv("BACKEND_API_KEY", "sua_chave_backend_inventada")
    ALLOWED_ORIGINS: list[str] = ["*"]
    MAX_UPLOAD_MB: int = 5
    ALLOWED_MIME: list[str] = ["image/jpeg", "image/png", "image/webp"]
    RATE_LIMIT: str = "10/minute"
    DEBUG: bool = os.getenv("DEBUG", "False") == "True"
    
    # Configuração do Redis
    REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", "6379"))
    REDIS_DB: int = int(os.getenv("REDIS_DB", "0"))
    REDIS_TTL: int = int(os.getenv("REDIS_TTL", "60"))  # segundos
    REDIS_PASSWORD: str = os.getenv("REDIS_PASSWORD", "")

    # Configuração do Firebase
    FIREBASE_CREDENTIALS_PATH: str = os.getenv("FIREBASE_CREDENTIALS_PATH", "serviceAccountKey.json")

    # URL da API
    API_URL: str = os.getenv("API_URL", "http://127.0.0.1:8000/feed")

    class Config:
        env_file = ".env"

settings = Settings()


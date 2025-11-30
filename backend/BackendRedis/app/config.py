import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GEMINI_API_KEY: str
    BACKEND_API_KEY: str
    ALLOWED_ORIGINS: list[str] = ["*"]
    MAX_UPLOAD_MB: int = 5
    ALLOWED_MIME: list[str] = ["image/jpeg", "image/png", "image/webp"]
    RATE_LIMIT: str = "10/minute"
    DEBUG: bool = True
    
    # Configuração do Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_TTL: int = 60  # segundos
    REDIS_PASSWORD: str = "DeOlhoNoLixoSecure2024!"

    # Configuração do Firebase
    FIREBASE_CREDENTIALS_PATH: str = "serviceAccountKey.json"

    class Config:
        env_file = ".env"

settings = Settings()

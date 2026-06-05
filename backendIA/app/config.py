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

    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_SENDER: str = ""
    EMAIL_RECIPIENT: str = "semulsp@pmm.am.gov.br"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

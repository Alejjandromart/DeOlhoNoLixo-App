import redis
import firebase_admin
from firebase_admin import credentials, firestore
from app.config import settings
import os

# Conexão Redis com fallback
redis_client = None
redis_available = False

try:
    redis_client = redis.Redis(
        host=settings.REDIS_HOST,
        port=settings.REDIS_PORT,
        db=settings.REDIS_DB,
        password=settings.REDIS_PASSWORD,
        decode_responses=True,
        socket_connect_timeout=2  # Timeout rápido
    )
    # Testa conexão
    redis_client.ping()
    redis_available = True
    print("✅ Redis conectado com sucesso.")
except Exception as e:
    print(f"⚠️ Redis não disponível ({e}). Usando cache em memória.")
    redis_client = None
    redis_available = False

# Inicialização do Firebase (desabilitado - usando Supabase no app)
db = None
firebase_available = False

print("ℹ️ Firebase/Firestore desabilitado. Backend em modo standalone.")
print("ℹ️ Use Supabase no app React Native para persistência.")

def get_recent_denuncias_from_db(limit: int = 10):
    """
    Busca as denúncias mais recentes.
    Modo standalone: retorna lista vazia (dados virão do app via API POST).
    """
    print("ℹ️ get_recent_denuncias_from_db: modo standalone (sem Firebase)")
    return []

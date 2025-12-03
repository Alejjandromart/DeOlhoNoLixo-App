import redis
import firebase_admin
from firebase_admin import credentials, firestore
from app.config import settings
import os

# Conexão Redis com fallback
redis_client = None
redis_available = False

try:
    # Configuração do Redis (sem senha se vazio)
    redis_config = {
        'host': settings.REDIS_HOST,
        'port': settings.REDIS_PORT,
        'db': settings.REDIS_DB,
        'decode_responses': True,
        'socket_connect_timeout': 2
    }
    
    # Só adiciona password se não for vazio
    if settings.REDIS_PASSWORD:
        redis_config['password'] = settings.REDIS_PASSWORD
    
    redis_client = redis.Redis(**redis_config)
    
    # Testa conexão
    redis_client.ping()
    redis_available = True
    print("✅ Redis conectado com sucesso.")
except Exception as e:
    print(f"⚠️ Redis não disponível ({e}). Usando cache em memória.")
    redis_client = None
    redis_available = False

# Inicialização do Firebase/Firestore
db = None
firebase_available = False

try:
    # Busca serviceAccountKey.json na raiz do BackendRedis
    cred_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), settings.FIREBASE_CREDENTIALS_PATH)
    
    if os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        firebase_available = True
        print("✅ Firebase/Firestore conectado com sucesso.")
    else:
        print(f"⚠️ Arquivo {cred_path} não encontrado. Firebase desabilitado.")
except Exception as e:
    print(f"⚠️ Firebase não disponível ({e}). Backend em modo standalone.")
    db = None
    firebase_available = False

def get_recent_denuncias_from_db(limit: int = 10):
    """
    Busca as denúncias mais recentes do Firestore.
    Retorna lista vazia se Firebase não estiver disponível.
    """
    if not firebase_available or not db:
        print("ℹ️ get_recent_denuncias_from_db: Firebase não disponível")
        return []
    
    try:
        print(f"🔍 Buscando últimas {limit} denúncias do Firestore...")
        denuncias_ref = db.collection('denuncias').order_by('created_at', direction=firestore.Query.DESCENDING).limit(limit)
        docs = denuncias_ref.stream()
        
        denuncias = []
        for doc in docs:
            data = doc.to_dict()
            data['id'] = doc.id
            denuncias.append(data)
        
        print(f"✅ {len(denuncias)} denúncias carregadas do Firestore")
        return denuncias
    except Exception as e:
        print(f"❌ Erro ao buscar denúncias do Firestore: {e}")
        return []

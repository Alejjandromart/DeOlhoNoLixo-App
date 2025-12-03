import json
from typing import List, Dict, Any
from datetime import datetime, timedelta
from app.database import redis_client, redis_available, get_recent_denuncias_from_db
from app.config import settings

FEED_KEY = "feed:denuncias:recent"

# Cache em memória como fallback
_memory_cache = {
    "data": [],
    "timestamp": None
}

def get_feed_denuncias() -> List[Dict[str, Any]]:
    """
    Recupera as 10 denúncias mais recentes.
    Tenta buscar do Redis primeiro. Se Redis não disponível, usa cache em memória.
    Se cache vazio, carrega do BD.
    """
    
    # 1. Tenta Redis se disponível
    if redis_available and redis_client:
        try:
            cached_data = redis_client.lrange(FEED_KEY, 0, 9)
            if cached_data:
                print("✅ Dados carregados do Redis")
                return [json.loads(item) for item in cached_data]
        except Exception as e:
            print(f"⚠️ Erro ao acessar Redis: {e}")
    
    # 2. Tenta cache em memória
    if _memory_cache["data"] is not None and _memory_cache["timestamp"] is not None:
        # Verifica se o cache ainda é válido (TTL)
        age = (datetime.now() - _memory_cache["timestamp"]).total_seconds()
        if age < settings.REDIS_TTL:
            print(f"✅ Dados carregados do cache em memória (idade: {age:.1f}s)")
            return _memory_cache["data"]
    
    # 3. Carrega do BD
    print("🔄 Carregando dados do Firebase...")
    fresh_data = get_recent_denuncias_from_db(limit=10)

    if fresh_data:
        # Atualiza cache em memória
        _memory_cache["data"] = fresh_data
        _memory_cache["timestamp"] = datetime.now()
        
        # Tenta armazenar no Redis se disponível
        if redis_available and redis_client:
            try:
                serialized_data = [json.dumps(item) for item in fresh_data]
                pipeline = redis_client.pipeline()
                pipeline.delete(FEED_KEY)
                pipeline.rpush(FEED_KEY, *serialized_data)
                pipeline.expire(FEED_KEY, settings.REDIS_TTL)
                pipeline.execute()
                print("✅ Cache atualizado no Redis")
            except Exception as e:
                print(f"⚠️ Erro ao atualizar Redis: {e}")
    else:
        # Fallback para teste se o BD estiver vazio
        print("⚠️ BD vazio. Retornando dados mockados para teste.")
        fresh_data = [
            {
                "id": "mock-1",
                "description": "Denúncia de Teste (Banco de Dados Offline)",
                "category": "Teste",
                "timestamp": datetime.now().isoformat(),
                "severity": "Baixo",
                "geographicContext": "Simulação",
                "environmentalImpact": "Nenhum"
            }
        ]

    return fresh_data

def add_denuncia_to_feed(denuncia: Dict[str, Any]) -> None:
    """
    Adiciona uma nova denúncia ao feed.
    Atualiza cache Redis, memória e Firebase (se disponível).
    """
    from app.database import db, firebase_available
    
    print(f"➕ Adicionando denúncia ao feed: {denuncia.get('id', 'sem-id')}")
    
    # 1. Salva no Firebase/Firestore (fonte da verdade)
    if firebase_available and db:
        try:
            # Remove 'id' se existir (Firestore gera automaticamente)
            denuncia_data = {k: v for k, v in denuncia.items() if k != 'id'}
            
            # Adiciona timestamp se não existir
            if 'created_at' not in denuncia_data:
                from google.cloud.firestore import SERVER_TIMESTAMP
                denuncia_data['created_at'] = SERVER_TIMESTAMP
            
            doc_ref = db.collection('denuncias').add(denuncia_data)
            print(f"✅ Denúncia salva no Firestore com ID: {doc_ref[1].id}")
        except Exception as e:
            print(f"⚠️ Erro ao salvar no Firestore: {e}")
    
    # 2. Adiciona ao cache em memória
    if _memory_cache["data"] is None:
        _memory_cache["data"] = []
    
    # Insere no início (mais recente primeiro)
    _memory_cache["data"].insert(0, denuncia)
    
    # Mantém apenas as 10 mais recentes
    _memory_cache["data"] = _memory_cache["data"][:10]
    _memory_cache["timestamp"] = datetime.now()
    
    # 3. Atualiza Redis se disponível
    if redis_available and redis_client:
        try:
            # Adiciona no início da lista Redis
            serialized = json.dumps(denuncia)
            redis_client.lpush(FEED_KEY, serialized)
            
            # Remove itens excedentes (mantém apenas 10)
            redis_client.ltrim(FEED_KEY, 0, 9)
            
            # Renova TTL
            redis_client.expire(FEED_KEY, settings.REDIS_TTL)
            
            print("✅ Redis atualizado com nova denúncia")
        except Exception as e:
            print(f"⚠️ Erro ao atualizar Redis: {e}")
    
    print(f"✅ Feed agora tem {len(_memory_cache['data'])} denúncias")

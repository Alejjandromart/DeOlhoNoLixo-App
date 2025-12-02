from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from pydantic import BaseModel
from app.services.feed_service import get_feed_denuncias, add_denuncia_to_feed
from app.middleware.auth import verify_api_key

router = APIRouter(tags=["feed"])

class DenunciaInput(BaseModel):
    id: str
    description: str
    category: str
    timestamp: str
    severity: str
    geographicContext: str
    environmentalImpact: str
    images: List[str] = []
    location: Dict[str, Any] = {}
    userId: str = ""

@router.get("/feed", response_model=List[Dict[str, Any]])
async def read_feed(
    _ = Depends(verify_api_key)
):
    """
    Retorna as denúncias mais recentes do feed.
    Utiliza cache Redis.
    """
    try:
        return get_feed_denuncias()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/feed")
async def add_to_feed(
    denuncia: DenunciaInput,
    _ = Depends(verify_api_key)
):
    """
    Adiciona uma nova denúncia ao feed.
    Atualiza o cache Redis automaticamente.
    """
    try:
        add_denuncia_to_feed(denuncia.dict())
        return {"status": "success", "message": "Denúncia adicionada ao feed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

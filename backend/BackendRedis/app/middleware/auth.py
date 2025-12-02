import os
from fastapi import Header, HTTPException, Depends
from starlette.status import HTTP_401_UNAUTHORIZED
from app.config import settings

async def verify_api_key(x_api_key: str = Header(None)):
    if not x_api_key:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Missing API key")
    if x_api_key != settings.BACKEND_API_KEY:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Invalid API key")

    return True

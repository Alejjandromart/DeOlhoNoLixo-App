import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse

from app.config import settings
from app.routers import feed

# Configuração de Logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("deolho-feed")

# Inicialização do App
app = FastAPI(title="DeOlho NoLixo Feed API", debug=settings.DEBUG)

# CORS (Pode ser ajustado se o frontend for diferente)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "X-API-Key"],
)

# Routers
# O endpoint será /feed (definido no router)
app.include_router(feed.router)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled exception: %s", exc)
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})

@app.get("/")
async def root():
    return {"status": "online", "service": "DeOlho NoLixo Feed Service"}

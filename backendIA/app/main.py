import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.middleware import SlowAPIMiddleware
from starlette.responses import JSONResponse

from app.config import settings
from app.routers import analyze

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("deolho")

app = FastAPI(title="DeOlho NoLixo API", debug=settings.DEBUG)

# CORS restrito
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["Content-Type", "X-API-Key"],
)

# Rate limiter
app.state.limiter = analyze.limiter
app.add_exception_handler(429, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# Routers
app.include_router(analyze.router)

# Global exception handler (no stack traces leaked)
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled exception: %s", exc)
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})

@app.get("/")
async def root():
    return {"status": "online", "service": "DeOlho NoLixo AI API"}

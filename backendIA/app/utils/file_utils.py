from tempfile import SpooledTemporaryFile
from typing import BinaryIO

MAX_BYTES = 1024 * 1024 * 6  # slightly above MAX_UPLOAD_MB to be safe

async def stream_to_spooled(file) -> SpooledTemporaryFile:
    """Grava o UploadFile em SpooledTemporaryFile sem carregar tudo na RAM."""
    spooled = SpooledTemporaryFile(max_size=MAX_BYTES)
    # file is an UploadFile with .file attribute (a SpooledTemporaryFile-like object) when using Starlette
    # Se vier como UploadFile async, use await file.read() em chunks
    # Aqui vamos tentar ler em chunks
    chunk = await file.read(1024 * 64)
    while chunk:
        spooled.write(chunk)
        if spooled.tell() > MAX_BYTES:
            spooled.close()
            raise ValueError("File too large")
        chunk = await file.read(1024 * 64)
    spooled.seek(0)
    return spooled

def validate_mime(content_type: str, allowed: list[str]) -> bool:
    return content_type in allowed

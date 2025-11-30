from dataclasses import dataclass
from typing import List, Optional
from datetime import datetime


@dataclass
class Denuncia:
    """Representa uma denúncia no sistema"""
    id: str
    nomeUsuario: str
    descricao: str
    localizacao: str
    coordenadas: str
    imagens: List[str]
    status: str
    dataCriacao: datetime
    categoria: str
    gravidade: Optional[str] = None
    tags: Optional[List[str]] = None
    impactoAmbiental: Optional[str] = None
    contextoGeografico: Optional[str] = None
    
    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "nomeUsuario": self.nomeUsuario,
            "descricao": self.descricao,
            "localizacao": self.localizacao,
            "coordenadas": self.coordenadas,
            "imagens": self.imagens,
            "status": self.status,
            "dataCriacao": self.dataCriacao.isoformat() if isinstance(self.dataCriacao, datetime) else self.dataCriacao,
            "categoria": self.categoria,
            "gravidade": self.gravidade,
            "tags": self.tags or [],
            "impactoAmbiental": self.impactoAmbiental,
            "contextoGeografico": self.contextoGeografico
        }

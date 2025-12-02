from dataclasses import dataclass
from typing import Optional
from datetime import datetime
import uuid


@dataclass
class OrgaoResponsavel:
    """
    Representa um órgão público responsável por resolver denúncias ambientais
    Conforme UML do sistema
    """
    id: str
    nome: str
    email: str
    tipoOrgao: str  # Ex: "Limpeza Urbana", "Meio Ambiente", "Defesa Civil"
    telefone: Optional[str] = None
    endereco: Optional[str] = None
    cidade: Optional[str] = None
    estado: Optional[str] = None
    horarioAtendimento: Optional[str] = None
    siteOficial: Optional[str] = None
    ativo: bool = True
    dataCriacao: Optional[datetime] = None
    
    def __post_init__(self):
        """Inicializa valores padrão"""
        if not self.id:
            self.id = str(uuid.uuid4())
        if not self.dataCriacao:
            self.dataCriacao = datetime.now()
    
    @staticmethod
    def criar_orgao(
        nome: str,
        email: str,
        tipoOrgao: str,
        **kwargs
    ) -> 'OrgaoResponsavel':
        """Factory method para criar órgão"""
        return OrgaoResponsavel(
            id=str(uuid.uuid4()),
            nome=nome,
            email=email,
            tipoOrgao=tipoOrgao,
            dataCriacao=datetime.now(),
            **kwargs
        )
    
    def to_dict(self) -> dict:
        """Converte para dicionário"""
        return {
            "id": self.id,
            "nome": self.nome,
            "email": self.email,
            "tipoOrgao": self.tipoOrgao,
            "telefone": self.telefone,
            "endereco": self.endereco,
            "cidade": self.cidade,
            "estado": self.estado,
            "horarioAtendimento": self.horarioAtendimento,
            "siteOficial": self.siteOficial,
            "ativo": self.ativo,
            "dataCriacao": self.dataCriacao.isoformat() if self.dataCriacao else None
        }
    
    def __str__(self) -> str:
        return f"{self.nome} ({self.tipoOrgao}) - {self.email}"

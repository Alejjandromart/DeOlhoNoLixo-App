import json
import os
from typing import Optional, List, Dict
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.orgao_responsavel import OrgaoResponsavel


class OrgaoService:
    """Gerencia órgãos responsáveis e mapeamento por região"""
    
    def __init__(self):
        self.orgaos: Dict[str, OrgaoResponsavel] = {}
        self._carregar_orgaos()
    
    def _carregar_orgaos(self):
        """Carrega órgãos padrão para Manaus/AM"""
        orgaos_padrao = [
            OrgaoResponsavel.criar_orgao(
                nome="SEMULSP - Secretaria Municipal de Limpeza Pública",
                email="alejjandromartin0@gmail.com",
                tipoOrgao="Limpeza Urbana",
                telefone="(92) 3215-6000",
                cidade="Manaus",
                estado="AM",
                horarioAtendimento="Segunda a Sexta, 8h às 18h",
                siteOficial="https://semulsp.manaus.am.gov.br"
            ),
            OrgaoResponsavel.criar_orgao(
                nome="SEMMAS - Secretaria Municipal de Meio Ambiente",
                email="alejjandromartin0@gmail.com",
                tipoOrgao="Meio Ambiente",
                telefone="(92) 3236-8577",
                cidade="Manaus",
                estado="AM",
                horarioAtendimento="Segunda a Sexta, 8h às 14h",
                siteOficial="https://semmas.manaus.am.gov.br"
            ),
            OrgaoResponsavel.criar_orgao(
                nome="Defesa Civil de Manaus",
                email="alejjandromartin0@gmail.com",
                tipoOrgao="Defesa Civil",
                telefone="(92) 3236-3260",
                cidade="Manaus",
                estado="AM",
                horarioAtendimento="24 horas",
                siteOficial="https://defesacivil.manaus.am.gov.br"
            ),
            OrgaoResponsavel.criar_orgao(
                nome="IBAMA - Instituto Brasileiro do Meio Ambiente",
                email="alejjandromartin0@gmail.com",
                tipoOrgao="Federal - Meio Ambiente",
                telefone="(92) 3303-8900",
                cidade="Manaus",
                estado="AM",
                horarioAtendimento="Segunda a Sexta, 8h às 12h e 14h às 18h",
                siteOficial="https://www.gov.br/ibama"
            )
        ]
        
        for orgao in orgaos_padrao:
            self.orgaos[orgao.id] = orgao
        
        print(f"✅ {len(self.orgaos)} órgãos carregados")
    
    def obter_orgao_por_id(self, orgao_id: str) -> Optional[OrgaoResponsavel]:
        """Obtém órgão por ID"""
        return self.orgaos.get(orgao_id)
    
    def obter_orgao_por_categoria(
        self, 
        categoria: str, 
        cidade: str = "Manaus"
    ) -> Optional[OrgaoResponsavel]:
        """
        Obtém órgão responsável baseado na categoria da denúncia
        """
        # Mapeamento categoria -> tipo de órgão
        mapeamento = {
            "ambiental": "Meio Ambiente",
            "entulho": "Limpeza Urbana",
            "lixo_domestico": "Limpeza Urbana",
            "domestico": "Limpeza Urbana",
            "lixo_eletronico": "Meio Ambiente",
            "eletronico": "Meio Ambiente",
            "poluicao": "Meio Ambiente",
            "queimada": "Defesa Civil",
            "desmatamento": "Federal - Meio Ambiente",
        }
        
        tipo_orgao = mapeamento.get(categoria.lower(), "Limpeza Urbana")
        
        # Buscar órgão correspondente
        for orgao in self.orgaos.values():
            if orgao.tipoOrgao == tipo_orgao and orgao.cidade == cidade and orgao.ativo:
                return orgao
        
        return None
    
    def listar_orgaos_ativos(self, cidade: Optional[str] = None) -> List[OrgaoResponsavel]:
        """Lista todos os órgãos ativos, opcionalmente filtrados por cidade"""
        orgaos = [o for o in self.orgaos.values() if o.ativo]
        
        if cidade:
            orgaos = [o for o in orgaos if o.cidade == cidade]
        
        return orgaos
    
    def adicionar_orgao(self, orgao: OrgaoResponsavel) -> bool:
        """Adiciona novo órgão ao sistema"""
        try:
            self.orgaos[orgao.id] = orgao
            print(f"✅ Órgão adicionado: {orgao.nome}")
            return True
        except Exception as e:
            print(f"❌ Erro ao adicionar órgão: {e}")
            return False
    
    def desativar_orgao(self, orgao_id: str) -> bool:
        """Desativa um órgão"""
        if orgao_id in self.orgaos:
            self.orgaos[orgao_id].ativo = False
            print(f"✅ Órgão desativado: {self.orgaos[orgao_id].nome}")
            return True
        return False

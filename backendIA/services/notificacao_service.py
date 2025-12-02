import aiosmtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
from jinja2 import Template
from typing import Optional
import httpx
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.orgao_responsavel import OrgaoResponsavel
from models.denuncia import Denuncia


class NotificacaoService:
    """
    Gerencia notificações para órgãos responsáveis
    Implementa o método receberNotificacao do UML
    """
    
    def __init__(self):
        self.smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_user = os.getenv("SMTP_USER")
        self.smtp_password = os.getenv("SMTP_PASSWORD")
        self.email_from = os.getenv("EMAIL_FROM", "DeOlhoNoLixo <noreply@deolhonolixo.com>")
    
    async def receberNotificacao(
        self, 
        orgao: OrgaoResponsavel,
        denuncia: Denuncia, 
        resumo: str
    ) -> None:
        """
        +receberNotificacao(denuncia: Denuncia, resumo: string): void
        
        Envia notificação por email para o órgão responsável
        """
        try:
            print(f"📧 Enviando notificação para {orgao.nome}...")
            
            # Gerar corpo do email
            corpo_html = self._gerar_corpo_email(denuncia, resumo, orgao)
            
            # Criar mensagem
            mensagem = self._criar_mensagem_email(corpo_html, denuncia, orgao)
            
            # Anexar imagens (se houver)
            if denuncia.imagens:
                await self._anexar_imagens(mensagem, denuncia.imagens)
            
            # Enviar email
            sucesso = await self._enviar_email(mensagem)
            
            if sucesso:
                print(f"✅ Notificação enviada para {orgao.nome}")
            else:
                print(f"❌ Falha ao enviar notificação para {orgao.nome}")
                
        except Exception as e:
            print(f"❌ Erro ao enviar notificação: {e}")
            raise
    
    def _gerar_corpo_email(
        self, 
        denuncia: Denuncia, 
        resumo: str,
        orgao: OrgaoResponsavel
    ) -> str:
        """Gera HTML do email de notificação"""
        template_html = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6; 
                    color: #333;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background: white;
                }
                .header { 
                    background: linear-gradient(135deg, #2D9F8E 0%, #1f7a6c 100%);
                    color: white; 
                    padding: 30px 20px;
                    text-align: center;
                }
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                }
                .header p {
                    margin: 10px 0 0 0;
                    opacity: 0.9;
                }
                .content { 
                    padding: 30px 20px;
                }
                .section { 
                    margin: 20px 0;
                    padding: 15px;
                    background: #f8f9fa;
                    border-left: 4px solid #2D9F8E;
                    border-radius: 4px;
                }
                .label { 
                    font-weight: bold;
                    color: #2D9F8E;
                    margin-bottom: 5px;
                    display: block;
                }
                .value {
                    color: #555;
                }
                .urgente { 
                    background: #ffe5e5;
                    border-left-color: #e74c3c;
                }
                .urgente .label {
                    color: #e74c3c;
                }
                .tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-top: 10px;
                }
                .tag {
                    background: #2D9F8E;
                    color: white;
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-size: 12px;
                }
                .footer { 
                    margin-top: 30px;
                    padding: 20px;
                    background: #f0f0f0;
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                }
                .footer a {
                    color: #2D9F8E;
                    text-decoration: none;
                }
                .cta-button {
                    display: inline-block;
                    background: #2D9F8E;
                    color: white;
                    padding: 12px 30px;
                    text-decoration: none;
                    border-radius: 25px;
                    margin: 20px 0;
                    font-weight: bold;
                }
                .orgao-info {
                    background: #e8f5f3;
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🚨 Nova Denúncia Ambiental</h1>
                    <p>Sistema DeOlhoNoLixo - Análise com Inteligência Artificial</p>
                </div>
                
                <div class="content">
                    <div class="orgao-info">
                        <strong>Para:</strong> {{ orgao.nome }}<br>
                        <strong>Tipo:</strong> {{ orgao.tipoOrgao }}
                    </div>
                    
                    <div class="section">
                        <span class="label">🆔 ID da Denúncia</span>
                        <span class="value">{{ denuncia.id }}</span>
                    </div>
                    
                    <div class="section">
                        <span class="label">📍 Localização</span>
                        <span class="value">{{ denuncia.localizacao }}</span>
                        <div style="margin-top: 5px; font-size: 12px; color: #888;">
                            Coordenadas: {{ denuncia.coordenadas }}
                        </div>
                        <a href="https://www.google.com/maps?q={{ denuncia.coordenadas }}" 
                           class="cta-button" 
                           style="font-size: 12px; padding: 8px 16px;">
                            📍 Ver no Google Maps
                        </a>
                    </div>
                    
                    <div class="section">
                        <span class="label">📝 Descrição da Denúncia</span>
                        <p class="value">{{ denuncia.descricao }}</p>
                    </div>
                    
                    <div class="section">
                        <span class="label">🏷️ Categoria</span>
                        <span class="value">{{ denuncia.categoria }}</span>
                    </div>
                    
                    <div class="section {{ 'urgente' if denuncia.gravidade == 'Crítico' else '' }}">
                        <span class="label">⚠️ Nível de Gravidade</span>
                        <span class="value" style="font-size: 18px; font-weight: bold;">
                            {{ denuncia.gravidade }}
                        </span>
                    </div>
                    
                    <div class="section">
                        <span class="label">🤖 Análise da Inteligência Artificial</span>
                        <p class="value">{{ resumo }}</p>
                    </div>
                    
                    {% if denuncia.impactoAmbiental %}
                    <div class="section">
                        <span class="label">🌍 Impacto Ambiental</span>
                        <p class="value">{{ denuncia.impactoAmbiental }}</p>
                    </div>
                    {% endif %}
                    
                    {% if denuncia.tags %}
                    <div class="section">
                        <span class="label">🏷️ Objetos Detectados pela IA</span>
                        <div class="tags">
                            {% for tag in denuncia.tags %}
                            <span class="tag">{{ tag }}</span>
                            {% endfor %}
                        </div>
                    </div>
                    {% endif %}
                    
                    <div class="section">
                        <span class="label">📅 Data e Hora</span>
                        <span class="value">{{ denuncia.dataCriacao }}</span>
                    </div>
                    
                    <div class="section">
                        <span class="label">👤 Denunciante</span>
                        <span class="value">{{ denuncia.nomeUsuario }}</span>
                    </div>
                    
                    {% if denuncia.imagens %}
                    <div class="section">
                        <span class="label">📷 Fotos Anexadas</span>
                        <p class="value">{{ denuncia.imagens|length }} foto(s) em anexo</p>
                    </div>
                    {% endif %}
                </div>
                
                <div class="footer">
                    <p><strong>DeOlhoNoLixo</strong></p>
                    <p>Sistema de Denúncias Ambientais com Inteligência Artificial</p>
                    <p>
                        Esta denúncia foi gerada automaticamente pelo aplicativo<br>
                        <a href="https://deolhonolixo.com">www.deolhonolixo.com</a>
                    </p>
                    <p style="margin-top: 15px; font-size: 11px; color: #999;">
                        Para mais informações, entre em contato através do email<br>
                        <a href="mailto:contato@deolhonolixo.com">contato@deolhonolixo.com</a>
                    </p>
                </div>
            </div>
        </body>
        </html>
        """
        
        template = Template(template_html)
        return template.render(
            denuncia=denuncia.to_dict(), 
            resumo=resumo,
            orgao=orgao.to_dict()
        )
    
    def _criar_mensagem_email(
        self, 
        corpo_html: str, 
        denuncia: Denuncia,
        orgao: OrgaoResponsavel
    ) -> MIMEMultipart:
        """Cria objeto de mensagem MIME"""
        mensagem = MIMEMultipart('alternative')
        
        # Assunto com emoji e gravidade
        emoji_gravidade = "🔴" if denuncia.gravidade == "Crítico" else "🟡" if denuncia.gravidade == "Médio" else "🟢"
        mensagem['Subject'] = f"{emoji_gravidade} Denúncia {denuncia.categoria} - {denuncia.gravidade} - ID: {denuncia.id[:8]}"
        mensagem['From'] = self.email_from
        mensagem['To'] = orgao.email
        mensagem['Reply-To'] = "contato@deolhonolixo.com"
        
        # Adicionar corpo HTML
        parte_html = MIMEText(corpo_html, 'html', 'utf-8')
        mensagem.attach(parte_html)
        
        return mensagem
    
    async def _anexar_imagens(self, mensagem: MIMEMultipart, imagens: list) -> None:
        """Anexa imagens ao email"""
        if not imagens:
            return
        
        for idx, img_url in enumerate(imagens[:3]):  # Máximo 3 imagens
            try:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    response = await client.get(img_url)
                    if response.status_code == 200:
                        img_data = response.content
                        img = MIMEImage(img_data)
                        img.add_header(
                            'Content-Disposition', 
                            'attachment', 
                            filename=f'denuncia_foto_{idx+1}.jpg'
                        )
                        mensagem.attach(img)
                        print(f"✅ Imagem {idx+1} anexada")
            except Exception as e:
                print(f"⚠️ Erro ao anexar imagem {idx+1}: {e}")
    
    async def _enviar_email(self, mensagem: MIMEMultipart) -> bool:
        """Envia o email via SMTP"""
        try:
            if not self.smtp_user or not self.smtp_password:
                print("⚠️ Credenciais SMTP não configuradas - simulando envio")
                return True
            
            # Enviar email usando aiosmtplib
            await aiosmtplib.send(
                mensagem,
                hostname=self.smtp_host,
                port=self.smtp_port,
                username=self.smtp_user,
                password=self.smtp_password,
                start_tls=True,
                timeout=30
            )
            
            return True
        except Exception as e:
            print(f"❌ Erro ao enviar email SMTP: {e}")
            return False

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import logging
from typing import Optional
from app.config import settings

logger = logging.getLogger("deolho.email")

def send_report_email(
    category: str,
    location: str,
    description: str,
    images: list[str],
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
) -> bool:
    """Sends a report email to municipal authorities.
    If SMTP variables are not set, it prints a mock log to the console instead.
    """
    subject = f"[DeOlhoNoLixo] Nova Denúncia de Descarte Irregular - Categoria: {category}"

    # Google Maps link
    if latitude is not None and longitude is not None:
        maps_url = f"https://www.google.com/maps?q={latitude},{longitude}"
        maps_html = f"""
          <tr>
            <th style="padding: 10px; border: 1px solid #dddddd; text-align: left; background-color: #f2f2f2;">Localização GPS</th>
            <td style="padding: 10px; border: 1px solid #dddddd;">
              <a href="{maps_url}" style="color: #059669; font-weight: bold; text-decoration: none;">
                📍 Ver no Google Maps ({latitude:.5f}, {longitude:.5f})
              </a>
            </td>
          </tr>"""
        maps_text = f"\n    - Google Maps: {maps_url}"
    else:
        maps_html = ""
        maps_text = ""

    images_html = "".join([
        f'<p><img src="{img}" alt="Imagem da Ocorrência" style="max-width: 100%; max-height: 400px; border-radius: 8px; margin-top: 10px;"></p>'
        for img in images
    ])

    body_html = f"""
    <html>
      <body style="font-family: Arial, sans-serif; color: #333333; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #f9f9f9;">
          <h2 style="color: #059669; border-bottom: 2px solid #059669; padding-bottom: 10px;">Notificação de Descarte Irregular de Lixo</h2>
          <p>Prezada <strong>Secretaria Municipal de Limpeza Urbana (SEMULSP)</strong>,</p>
          <p>Gostaríamos de encaminhar uma nova ocorrência registrada através da plataforma <strong>DeOlhoNoLixo</strong>.</p>

          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 10px; border: 1px solid #dddddd; text-align: left; width: 140px;">Categoria</th>
              <td style="padding: 10px; border: 1px solid #dddddd;">{category}</td>
            </tr>
            <tr>
              <th style="padding: 10px; border: 1px solid #dddddd; text-align: left;">Endereço</th>
              <td style="padding: 10px; border: 1px solid #dddddd;">{location}</td>
            </tr>
            {maps_html}
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 10px; border: 1px solid #dddddd; text-align: left;">Descrição</th>
              <td style="padding: 10px; border: 1px solid #dddddd;">{description}</td>
            </tr>
          </table>

          <div style="margin-top: 20px;">
            <h3>Imagens Anexadas:</h3>
            {images_html if images else "<p>Nenhuma imagem disponível.</p>"}
          </div>

          <p style="margin-top: 30px; font-size: 0.9em; color: #666666; border-top: 1px solid #e0e0e0; padding-top: 15px;">
            Esta mensagem é gerada de forma automatizada pelo aplicativo DeOlhoNoLixo.
          </p>
        </div>
      </body>
    </html>
    """

    body_text = f"""
    Prezada Secretaria Municipal de Limpeza Urbana (SEMULSP),

    Gostaríamos de encaminhar uma nova ocorrência registrada através da plataforma DeOlhoNoLixo.

    Detalhes da Ocorrência:
    - Categoria: {category}
    - Endereço: {location}{maps_text}
    - Descrição: {description}
    - Imagens: {", ".join(images) if images else "Nenhuma imagem disponível."}

    Esta mensagem é gerada de forma automatizada pelo aplicativo DeOlhoNoLixo.
    """

    # If no SMTP configured, print mock log in console
    if not settings.SMTP_HOST or not settings.SMTP_USERNAME or not settings.SMTP_PASSWORD:
        print("\n" + "="*80)
        print(" [EMAIL MOCK] - SMTP não configurado. Exibindo e-mail no console:")
        print(f" Destinatário: {settings.EMAIL_RECIPIENT}")
        print(f" Remetente: {settings.SMTP_SENDER or 'noreply@deolhonolixo.com'}")
        print(f" Assunto: {subject}")
        print("-"*80)
        print(body_text.strip())
        print("="*80 + "\n")
        return True

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = settings.SMTP_SENDER or settings.SMTP_USERNAME
        msg["To"] = settings.EMAIL_RECIPIENT

        msg.attach(MIMEText(body_text, "plain"))
        msg.attach(MIMEText(body_html, "html"))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            server.sendmail(msg["From"], [msg["To"]], msg.as_string())

        logger.info("Email enviado com sucesso para %s", settings.EMAIL_RECIPIENT)
        return True
    except Exception as e:
        logger.exception("Falha ao enviar e-mail via SMTP: %s", e)
        return False


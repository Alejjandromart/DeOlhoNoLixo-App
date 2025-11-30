# Classe OrgaoResponsavel

Sistema de gerenciamento de órgãos responsáveis e notificações automáticas.

## Estrutura

```
backendIA/
├── models/
│   ├── orgao_responsavel.py   # Modelo OrgaoResponsavel
│   └── denuncia.py             # Modelo Denuncia
├── services/
│   ├── orgao_service.py        # Gerenciamento de órgãos
│   └── notificacao_service.py  # Envio de notificações
└── main.py                     # Endpoints da API
```

## Órgãos Pré-cadastrados (Manaus/AM)

1. **SEMULSP** - Secretaria Municipal de Limpeza Pública
   - Email: limpeza.manaus@prefeitura.am.gov.br
   - Tipo: Limpeza Urbana
   - Categorias: Entulho, Lixo Doméstico

2. **SEMMAS** - Secretaria Municipal de Meio Ambiente
   - Email: meioambiente.manaus@prefeitura.am.gov.br
   - Tipo: Meio Ambiente
   - Categorias: Ambiental, Lixo Eletrônico, Poluição

3. **Defesa Civil de Manaus**
   - Email: defesacivil@manaus.am.gov.br
   - Tipo: Defesa Civil
   - Categorias: Queimadas

4. **IBAMA** - Instituto Brasileiro do Meio Ambiente
   - Email: ibama.am@ibama.gov.br
   - Tipo: Federal - Meio Ambiente
   - Categorias: Desmatamento

## Endpoints

### POST /analyze-and-notify
Analisa imagem e notifica órgão automaticamente.

**Parâmetros:**
- `files`: Imagens (multipart/form-data)
- `latitude`: float
- `longitude`: float
- `localizacao`: string
- `usuario`: string
- `categoria`: string (default: "ambiental")

**Resposta:**
```json
{
  "analise": {...},
  "orgao": {...},
  "notificacao": "enviada_com_sucesso",
  "denuncia_id": "uuid"
}
```

### GET /orgaos
Lista todos os órgãos ativos.

**Query:**
- `cidade`: string (opcional)

### GET /orgaos/{orgao_id}
Obtém detalhes de um órgão específico.

## Configuração de Email

Edite o arquivo `.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASSWORD=sua-senha-de-app
EMAIL_FROM=DeOlhoNoLixo <seu-email@gmail.com>
```

### Como gerar senha de app do Gmail:

1. Acesse: https://myaccount.google.com/apppasswords
2. Crie uma nova senha de app
3. Use essa senha no `.env`

## Teste

```bash
# Instalar dependências
pip install -r requirements.txt

# Iniciar servidor
python main.py

# Testar endpoint de órgãos
curl http://localhost:8000/orgaos
```

## Conformidade com UML

✅ **Classe OrgaoResponsavel**: 100% implementada
- ✅ id: UUID
- ✅ nome: string
- ✅ email: string
- ✅ tipoOrgao: string
- ✅ receberNotificacao(denuncia, resumo): void

✅ **Integração completa**:
- Análise de imagem com IA
- Identificação automática do órgão responsável
- Envio de email com template HTML
- Anexo de fotos da denúncia

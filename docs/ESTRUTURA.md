# 📁 Estrutura do Projeto - DeOlho NoLixo

Documentação detalhada da organização de pastas e arquivos.

---

## 🌳 Visão Geral

```
DeOlhoNoLixo-App/
│
├── 📱 app/                          # MOBILE APP (React Native + Expo)
├── 🔧 backend/                      # BACKENDS (Python + FastAPI)
├── 📄 docs/                         # DOCUMENTAÇÃO
└── ⚙️ Arquivos de Configuração
```

---

## 📱 App Mobile (`app/`)

### Estrutura Completa

```
app/
│
├── index.tsx                        # Ponto de entrada do app
│
├── _types/                          # Definições TypeScript
│   └── type.ts                      # Tipos globais e interfaces
│
├── assets/                          # Recursos estáticos
│   ├── fonts/                       # Fontes customizadas (.ttf, .otf)
│   ├── images/                      # Imagens (logos, ícones, backgrounds)
│   │   ├── logo.png
│   │   ├── splash.png
│   │   └── ...
│   ├── lottie/                      # Animações Lottie (JSON)
│   │   ├── 1Beautiful city.json
│   │   ├── 2Tourist travel.json
│   │   ├── 3Animation feed.json
│   │   └── success-animation.json
│   └── videos/                      # Vídeos (tutoriais, onboarding)
│
├── components/                      # Componentes reutilizáveis
│   ├── BackButton.tsx               # Botão de voltar
│   ├── CustomButton.tsx             # Botão customizado
│   ├── CustomButtonCadastro.tsx     # Botão para cadastro
│   ├── CustomCheckbox.tsx           # Checkbox customizado
│   ├── CustomInputCadastro.tsx      # Input de formulário
│   ├── ConfirmationModal.tsx        # Modal de confirmação
│   ├── Dot.tsx                      # Indicador de paginação
│   ├── LikeExplosion.tsx            # Animação de like
│   ├── LogoutButton.tsx             # Botão de logout
│   ├── Pagination.tsx               # Paginação de telas
│   ├── ProtectedRoute.tsx           # HOC para rotas protegidas
│   ├── RenderItem.tsx               # Renderizador de itens de lista
│   ├── SocialButton.tsx             # Botão de autenticação social
│   │
│   ├── BottomTabBar/                # Tab Navigation Customizada
│   │   ├── index.tsx                # Componente principal
│   │   ├── AnimatedSlider.tsx       # Slider animado
│   │   ├── CentralButton.tsx        # Botão central
│   │   ├── TabButton.tsx            # Botão de tab
│   │   └── colors.ts                # Cores do tab bar
│   │
│   ├── Feed/                        # Componentes do Feed
│   │   ├── CommentsModal.tsx        # Modal de comentários
│   │   ├── DenunciaCard.tsx         # Card de denúncia
│   │   └── components/              # Sub-componentes do feed
│   │
│   └── Shared/                      # Componentes compartilhados
│       ├── ConfirmModal.tsx         # Modal genérico de confirmação
│       ├── CustomModal.tsx          # Modal customizável
│       └── InputModal.tsx           # Modal com input
│
├── constants/                       # Constantes da aplicação
│   └── Colors.ts                    # Paleta de cores do app
│
├── context/                         # Context API (Estado Global)
│   ├── AuthContext.tsx              # Contexto de autenticação
│   └── DenunciaContext.tsx          # Contexto de denúncias
│
├── data/                            # Dados mock e fixtures
│   └── data.ts                      # Dados de exemplo
│
├── hooks/                           # Custom Hooks
│   └── useAuthRedirect.ts           # Hook de redirecionamento autenticado
│
├── lib/                             # Configurações de bibliotecas
│   └── firebase.ts                  # Inicialização Firebase
│
├── navigation/                      # Configuração de navegação
│   ├── RootStack.tsx                # Stack principal
│   ├── AuthNavigator.tsx            # Stack de autenticação
│   └── MainTabNavigator.tsx         # Bottom tabs
│
├── screens/                         # Telas do aplicativo
│   ├── Auth/                        # Telas de autenticação
│   │   ├── Splash.tsx               # Tela de splash
│   │   ├── Onboarding.tsx           # Onboarding tutorial
│   │   ├── Tutorial.tsx             # Tutorial do app
│   │   ├── Inicial.tsx              # Tela inicial
│   │   ├── Login.tsx                # Login
│   │   ├── Cadastro.tsx             # Cadastro de usuário
│   │   ├── EsqueciSenha.tsx         # Recuperação de senha
│   │   └── PermissionsScreen.tsx    # Solicitação de permissões
│   │
│   ├── Home/                        # Telas principais
│   │   ├── FeedScreen.tsx           # Feed de denúncias
│   │   ├── ProfileScreen.tsx        # Perfil do usuário
│   │   ├── ConfiguracaoScreen.tsx   # Configurações
│   │   └── AlterarSenhaScreen.tsx   # Alterar senha
│   │
│   └── DenunciaIA/                  # Criação de denúncias
│       ├── index.ts                 # Exportações
│       ├── DenunciaIA.tsx           # Tela principal
│       └── components/              # Componentes da denuncia
│
└── services/                        # Serviços de API
    ├── aiService.ts                 # Comunicação com backend IA
    └── feedService.ts               # Operações de feed
```

### 🎯 Responsabilidades

- **components/**: Componentes UI reutilizáveis em múltiplas telas
- **screens/**: Telas completas da aplicação
- **navigation/**: Configuração de rotas e navegação
- **context/**: Estado global compartilhado
- **services/**: Comunicação com APIs externas
- **hooks/**: Lógica reutilizável com hooks
- **constants/**: Valores fixos (cores, configurações)

---

## 🔧 Backend Principal (`backend/BackendRedis/`)

### Estrutura

```
backend/BackendRedis/
│
├── app/                             # Código da aplicação
│   ├── main.py                      # Ponto de entrada FastAPI
│   ├── config.py                    # Configurações (env vars)
│   ├── database.py                  # Conexão Redis
│   │
│   ├── middleware/                  # Middleware customizado
│   │   ├── __init__.py
│   │   ├── cors.py                  # CORS config
│   │   └── rate_limit.py            # Rate limiting
│   │
│   ├── routers/                     # Endpoints da API
│   │   ├── __init__.py
│   │   ├── auth.py                  # Autenticação
│   │   ├── denuncias.py             # CRUD denúncias
│   │   ├── users.py                 # Gerenciamento usuários
│   │   └── feed.py                  # Feed e interações
│   │
│   ├── models/                      # Modelos Pydantic
│   │   ├── __init__.py
│   │   ├── user.py                  # Modelo de usuário
│   │   └── denuncia.py              # Modelo de denúncia
│   │
│   ├── services/                    # Lógica de negócio
│   │   ├── __init__.py
│   │   ├── auth_service.py          # Autenticação Firebase
│   │   ├── denuncia_service.py      # Lógica de denúncias
│   │   └── cache_service.py         # Cache Redis
│   │
│   └── utils/                       # Utilitários
│       ├── __init__.py
│       ├── validators.py            # Validadores
│       └── helpers.py               # Funções auxiliares
│
├── serviceAccountKey.json           # Credenciais Firebase (NÃO COMMITAR!)
├── requirements.txt                 # Dependências Python
├── .env                             # Variáveis de ambiente (NÃO COMMITAR!)
└── README.md                        # Documentação do backend
```

### 🎯 Responsabilidades

- **routers/**: Endpoints HTTP (GET, POST, PUT, DELETE)
- **services/**: Lógica de negócio complexa
- **models/**: Validação e serialização de dados
- **middleware/**: Processamento de requisições/respostas

---

## 🤖 Backend IA (`backendIA/`)

### Estrutura

```
backendIA/
│
├── app/                             # Código da aplicação
│   ├── __init__.py
│   ├── main.py                      # FastAPI app principal
│   ├── config.py                    # Configurações (Gemini, SMTP)
│   ├── models.py                    # Modelos Pydantic
│   │
│   ├── routers/                     # Endpoints de IA
│   │   ├── __init__.py
│   │   ├── classification.py        # Classificação de imagens
│   │   ├── analysis.py              # Análise contextual
│   │   └── recommendations.py       # Recomendações de órgãos
│   │
│   ├── services/                    # Serviços de IA
│   │   ├── __init__.py
│   │   ├── yolo_service.py          # Detecção com YOLOv8
│   │   ├── gemini_service.py        # IA generativa
│   │   └── notificacao_service.py   # Envio de emails
│   │
│   ├── utils/                       # Utilitários
│   │   ├── __init__.py
│   │   ├── image_processing.py      # Processamento de imagem
│   │   └── validators.py            # Validação de dados
│   │
│   └── middleware/                  # Middleware
│       ├── __init__.py
│       └── cors.py
│
├── models/                          # Modelos de dados
│   ├── __init__.py
│   ├── denuncia.py                  # Modelo de denúncia
│   └── orgao_responsavel.py         # Modelo de órgão
│
├── templates/                       # Templates de email (Jinja2)
│   └── notificacao.html
│
├── requirements.txt                 # Dependências Python
├── .env                             # Variáveis de ambiente (NÃO COMMITAR!)
└── README.md                        # Documentação do backend IA
```

### 🎯 Responsabilidades

- **yolo_service.py**: Detecção de objetos em imagens
- **gemini_service.py**: Análise contextual e NLP
- **notificacao_service.py**: Notificações por email
- **image_processing.py**: Pré-processamento de imagens

---

## 🔍 Modelo YOLOv8 (`backend/trash.v1i.yolov8/`)

### Estrutura

```
trash.v1i.yolov8/
│
├── data.yaml                        # Configuração do dataset
├── yolov8n.pt                       # Modelo treinado (weights)
│
├── train.py                         # Script de treinamento
├── run_inference.py                 # Script de inferência
│
├── train/                           # Dataset de treino
│   ├── images/                      # Imagens de treino
│   └── labels/                      # Anotações YOLO format
│
├── valid/                           # Dataset de validação
│   ├── images/
│   └── labels/
│
├── test/                            # Dataset de teste
│   ├── images/
│   └── labels/
│
└── runs/                            # Resultados de treinamento
    └── detect/
        └── train/                   # Métricas e gráficos
```

### 🎯 Classes Detectadas

O modelo foi treinado para detectar:
- Plástico
- Papel/Papelão
- Metal
- Vidro
- Orgânico
- Eletrônicos
- Outros

---

## 📄 Documentação (`docs/`)

```
docs/
├── INSTALACAO.md                    # Guia de instalação
├── TECNOLOGIAS.md                   # Stack tecnológico
├── ESTRUTURA.md                     # Este arquivo
├── CONTRIBUINDO.md                  # Guia de contribuição
└── TROUBLESHOOTING.md               # Solução de problemas
```

---

## ⚙️ Arquivos de Configuração (Raiz)

```
DeOlhoNoLixo-App/
│
├── package.json                     # Dependências Node.js
├── package-lock.json                # Lockfile npm
│
├── tsconfig.json                    # Configuração TypeScript
├── app.config.js                    # Configuração Expo
├── app.d.ts                         # Tipos TypeScript globais
├── babel.config.js                  # Configuração Babel
├── eas.json                         # Configuração EAS Build
│
├── google-services.json             # Firebase Android (NÃO COMMITAR se sensível)
│
├── .env                             # Variáveis de ambiente (NÃO COMMITAR!)
├── .gitignore                       # Arquivos ignorados pelo Git
│
├── index.js                         # Entry point do app
├── App.tsx                          # Componente raiz (se não usar Expo Router)
│
├── README.md                        # Documentação principal
├── INICIALIZACAO.md                 # Guia de inicialização
│
└── _vscode/                         # Configurações VS Code
    ├── settings.json                # Settings do workspace
    └── extensions.json              # Extensões recomendadas
```

---

## 🔒 Arquivos que NÃO devem ser commitados

Certifique-se de que estes arquivos estão no `.gitignore`:

```gitignore
# Variáveis de ambiente
.env
.env.local
.env.*.local

# Credenciais
serviceAccountKey.json
google-services.json  # se contiver dados sensíveis

# Node
node_modules/
npm-debug.log
yarn-error.log

# Python
__pycache__/
*.pyc
venv/
.venv/

# Expo
.expo/
dist/

# Build
*.apk
*.ipa
*.aab
```

---

## 🎯 Convenções de Nomenclatura

### Arquivos e Pastas
- **Componentes React**: `PascalCase.tsx` (ex: `CustomButton.tsx`)
- **Utilitários**: `camelCase.ts` (ex: `validators.ts`)
- **Constantes**: `PascalCase.ts` (ex: `Colors.ts`)
- **Pastas**: `camelCase` ou `PascalCase` conforme contexto

### Código
- **Componentes**: `PascalCase` (ex: `const CustomButton = () => {}`)
- **Funções/Variáveis**: `camelCase` (ex: `const handlePress = () => {}`)
- **Constantes**: `UPPER_SNAKE_CASE` (ex: `const API_URL = '...'`)
- **Interfaces/Types**: `PascalCase` com prefixo I (ex: `interface IUserProps {}`)

---

## 🚀 Como Navegar no Projeto

### Para trabalhar no Mobile
1. Abrir `app/screens/` para telas
2. Criar componentes em `app/components/`
3. Adicionar rotas em `app/navigation/`
4. Gerenciar estado em `app/context/`

### Para trabalhar no Backend
1. Adicionar endpoints em `backend/BackendRedis/app/routers/`
2. Implementar lógica em `backend/BackendRedis/app/services/`
3. Criar modelos em `backend/BackendRedis/app/models/`

### Para trabalhar na IA
1. Melhorar prompts em `backendIA/app/services/gemini_service.py`
2. Treinar modelo em `backend/trash.v1i.yolov8/train.py`
3. Ajustar inferência em `backendIA/app/services/yolo_service.py`

---

[← Voltar ao README](../README.md) | [Tecnologias →](TECNOLOGIAS.md)

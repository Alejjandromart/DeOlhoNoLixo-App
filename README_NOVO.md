# 🌿 DeOlho NoLixo - Sistema de Denúncias Ambientais

Sistema inteligente de denúncias ambientais com análise de imagens por IA e notificação automática aos órgãos responsáveis.

## 🚀 Tecnologias

### Frontend
- **React Native** com Expo
- **TypeScript**
- **React Navigation** v6
- **Firebase Auth** com AsyncStorage
- **Axios** para requisições HTTP

### Backend IA (Port 8000)
- **FastAPI** (Python)
- **Google Gemini 2.5 Flash** para análise de imagens
- **SMTP** para notificações por email
- **Aiosmtplib** para envio assíncrono

### Backend Redis (Port 8001)
- **FastAPI** (Python)
- **Cache em memória** (fallback sem Redis)
- **API Key authentication**

## 📋 Pré-requisitos

- Node.js 16+
- Python 3.11+
- Expo CLI (`npm install -g expo-cli`)
- Git

## ⚙️ Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/Alejjandromart/DeOlhoNoLixo-App.git
cd DeOlhoNoLixo-App
```

### 2. Instalar dependências do app

```bash
npm install
```

### 3. Configurar backends

#### Backend IA
```bash
cd backendIA
pip install -r requirements.txt
```

#### Backend Redis
```bash
cd backend/BackendRedis
pip install -r requirements.txt
```

## 🎯 Inicialização

**Consulte o [INICIAR_RAPIDO.md](./INICIAR_RAPIDO.md)** para instruções detalhadas.

### Resumo Rápido

**Terminal 1 - Backend IA (Port 8000)**
```bash
cd backendIA
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 - Backend Redis (Port 8001)**
```bash
cd backend/BackendRedis
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

**Terminal 3 - App Expo (Port 8081)**
```bash
npx expo start --clear
```

## 📱 Funcionalidades

### ✨ Principais
- ✅ Sistema de autenticação (Firebase Auth)
- ✅ Análise automática de imagens com IA (Gemini)
- ✅ Categorização inteligente de resíduos
- ✅ Geolocalização GPS automática
- ✅ Notificação por email aos órgãos responsáveis
- ✅ Feed de denúncias com cache Redis
- ✅ Sistema de likes e comentários
- ✅ Limite de 5 denúncias por mês por usuário
- ✅ Pull-to-refresh no feed

### 🔍 IA - Análise de Imagens
- Detecção de objetos relacionados a lixo
- Classificação de severidade (Baixo/Médio/Crítico)
- Análise de contexto geográfico
- Cálculo de impacto ambiental
- Sugestão automática de descrição

### 📧 Notificação de Órgãos
- **4 órgãos cadastrados**:
  - SEMULSP (Limpeza Urbana)
  - SEMMAS (Meio Ambiente)
  - Defesa Civil (Emergências)
  - IBAMA (Crimes Ambientais)
- Email automático com:
  - Descrição da denúncia
  - Severidade
  - Localização GPS
  - Imagens anexadas
  - Tags da IA

## 🏗️ Estrutura do Projeto

```
DeOlhoNoLixo-App/
├── app/                          # Código React Native
│   ├── components/              # Componentes reutilizáveis
│   │   ├── Feed/               # Componentes do feed
│   │   └── BottomTabBar/       # Barra de navegação
│   ├── screens/                # Telas do app
│   │   ├── Auth/              # Autenticação
│   │   ├── Home/              # Telas principais
│   │   └── DenunciaIA/        # Sistema de denúncias
│   ├── navigation/            # Navegação
│   ├── context/               # Context API
│   ├── services/              # Serviços (API)
│   └── constants/             # Constantes
├── backendIA/                  # Backend de IA
│   ├── models/                # Modelos de dados
│   ├── services/              # Serviços (email, órgãos)
│   └── main.py               # FastAPI app
└── backend/BackendRedis/      # Backend de feed
    └── app/
        ├── routers/          # Rotas da API
        └── services/         # Lógica de negócio
```

## 🔧 Configuração

### Variáveis de Ambiente

**backendIA/.env**
```env
GEMINI_API_KEY=sua_chave_aqui
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASSWORD=sua_senha_app
```

**backend/BackendRedis/.env**
```env
BACKEND_API_KEY=secure-api-key-12345
REDIS_PASSWORD=DeOlhoNoLixoSecure2024!
```

## 📚 Documentação

- [INICIAR_RAPIDO.md](./INICIAR_RAPIDO.md) - Guia rápido de inicialização
- [GUIA_INICIALIZACAO.md](./GUIA_INICIALIZACAO.md) - Guia completo com troubleshooting
- [backendIA/README_ORGAOS.md](./backendIA/README_ORGAOS.md) - Sistema de órgãos
- [backend/BackendRedis/README_INTEGRACAO.md](./backend/BackendRedis/README_INTEGRACAO.md) - Integração Redis

## 🧪 Testes

Todos os testes foram validados e removidos após confirmação de funcionamento, seguindo boas práticas de clean code.

## 📄 Licença

Este projeto está sob a licença MIT.

## 👥 Autores

- Peterson Silva
- Alejandro Martins

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

**Desenvolvido com ❤️ para um futuro mais sustentável** 🌱

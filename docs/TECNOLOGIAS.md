# 🚀 Stack Tecnológico - DeOlho NoLixo

Documentação completa das tecnologias utilizadas no projeto.

---

## Frontend (Mobile App)

### Core
- **React Native 0.81** → framework para desenvolvimento multiplataforma (iOS/Android)
- **Expo SDK 54** → conjunto de ferramentas e APIs nativas simplificadas
- **TypeScript 5.x** → tipagem estática para maior segurança e manutenibilidade

### Navegação
- **React Navigation 7** → navegação entre telas
  - `@react-navigation/native-stack` → navegação stack
  - `@react-navigation/bottom-tabs` → bottom tab navigation
  - `@react-navigation/elements` → componentes auxiliares

### UI/UX
- **Expo Linear Gradient** → gradientes
- **Lottie React Native** → animações complexas em JSON
- **React Native Reanimated 4** → animações de alta performance
- **React Native Gesture Handler** → gestos e interações
- **@rneui/themed** → componentes UI prontos
- **@expo/vector-icons** → biblioteca de ícones

### APIs Nativas
- **Expo Camera** → captura de fotos e vídeos
- **Expo Location** → geolocalização GPS
- **Expo Image Picker** → seleção de imagens da galeria
- **Expo AV / Expo Video** → reprodução de áudio e vídeo
- **Expo File System** → manipulação de arquivos
- **Expo Splash Screen** → tela de splash
- **Expo Status Bar** → customização da status bar

### Autenticação e Storage
- **Firebase SDK 12.6** → autenticação, Firestore, Storage
- **@react-native-google-signin/google-signin** → login com Google
- **Expo Auth Session** → fluxo OAuth
- **Expo Secure Store** → armazenamento seguro de credenciais
- **AsyncStorage** → armazenamento local persistente
- **Expo Crypto** → criptografia

### Networking
- **Axios 1.13** → cliente HTTP para comunicação com backend
- **Expo Web Browser** → navegador in-app

### Utilities
- **Expo Checkbox** → checkboxes customizados
- **Expo Constants** → constantes do sistema
- **Expo Font** → carregamento de fontes customizadas
- **@gorhom/bottom-sheet** → bottom sheets

---

## Backend Principal (API REST)

### Framework e Server
- **FastAPI** → framework Python moderno e de alta performance
  - Tipagem com Pydantic
  - Documentação automática (Swagger/OpenAPI)
  - Validação automática de dados
  - Suporte assíncrono nativo
- **Uvicorn[standard]** → servidor ASGI de alta performance

### Banco de Dados e Cache
- **Redis** → banco de dados em memória
  - Cache de sessões
  - Rate limiting
  - Armazenamento de dados temporários

### Autenticação e Storage
- **Firebase Admin SDK** → gerenciamento backend do Firebase
  - Autenticação de usuários
  - Storage de arquivos (imagens)
  - Cloud Firestore

### Validação e Configuração
- **Pydantic[email]** → validação de dados e settings
- **Pydantic Settings** → gerenciamento de configurações
- **Python Multipart** → upload de arquivos

### Segurança
- **SlowAPI** → rate limiting e proteção contra DDoS
- **Python-dotenv** → gerenciamento de variáveis de ambiente

---

## Backend IA (Machine Learning)

### Framework e Server
- **FastAPI** → API REST para serviços de IA
- **Uvicorn[standard]** → servidor ASGI

### Inteligência Artificial
- **YOLOv8 (Ultralytics)** → detecção e classificação de objetos
  - Modelo treinado para detectar tipos de lixo
  - Inferência em tempo real
  - Suporte a GPU (CUDA)
- **Google Generative AI (Gemini)** → IA generativa
  - Análise contextual de imagens
  - Processamento de linguagem natural
  - Identificação de órgãos responsáveis
  - Geração de relatórios

### Comunicação
- **HTTPX 0.25** → cliente HTTP assíncrono para comunicação entre serviços

### Notificações
- **AIOSMTPLIB 3.0** → envio assíncrono de emails
- **Jinja2 3.1** → templates para emails HTML

### Validação
- **Pydantic[email]** → validação de dados
- **Pydantic Settings** → configurações
- **Python Multipart** → upload de imagens

### Segurança
- **SlowAPI** → rate limiting
- **Python-dotenv** → variáveis de ambiente

---

## DevOps e Ferramentas

### Controle de Versão
- **Git** → controle de versão
- **GitHub** → repositório e colaboração

### Build e Deploy
- **EAS (Expo Application Services)** → build e deploy de apps
  - Build Android/iOS
  - Over-the-air updates
  - Submissão para stores

### Desenvolvimento
- **VS Code** → IDE recomendada
- **Android Studio** → emulador Android e SDK
- **Expo Go** → teste em dispositivos físicos
- **Expo CLI** → ferramentas de linha de comando

### Qualidade de Código
- **ESLint** → linting JavaScript/TypeScript
- **Prettier** → formatação de código
- **TypeScript Compiler** → verificação de tipos

### Configuração
- **Babel** → transpilação JavaScript
- **Metro Bundler** → bundler do React Native
- **TSConfig** → configuração TypeScript

---

## Dependências de Desenvolvimento

### Mobile
```json
{
  "typescript": "~5.6.2",
  "@types/react": "~19.0.2",
  "@types/react-native": "^0.81.0",
  "prettier": "^3.0.0",
  "eslint": "^8.0.0"
}
```

### Backend Python
```txt
# Testing
pytest
pytest-asyncio
httpx

# Development
black  # formatação
flake8  # linting
mypy  # verificação de tipos
```

---

## Integrações de Terceiros

### Firebase
- **Authentication** → login/cadastro
- **Cloud Firestore** → banco de dados NoSQL
- **Cloud Storage** → armazenamento de imagens
- **Cloud Messaging** → notificações push (planejado)

### Google Cloud
- **Gemini AI API** → IA generativa
- **Cloud Vision API** → análise de imagens (alternativa)

### Serviços Externos (Planejados)
- **Mapbox/Google Maps** → mapas e visualização
- **SendGrid** → envio de emails em produção
- **Sentry** → monitoramento de erros

---

## Requisitos de Sistema

### Desenvolvimento Mobile
- **Node.js**: 18.x ou superior (LTS)
- **npm**: 9.x ou superior
- **Android SDK**: API Level 34+
- **Expo CLI**: 6.x

### Desenvolvimento Backend
- **Python**: 3.11 ou superior
- **pip**: 23.x ou superior
- **Redis**: 7.x ou superior (opcional em dev)

### Sistemas Operacionais Suportados
- **Windows** 10/11
- **macOS** 12+ (Monterey ou superior)
- **Linux** (Ubuntu 20.04+, Debian, Fedora)

---

## Por Que Essas Tecnologias?

### React Native + Expo
- ✅ Desenvolvimento multiplataforma (iOS + Android) com um código
- ✅ Hot reload para desenvolvimento rápido
- ✅ Acesso a APIs nativas sem configuração complexa
- ✅ Comunidade ativa e grande ecossistema
- ✅ Performance próxima ao nativo

### TypeScript
- ✅ Detecta erros em tempo de desenvolvimento
- ✅ Autocomplete e IntelliSense poderosos
- ✅ Código mais manutenível e documentado
- ✅ Refatoração segura

### FastAPI
- ✅ Alta performance (comparável a Node.js e Go)
- ✅ Documentação automática (Swagger)
- ✅ Validação automática de dados
- ✅ Suporte assíncrono nativo
- ✅ Tipagem com Pydantic

### YOLOv8
- ✅ Estado da arte em detecção de objetos
- ✅ Rápido e preciso
- ✅ Fácil de treinar e fazer fine-tuning
- ✅ Suporte a múltiplos backends (CPU, GPU)

### Firebase
- ✅ Autenticação robusta e segura
- ✅ Escalabilidade automática
- ✅ SDK bem documentado
- ✅ Gratuito para começar
- ✅ Integração fácil com React Native

### Redis
- ✅ Extremamente rápido (em memória)
- ✅ Ideal para cache e sessões
- ✅ Suporte a estruturas de dados complexas
- ✅ Persistência opcional

---

## Roadmap Tecnológico

### Curto Prazo
- [ ] Migração para Expo Router (file-based routing)
- [ ] Implementação de testes automatizados (Jest + Testing Library)
- [ ] CI/CD com GitHub Actions

### Médio Prazo
- [ ] Notificações push com Firebase Cloud Messaging
- [ ] Mapas interativos com Mapbox
- [ ] Internacionalização (i18n)
- [ ] Modo offline com sincronização

### Longo Prazo
- [ ] App Web com Next.js
- [ ] Dashboard administrativo
- [ ] GraphQL API
- [ ] Machine Learning on-device (TensorFlow Lite)

---

[← Voltar ao README](../README.md) | [Instalação →](INSTALACAO.md)

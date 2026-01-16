# 📦 Guia de Instalação - DeOlho NoLixo

Guia completo passo a passo para configurar o ambiente de desenvolvimento.

---

## 📋 Índice

1. [Pré-requisitos](#-pré-requisitos)
2. [Clonar Repositório](#-clonar-repositório)
3. [Instalação Mobile](#-instalação-mobile)
4. [Instalação Backend Principal](#-instalação-backend-principal)
5. [Instalação Backend IA](#-instalação-backend-ia)
6. [Configuração Firebase](#-configuração-firebase)
7. [Configuração Google Gemini](#-configuração-google-gemini)
8. [Verificação Final](#-verificação-final)

---

## 🔧 Pré-requisitos

### Software Necessário

#### Para Desenvolvimento Mobile
```bash
# Node.js (LTS v18+)
node -v  # deve retornar v18.x ou superior
npm -v   # deve retornar 9.x ou superior

# Git
git --version  # deve retornar 2.x ou superior
```

**Downloads**:
- [Node.js (LTS)](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [VS Code](https://code.visualstudio.com/)
- [Android Studio](https://developer.android.com/studio)

#### Para Desenvolvimento Backend
```bash
# Python
python --version  # deve retornar 3.11 ou superior
pip --version     # deve retornar 23.x ou superior
```

**Downloads**:
- [Python 3.11+](https://www.python.org/downloads/)

#### Redis (Opcional para Dev Local)
- **Windows**: [Redis for Windows](https://github.com/microsoftarchive/redis/releases)
- **macOS**: `brew install redis`
- **Linux**: `sudo apt install redis-server`

### Contas Necessárias

- ✅ **Conta Google** (para autenticação)
- ✅ **Firebase Account** (gratuito)
- ✅ **Google Cloud Account** (para Gemini AI - free tier disponível)

---

## 📥 Clonar Repositório

```bash
git clone https://github.com/Alejjandromart/DeOlhoNoLixo-App.git
cd DeOlhoNoLixo-App
```

---

## 📱 Instalação Mobile

### 1. Instalar Dependências

```bash
npm install
```

ou se preferir Yarn:

```bash
yarn install
```

### 2. Criar Arquivo `.env`

Crie um arquivo `.env` na **raiz do projeto**:

```env
# Firebase Web Config
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=deolhonolixo.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=deolhonolixo
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=deolhonolixo.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:android:abc...

# Backend URLs
EXPO_PUBLIC_API_URL=http://localhost:8000
EXPO_PUBLIC_AI_API_URL=http://localhost:8001

# Environment
EXPO_PUBLIC_ENV=development
```

> ⚠️ **Importante**: Nunca commite o arquivo `.env` no Git!

### 3. Verificar Instalação

```bash
npm start
```

Se aparecer o QR Code do Expo, a instalação foi bem-sucedida! ✅

---

## 🔧 Instalação Backend Principal

### 1. Navegar para a Pasta

```bash
cd backend/BackendRedis
```

### 2. Criar Ambiente Virtual Python (Recomendado)

**Windows (PowerShell)**:
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Linux/macOS**:
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Instalar Dependências

```bash
pip install -r requirements.txt
```

### 4. Criar Arquivo `.env`

Crie um arquivo `.env` em `backend/BackendRedis/`:

```env
# Firebase
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# API Settings
API_PORT=8000
API_HOST=0.0.0.0
ENVIRONMENT=development

# Security
SECRET_KEY=sua_chave_secreta_aqui_min_32_caracteres
CORS_ORIGINS=http://localhost:19006,http://localhost:8081

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60
```

### 5. Gerar Secret Key

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Copie o resultado e cole em `SECRET_KEY` no `.env`.

### 6. Verificar Instalação

```bash
uvicorn app.main:app --reload
```

Acesse: http://localhost:8000/docs

Se aparecer a documentação Swagger, está funcionando! ✅

---

## 🤖 Instalação Backend IA

### 1. Navegar para a Pasta

```bash
cd ../../backendIA
```

### 2. Criar Ambiente Virtual Python

**Windows (PowerShell)**:
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Linux/macOS**:
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Instalar Dependências

```bash
pip install -r requirements.txt
```

### 4. Instalar YOLOv8 (Ultralytics)

```bash
pip install ultralytics
```

### 5. Criar Arquivo `.env`

Crie um arquivo `.env` em `backendIA/`:

```env
# Google Gemini AI
GOOGLE_API_KEY=sua_chave_api_gemini_aqui

# Email (Notificações)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASSWORD=sua_senha_app_gmail

# API Settings
API_PORT=8001
API_HOST=0.0.0.0
ENVIRONMENT=development

# YOLOv8
MODEL_PATH=../backend/trash.v1i.yolov8/yolov8n.pt
CONFIDENCE_THRESHOLD=0.5

# Security
SECRET_KEY=sua_chave_secreta_aqui_diferente_do_backend
CORS_ORIGINS=http://localhost:8000,http://localhost:19006
```

### 6. Verificar Modelo YOLOv8

```bash
# Verificar se o modelo existe
ls ../backend/trash.v1i.yolov8/yolov8n.pt
```

Se não existir, baixe o modelo pré-treinado:

```bash
cd ../backend/trash.v1i.yolov8
python -c "from ultralytics import YOLO; YOLO('yolov8n.pt')"
```

### 7. Verificar Instalação

```bash
cd ../../backendIA
uvicorn app.main:app --reload --port 8001
```

Acesse: http://localhost:8001/docs

Se aparecer a documentação Swagger, está funcionando! ✅

---

## 🔥 Configuração Firebase

### 1. Criar Projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Digite o nome: `DeOlhoNoLixo` (ou outro nome)
4. Desabilite Google Analytics (opcional)
5. Crie o projeto

### 2. Configurar Authentication

1. No menu lateral, clique em **Authentication**
2. Clique em "Começar"
3. Habilite os provedores:
   - ✅ **Email/Password**
   - ✅ **Google** (configure OAuth)

### 3. Configurar Firestore Database

1. No menu lateral, clique em **Firestore Database**
2. Clique em "Criar banco de dados"
3. Escolha modo de produção
4. Selecione localização (South America - São Paulo)

### 4. Configurar Storage

1. No menu lateral, clique em **Storage**
2. Clique em "Começar"
3. Aceite as regras padrão

### 5. Adicionar App Android

1. No menu lateral, clique em **Visão geral do projeto** (ícone de engrenagem)
2. Clique em "Adicionar app" → Android
3. Package name: `com.deolhonolixo.app` (verifique em app.json)
4. Apelido: "DeOlho NoLixo App"
5. **Baixe o arquivo `google-services.json`**
6. Cole na **raiz do projeto** (DeOlhoNoLixo-App/)

### 6. Obter Credenciais Web

1. Em Configurações do projeto → Seus apps
2. Clique em "Configuração" no app Web (ou adicione um)
3. Copie as credenciais:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "projeto.firebaseapp.com",
  projectId: "projeto",
  storageBucket: "projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

4. Cole no arquivo `.env` do app mobile (com prefixo `EXPO_PUBLIC_`)

### 7. Gerar Service Account Key (Backend)

1. Configurações do projeto → Contas de serviço
2. Clique em "Gerar nova chave privada"
3. **Baixe o arquivo JSON**
4. Renomeie para `serviceAccountKey.json`
5. Cole em `backend/BackendRedis/`

> ⚠️ **NUNCA commite esse arquivo no Git!**

---

## 🌟 Configuração Google Gemini

### 1. Acessar Google AI Studio

1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Faça login com sua conta Google

### 2. Criar API Key

1. Clique em "Get API Key"
2. Clique em "Create API key in new project"
3. **Copie a chave gerada**

### 3. Adicionar ao Backend IA

Cole a chave no arquivo `.env` do backendIA:

```env
GOOGLE_API_KEY=AIzaSy...sua_chave_aqui
```

### 4. Testar Gemini

```bash
cd backendIA
python -c "
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
model = genai.GenerativeModel('gemini-pro')
response = model.generate_content('Olá!')
print(response.text)
"
```

Se retornar uma resposta, está configurado! ✅

---

## ✅ Verificação Final

### Checklist de Instalação

- [ ] Node.js e npm instalados
- [ ] Python 3.11+ instalado
- [ ] Git instalado
- [ ] Android Studio configurado (opcional)
- [ ] Repositório clonado
- [ ] Dependências mobile instaladas (`npm install`)
- [ ] Dependências backend principal instaladas
- [ ] Dependências backend IA instaladas
- [ ] Firebase configurado
- [ ] `google-services.json` na raiz
- [ ] `serviceAccountKey.json` em backend/BackendRedis
- [ ] Gemini API Key configurada
- [ ] Todos os arquivos `.env` criados

### Testar Sistema Completo

**Terminal 1 - Backend Principal**:
```bash
cd backend/BackendRedis
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Backend IA**:
```bash
cd backendIA
uvicorn app.main:app --reload --port 8001
```

**Terminal 3 - App Mobile**:
```bash
npm start
```

Se todos os 3 estiverem rodando sem erros, **SUCESSO!** 🎉

---

## 🆘 Problemas na Instalação?

Consulte o [guia de troubleshooting](TROUBLESHOOTING.md) para soluções de problemas comuns.

---

[← Voltar ao README](../README.md) | [Troubleshooting →](TROUBLESHOOTING.md)

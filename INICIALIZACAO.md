# 🚀 Guia de Inicialização do Sistema DeOlhoNoLixo

## 📋 Pré-requisitos

- **Node.js** 18+ e npm instalados
- **Python** 3.10+ instalado
- **Expo Go** instalado no celular (Android/iOS)
- **PowerShell** (Windows)
- Dispositivos conectados na mesma rede Wi-Fi

---

## 🔧 Configuração Inicial

### 1. Verificar o IP da Rede

Antes de iniciar, verifique o IP do computador:

```powershell
ipconfig | Select-String -Pattern "IPv4"
```

Anote o IP da sua rede Wi-Fi (exemplo: `192.168.0.3`)

### 2. Atualizar IPs nos Arquivos (se mudou de rede)

Se o IP mudou, atualize nos seguintes arquivos:

- `app/services/feedService.ts` → Linha 3: `FEED_API_URL`
- `app/services/aiService.ts` → Linha 7: `AI_API_URL`
- `app/screens/DenunciaIA/DenunciaIA.tsx` → Buscar por `analyze-and-notify`
- `app/screens/DenunciaIA/components/Step2Description.tsx` → Buscar por `/analyze`

**Formato:** `http://SEU_IP:PORTA`

---

## 🎯 Inicialização do Sistema

### **Terminal 1: Backend IA (Porta 8000)**

Responsável pela análise com Google Gemini AI e envio de emails.

```powershell
cd "C:\Users\silva\OneDrive\Área de Trabalho\deolhonolixo\DeOlhoNoLixo-App\backendIA"
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

✅ **Sucesso:** Deve aparecer:
```
INFO: Uvicorn running on http://0.0.0.0:8000
✅ 4 órgãos carregados
INFO: Application startup complete.
```

🧪 **Testar:** Abra http://192.168.0.3:8000/docs (substitua pelo seu IP)

---

### **Terminal 2: BackendRedis (Porta 8001)**

Responsável pelo cache do feed de denúncias.

```powershell
cd "C:\Users\silva\OneDrive\Área de Trabalho\deolhonolixo\DeOlhoNoLixo-App\backend\BackendRedis"
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

✅ **Sucesso:** Deve aparecer:
```
INFO: Uvicorn running on http://0.0.0.0:8001
⚠️ Redis não disponível. Usando cache em memória.
ℹ️ Firebase/Firestore desabilitado. Backend em modo standalone.
INFO: Application startup complete.
```

🧪 **Testar:** Abra http://192.168.0.3:8001/docs

---

### **Terminal 3: Expo App (Porta 8081)**

Aplicativo React Native que roda no celular.

```powershell
cd "C:\Users\silva\OneDrive\Área de Trabalho\deolhonolixo\DeOlhoNoLixo-App"
npx expo start --clear
```

✅ **Sucesso:** Deve aparecer um QR Code no terminal.

📱 **Conectar no Celular:**
1. Abra o **Expo Go** no celular
2. Escaneie o QR Code
3. Aguarde o app carregar

---

## ✅ Verificação de Status

### Testar Conectividade dos Backends

**Backend IA:**
```powershell
curl http://192.168.0.3:8000/
```
Resposta esperada: `{"status":"online","service":"DeOlhoNoLixo AI API",...}`

**BackendRedis:**
```powershell
curl http://192.168.0.3:8001/
```
Resposta esperada: `{"status":"online","service":"DeOlho NoLixo Feed Service"}`

---

## 📱 Funcionalidades do Sistema

### 1. **Fazer Denúncia com IA**
- Tire foto do lixo
- IA analisa automaticamente (Google Gemini)
- Gera descrição inteligente
- Identifica tipos de resíduos
- Calcula severidade
- Envia email para órgão responsável

### 2. **Feed de Denúncias**
- Visualize todas as denúncias
- Imagens em Base64 (visíveis em todos os dispositivos)
- Cache em memória (BackendRedis)
- Informações: localização, status, tempo, tipos de lixo

### 3. **Sistema de Curtidas** (em desenvolvimento)
- Curtir denúncias
- Contador de likes
- Animação de explosão

### 4. **Comentários** (em desenvolvimento)
- Adicionar comentários nas denúncias
- Visualizar comentários de outros usuários

---

## 🔑 Arquivos de Configuração

### `backendIA/.env`
```env
GEMINI_API_KEY=AIzaSua_Chave_Aqui
BACKEND_API_KEY=secure-api-key-12345
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASSWORD=sua_senha_app
EMAIL_FROM=DeOlhoNoLixo <seu_email@gmail.com>
```

⚠️ **Importante:** Nunca faça commit do arquivo `.env` (já está no `.gitignore`)

---

## 🐛 Solução de Problemas

### ❌ Backend não inicia
- Verifique se Python 3.10+ está instalado: `python --version`
- Instale dependências: `pip install -r requirements.txt`
- Verifique se a porta está livre: `Get-NetTCPConnection -LocalPort 8000`

### ❌ Expo não conecta no celular
- Certifique-se de que PC e celular estão na **mesma rede Wi-Fi**
- Desabilite firewall/antivírus temporariamente
- Verifique o IP: pode ter mudado

### ❌ Imagens não aparecem em outros dispositivos
- Verifique se o código usa `expo-file-system/legacy`
- Confirme que imagens são convertidas para Base64
- Procure por log: `"✅ Imagem convertida para Base64"`

### ❌ Email não enviado
- Verifique `SMTP_USER` e `SMTP_PASSWORD` no `.env`
- Use senha de app do Gmail (não a senha normal)
- Gere em: https://myaccount.google.com/apppasswords

### ❌ API key Gemini inválida
- Obtenha nova chave em: https://aistudio.google.com/app/apikey
- Atualize `GEMINI_API_KEY` no `backendIA/.env`
- Reinicie o Backend IA

---

## 📊 Arquitetura do Sistema

```
┌─────────────────┐
│   Expo App      │ (React Native - Porta 8081)
│   (Celular)     │
└────────┬────────┘
         │
         ├─────────────────┐
         │                 │
         ▼                 ▼
┌─────────────────┐  ┌──────────────────┐
│  Backend IA     │  │  BackendRedis    │
│  (Porta 8000)   │  │  (Porta 8001)    │
│                 │  │                  │
│ • Google Gemini │  │ • Cache Feed     │
│ • Envio Email   │  │ • Memory/Redis   │
│ • Órgãos DB     │  │ • Standalone     │
└─────────────────┘  └──────────────────┘
```

---

## 🔄 Fluxo de Denúncia

1. **Usuário tira foto** → Expo App
2. **IA analisa imagem** → Backend IA (Gemini)
3. **Gera descrição** → Retorna para App
4. **Usuário confirma** → Envia denúncia
5. **Salva localmente** → Context (AsyncStorage)
6. **Envia para feed** → BackendRedis (cache)
7. **Notifica órgão** → Backend IA (email SMTP)
8. **Atualiza feed** → Todos os dispositivos veem

---

## 📝 Comandos Úteis

**Limpar cache do Expo:**
```powershell
npx expo start --clear
```

**Reinstalar dependências Node:**
```powershell
rm -rf node_modules; npm install
```

**Reinstalar dependências Python:**
```powershell
pip install -r requirements.txt --force-reinstall
```

**Ver logs do Backend:**
- Logs aparecem automaticamente no terminal onde o backend está rodando

**Parar todos os serviços:**
- Pressione `Ctrl+C` em cada terminal

---

## 🎓 Dicas de Desenvolvimento

- Use `console.log` no app para debug (aparecem no terminal do Expo)
- Use `print()` nos backends para debug (aparecem no terminal uvicorn)
- Recarregue o app: pressione `r` no terminal do Expo
- Reload completo: pressione `Shift+R` no terminal do Expo
- Backends recarregam automaticamente ao salvar arquivos (--reload)

---

## 📞 Suporte

Em caso de problemas, verifique:
1. Todos os 3 terminais estão rodando
2. IPs estão corretos (mesma rede)
3. Firewall não está bloqueando
4. Dependências instaladas
5. Arquivo `.env` configurado

---

**Desenvolvido por:** Equipe DeOlhoNoLixo  
**Versão:** 1.0.0  
**Data:** Dezembro 2025

# 🚀 Guia de Inicialização - DeOlho NoLixo

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- ✅ Node.js (versão 16+)
- ✅ Python 3.11+
- ✅ Expo CLI (`npm install -g expo-cli`)
- ✅ Git
- ⚠️ Redis/Memurai (opcional, mas recomendado)

## 🎯 Inicialização Completa do Sistema

### Passo 1️⃣: Clonar o Repositório (se necessário)

```powershell
cd "C:\Users\silva\OneDrive\Área de Trabalho\deolhonolixo"
git clone https://github.com/Alejjandromart/DeOlhoNoLixo-App.git
cd DeOlhoNoLixo-App
```

### Passo 2️⃣: Instalar Dependências do App

```powershell
# Na raiz do projeto
npm install
```

**Tempo estimado**: 2-3 minutos

---

## 🤖 Backend IA (Port 8000)

### Passo 3️⃣: Configurar Backend de IA

```powershell
# Navegar para o backend IA
cd backendIA

# Instalar dependências Python
pip install -r requirements.txt
```

### Passo 4️⃣: Configurar Variáveis de Ambiente

Verifique se o arquivo `.env` existe em `backendIA/.env`:

```env
GEMINI_API_KEY=AIzaSyDV5QIuKPdz_D9zFrIojBZi0E9xpjIHt_M
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=silvapeterson950@gmail.com
SMTP_PASSWORD=vppapshsnxbwkqql
EMAIL_FROM=silvapeterson950@gmail.com
```

### Passo 5️⃣: Iniciar Backend IA

**Terminal 1** (deixe aberto):
```powershell
cd "C:\Users\silva\OneDrive\Área de Trabalho\deolhonolixo\DeOlhoNoLixo-App\backendIA"
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Você deve ver**:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Application startup complete.
```

**Testar**:
```powershell
# Em outro terminal
curl http://192.168.0.3:8000/
```

Deve retornar: `{"status":"online","service":"DeOlho NoLixo AI Service"}`

---

## 💾 Backend Redis (Port 8001)

### Passo 6️⃣: Configurar Backend Redis

```powershell
# Navegar para o backend Redis
cd "C:\Users\silva\OneDrive\Área de Trabalho\deolhonolixo\DeOlhoNoLixo-App\backend\BackendRedis"

# Instalar dependências Python
pip install -r requirements.txt
```

### Passo 7️⃣: Configurar Variáveis de Ambiente

Verifique se o arquivo `.env` existe em `backend/BackendRedis/.env`:

```env
GEMINI_API_KEY=AIzaSyAu2yZ1Gqk8MBSUcYZRV5ZWcF9b8sReo_0
BACKEND_API_KEY=secure-api-key-12345
ALLOWED_ORIGINS=["*"]
MAX_UPLOAD_MB=5
ALLOWED_MIME=["image/jpeg","image/png","image/webp"]
RATE_LIMIT=10/minute
DEBUG=True
REDIS_PASSWORD=DeOlhoNoLixoSecure2024!
```

### Passo 8️⃣: Iniciar Backend Redis

**IMPORTANTE**: Você precisa abrir um **novo terminal PowerShell** manualmente e executar:

```powershell
cd "C:\Users\silva\OneDrive\Área de Trabalho\deolhonolixo\DeOlhoNoLixo-App\backend\BackendRedis"
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

**Ou use este comando para abrir em nova janela**:
```powershell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\silva\OneDrive\Área de Trabalho\deolhonolixo\DeOlhoNoLixo-App\backend\BackendRedis'; uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload"
```

**Você deve ver**:
```
⚠️ Redis não disponível (Timeout). Usando cache em memória.
ℹ️ Firebase/Firestore desabilitado. Backend em modo standalone.
INFO:     Uvicorn running on http://0.0.0.0:8001
INFO:     Started server process
INFO:     Application startup complete.
```

**Testar**:
```powershell
# Em outro terminal
curl http://192.168.0.3:8001/
```

Deve retornar: `{"status":"online","service":"DeOlho NoLixo Feed Service"}`

---

## 📱 App React Native (Expo)

### Passo 9️⃣: Verificar IP da Máquina

```powershell
ipconfig
```

Procure por **"Adaptador de Rede sem Fio Wi-Fi"** → **"Endereço IPv4"**

**Importante**: O IP atual é `192.168.0.3`. Se mudou, atualize nos arquivos:
- `app/services/aiService.ts` (linha 3)
- `app/services/feedService.ts` (linha 3)

### Passo 🔟: Iniciar o Metro Bundler

**Terminal 3** (deixe aberto):
```powershell
cd "C:\Users\silva\OneDrive\Área de Trabalho\deolhonolixo\DeOlhoNoLixo-App"
npx expo start --clear
```

**Você deve ver**:
```
 › Metro waiting on exp://192.168.0.3:8081
 › Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

### Passo 1️⃣1️⃣: Abrir no Dispositivo

**Opção A - Smartphone físico**:
1. Instale **Expo Go** (Play Store/App Store)
2. Escaneie o QR code mostrado no terminal
3. Aguarde o app carregar

**Opção B - Emulador Android**:
```powershell
# Pressione 'a' no terminal do Expo
a
```

**Opção C - Simulador iOS** (apenas macOS):
```powershell
# Pressione 'i' no terminal do Expo
i
```

---

## ✅ Verificação Final

Com tudo rodando, você deve ter **3 terminais abertos**:

### Terminal 1 - Backend IA (Port 8000)
```
INFO: Uvicorn running on http://0.0.0.0:8000
```
**Função**: Análise de imagens com Gemini AI + Email para órgãos

### Terminal 2 - Backend Redis (Port 8001)
```
INFO: Uvicorn running on http://0.0.0.0:8001
```
**Função**: Feed com cache (Redis ou memória)

### Terminal 3 - Expo Metro
```
Metro waiting on exp://192.168.0.3:8081
```
**Função**: App React Native rodando

---

## 🧪 Testes de Funcionamento

### 1. Testar Backend IA
```powershell
curl http://192.168.0.3:8000/
```
✅ Esperado: `{"status":"online","service":"DeOlho NoLixo AI Service"}`

### 2. Testar Backend Redis
```powershell
Invoke-WebRequest -Uri "http://192.168.0.3:8001/feed" -Headers @{"X-API-Key"="secure-api-key-12345"} | Select-Object -ExpandProperty Content
```
✅ Esperado: `[{"id":"mock-1",...}]` (denúncia mock)

### 3. Testar App
1. Abra o app no celular/emulador
2. Faça login ou cadastre-se
3. Vá em "Realizar Denúncia"
4. Tire uma foto de lixo
5. Aguarde a análise da IA
6. Revise e envie

---

## 🔧 Comandos Rápidos (Inicialização Futura)

### Script PowerShell para Iniciar Tudo de Uma Vez

Salve como `start-all.ps1`:

```powershell
# Terminal 1: Backend IA
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\silva\OneDrive\Área de Trabalho\deolhonolixo\DeOlhoNoLixo-App\backendIA'; uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

# Aguarda 3 segundos
Start-Sleep -Seconds 3

# Terminal 2: Backend Redis
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\silva\OneDrive\Área de Trabalho\deolhonolixo\DeOlhoNoLixo-App\backend\BackendRedis'; uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload"

# Aguarda 3 segundos
Start-Sleep -Seconds 3

# Terminal 3: Expo
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\silva\OneDrive\Área de Trabalho\deolhonolixo\DeOlhoNoLixo-App'; npx expo start --clear"

Write-Host "✅ Todos os serviços foram iniciados!" -ForegroundColor Green
Write-Host "Aguarde alguns segundos para os backends iniciarem completamente." -ForegroundColor Yellow
```

**Executar**:
```powershell
cd "C:\Users\silva\OneDrive\Área de Trabalho\deolhonolixo\DeOlhoNoLixo-App"
.\start-all.ps1
```

---

## 🛑 Como Parar Tudo

### Parar Backends (Terminais 1 e 2)
Pressione `Ctrl+C` em cada terminal

### Parar Expo (Terminal 3)
Pressione `Ctrl+C`

### Matar Processos (se necessário)
```powershell
# Encontrar processos na porta 8000
netstat -ano | findstr :8000

# Matar processo (substitua PID)
taskkill /PID <número_do_processo> /F

# Repetir para 8001 e 8081
```

---

## 📊 Portas Utilizadas

| Porta | Serviço | Descrição |
|-------|---------|-----------|
| 8000 | Backend IA | Análise Gemini + Email |
| 8001 | Backend Redis | Feed com cache |
| 8081 | Expo Metro | App React Native |
| 19000 | Expo DevTools | Ferramentas de desenvolvimento |
| 19001 | Expo | Tunnel |
| 6379 | Redis | Cache (se instalado) |

---

## 🐛 Problemas Comuns

### ❌ Erro: "Port already in use"
```powershell
# Encontrar processo usando a porta
netstat -ano | findstr :8000  # ou 8001, 8081

# Matar processo
taskkill /PID <número> /F
```

### ❌ Erro: "Cannot connect to backend"
1. Verifique se os backends estão rodando
2. Confirme o IP: `ipconfig`
3. Atualize o IP em `aiService.ts` e `feedService.ts`
4. Reinicie o Expo: `r` no terminal

### ❌ Erro: "Module not found"
```powershell
# No app
npm install

# Nos backends
pip install -r requirements.txt
```

### ❌ Expo não inicia
```powershell
# Limpar cache
npx expo start --clear

# Ou reinstalar node_modules
rm -rf node_modules
npm install
```

---

## 📝 Ordem de Inicialização (Resumo)

```
1. Backend IA (8000)          → 10 segundos
2. Backend Redis (8001)       → 10 segundos  
3. Expo Metro (8081)          → 30 segundos
4. Abrir app no dispositivo   → 20 segundos

Total: ~70 segundos
```

---

## 🎉 Sistema Totalmente Inicializado!

Quando todos os 3 terminais estiverem rodando e você conseguir:
- ✅ Acessar `http://192.168.0.3:8000/` (Backend IA)
- ✅ Acessar `http://192.168.0.3:8001/` (Backend Redis)
- ✅ Ver o QR code do Expo no terminal
- ✅ Abrir o app no celular/emulador

**O sistema está 100% operacional!** 🚀

---

## 📞 Suporte

Se algo não funcionar:

1. **Verifique os logs** nos 3 terminais
2. **Confirme o IP** com `ipconfig`
3. **Teste cada backend** individualmente com `curl`
4. **Reinicie tudo** na ordem correta

---

**Última atualização**: 30 de Novembro de 2024
**Versão**: 1.0.0

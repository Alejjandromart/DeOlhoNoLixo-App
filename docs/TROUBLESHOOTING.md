# 🆘 Troubleshooting - DeOlho NoLixo

Soluções para problemas comuns encontrados durante desenvolvimento.

---

## 📋 Índice

1. [Problemas de Instalação](#-problemas-de-instalação)
2. [Erros do Expo](#-erros-do-expo)
3. [Problemas com Backend](#-problemas-com-backend)
4. [Erros do Firebase](#-erros-do-firebase)
5. [Problemas com IA](#-problemas-com-ia)
6. [Erros de Permissões](#-erros-de-permissões)
7. [Problemas de Build](#-problemas-de-build)
8. [Outros Problemas](#-outros-problemas)

---

## 📦 Problemas de Instalação

### ❌ Erro: "Unable to resolve module"

**Sintoma**: App não encontra módulos instalados

**Soluções**:

```bash
# 1. Limpar cache do Metro
npx expo start -c

# 2. Limpar cache do npm
rm -rf node_modules
rm package-lock.json
npm cache clean --force
npm install

# 3. Reiniciar o servidor
npx expo start --clear
```

### ❌ Erro: "Command not found: expo"

**Sintoma**: Terminal não reconhece comando `expo`

**Solução**:

```bash
# Instalar Expo CLI globalmente
npm install -g @expo/cli

# Verificar instalação
expo --version
```

### ❌ Erro: "Python not found"

**Sintoma**: Backend não inicia (Windows)

**Solução**:

```bash
# Verificar se Python está no PATH
python --version

# Se não funcionar, usar py
py --version

# Adicionar ao PATH (Windows)
# 1. Pesquisar "Variáveis de ambiente"
# 2. Editar PATH
# 3. Adicionar: C:\Users\SeuUsuario\AppData\Local\Programs\Python\Python311
```

### ❌ Erro: "pip: command not found"

**Solução**:

```bash
# Windows
python -m pip install --upgrade pip

# Linux/macOS
python3 -m pip install --upgrade pip
```

---

## 📱 Erros do Expo

### ❌ Erro: "Metro bundler error"

**Sintoma**: Tela vermelha com erro do Metro

**Soluções**:

```bash
# Limpar cache
npx expo start -c

# Resetar Metro
watchman watch-del-all  # macOS/Linux
npx expo start --clear
```

### ❌ Erro: "Unable to find expo in this project"

**Solução**:

```bash
# Reinstalar Expo
npm install expo

# Verificar se está em package.json
cat package.json | grep expo
```

### ❌ QR Code não aparece

**Soluções**:

```bash
# 1. Usar modo tunnel
npx expo start --tunnel

# 2. Verificar firewall
# Windows: permitir Node.js no firewall
# macOS: System Preferences > Security > Firewall

# 3. Usar IP local manualmente
npx expo start
# Anotar o IP (ex: exp://192.168.1.10:8081)
# Digitar manualmente no Expo Go
```

### ❌ "Network response timed out"

**Sintoma**: App não conecta ao Metro bundler

**Soluções**:

```bash
# 1. Garantir mesma rede Wi-Fi
# Celular e computador devem estar na mesma rede

# 2. Usar modo LAN
npx expo start --lan

# 3. Usar modo tunnel (mais lento)
npx expo start --tunnel
```

### ❌ "Invariant Violation: Module AppRegistry is not a registered callable module"

**Solução**:

```bash
# Limpar cache e reinstalar
rm -rf node_modules
npm install
npx expo start -c
```

---

## 🔧 Problemas com Backend

### ❌ Backend não inicia: "Address already in use"

**Sintoma**: Porta 8000 ou 8001 já está em uso

**Solução**:

**Windows (PowerShell)**:
```powershell
# Encontrar processo na porta 8000
netstat -ano | findstr :8000

# Matar processo (substitua PID)
taskkill /PID <PID> /F

# Ou usar porta diferente
uvicorn app.main:app --reload --port 8002
```

**Linux/macOS**:
```bash
# Encontrar processo
lsof -i :8000

# Matar processo
kill -9 <PID>
```

### ❌ "ModuleNotFoundError: No module named 'X'"

**Sintoma**: Imports Python falhando

**Solução**:

```bash
# Ativar ambiente virtual
# Windows
.\venv\Scripts\Activate.ps1

# Linux/macOS
source venv/bin/activate

# Reinstalar dependências
pip install -r requirements.txt

# Verificar instalação
pip list
```

### ❌ Redis connection refused

**Sintoma**: Backend não conecta ao Redis

**Soluções**:

```bash
# 1. Verificar se Redis está rodando
redis-cli ping
# Deve retornar: PONG

# 2. Iniciar Redis
# Windows
redis-server

# Linux/macOS
redis-server
# ou
brew services start redis

# 3. Verificar .env
# REDIS_HOST=localhost
# REDIS_PORT=6379
```

### ❌ App não conecta ao backend

**Sintoma**: Erro de rede no app mobile

**Soluções**:

1. **Verificar URLs no `.env`**:
```env
# Se estiver no emulador Android
EXPO_PUBLIC_API_URL=http://10.0.2.2:8000

# Se estiver em dispositivo físico (usar IP da máquina)
EXPO_PUBLIC_API_URL=http://192.168.1.10:8000

# Localhost só funciona no mesmo dispositivo!
```

2. **Descobrir IP da máquina**:
```bash
# Windows
ipconfig
# Procurar IPv4 Address

# Linux/macOS
ifconfig
# ou
ip addr
```

3. **Verificar firewall**:
```powershell
# Windows: permitir porta 8000 e 8001
New-NetFirewallRule -DisplayName "FastAPI" -Direction Inbound -LocalPort 8000,8001 -Protocol TCP -Action Allow
```

---

## 🔥 Erros do Firebase

### ❌ "Firebase: Error (auth/invalid-api-key)"

**Solução**:

```env
# Verificar se API key está correta no .env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...

# Obter nova key do Firebase Console
# Configurações do projeto > Geral > Apps
```

### ❌ "google-services.json not found"

**Solução**:

```bash
# 1. Baixar do Firebase Console
# Configurações do projeto > Seus apps > Android app
# Clicar em "Fazer download do google-services.json"

# 2. Colocar na RAIZ do projeto
cp ~/Downloads/google-services.json .

# 3. Verificar
ls -la google-services.json
```

### ❌ "serviceAccountKey.json" erros

**Solução**:

```bash
# 1. Baixar do Firebase Console
# Configurações do projeto > Contas de serviço
# Gerar nova chave privada

# 2. Colocar em backend/BackendRedis/
cp ~/Downloads/serviceAccountKey.json backend/BackendRedis/

# 3. Verificar .env
# FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
```

### ❌ "Firebase: Error (auth/network-request-failed)"

**Soluções**:

1. **Verificar conexão com internet**
2. **Verificar firewall**
3. **Testar com dados móveis** (pode ser rede corporativa bloqueando)

### ❌ Storage upload fails

**Solução**:

```javascript
// Verificar regras do Storage no Firebase Console
// Storage > Rules

// Regras permissivas para desenvolvimento:
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 🤖 Problemas com IA

### ❌ "GOOGLE_API_KEY not found"

**Solução**:

```bash
# 1. Criar .env em backendIA/
cd backendIA
touch .env  # Linux/macOS
# ou criar manualmente

# 2. Adicionar chave
echo "GOOGLE_API_KEY=sua_chave_aqui" >> .env

# 3. Obter chave em https://makersuite.google.com/app/apikey
```

### ❌ YOLOv8 model not found

**Sintoma**: `FileNotFoundError: yolov8n.pt`

**Solução**:

```bash
cd backend/trash.v1i.yolov8

# Baixar modelo pré-treinado
pip install ultralytics
python -c "from ultralytics import YOLO; YOLO('yolov8n.pt')"

# Verificar
ls -la yolov8n.pt
```

### ❌ "Gemini API quota exceeded"

**Sintoma**: Erro 429 ou quota exceeded

**Soluções**:

1. **Aguardar reset do limite** (geralmente 1 minuto)
2. **Implementar rate limiting no código**
3. **Usar chave de projeto diferente**
4. **Ativar billing** (se necessário)

### ❌ Classificação muito lenta

**Soluções**:

```python
# 1. Reduzir tamanho da imagem antes de processar
from PIL import Image

def resize_image(image_path, max_size=640):
    img = Image.open(image_path)
    img.thumbnail((max_size, max_size))
    return img

# 2. Usar modelo menor
# yolov8n.pt (mais rápido) ao invés de yolov8l.pt

# 3. Habilitar GPU (se disponível)
# Instalar: pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```

---

## 🔒 Erros de Permissões

### ❌ Camera permission denied (Android)

**Sintoma**: App crasha ao abrir câmera

**Solução**:

```bash
# 1. Verificar AndroidManifest.xml
# Deve conter:
<uses-permission android:name="android.permission.CAMERA"/>

# 2. Solicitar permissão no código
# Ver: app/screens/Auth/PermissionsScreen.tsx

# 3. Conceder manualmente
# Configurações > Apps > DeOlhoNoLixo > Permissões > Câmera
```

### ❌ Location permission denied

**Solução**:

```typescript
// Verificar se solicita permissão corretamente
import * as Location from 'expo-location';

const { status } = await Location.requestForegroundPermissionsAsync();
if (status !== 'granted') {
  Alert.alert('Permissão negada', 'Precisamos de acesso à localização');
  return;
}
```

### ❌ "EACCES: permission denied" (npm)

**Sintoma**: Erro de permissão ao instalar pacotes

**Solução**:

```bash
# Linux/macOS: NÃO use sudo com npm!
# Consertar permissões:
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Windows: executar PowerShell como Administrador
```

---

## 📦 Problemas de Build

### ❌ EAS Build fails

**Sintoma**: Build no EAS falha

**Soluções**:

```bash
# 1. Limpar build anterior
eas build:cancel

# 2. Atualizar eas.json
# Verificar configurações em eas.json

# 3. Tentar build local primeiro
eas build --platform android --local

# 4. Ver logs detalhados
eas build:list
eas build:view <build-id>
```

### ❌ "Could not find tools.jar"

**Sintoma**: Build Android falha

**Solução**:

```bash
# Instalar JDK 11 ou 17
# Windows: https://adoptium.net/
# Linux: sudo apt install openjdk-17-jdk
# macOS: brew install openjdk@17

# Configurar JAVA_HOME
# Windows (PowerShell):
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.5.8-hotspot"

# Linux/macOS:
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
```

### ❌ Gradle build fails

**Solução**:

```bash
cd android
# Limpar cache
./gradlew clean

# Rebuild
./gradlew assembleDebug

# Se erro persistir, deletar .gradle
rm -rf ~/.gradle/caches/
```

---

## 🔧 Outros Problemas

### ❌ TypeScript errors após update

**Solução**:

```bash
# Limpar cache do TypeScript
rm -rf .expo
rm tsconfig.json
npx expo start --clear

# Reinstalar tipos
npm install --save-dev @types/react @types/react-native
```

### ❌ App muito lento no desenvolvimento

**Soluções**:

```bash
# 1. Usar modo de produção
npx expo start --no-dev

# 2. Habilitar Hermes (se não estiver)
# Em app.json:
{
  "expo": {
    "jsEngine": "hermes"
  }
}

# 3. Otimizar imagens
# Usar formato WebP ao invés de PNG
```

### ❌ Hot reload não funciona

**Solução**:

```bash
# Reiniciar com clear
npx expo start -c

# Desabilitar/habilitar fast refresh no app
# Shake device > Enable Fast Refresh
```

### ❌ "Watchman error"

**macOS/Linux**:
```bash
# Reinstalar Watchman
brew install watchman

# Limpar watches
watchman watch-del-all
```

### ❌ Expo Go não abre o app

**Soluções**:

1. **Atualizar Expo Go** para última versão
2. **Verificar compatibilidade SDK**:
```bash
npx expo-doctor
```
3. **Usar emulador** ao invés de Expo Go

---

## 🆘 Ainda com Problemas?

### Checklist Final

- [ ] Node.js e npm atualizados?
- [ ] Dependências instaladas (`npm install`)?
- [ ] Cache limpo (`npx expo start -c`)?
- [ ] Backends rodando (portas 8000 e 8001)?
- [ ] Firebase configurado corretamente?
- [ ] Arquivos `.env` criados?
- [ ] Mesma rede Wi-Fi (device e computador)?
- [ ] Permissões concedidas no celular?

### Obter Ajuda

1. **Verificar issues existentes**: [GitHub Issues](https://github.com/Alejjandromart/DeOlhoNoLixo-App/issues)
2. **Abrir nova issue**: Incluir:
   - Sistema operacional
   - Versões (Node, npm, Python, etc)
   - Logs de erro completos
   - Passos para reproduzir
3. **Discussions**: Para perguntas gerais
4. **Documentação oficial**:
   - [Expo Docs](https://docs.expo.dev/)
   - [React Native Docs](https://reactnative.dev/)
   - [FastAPI Docs](https://fastapi.tiangolo.com/)

---

## 🔍 Logs Úteis

### Coletar logs do app

```bash
# Logs do Metro bundler
npx expo start --clear

# Logs do Android
adb logcat | grep "ReactNativeJS"

# Logs do iOS
react-native log-ios
```

### Logs do backend

```bash
# Ver logs em tempo real
cd backend/BackendRedis
uvicorn app.main:app --reload --log-level debug

# Logs do Python
tail -f app.log
```

---

[← Voltar ao README](../README.md) | [Instalação →](INSTALACAO.md)

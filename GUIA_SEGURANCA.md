# 🔐 Guia de Segurança - Credenciais Sensíveis

## ⚠️ IMPORTANTE - NUNCA COMMITAR CREDENCIAIS!

Este documento descreve como gerenciar credenciais sensíveis de forma segura no projeto.

## 📋 Estrutura de Arquivos

### Frontend (React Native/Expo)

- **`.env.local`** - Arquivo real com credenciais (GITIGNORED)
- **`.env.example`** - Template público para referência (SEM credenciais reais)

### Backend (FastAPI)

- **`backend/BackendRedis/.env`** - Arquivo real (GITIGNORED)
- **`backend/BackendRedis/.env.example`** - Template público (SEM credenciais reais)
- **`backendIA/.env`** - Arquivo real (GITIGNORED)
- **`backendIA/.env.example`** - Template público (SEM credenciais reais)

## 🚀 Setup Inicial

1. **Clone o repositório**
   ```bash
   git clone https://github.com/Alejjandromart/DeOlhoNoLixo-App.git
   cd DeOlhoNoLixo-App
   ```

2. **Frontend - Criar arquivo de env local**
   ```bash
   cp .env.example .env.local
   # Editar .env.local e adicionar valores reais do seu Firebase
   ```

3. **Backend - Criar arquivos de env local**
   ```bash
   cp backend/BackendRedis/.env.example backend/BackendRedis/.env
   cp backendIA/.env.example backendIA/.env
   # Editar cada arquivo e adicionar valores reais
   ```

## ✅ Verificação de Segurança

- [x] Todos os `.env` e `.env.local` adicionados ao `.gitignore`
- [x] Arquivos de exemplo (`.env.example`) no repositório para referência
- [x] Código refatorado para ler de `process.env` (Frontend) e `os.getenv()` (Backend)
- [x] Credenciais removidas do código-fonte
- [x] Guia de segurança sem credenciais expostas

## 🔍 Como o Código Acessa as Credenciais

### Frontend (JavaScript/TypeScript)
```typescript
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    // ... etc
};
```

### Backend (Python)
```python
class Settings(BaseSettings):
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    REDIS_PASSWORD: str = os.getenv("REDIS_PASSWORD", "")
    # ... etc
```

## 🛡️ Boas Práticas

1. **Nunca** commitar arquivos `.env` ou `.env.local`
2. **Sempre** adicionar novas credenciais ao `.env.example` sem valores reais
3. **Usar** ferramentas como `1Password`, `LastPass`, ou `AWS Secrets Manager` para armazenar credenciais em produção
4. **Rotacionar** chaves de API regularmente
5. **Revisar** o `.gitignore` antes de commitar
6. **Usar** variáveis de ambiente no CI/CD (GitHub Actions, etc.)
7. **Verificar** o histórico do git para credenciais expostas antes de fazer push

## 📝 Para Contribuidores

Se você clonar este repositório:

1. Crie os arquivos `.env.local` baseado em `.env.example`
2. Preencha com suas credenciais reais (solicite ao time se necessário)
3. **NÃO commitar** esses arquivos
4. Verifique seu git status antes de fazer push: `git status`

```bash
# Verificar se há arquivos .env que não estão gitignored
git status | grep "\.env"
```

## 🚨 Se Credenciais Forem Expostas

1. **Regenere as chaves** imediatamente no Firebase/Google Cloud/Gemini
2. **Remova da memória do git**:
   ```bash
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch app/lib/firebase.ts" \
   --prune-empty --tag-name-filter cat -- --all
   ```
3. **Notifique o time** sobre a exposição
4. **Regenere todas as credenciais** afetadas

## 📚 Referências

- [Expo Environment Variables](https://docs.expo.dev/build-reference/variables/)
- [Firebase Security Best Practices](https://firebase.google.com/docs/rules)
- [Python-Dotenv Documentation](https://python-dotenv.readthedocs.io/)
- [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)


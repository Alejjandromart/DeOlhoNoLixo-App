# Integração BackendRedis - Feed com Cache

## 🎯 Objetivo

O BackendRedis fornece um sistema de cache inteligente para o feed de denúncias, melhorando significativamente a performance do aplicativo.

## 🏗️ Arquitetura

```
┌─────────────────┐      POST /feed       ┌──────────────────┐
│   App React     │ ──────────────────────>│  BackendRedis    │
│    Native       │                        │   (Port 8001)    │
│                 │      GET /feed         │                  │
│  DenunciaIA.tsx │<───────────────────────│  Feed Service    │
│  FeedScreen.tsx │                        │  + Redis Cache   │
└─────────────────┘                        └──────────────────┘
                                                    │
                                                    │ Cache em Memória
                                                    │ (Fallback sem Redis)
                                                    ▼
                                           ┌──────────────────┐
                                           │  Memory Cache    │
                                           │  TTL: 60 segundos│
                                           └──────────────────┘
```

## 📦 Componentes

### 1. **BackendRedis (Port 8001)**
- **Localização**: `backend/BackendRedis/`
- **Tecnologia**: FastAPI + Redis (com fallback para memória)
- **Endpoints**:
  - `GET /` - Status do serviço
  - `GET /feed` - Retorna 10 denúncias mais recentes (com cache)
  - `POST /feed` - Adiciona nova denúncia ao cache

### 2. **feedService.ts**
- **Localização**: `app/services/feedService.ts`
- **Funções**:
  - `getFeedDenuncias()` - Busca denúncias do backend
  - `addDenunciaToFeed()` - Adiciona denúncia ao feed
  - `checkFeedServiceStatus()` - Verifica status do serviço

### 3. **Integração no App**
- **DenunciaIA.tsx**: Envia denúncias ao feed após criação
- **FeedScreen.tsx**: Busca denúncias do backend ao carregar

## 🔑 Configuração

### Variáveis de Ambiente (.env)

```env
# BackendRedis
GEMINI_API_KEY=AIzaSyAu2yZ1Gqk8MBSUcYZRV5ZWcF9b8sReo_0
BACKEND_API_KEY=secure-api-key-12345
REDIS_PASSWORD=DeOlhoNoLixoSecure2024!
```

### API Key
Todas as requisições ao BackendRedis precisam do header:
```
X-API-Key: secure-api-key-12345
```

## 🚀 Como Usar

### 1. Iniciar BackendRedis

```powershell
cd backend\BackendRedis
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

Ou usar PowerShell em segundo plano:
```powershell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'backend\BackendRedis'; uvicorn app.main:app --host 0.0.0.0 --port 8001" -WindowStyle Minimized
```

### 2. Verificar Status

```powershell
curl http://192.168.0.3:8001/
```

Resposta esperada:
```json
{
  "status": "online",
  "service": "DeOlho NoLixo Feed Service"
}
```

### 3. Testar Feed (com X-API-Key)

```powershell
curl -H "X-API-Key: secure-api-key-12345" http://192.168.0.3:8001/feed
```

## 📊 Fluxo de Dados

### Criação de Denúncia

1. Usuário preenche formulário em `DenunciaIA.tsx`
2. Imagens são analisadas pela IA (backendIA:8000)
3. Denúncia é salva no `DenunciaContext` (local)
4. **NOVO**: Denúncia é enviada ao `BackendRedis:8001/feed` (cache)
5. Cache Redis atualizado automaticamente

### Visualização do Feed

1. `FeedScreen.tsx` carrega ao abrir
2. Chama `getFeedDenuncias()` do `feedService.ts`
3. **BackendRedis** retorna do cache (60s TTL):
   - ✅ **Com Redis**: Busca do Redis (ultra-rápido)
   - ⚠️ **Sem Redis**: Busca do cache em memória (rápido)
   - 🔄 **Cache expirado**: Recarrega (lista vazia em modo standalone)
4. Dados convertidos para formato do Context
5. Feed exibido com `DenunciaCard`

## 🎨 Vantagens

### Performance
- ⚡ **Cache Redis**: TTL de 60 segundos reduz carga no banco
- 💾 **Fallback Memória**: Funciona sem Redis instalado
- 🔄 **Pull-to-refresh**: Recarrega dados atualizados

### Escalabilidade
- 🌐 **Múltiplos clientes**: Cache compartilhado entre usuários
- 📈 **Redução de queries**: Menos acessos ao Firebase/Supabase
- 🛡️ **Rate limiting**: Proteção contra sobrecarga

### Confiabilidade
- 🔌 **Modo offline**: Cache em memória quando Redis indisponível
- 🔄 **Auto-recuperação**: Reconecta automaticamente ao Redis
- ⚠️ **Graceful degradation**: Fallback para DenunciaContext

## 🔧 Configuração do Redis (Opcional)

### Windows - Memurai
1. Baixe: https://www.memurai.com/get-memurai
2. Instale e inicie o serviço
3. Configuração padrão: `localhost:6379`
4. Password: `DeOlhoNoLixoSecure2024!`

### Verificar Conexão
```powershell
redis-cli -h localhost -p 6379 -a DeOlhoNoLixoSecure2024!
```

## 📝 Logs

### BackendRedis
```
⚠️ Redis não disponível (Timeout). Usando cache em memória.
ℹ️ Firebase/Firestore desabilitado. Backend em modo standalone.
INFO: Uvicorn running on http://0.0.0.0:8001
```

### App React Native
```
🔄 Carregando feed do BackendRedis...
✅ 5 denúncias carregadas do feed
📤 Enviando denúncia: {...}
✅ Denúncia adicionada ao feed com cache Redis
```

## 🐛 Troubleshooting

### Erro: "Impossível conectar ao servidor"
- ✅ Verifique se BackendRedis está rodando: `curl http://192.168.0.3:8001/`
- ✅ Confirme a porta 8001 não está em uso: `netstat -ano | findstr :8001`

### Erro: "Invalid API key"
- ✅ Verifique o header `X-API-Key` está presente
- ✅ Confirme a chave é `secure-api-key-12345`

### Feed vazio no app
- ✅ Envie pelo menos uma denúncia usando `DenunciaIA.tsx`
- ✅ Verifique logs do backend: "➕ Adicionando denúncia ao feed"
- ✅ Teste diretamente: `curl -H "X-API-Key: secure-api-key-12345" http://192.168.0.3:8001/feed`

### Redis não conecta
- ℹ️ **Não é crítico**: Sistema funciona com cache em memória
- ✅ Para ativar Redis: Instale Memurai e reinicie BackendRedis
- ✅ Teste conexão: `redis-cli -h localhost -p 6379 -a DeOlhoNoLixoSecure2024!`

## 🔮 Próximos Passos

- [ ] Persistência de likes e comentários via API
- [ ] Sincronização com Supabase
- [ ] Suporte a paginação (>10 denúncias)
- [ ] WebSockets para atualizações em tempo real
- [ ] Redis Sentinel para alta disponibilidade

## 📞 Suporte

Em caso de problemas, verifique:
1. Logs do BackendRedis (terminal onde rodou uvicorn)
2. Logs do Expo (terminal do Metro)
3. Network requests no React Native Debugger

---

**Status Atual**: ✅ Totalmente funcional (com ou sem Redis)
**Última Atualização**: 2024

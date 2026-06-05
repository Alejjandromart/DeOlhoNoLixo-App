# Task 4: BackendIA — Consolidação + Dockerfile + Deploy Render.com

> **Dependências:** Nenhuma (independente do frontend)
> **Arquitetura:** FastAPI + Python 3.11 + Gemini API → deploy no Render.com (free tier)
> **Tech Stack:** Python 3.11, FastAPI, uvicorn, google-generativeai, slowapi, Pydantic v2, Docker

---

## 🛠️ Especificação

### 1. Objetivo
- **Unificar** as duas versões do backend (`backendIA/main.py` raiz vs `backendIA/app/`) em uma única versão — a estruturada (`app/`)
- **Containerizar** com Dockerfile para deploy no Render.com
- **Adicionar endpoint `/health`** para monitoramento e keep-alive
- **Conectar o frontend** à URL do Render via `app.config.js` + `expo-constants`
- **Conectar `Step2Description.tsx`** à API real (hoje usa resposta hardcoded)

### 2. Endpoint `/health`

```
GET /health
Response 200: { "status": "ok", "service": "DeOlho NoLixo AI API" }
```
Usado pelo Render para health checks e pelo cron-job.org para manter o serviço acordado.

### 3. Endpoint `/analyze` (já implementado — apenas validar)

```
POST /analyze
Headers: X-API-Key: {BACKEND_API_KEY}
Body: multipart/form-data
  files[]: imagens (jpeg/png/webp, máx 5MB cada)
  latitude: float (opcional)
  longitude: float (opcional)

Response 200:
{
  "objectsDetected": ["saco plástico", "entulho"],
  "geographicContext": "Área urbana, calçada",
  "environmentalImpact": "Obstrução de vias públicas...",
  "severity": "Médio",
  "suggestedCategory": "Doméstico",
  "suggestedDescription": "Acúmulo irregular de resíduos..."
}
```

### 4. Modelo de dados — `AnalysisResult`
```python
class AnalysisResult(BaseModel):
    objectsDetected: List[str]
    geographicContext: str
    environmentalImpact: str
    severity: str          # "Nenhuma" | "Baixo" | "Médio" | "Crítico"
    suggestedCategory: str
    suggestedDescription: str
```

### 5. Configuração de URL no Frontend

O `Step2Description.tsx` atualmente usa uma resposta hardcoded (fake). Após o deploy,
ele deve chamar a URL real configurada via `expo-constants`:

```typescript
import Constants from 'expo-constants';
const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl ?? 'https://deolho-ia.onrender.com';
const BACKEND_API_KEY = Constants.expoConfig?.extra?.backendApiKey ?? '';
```

### 6. Passos de Deploy no Render.com

1. Criar conta em [render.com](https://render.com) (gratuito com GitHub login)
2. "New +" → "Web Service"
3. Conectar repositório GitHub → selecionar `DeOlhoNoLixo-App`
4. Configurar:
   - **Name**: `deolho-ia`
   - **Root Directory**: `backendIA`
   - **Runtime**: Docker
   - **Build Command**: (automático via Dockerfile)
   - **Start Command**: (automático via CMD do Dockerfile)
5. Adicionar variáveis de ambiente:
   - `GEMINI_API_KEY` = (nova chave do [Google AI Studio](https://aistudio.google.com/apikey))
   - `BACKEND_API_KEY` = (string segura aleatória — ex: `openssl rand -hex 32`)
   - `ALLOWED_ORIGINS` = `["*"]`
   - `MAX_UPLOAD_MB` = `5`
   - `ALLOWED_MIME` = `["image/jpeg","image/png","image/webp"]`
   - `RATE_LIMIT` = `10/minute`
   - `DEBUG` = `False`
6. Clicar em "Deploy"
7. Aguardar ~3min para o primeiro build
8. URL gerada: `https://deolho-ia.onrender.com`

### 7. Keep-Alive (evitar cold start nos testes)

1. Criar conta em [cron-job.org](https://cron-job.org) (gratuito)
2. "Create cronjob":
   - URL: `https://deolho-ia.onrender.com/health`
   - Schedule: a cada **10 minutos**
3. Isso mantém o serviço acordado durante a sessão de testes

### 8. Edge Cases
- **Render sem `.env`**: variáveis de ambiente são configuradas no painel do Render — o arquivo `.env` não vai para produção (está no `.gitignore`)
- **Gemini API key antiga comprometida**: gerar nova em `aistudio.google.com` ANTES do deploy
- **`BACKEND_API_KEY` no frontend**: vai para o APK (pode ser decompilado). Para o teste GQS isso é aceitável. Em produção, o ideal seria um proxy ou Firebase Functions
- **Timeout Render free tier**: requests lentos (>30s) são cancelados. O Gemini costuma responder em 5-15s — dentro do limite
- **Dockerfile multi-arch**: usar `python:3.11-slim` que suporta `linux/amd64` (Render usa AMD64)

### 9. Fora do Escopo
- Não configurar domínio personalizado
- Não implementar HTTPS próprio (Render fornece automático)
- Não implementar autoscaling

### 10. Critérios de Aceite
- [ ] `GET https://deolho-ia.onrender.com/health` → `{"status":"ok"}`
- [ ] `POST /analyze` com imagem real → resposta JSON com os 6 campos
- [ ] App (Step2Description) chama a API real e preenche descrição com resposta da IA
- [ ] `GEMINI_API_KEY` não está em nenhum arquivo commitado
- [ ] `backendIA/main.py` raiz deletado (apenas `app/main.py` existe)
- [ ] Cron-job.org configurado e fazendo ping a cada 10min

---

## 📂 Arquivos

### [DELETE] `backendIA/main.py` (raiz — versão não estruturada)

```bash
git rm backendIA/main.py
```

---

### `backendIA/app/main.py` — ADICIONAR `/health`

```diff
  @app.get("/")
  async def root():
      return {"status": "online", "service": "DeOlho NoLixo AI API"}

+ @app.get("/health")
+ async def health():
+     return {"status": "ok", "service": "DeOlho NoLixo AI API"}
```

---

### [NEW] `backendIA/Dockerfile`

```dockerfile
FROM python:3.11-slim

# Sem cache de apt para imagem menor
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
```

---

### [NEW] `backendIA/.dockerignore`

```
__pycache__/
*.pyc
.env
.env.*
test_backend.py
trash.v1i.yolov8/
```

---

### `app.config.js` — ADICIONAR `backendUrl` e `backendApiKey` no `extra`

```diff
    extra: {
+     backendUrl: process.env.BACKEND_URL || 'https://deolho-ia.onrender.com',
+     backendApiKey: process.env.BACKEND_API_KEY || '',
      eas: {
        projectId: 'd80d11f6-aaac-48b6-a1be-83033f23b782'
      }
    },
```

---

### `app/screens/DenunciaIA/components/Step2Description.tsx` — CHAMAR API REAL

Substituir a resposta hardcoded pela chamada real ao backendIA:

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Constants from 'expo-constants';
import { ReportData } from '../DenunciaIA';
import AnalyzingState from './AnalyzingState';

const BACKEND_URL = (Constants.expoConfig?.extra?.backendUrl as string) ?? 'https://deolho-ia.onrender.com';
const BACKEND_API_KEY = (Constants.expoConfig?.extra?.backendApiKey as string) ?? '';

interface Props {
  data: ReportData;
  updateData: (data: Partial<ReportData>) => void;
}

export default function Step2Description({ data, updateData }: Props) {
  const [isAnalyzing, setIsAnalyzing] = useState(data.description.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAnalyzing) return;
    analisarImagens();
  }, []);

  const analisarImagens = async () => {
    try {
      const formData = new FormData();

      for (const photoUri of data.photos) {
        const filename = photoUri.split('/').pop() ?? 'photo.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        formData.append('files', { uri: photoUri, name: filename, type } as any);
      }

      if (data.coordinates?.lat) formData.append('latitude', String(data.coordinates.lat));
      if (data.coordinates?.lng) formData.append('longitude', String(data.coordinates.lng));

      const response = await fetch(`${BACKEND_URL}/analyze`, {
        method: 'POST',
        headers: { 'X-API-Key': BACKEND_API_KEY },
        body: formData,
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const result = await response.json();

      updateData({
        description: result.suggestedDescription ?? '',
        category: result.suggestedCategory ?? 'Ambiental',
        aiAnalysis: {
          severity: result.severity ?? 'Médio',
          tags: result.objectsDetected ?? [],
        },
      });
    } catch (e) {
      setError('Não foi possível analisar as imagens. Escreva a descrição manualmente.');
      updateData({ description: '' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzing) {
    return <AnalyzingState onComplete={() => {}} />;
  }

  return (
    <View style={styles.container}>
      {error && (
        <View style={styles.errorCard}>
          <Ionicons name="warning-outline" size={18} color="#DC2626" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Descrição</Text>
          {!error && (
            <View style={styles.aiBadge}>
              <Ionicons name="sparkles" size={12} color="#8B5CF6" />
              <Text style={styles.aiBadgeText}>Sugestão da IA</Text>
            </View>
          )}
        </View>

        <View style={styles.textAreaContainer}>
          <TextInput
            style={styles.textArea}
            value={data.description}
            onChangeText={(text) => updateData({ description: text })}
            placeholder="Descreva o problema..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            maxLength={500}
          />
          <View style={styles.charCounter}>
            <Text style={styles.charCounterText}>{data.description.length}/500</Text>
          </View>
        </View>

        {data.aiAnalysis && data.aiAnalysis.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            <Text style={styles.tagsLabel}>TIPOS IDENTIFICADOS</Text>
            <View style={styles.tags}>
              {data.aiAnalysis.tags.map((tag, i) => (
                <View key={i} style={styles.tag}>
                  <Ionicons name="pricetag" size={10} color="#059669" />
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoIconContainer}>
          <Ionicons name="create-outline" size={18} color="#059669" />
        </View>
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>Revise o texto</Text>
          <Text style={styles.infoText}>
            {error
              ? 'Escreva uma descrição detalhada do problema encontrado.'
              : 'A inteligência artificial gerou este texto com base nas imagens. Sinta-se à vontade para editar.'}
          </Text>
        </View>
      </View>
    </View>
  );
}

// Manter os mesmos styles do arquivo original +
const styles = StyleSheet.create({
  container: { gap: 24 },
  errorCard: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FEF2F2', padding: 12, borderRadius: 12,
    borderWidth: 1, borderColor: '#FECACA',
  },
  errorText: { flex: 1, fontSize: 13, color: '#DC2626' },
  card: {
    backgroundColor: '#FFFFFF', padding: 20, borderRadius: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 2, elevation: 2,
    borderWidth: 1, borderColor: '#F3F4F6',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  aiBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#F5F3FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12,
  },
  aiBadgeText: { fontSize: 12, fontWeight: '600', color: '#8B5CF6' },
  textAreaContainer: { position: 'relative' },
  textArea: {
    backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB',
    borderRadius: 16, padding: 16, fontSize: 14, color: '#1F2937', minHeight: 160,
  },
  charCounter: {
    position: 'absolute', bottom: 12, right: 12,
    backgroundColor: 'rgba(255,255,255,0.8)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
  },
  charCounterText: { fontSize: 12, color: '#9CA3AF' },
  tagsContainer: { marginTop: 16 },
  tagsLabel: { fontSize: 10, fontWeight: '700', color: '#9CA3AF', letterSpacing: 0.5, marginBottom: 8 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 8, borderWidth: 1, borderColor: '#D1FAE5', elevation: 1,
  },
  tagText: { fontSize: 12, fontWeight: '600', color: '#059669' },
  infoCard: {
    flexDirection: 'row', backgroundColor: '#ECFDF5', padding: 16,
    borderRadius: 16, borderWidth: 1, borderColor: '#D1FAE5', gap: 12,
  },
  infoIconContainer: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF',
    justifyContent: 'center', alignItems: 'center', elevation: 1,
  },
  infoContent: { flex: 1 },
  infoTitle: { fontSize: 14, fontWeight: '600', color: '#065F46', marginBottom: 4 },
  infoText: { fontSize: 12, color: '#059669', lineHeight: 18 },
});
```

---

## Comandos

```bash
# Gerar BACKEND_API_KEY segura (rodar no terminal)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Testar o container localmente (opcional)
cd backendIA
docker build -t deolho-ia .
docker run -p 8000:8000 \
  -e GEMINI_API_KEY=sua_chave \
  -e BACKEND_API_KEY=sua_api_key \
  -e ALLOWED_ORIGINS='["*"]' \
  deolho-ia

# Testar health check
curl http://localhost:8000/health
```

---

## Commit

```bash
git add -A
git commit -m "feat: consolidate backendIA, add Dockerfile and /health endpoint, connect Step2Description to real API"
```

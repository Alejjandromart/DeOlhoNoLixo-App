# 🔥 Firebase Integration Guide

## ℹ️ Status Atual

O Firebase está **DESABILITADO** por padrão. O sistema funciona perfeitamente sem ele, usando:
- **Supabase** para autenticação
- **BackendRedis** para cache do feed
- **Context Local** para estado da aplicação

## 🎯 Quando Habilitar Firebase?

Habilite o Firebase se você precisa de:
- ✅ **Sincronização em tempo real** entre dispositivos
- ✅ **Upload de imagens** no Firebase Storage (mais robusto que Base64)
- ✅ **Persistência permanente** no Firestore
- ✅ **Dashboard admin** para gerenciar denúncias

## 🔧 Como Ativar o Firebase

### 1. Configurar Credenciais

O arquivo `google-services.json` já existe na raiz do projeto. Se precisar atualizar:

```bash
# Baixe do Firebase Console
# Coloque na raiz: DeOlhoNoLixo-App/google-services.json
```

### 2. Habilitar Firebase no Código

Edite `app/config/firebaseEnabled.ts`:

```typescript
export const USE_FIREBASE = true; // ← Mude para true
```

### 3. Instalar Dependências (já instaladas)

```bash
npm install firebase
# Já está instalado no package.json
```

### 4. Reiniciar o App

```bash
npx expo start --clear
```

## 📁 Arquivos do Firebase

### Configuração
- `app/config/firebaseEnabled.ts` - Flag para ativar/desativar
- `app/lib/firebase.ts` - Inicialização do Firebase
- `google-services.json` - Credenciais Android

### Serviços
- `app/services/firebase.ts` - Re-exporta instâncias (auth, db, storage)
- `app/services/storage.ts` - Upload de fotos no Firebase Storage
- `app/services/denuncias.ts` - CRUD de denúncias no Firestore

### Integração
- `app/context/DenunciaContext.tsx` - Usa Firebase quando habilitado

## 🔄 Como Funciona

### Com Firebase DESABILITADO (padrão)
```
1. Usuário cria denúncia
2. Salva no Context (AsyncStorage)
3. Envia para BackendRedis (cache)
4. Imagens em Base64 (dentro do JSON)
```

### Com Firebase HABILITADO
```
1. Usuário cria denúncia
2. Upload de imagens → Firebase Storage (URLs permanentes)
3. Salva no Firestore (banco permanente)
4. Listener em tempo real atualiza Context
5. Também envia para BackendRedis (compatibilidade)
```

## 🎨 Funcionalidades do Firebase

### Storage (enviarFoto)
```typescript
import { enviarFoto } from '@/services/storage';

// Upload de imagem
const uri = 'file:///...jpg';
const url = await enviarFoto(uri);
// Retorna: https://firebasestorage.googleapis.com/.../foto.jpg
```

### Firestore (criarDenuncia)
```typescript
import { criarDenuncia } from '@/services/denuncias';

const dados = {
  descricao: 'Lixo acumulado',
  fotoURL: ['https://...'],
  latitude: -23.550520,
  longitude: -46.633308,
  localizacao: 'Av. Paulista',
  tipos: ['plástico', 'papel'],
  usuarioEmail: 'user@example.com',
};

const docId = await criarDenuncia(dados);
```

### Firestore (ouvirDenuncias)
```typescript
import { ouvirDenuncias } from '@/services/denuncias';

// Listener em tempo real
const unsubscribe = ouvirDenuncias((denuncias) => {
  console.log(`${denuncias.length} denúncias recebidas`);
  // Atualiza UI automaticamente
});

// Cancelar listener
unsubscribe();
```

### Firestore (curtirDenuncia)
```typescript
import { curtirDenuncia, descurtirDenuncia } from '@/services/denuncias';

// Incrementa contador
await curtirDenuncia('doc-id-123');

// Decrementa contador
await descurtirDenuncia('doc-id-123');
```

## 🔐 Variáveis de Ambiente (Opcional)

Crie `.env` na raiz com:

```env
FIREBASE_API_KEY=AIzaSy...
FIREBASE_AUTH_DOMAIN=deolho-app.firebaseapp.com
FIREBASE_PROJECT_ID=deolho-app
FIREBASE_STORAGE_BUCKET=deolho-app.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=27306055437
FIREBASE_APP_ID=1:27306055437:android:...
```

## 🐛 Troubleshooting

### Firebase não inicializa
- ✅ Verifique `USE_FIREBASE = true`
- ✅ Reinicie o app com `--clear`
- ✅ Verifique `google-services.json` existe

### Upload de foto falha
- ✅ Verifique Storage está habilitado no Firebase Console
- ✅ Verifique regras do Storage permitem uploads

### Listener não funciona
- ✅ Verifique Firestore está habilitado
- ✅ Verifique regras do Firestore permitem leitura
- ✅ Verifique console para erros

## 📊 Estrutura do Firestore

### Coleção: `denuncias`
```json
{
  "descricao": "string",
  "fotoURL": ["url1", "url2"],
  "localizacao": "string",
  "latitude": number,
  "longitude": number,
  "tipos": ["tag1", "tag2"],
  "status": "Pendente" | "Em Análise" | "Resolvida",
  "usuarioEmail": "user@example.com",
  "curtidas": number,
  "created_at": Timestamp
}
```

## 🎓 Recomendações

### Para Desenvolvimento
**Mantenha Firebase DESABILITADO:**
- ✅ Mais rápido (sem uploads)
- ✅ Funciona offline
- ✅ Testes mais simples

### Para Produção
**Habilite Firebase:**
- ✅ Sincronização multi-dispositivo
- ✅ Backup permanente
- ✅ Dashboard admin
- ✅ Escalabilidade

## 🔗 Links Úteis

- [Firebase Console](https://console.firebase.google.com/)
- [Firestore Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Storage Rules](https://firebase.google.com/docs/storage/security)

---

**Desenvolvido por:** Equipe DeOlhoNoLixo  
**Versão:** 1.0.0  
**Data:** Dezembro 2025

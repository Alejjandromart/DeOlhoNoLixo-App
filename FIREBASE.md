# 🔥 Integração com Firebase - DeOlhoNoLixo

Este documento descreve todos os arquivos e funcionalidades que se conectam diretamente ao Firebase.

---

## 📋 Índice

1. [Configuração Inicial](#configuração-inicial)
2. [Autenticação (Firebase Auth)](#autenticação-firebase-auth)
3. [Banco de Dados (Firestore)](#banco-de-dados-firestore)
4. [Armazenamento (Storage)](#armazenamento-storage)
5. [Estrutura de Dados](#estrutura-de-dados)

---

## 🔧 Configuração Inicial

### `app/lib/firebase.ts`
**Arquivo principal de configuração do Firebase**

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
```

**Serviços inicializados:**
- ✅ **Firebase Auth** - Autenticação de usuários
- ✅ **Firestore** - Banco de dados NoSQL
- ✅ **Storage** - Armazenamento de imagens

**Variáveis de ambiente (`.env`):**
```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

---

## 🔐 Autenticação (Firebase Auth)

### 1. `app/context/AuthContext.tsx`
**Gerenciamento global de autenticação**

#### Funções principais:
- `signIn(email, password)` - Login com email/senha
- `signUp(email, password)` - Cadastro de novo usuário
- `signInWithGoogle()` - Login com Google
- `signOut()` - Logout
- `resetPassword(email)` - Recuperação de senha

#### Estado global:
```typescript
{
  user: User | null,
  loading: boolean,
  isAuthReady: boolean
}
```

---

### 2. `app/screens/Auth/Login.tsx`
**Tela de login**

#### Integrações Firebase:
- `signInWithEmailAndPassword()` - Login direto
- Tratamento de erros:
  - `auth/invalid-email` - Email inválido
  - `auth/user-not-found` - Usuário não encontrado
  - `auth/wrong-password` - Senha incorreta
  - `auth/invalid-credential` - Credenciais inválidas

---

### 3. `app/screens/Auth/Cadastro.tsx`
**Tela de cadastro**

#### Integrações Firebase:
- `createUserWithEmailAndPassword()` - Criação de conta
- `setDoc(doc(db, 'usuarios', uid))` - Salva dados do usuário no Firestore

#### Dados salvos no Firestore:
```typescript
{
  email: string,
  nomeCompleto: string,
  nomeUsuario: string,
  cidade: string,
  photoURL: string | null,
  criadoEm: string (ISO)
}
```

---

### 4. `app/screens/Auth/EsqueciSenha.tsx`
**Recuperação de senha**

#### Integrações Firebase:
- `sendPasswordResetEmail(auth, email)` - Envia email de reset

---

## 📊 Banco de Dados (Firestore)

### 1. `app/context/DenunciaContext.tsx`
**Gerenciamento de denúncias (CRUD completo)**

#### Coleções Firestore utilizadas:
- **`denuncias`** - Armazena todas as denúncias
- **`usuarios`** - Dados dos usuários

#### Funções principais:

##### 📝 Criar Denúncia
```typescript
adicionarDenuncia(denuncia) {
  // 1. Upload de imagens para Storage
  // 2. Busca dados do usuário
  // 3. Salva no Firestore
  await criarDenunciaFirebase(dadosFirebase)
}
```

##### 👂 Escutar mudanças em tempo real
```typescript
ouvirDenuncias((denuncias) => {
  // Listener com onSnapshot
  // Atualiza automaticamente quando há mudanças
})
```

##### ❤️ Curtir denúncia
```typescript
curtirDenuncia(denunciaId) {
  await updateDoc(doc(db, 'denuncias', firestoreId), {
    curtidas: increment(1),
    curtidasUsers: arrayUnion(userId)
  })
}
```

##### 💬 Adicionar comentário
```typescript
adicionarComentario(denunciaId, texto, usuario) {
  await updateDoc(doc(db, 'denuncias', firestoreId), {
    comentarios: arrayUnion({
      id: timestamp,
      userId: auth.currentUser.uid,
      userName: usuario.nome,
      userAvatar: usuario.avatar,
      texto: texto,
      timestamp: serverTimestamp()
    })
  })
}
```

##### 🗑️ Deletar denúncia
```typescript
deletarDenuncia(denunciaId) {
  await deleteDoc(doc(db, 'denuncias', firestoreId))
}
```

##### 📊 Contar denúncias do mês
```typescript
contarDenunciasMesAtual(email) {
  const q = query(
    collection(db, 'denuncias'),
    where('usuarioEmail', '==', email),
    where('created_at', '>=', inicioMes)
  )
}
```

---

### 2. `app/screens/DenunciaIA/DenunciaIA.tsx`
**Criação de denúncia com IA**

#### Integrações Firebase:
- Usa `adicionarDenuncia()` do Context
- Salva automaticamente no Firestore
- Upload de imagens para Storage

#### Fluxo:
1. Usuário tira fotos
2. IA analisa as imagens
3. Gera descrição automática
4. Salva no Firestore via Context
5. Notifica órgão responsável (backend)

---

### 3. `app/screens/Home/ProfileScreen.tsx`
**Tela de perfil do usuário**

#### Integrações Firebase:
- `getDoc(doc(db, 'usuarios', uid))` - Busca dados do usuário
- `setDoc(doc(db, 'usuarios', uid))` - Atualiza perfil
- `updateProfile(auth.currentUser)` - Atualiza Auth
- `updateEmail(auth.currentUser, newEmail)` - Atualiza email

#### Dados atualizáveis:
```typescript
{
  nomeCompleto: string,
  nomeUsuario: string,
  email: string,
  cidade: string,
  photoURL: string | null
}
```

---

### 4. `app/screens/Home/ConfiguracaoScreen.tsx`
**Tela de configurações**

#### Integrações Firebase:
- Exibe dados do perfil
- Upload de foto de perfil
- Navegação para alteração de senha

---

### 5. `app/screens/Home/AlterarSenhaScreen.tsx`
**Alteração de senha**

#### Integrações Firebase:
- `reauthenticateWithCredential()` - Reautentica usuário
- `updatePassword()` - Atualiza senha

---

## 🖼️ Armazenamento (Storage)

### 1. Upload de Fotos de Denúncia
**Localização:** `app/context/DenunciaContext.tsx`

```typescript
async function enviarFoto(uri: string): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();
  
  const filename = `denuncias/${Date.now()}_${Math.random()}.jpg`;
  const storageRef = ref(storage, filename);
  
  await uploadBytes(storageRef, blob);
  return await getDownloadURL(storageRef);
}
```

**Caminho:** `denuncias/{timestamp}_{random}.jpg`

---

### 2. Upload de Foto de Perfil
**Localização:** `app/screens/Home/ProfileScreen.tsx`

```typescript
async function handleImageUpload(uri: string) {
  const blob = await fetch(uri).then(r => r.blob());
  const filename = `profile_pictures/${user.uid}.jpg`;
  const storageRef = ref(storage, filename);
  
  await uploadBytes(storageRef, blob);
  const photoURL = await getDownloadURL(storageRef);
  
  // Atualiza no Auth e Firestore
  await updateProfile(auth.currentUser, { photoURL });
  await setDoc(doc(db, 'usuarios', user.uid), { photoURL });
}
```

**Caminho:** `profile_pictures/{userId}.jpg`

---

## 📁 Estrutura de Dados no Firestore

### Coleção: `usuarios`
```typescript
{
  // Document ID = auth.currentUser.uid
  email: string,
  nomeCompleto: string,
  nomeUsuario: string,
  cidade: string,
  photoURL: string | null,
  criadoEm: string (ISO timestamp)
}
```

---

### Coleção: `denuncias`
```typescript
{
  // Document ID = auto-gerado
  descricao: string,
  fotoURL: string[], // URLs das imagens no Storage
  localizacao: string,
  latitude?: number,
  longitude?: number,
  tipos: string[], // ['Plástico', 'Metal', etc.]
  status: 'Pendente' | 'Em Andamento' | 'Resolvido',
  
  // Dados do usuário
  usuarioID: string,
  usuarioEmail: string,
  usuarioNome: string,
  usuarioAvatar: string | null,
  
  // Interações
  curtidas: number,
  curtidasUsers: string[], // Array de UIDs
  comentarios: [
    {
      id: number,
      userId: string,
      userName: string,
      userAvatar: string | null,
      texto: string,
      timestamp: Timestamp
    }
  ],
  
  // Metadados
  created_at: Timestamp,
  updated_at: Timestamp
}
```

---

## 🔄 Listeners em Tempo Real

### DenunciaContext - Listener principal
```typescript
useEffect(() => {
  const unsubscribe = onSnapshot(
    collection(db, 'denuncias'),
    (snapshot) => {
      const denuncias = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setDenuncias(denuncias)
    }
  )
  
  return () => unsubscribe() // Cleanup
}, [])
```

**Benefícios:**
- ✅ Atualização automática quando há mudanças
- ✅ Sincronização em tempo real entre dispositivos
- ✅ Offline support (cache local)

---

## 🛡️ Regras de Segurança (Firestore)

### Regras recomendadas:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Usuários - Apenas o próprio usuário pode editar
    match /usuarios/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Denúncias
    match /denuncias/{denunciaId} {
      allow read: if true; // Qualquer um pode ler
      allow create: if request.auth != null; // Apenas autenticados podem criar
      allow update: if request.auth != null; // Qualquer autenticado pode curtir/comentar
      allow delete: if request.auth != null && 
                      request.auth.uid == resource.data.usuarioID; // Apenas dono pode deletar
    }
  }
}
```

---

## 📊 Resumo de Operações

| Operação | Arquivo | Função Firebase |
|----------|---------|-----------------|
| Login | `AuthContext.tsx` | `signInWithEmailAndPassword()` |
| Cadastro | `Cadastro.tsx` | `createUserWithEmailAndPassword()` |
| Criar denúncia | `DenunciaContext.tsx` | `addDoc()` |
| Listar denúncias | `DenunciaContext.tsx` | `onSnapshot()` |
| Curtir | `DenunciaContext.tsx` | `updateDoc()` + `increment()` |
| Comentar | `DenunciaContext.tsx` | `updateDoc()` + `arrayUnion()` |
| Upload imagem | `DenunciaContext.tsx` | `uploadBytes()` + `getDownloadURL()` |
| Atualizar perfil | `ProfileScreen.tsx` | `setDoc()` + `updateProfile()` |

---

## 🚀 Performance

### Otimizações implementadas:
1. **Paginação** - Limitar queries com `limit()`
2. **Índices** - Criar índices para queries complexas
3. **Cache** - Usar cache offline do Firestore
4. **Batch writes** - Agrupar múltiplas escritas
5. **Listeners focados** - Escutar apenas dados necessários

---

## 📝 Notas Importantes

⚠️ **Limite de 5 denúncias/mês por usuário** - Implementado em `DenunciaContext.tsx`

⚠️ **Validação de email** - Feita no frontend e backend

⚠️ **Imagens comprimidas** - Quality 0.5 no upload para economizar storage

⚠️ **Cleanup de listeners** - Sempre fazer `unsubscribe()` no cleanup

---

## 🔗 Links Úteis

- [Firebase Console](https://console.firebase.google.com/)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Firebase Storage Documentation](https://firebase.google.com/docs/storage)

---

**Última atualização:** 3 de dezembro de 2025

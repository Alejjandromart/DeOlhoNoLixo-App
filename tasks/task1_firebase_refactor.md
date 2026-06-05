# Task 1: Firebase Refactor — Adicionar Firestore/Storage + Remover Google Sign-In

> **Dependências:** Nenhuma (primeira task)
> **Arquitetura:** React Native + Expo SDK 56 + Firebase v12 (modular SDK)
> **Tech Stack:** TypeScript, Firebase Auth, Firestore, Firebase Storage, AsyncStorage

---

## 🛠️ Especificação

### 1. Objetivo
Preparar a camada de infraestrutura Firebase para suportar denúncias globais persistentes.
Isso envolve três ações paralelas:
1. Adicionar `Firestore` e `Storage` ao `firebase.ts`
2. Remover **100%** do Google Sign-In do codebase (imports, funções, UI, plugin, pacote npm)
3. Configurar as regras de segurança do Firestore e do Storage no console Firebase

### 2. Pré-requisito Manual (antes de escrever código)
Abrir o [Firebase Console](https://console.firebase.google.com) → projeto `deolho-app` → **Configurações do projeto** → aba **Seus apps** → copiar `messagingSenderId` e `appId` do app Android.

### 3. Fluxo
1. Preencher `messagingSenderId` e `appId` no `firebase.ts`
2. Adicionar `getFirestore` e `getStorage` ao `firebase.ts`
3. Remover `signInWithGoogle` do `AuthContext.tsx`
4. Remover botão Google + `handleGoogleLoginPress` do `Login.tsx`
5. Remover botão Google + `onGoogle` do `Cadastro.tsx`
6. Remover `@react-native-google-signin/google-signin` do `app.config.js`
7. Remover `@react-native-google-signin/google-signin` do `package.json`
8. Rodar `npm install` para limpar `node_modules`
9. Configurar regras Firestore e Storage no Console Firebase
10. Habilitar **Firebase Storage** no console (Storage → Começar)

### 4. Regras de Segurança

**Firestore Rules** (Console → Firestore → Regras):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /denuncias/{denunciaId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null
        && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null;
      allow delete: if request.auth != null
        && resource.data.userId == request.auth.uid;

      match /comentarios/{comentarioId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null
          && request.resource.data.userId == request.auth.uid;
      }
    }

    match /users/{userId} {
      allow read, write: if request.auth != null
        && request.auth.uid == userId;
    }
  }
}
```

**Storage Rules** (Console → Storage → Regras):
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /denuncias/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
        && request.auth.uid == userId
        && request.resource.size < 10 * 1024 * 1024;
    }
  }
}
```

### 5. Edge Cases
- **`initializeApp` em hot reload**: usar `getApps().length === 0` para evitar "Firebase App named '[DEFAULT]' already exists"
- **`initializeAuth` já chamado**: o `try/catch` existente já trata isso — manter
- **Pacote `@react-native-google-signin`**: mesmo sem uso no código, ele fica no `node_modules` e gera warnings nativos no build. Removê-lo do `package.json` é obrigatório
- **`SocialButton.tsx`**: o componente de botão Google pode ser mantido no projeto (pode ser útil para futuros providers), mas não deve ser importado/usado em nenhuma tela

### 6. Fora do Escopo
- Não implementar a lógica de leitura/escrita no Firestore (Task 2)
- Não implementar upload de imagens para Storage (Task 2)
- Não alterar qualquer tela além de Login e Cadastro

### 7. Critérios de Aceite
- [ ] `expo start` roda sem warnings de módulos faltando
- [ ] Login com e-mail/senha funciona
- [ ] Cadastro funciona e redireciona para Tutorial no primeiro acesso
- [ ] Nenhuma referência a `signInWithGoogle`, `GoogleAuthProvider`, `GoogleSignin` existe no codebase
- [ ] `npm list @react-native-google-signin` retorna vazio
- [ ] Firebase Console → Storage existe e está ativo
- [ ] Firebase Console → Firestore → Regras salvas corretamente

---

## 📂 Arquivos a Modificar

### `app/lib/firebase.ts` — REESCREVER COMPLETO

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence, Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Preencher com os valores do Firebase Console → Configurações do projeto
const firebaseConfig = {
  apiKey: 'AIzaSyCxEmH_N1qy2QrSypdAqgSeRu7V-vJH-Mk',
  authDomain: 'deolho-app.firebaseapp.com',
  projectId: 'deolho-app',
  storageBucket: 'deolho-app.appspot.com',
  messagingSenderId: 'PREENCHER_DO_CONSOLE',  // ← obrigatório
  appId: 'PREENCHER_DO_CONSOLE',              // ← obrigatório
};

// Evitar re-inicialização em hot reload do Metro bundler
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  // Já inicializado (hot reload)
  auth = getAuth(app);
}

export const db = getFirestore(app);
export const storage = getStorage(app);
export { auth };
```

---

### `app/context/AuthContext.tsx` — REESCREVER COMPLETO

```typescript
import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../lib/firebase';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
} from 'firebase/auth';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let initialized = false;

    const unsubscribe = onAuthStateChanged(
      auth,
      (u) => { initialized = true; setUser(u); setLoading(false); },
      () => { initialized = true; setLoading(false); }
    );

    const timeout = setTimeout(() => {
      if (!initialized) setLoading(false);
    }, 5000);

    return () => { unsubscribe(); clearTimeout(timeout); };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
};
```

---

### `app/screens/Auth/Login.tsx` — REMOVER GOOGLE (linhas específicas)

Remover as seguintes seções (manter todo o resto intacto):

```diff
- import BotaoGoogle from '../../components/SocialButton';

// Na linha 40, alterar:
- const { signIn, signInWithGoogle } = useAuth();
+ const { signIn } = useAuth();

// Remover função inteira handleGoogleLoginPress (linhas 133-161)
- const handleGoogleLoginPress = async () => { ... };

// Remover bloco divisor + BotaoGoogle do JSX (linhas 252-262):
-          <View style={styles.divisor}>
-            <View style={styles.linha} />
-            <Text style={styles.divisorTexto}>Ou</Text>
-            <View style={styles.linha} />
-          </View>
-          <BotaoGoogle
-            texto="Continuar com Google"
-            aoPressionar={handleGoogleLoginPress}
-            carregando={carregando}
-          />

// Remover estilos não usados: divisor, linha, divisorTexto
```

---

### `app/screens/Auth/Cadastro.tsx` — REMOVER GOOGLE (linhas específicas)

```diff
- import BotaoGoogle from '../../components/SocialButton';

// Na linha 42, alterar:
- const { signUp, signInWithGoogle } = useAuth();
+ const { signUp } = useAuth();

// Remover função inteira onGoogle (linhas 152-179)
- const onGoogle = async () => { ... };

// Remover bloco divisor + BotaoGoogle do JSX (linhas 314-320):
-          <View style={styles.divisor}>
-            <View style={styles.linha} />
-            <Text style={styles.divisorTexto}>Ou</Text>
-            <View style={styles.linha} />
-          </View>
-          <BotaoGoogle texto="Continuar com Google" aoPressionar={onGoogle} />

// Remover estilos: divisor, linha, divisorTexto
```

---

### `app.config.js` — REMOVER PLUGIN

```diff
     plugins: [
       "expo-router",
       "expo-web-browser",
       "expo-font",
-      "@react-native-google-signin/google-signin",
       "expo-audio",
       "expo-secure-store",
       "expo-status-bar",
       "expo-video"
     ],
```

---

### `package.json` — REMOVER DEPENDÊNCIA

```diff
     "@react-navigation/stack": "^7.4.10",
     "@rneui/themed": "^4.0.0-rc.8",
-    "@react-native-google-signin/google-signin": "^16.0.0",
     "expo": "^56.0.8",
```

---

## Comandos

```bash
# Após editar package.json
npm install

# Verificar que o pacote foi removido
npm list @react-native-google-signin 2>&1 | grep -c "empty"

# Testar que tudo compila
npx expo start --clear
```

---

## Commit

```bash
git add -A
git commit -m "refactor: remove Google Sign-In, add Firestore and Storage to firebase.ts"
```

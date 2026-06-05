# Task 2: Feed Global — DenunciaContext para Firestore em Tempo Real [CONCLUÍDO]

> **Dependências:** Task 1 (firebase.ts com `db` e `storage` exportados)
> **Arquitetura:** Firestore `onSnapshot` (real-time) + Firebase Storage (imagens)
> **Tech Stack:** TypeScript, firebase/firestore, firebase/storage, React Context

---

## 🛠️ Especificação

### 1. Objetivo
Substituir o `DenunciaContext` atual (mock em memória, volátil) por uma implementação
real usando Firebase Firestore. O feed passa a ser **global e persistente**: todos os
usuários autenticados veem e interagem com as mesmas denúncias em tempo real.

### 2. Estrutura do Firestore

```
Coleção: denuncias/{denunciaId}
├── userId: string              (UID do autor)
├── usuario: {
│     nome: string,
│     avatar?: string
│   }
├── localizacao: string
├── latitude?: number
├── longitude?: number
├── descricao: string
├── tipos?: string[]
├── status: "Pendente" | "Em Andamento" | "Resolvido"
├── imagensUrls: string[]       (URLs públicas do Firebase Storage)
├── likes: number               (contador denormalizado)
├── likedBy: string[]           (UIDs — evita likes duplos)
├── comentariosCount: number    (contador denormalizado)
└── timestamp: Timestamp

Subcoleção: denuncias/{denunciaId}/comentarios/{comentarioId}
├── userId: string
├── usuario: { nome: string, avatar?: string }
├── texto: string
└── timestamp: Timestamp
```

### 3. Fluxo de Upload de Imagem
```
URI local (expo-image-picker)
  → fetch(uri) → blob
  → uploadBytesResumable(ref, blob)
  → getDownloadURL(ref)
  → URL pública salva em Firestore
```
Caminho no Storage: `denuncias/{userId}/{timestamp}_{random}.jpg`

### 4. Fluxo de Like (sem duplicatas)
- `isLiked` é computado client-side: `likedBy.includes(user.uid)`
- **Curtir**: `arrayUnion(user.uid)` + `likes + 1`
- **Descurtir**: `arrayRemove(user.uid)` + `likes - 1`
- Regra Firestore impede usuário não autenticado de dar like

### 5. Edge Cases
- **Upload falha**: capturar erro por imagem, fazer rollback (não salvar doc no Firestore se upload falhar)
- **Usuário não autenticado**: todas as funções de escrita fazem early return se `!user`
- **`onSnapshot` ao desmontar**: retornar a função `unsubscribe` no `useEffect` cleanup
- **Foto grande**: Storage rules limitam a 10MB por arquivo
- **`likedBy` com UID duplicado**: `arrayUnion` do Firestore é idempotente — seguro
- **`comentariosCount` desync**: usar `increment(1)` do Firestore em vez de ler valor local

### 6. Fora do Escopo
- Não implementar paginação do feed (Firestore `limit` + `startAfter`) — desnecessário para teste GQS
- Não implementar carregamento de comentários no snapshot principal — serão carregados na DenunciaCard sob demanda (Task 3)
- Não implementar notificações push

### 7. Critérios de Aceite
- [ ] Fazer uma denúncia → aparece no feed de outro usuário logado sem refresh
- [ ] Curtir/descurtir atualiza contador em tempo real para todos
- [ ] Reiniciar o app não apaga as denúncias
- [ ] Imagens aparecem carregadas (URL do Firebase Storage, não URI local)
- [ ] Comentário adicionado incrementa `comentariosCount`
- [ ] `npm audit` continua `0 vulnerabilities`

---

## 📂 Arquivos a Modificar

### `app/context/DenunciaContext.tsx` — REESCREVER COMPLETO

```typescript
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  increment,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { useAuth } from './AuthContext';

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface Comentario {
  id: string;
  userId: string;
  usuario: { nome: string; avatar?: string };
  texto: string;
  timestamp: Date;
  tempoAtras: string;
}

export interface Denuncia {
  id: string;
  userId: string;
  usuario: { nome: string; avatar?: string };
  localizacao: string;
  latitude?: number;
  longitude?: number;
  descricao: string;
  tipos?: string[];
  status: 'Pendente' | 'Em Andamento' | 'Resolvido';
  imagensUrls: string[];
  likes: number;
  likedBy: string[];
  isLiked: boolean;       // computado client-side
  timestamp: Date;
  tempoAtras: string;
  comentarios: Comentario[];
  comentariosCount: number;
}

export interface NovaDenuncia {
  usuario: { nome: string; avatar?: string };
  localizacao: string;
  latitude?: number;
  longitude?: number;
  descricao: string;
  tipos?: string[];
  imagensLocais: string[];  // URIs locais — serão upadas para Storage
}

interface DenunciaContextData {
  denuncias: Denuncia[];
  loadingFeed: boolean;
  adicionarDenuncia: (data: NovaDenuncia) => Promise<void>;
  curtirDenuncia: (id: string) => Promise<void>;
  adicionarComentario: (
    denunciaId: string,
    texto: string,
    usuario: { nome: string; avatar?: string }
  ) => Promise<void>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const calcularTempoAtras = (date: Date): string => {
  const diff = Date.now() - date.getTime();
  const min = Math.floor(diff / 60_000);
  const h = Math.floor(diff / 3_600_000);
  const d = Math.floor(diff / 86_400_000);
  if (min < 1) return 'agora';
  if (min < 60) return `${min}min`;
  if (h < 24) return `${h}h`;
  if (d === 1) return '1 dia';
  if (d < 7) return `${d} dias`;
  if (d < 30) return `${Math.floor(d / 7)} sem.`;
  return `${Math.floor(d / 30)} mês`;
};

const uploadImagem = async (uri: string, userId: string): Promise<string> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const filename = `${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;
  const storageRef = ref(storage, `denuncias/${userId}/${filename}`);
  await uploadBytesResumable(storageRef, blob);
  return getDownloadURL(storageRef);
};

// ─── Context ─────────────────────────────────────────────────────────────────

const DenunciaContext = createContext<DenunciaContextData | null>(null);

export const useDenuncias = (): DenunciaContextData => {
  const ctx = useContext(DenunciaContext);
  if (!ctx) throw new Error('useDenuncias deve ser usado dentro de um DenunciaProvider');
  return ctx;
};

// ─── Provider ────────────────────────────────────────────────────────────────

export const DenunciaProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [loadingFeed, setLoadingFeed] = useState(true);

  // Feed em tempo real — mais recentes primeiro
  useEffect(() => {
    const q = query(
      collection(db, 'denuncias'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const lista: Denuncia[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          const ts = (d.timestamp as Timestamp)?.toDate?.() ?? new Date();
          const likedBy: string[] = d.likedBy ?? [];
          return {
            id: docSnap.id,
            userId: d.userId ?? '',
            usuario: d.usuario ?? { nome: 'Usuário' },
            localizacao: d.localizacao ?? '',
            latitude: d.latitude ?? undefined,
            longitude: d.longitude ?? undefined,
            descricao: d.descricao ?? '',
            tipos: d.tipos ?? [],
            status: d.status ?? 'Pendente',
            imagensUrls: d.imagensUrls ?? [],
            likes: d.likes ?? 0,
            likedBy,
            isLiked: user ? likedBy.includes(user.uid) : false,
            timestamp: ts,
            tempoAtras: calcularTempoAtras(ts),
            comentarios: [],          // carregados sob demanda
            comentariosCount: d.comentariosCount ?? 0,
          };
        });
        setDenuncias(lista);
        setLoadingFeed(false);
      },
      (error) => {
        console.error('Erro ao ouvir denúncias:', error);
        setLoadingFeed(false);
      }
    );

    return unsubscribe;
  }, [user?.uid]);

  // ── Ações ──────────────────────────────────────────────────────────────────

  const adicionarDenuncia = async (data: NovaDenuncia): Promise<void> => {
    if (!user) throw new Error('Usuário não autenticado');

    // Upload de todas as imagens antes de salvar o doc
    const imagensUrls = await Promise.all(
      data.imagensLocais.map((uri) => uploadImagem(uri, user.uid))
    );

    await addDoc(collection(db, 'denuncias'), {
      userId: user.uid,
      usuario: data.usuario,
      localizacao: data.localizacao,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      descricao: data.descricao,
      tipos: data.tipos ?? [],
      status: 'Pendente',
      imagensUrls,
      likes: 0,
      likedBy: [],
      comentariosCount: 0,
      timestamp: serverTimestamp(),
    });
  };

  const curtirDenuncia = async (id: string): Promise<void> => {
    if (!user) return;
    const denuncia = denuncias.find((d) => d.id === id);
    if (!denuncia) return;
    const ref = doc(db, 'denuncias', id);
    if (denuncia.isLiked) {
      await updateDoc(ref, {
        likedBy: arrayRemove(user.uid),
        likes: denuncia.likes - 1,
      });
    } else {
      await updateDoc(ref, {
        likedBy: arrayUnion(user.uid),
        likes: denuncia.likes + 1,
      });
    }
  };

  const adicionarComentario = async (
    denunciaId: string,
    texto: string,
    usuario: { nome: string; avatar?: string }
  ): Promise<void> => {
    if (!user || !texto.trim()) return;
    const comentariosRef = collection(db, 'denuncias', denunciaId, 'comentarios');
    await addDoc(comentariosRef, {
      userId: user.uid,
      usuario,
      texto: texto.trim(),
      timestamp: serverTimestamp(),
    });
    // Incremento atômico do contador
    await updateDoc(doc(db, 'denuncias', denunciaId), {
      comentariosCount: increment(1),
    });
  };

  return (
    <DenunciaContext.Provider
      value={{ denuncias, loadingFeed, adicionarDenuncia, curtirDenuncia, adicionarComentario }}
    >
      {children}
    </DenunciaContext.Provider>
  );
};
```

---

### `app/screens/Home/FeedScreen.tsx` — AJUSTAR PROP `loading`

Adicionar indicador de carregamento enquanto o Firestore carrega o feed:

```diff
- const denuncias = denunciaContext?.denuncias || [];
+ const { denuncias, loadingFeed } = useDenuncias();

+ if (loadingFeed) {
+   return (
+     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' }}>
+       <ActivityIndicator size="large" color="#0A7D6F" />
+     </View>
+   );
+ }
```

---

### `app/screens/Denuncia/RealizarDenuncia.tsx` — AJUSTAR CHAMADA

A interface de `adicionarDenuncia` mudou: agora recebe `imagensLocais` em vez de `imagens`:

```diff
  denunciaContext.adicionarDenuncia({
    usuario: { nome: nomeFormatado, avatar: undefined },
    localizacao: localizacao!.endereco,
    descricao: descricao.trim(),
-   imagens: imagens.map(img => img.uri),
+   imagensLocais: imagens.map(img => img.uri),
    latitude: localizacao!.latitude,
    longitude: localizacao!.longitude,
    tipos: tiposSelecionados,
-   timestamp: new Date(),
  });
```

---

## Comandos

```bash
# Verificar que firebase/firestore e firebase/storage estão no bundle
# (já inclusos no firebase ^12.6.0 — nenhuma instalação extra necessária)
npx expo start --clear

# No simulador/dispositivo: criar uma denúncia e verificar no Firebase Console
# Console → Firestore → denuncias → documento criado
```

---

## Commit

```bash
git add -A
git commit -m "feat: replace mock DenunciaContext with Firestore real-time feed + Storage image upload"
```

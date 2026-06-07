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
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import Constants from 'expo-constants';

const BACKEND_URL = (Constants.expoConfig?.extra?.backendUrl as string) ?? 'https://deolho-ia.onrender.com';
const BACKEND_API_KEY = (Constants.expoConfig?.extra?.backendApiKey as string) ?? '';

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
  imagens: string[];
  likes: number;
  likedBy: string[];
  isLiked: boolean;       // computado client-side
  timestamp: Date;
  tempoAtras: string;
  comentarios: Comentario[];
  comentariosCount: number;
}

export interface NovaDenuncia {
  usuario: { nome: string; avatar?: string | null };
  localizacao: string;
  latitude?: number;
  longitude?: number;
  descricao: string;
  tipos?: string[];
  categoria?: string;
  imagensLocais: string[];
  imagensBase64?: string[];
}

interface DenunciaContextData {
  denuncias: Denuncia[];
  loadingFeed: boolean;
  adicionarDenuncia: (data: NovaDenuncia) => Promise<void>;
  curtirDenuncia: (id: string) => Promise<void>;
  adicionarComentario: (
    denunciaId: string,
    texto: string,
    usuario: { nome: string; avatar?: string | null }
  ) => Promise<void>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const calcularTempoAtras = (date: Date): string => {
  const diff = Date.now() - date.getTime();
  const min = Math.floor(diff / 60_000);
  const h = Math.floor(diff / 3_600_000);
  const d = Math.floor(diff / 86_400_000);
  if (min < 1) return 'agora';
  if (min === 1) return 'há 1 minuto';
  if (min < 60) return `há ${min} minutos`;
  if (h === 1) return 'há 1 hora';
  if (h < 24) return `há ${h} horas`;
  if (d === 1) return 'há 1 dia';
  if (d < 7) return `há ${d} dias`;
  if (d < 30) return `há ${Math.floor(d / 7)} semana${Math.floor(d / 7) > 1 ? 's' : ''}`;
  const m = Math.floor(d / 30);
  return `há ${m} ${m === 1 ? 'mês' : 'meses'}`;
};

// Faz o upload direto para o Cloudinary via API REST
const uploadImagemCloudinary = async (uri: string): Promise<string> => {
  const data = new FormData();
  data.append('file', {
    uri: uri,
    type: 'image/jpeg',
    name: `upload_${Date.now()}.jpg`,
  } as any);
  data.append('upload_preset', 'deolho_app');
  
  const response = await fetch('https://api.cloudinary.com/v1_1/drte2ruwe/image/upload', {
    method: 'POST',
    body: data,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data',
    }
  });

  const responseData = await response.json();
  if (responseData.secure_url) {
    return responseData.secure_url;
  } else {
    throw new Error('Falha no upload da imagem para o Cloudinary');
  }
};

const uploadImagemCloudinaryBase64 = async (base64Data: string): Promise<string> => {
  const response = await fetch('https://api.cloudinary.com/v1_1/drte2ruwe/image/upload', {
    method: 'POST',
    body: JSON.stringify({
      file: base64Data,
      upload_preset: 'deolho_app',
      public_id: `upload_${Date.now()}`,
      filename_override: `upload_${Date.now()}.jpg`,
    }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  const responseData = await response.json();
  if (responseData.secure_url) {
    return responseData.secure_url;
  } else {
    console.error('Cloudinary JSON upload error:', responseData);
    throw new Error('Falha no upload da imagem para o Cloudinary');
  }
};

// ─── Context ─────────────────────────────────────────────────────────────────

const DenunciaContext = createContext<DenunciaContextData | null>(null);

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
            imagens: d.imagensUrls ?? [], // Mapeando imagensUrls do Firebase para imagens
            likes: d.likes ?? 0,
            likedBy,
            isLiked: user ? likedBy.includes(user.uid) : false,
            timestamp: ts,
            tempoAtras: calcularTempoAtras(ts),
            comentarios: [],          // carregados sob demanda na tela da denúncia
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

    // Upload de todas as imagens para o Cloudinary antes de salvar no Firestore
    const imagensUrls = await Promise.all(
      data.imagensLocais.map((uri, index) => {
        const b64 = data.imagensBase64?.[index];
        if (b64) {
          return uploadImagemCloudinaryBase64(b64);
        }
        return uploadImagemCloudinary(uri);
      })
    );

    const sanitizedUsuario = {
      nome: data.usuario.nome || 'Usuário',
      avatar: (data.usuario.avatar === undefined || data.usuario.avatar === null) ? null : data.usuario.avatar,
    };

    await addDoc(collection(db, 'denuncias'), {
      userId: user.uid,
      usuario: sanitizedUsuario,
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

    // Enviar notificação por e-mail de forma automática em segundo plano pelo backend
    try {
      fetch(`${BACKEND_URL}/send-report-email`, {
        method: 'POST',
        headers: {
          'X-API-Key': BACKEND_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: data.categoria || data.tipos?.[0] || 'Ambiental',
          location: data.localizacao,
          latitude: data.latitude ?? null,
          longitude: data.longitude ?? null,
          description: data.descricao,
          images: imagensUrls,
        }),
      }).catch((err) => console.error('Erro de envio de email da denúncia:', err));
    } catch (e) {
      console.error('Erro ao chamar backend de e-mail:', e);
    }
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
    usuario: { nome: string; avatar?: string | null }
  ): Promise<void> => {
    if (!user || !texto.trim()) return;
    const sanitizedUsuario = {
      nome: usuario.nome || 'Usuário',
      avatar: (usuario.avatar === undefined || usuario.avatar === null) ? null : usuario.avatar,
    };
    const comentariosRef = collection(db, 'denuncias', denunciaId, 'comentarios');
    await addDoc(comentariosRef, {
      userId: user.uid,
      usuario: sanitizedUsuario,
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

export const useDenuncias = () => {
  const context = useContext(DenunciaContext);
  if (!context) {
    throw new Error('useDenuncias deve ser usado dentro de um DenunciaProvider');
  }
  return context;
};

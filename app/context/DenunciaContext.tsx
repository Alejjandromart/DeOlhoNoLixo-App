import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { USE_FIREBASE } from '../config/firebaseEnabled';
import { ouvirDenuncias, buscarDenuncias, criarDenuncia as criarDenunciaFirebase, curtirDenuncia as curtirDenunciaFirebase, descurtirDenuncia as descurtirDenunciaFirebase, DenunciaFirebase } from '../services/denuncias';
import { auth } from '../lib/firebase';
import { enviarFoto } from '../services/storage';
import { Timestamp } from 'firebase/firestore';

export interface Comentario {
  id: number;
  usuario: {
    nome: string;
    avatar?: string;
  };
  texto: string;
  tempoAtras: string;
  timestamp: Date;
}

export interface Denuncia {
  id: number;
  firestoreId?: string; // ID do documento no Firestore
  usuario: {
    nome: string;
    avatar?: string;
  };
  localizacao: string;
  status: string;
  tempoAtras: string;
  descricao: string;
  imagens: string[];
  likes: number;
  isLiked: boolean;
  latitude?: number;
  longitude?: number;
  tipos?: string[];
  timestamp: Date;
  comentarios: Comentario[];
}

export interface FiltrosDenuncia {
  status?: string[];
  tipos?: string[];
  dataInicio?: Date;
  dataFim?: Date;
}

interface DenunciaContextData {
  denuncias: Denuncia[];
  denunciasFiltradas: Denuncia[];
  filtrosAtivos: FiltrosDenuncia;
  isLoading: boolean;
  adicionarDenuncia: (denuncia: Omit<Denuncia, 'id' | 'likes' | 'isLiked' | 'tempoAtras' | 'status' | 'comentarios'>) => Promise<void>;
  curtirDenuncia: (id: number) => void;
  adicionarComentario: (denunciaId: number, texto: string, usuario: { nome: string; avatar?: string }) => void;
  contarDenunciasMesAtual: (nomeUsuario: string) => number;
  filtrarDenuncias: (filtros: FiltrosDenuncia) => void;
  limparFiltros: () => void;
}

const DenunciaContext = createContext<DenunciaContextData | null>(null);

export const useDenuncias = () => {
  const context = useContext(DenunciaContext);
  return context as DenunciaContextData;
};

// Mock data inicial
const MOCK_DENUNCIAS: Denuncia[] = [
  {
    id: 1,
    usuario: {
      nome: 'Sergio Mar',
      avatar: undefined,
    },
    localizacao: 'Rua Carlos Castelo',
    status: 'Pendente',
    tempoAtras: '2 dias',
    descricao: 'Lixo acumulado na calçada há vários dias. Necessário intervenção urgente para evitar problemas de saúde pública.',
    imagens: [
      'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=600',
      'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=600',
      'https://images.unsplash.com/photo-1586803984030-c5f9e52cf3c1?w=600',
    ],
    likes: 12,
    isLiked: false,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    comentarios: [
      {
        id: 1,
        usuario: { nome: 'Sergio Mar' },
        texto: 'fazia comentários sobre a atuação do técnico da prefeitura de Itacoatiara',
        tempoAtras: '4h',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
      {
        id: 2,
        usuario: { nome: 'Sergio Mar' },
        texto: 'fazia comentários sobre a atuação do técnico da prefeitura de Itacoatiara',
        tempoAtras: '4h',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
      {
        id: 3,
        usuario: { nome: 'Sergio Mar' },
        texto: 'fazia comentários sobre a atuação do técnico da prefeitura de Itacoatiara',
        tempoAtras: '4h',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
      {
        id: 4,
        usuario: { nome: 'Sergio Mar' },
        texto: 'fazia comentários sobre a atuação do técnico da prefeitura de Itacoatiara',
        tempoAtras: '4h',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: 2,
    usuario: {
      nome: 'Maria Silva',
      avatar: undefined,
    },
    localizacao: 'Av. Paulista',
    status: 'Em Andamento',
    tempoAtras: '5 dias',
    descricao: 'Contêiner transbordando na esquina.',
    imagens: [
      'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600',
    ],
    likes: 8,
    isLiked: true,
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    comentarios: [],
  },
  {
    id: 3,
    usuario: {
      nome: 'João Santos',
      avatar: undefined,
    },
    localizacao: 'Rua das Flores',
    status: 'Resolvido',
    tempoAtras: '1 semana',
    descricao: 'Lixo hospitalar descartado incorretamente.',
    imagens: [
      'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600',
      'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=600',
    ],
    likes: 24,
    isLiked: false,
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    comentarios: [],
  },
];

export const DenunciaProvider = ({ children }: { children: ReactNode }) => {
  // Se Firebase está habilitado, inicia vazio e aguarda sync
  // Se Firebase está desabilitado, usa MOCK_DENUNCIAS
  const [denuncias, setDenuncias] = useState<Denuncia[]>(USE_FIREBASE ? [] : MOCK_DENUNCIAS);
  const [denunciasFiltradas, setDenunciasFiltradas] = useState<Denuncia[]>([]);
  const [filtrosAtivos, setFiltrosAtivos] = useState<FiltrosDenuncia>({});
  const [isLoading, setIsLoading] = useState(USE_FIREBASE); // Só loading se usar Firebase

  // Carrega denúncias do Firebase imediatamente ao montar
  useEffect(() => {
    if (!USE_FIREBASE) {
      console.log('ℹ️ Firebase desabilitado, usando apenas Context local');
      return;
    }

    console.log('🔥 Iniciando listener do Firebase Firestore...');
    
    // Listener é chamado imediatamente com dados atuais + escuta mudanças
    const unsubscribe = ouvirDenuncias((denunciasFirebase) => {
      console.log(`📊 ${denunciasFirebase.length} denúncias recebidas do Firestore`);
      
      if (denunciasFirebase.length > 0) {
        const denunciasConvertidas = converterDenunciasFirebase(denunciasFirebase);
        
        setDenuncias(prev => {
          return denunciasConvertidas.map(newD => {
            // Tenta encontrar a denúncia anterior pelo ID do Firestore para preservar o like local
            const oldD = prev.find(p => p.firestoreId && p.firestoreId === newD.firestoreId);
            if (oldD) {
              return { ...newD, isLiked: oldD.isLiked };
            }
            return newD;
          });
        });

        setIsLoading(false); // Dados carregados!
        console.log(`✅ ${denunciasConvertidas.length} denúncias carregadas no Context`);
      } else {
        console.log('⚠️ Nenhuma denúncia encontrada no Firestore');
        setIsLoading(false); // Mesmo sem dados, marca como carregado
      }
    });

    return () => {
      console.log('🔥 Desconectando listener do Firebase');
      unsubscribe();
    };
  }, []);

  // Função auxiliar para converter denúncias do Firestore
  const converterDenunciasFirebase = (denunciasFirebase: any[]): Denuncia[] => {
    return denunciasFirebase.map((doc, index) => {
      const timestamp = doc.created_at instanceof Timestamp 
        ? doc.created_at.toDate() 
        : new Date();
      
      const denuncia = {
        id: index + 1,
        firestoreId: doc.id,
        usuario: {
          nome: doc.usuarioEmail?.split('@')[0] || 'Usuário',
          avatar: undefined,
        },
        localizacao: doc.localizacao || 'Localização não informada',
        status: doc.status || 'Pendente',
        tempoAtras: calcularTempoAtras(timestamp),
        descricao: doc.descricao || '',
        imagens: Array.isArray(doc.fotoURL) ? doc.fotoURL : doc.fotoURL ? [doc.fotoURL] : [],
        likes: doc.curtidas || 0,
        isLiked: (doc.curtidasUsers && auth?.currentUser?.uid) ? doc.curtidasUsers.includes(auth.currentUser.uid) : false,
        latitude: doc.latitude,
        longitude: doc.longitude,
        tipos: doc.tipos,
        timestamp,
        comentarios: [],
      };
      
      return denuncia;
    });
  };

  const calcularTempoAtras = (timestamp: Date): string => {
    const agora = new Date();
    const diferenca = agora.getTime() - timestamp.getTime();
    const minutos = Math.floor(diferenca / 60000);
    const horas = Math.floor(diferenca / 3600000);
    const dias = Math.floor(diferenca / 86400000);

    if (minutos < 1) return 'agora mesmo';
    if (minutos < 60) return `${minutos} min`;
    if (horas < 24) return `${horas}h`;
    if (dias === 1) return '1 dia';
    if (dias < 7) return `${dias} dias`;
    if (dias < 30) return `${Math.floor(dias / 7)} semana${Math.floor(dias / 7) > 1 ? 's' : ''}`;
    return `${Math.floor(dias / 30)} mês${Math.floor(dias / 30) > 1 ? 'es' : ''}`;
  };

  const adicionarDenuncia = async (novaDenuncia: Omit<Denuncia, 'id' | 'likes' | 'isLiked' | 'tempoAtras' | 'status' | 'comentarios'>) => {
    const denuncia: Denuncia = {
      ...novaDenuncia,
      id: Date.now(),
      likes: 0,
      isLiked: false,
      status: 'Pendente',
      tempoAtras: calcularTempoAtras(novaDenuncia.timestamp),
      comentarios: [],
    };

    // Adiciona localmente sempre (funciona com ou sem Firebase)
    setDenuncias(prev => [denuncia, ...prev]);

    // Se Firebase estiver habilitado, também salva lá
    if (USE_FIREBASE) {
      try {
        console.log('🔥 Salvando denúncia no Firestore...');
        
        // Upload das imagens para Firebase Storage
        const fotosURLs: string[] = [];
        for (const imagemUri of denuncia.imagens) {
          if (imagemUri.startsWith('http')) {
            // Se já for URL, usa direto
            fotosURLs.push(imagemUri);
          } else {
            // Se for URI local, faz upload
            const url = await enviarFoto(imagemUri);
            fotosURLs.push(url);
          }
        }

        const dadosFirebase: DenunciaFirebase = {
          descricao: denuncia.descricao,
          fotoURL: fotosURLs,
          localizacao: denuncia.localizacao,
          latitude: denuncia.latitude,
          longitude: denuncia.longitude,
          tipos: denuncia.tipos,
          status: denuncia.status,
          usuarioEmail: denuncia.usuario.nome, // TODO: usar email real do AuthContext
          curtidas: 0,
        };

        const docId = await criarDenunciaFirebase(dadosFirebase);
        console.log('✅ Denúncia salva no Firestore com ID:', docId);

        // Atualiza a denúncia local com o ID do Firestore para permitir interações imediatas
        setDenuncias(prev => prev.map(d => 
            d.id === denuncia.id ? { ...d, firestoreId: docId } : d
        ));
      } catch (error) {
        console.error('❌ Erro ao salvar no Firebase (continuando apenas localmente):', error);
      }
    }
  };

  const curtirDenuncia = (id: number) => {
    setDenuncias(prev =>
      prev.map(d => {
        if (d.id === id) {
          const isLiking = !d.isLiked;
          
          // Se tiver ID do Firestore, atualiza lá também
          if (USE_FIREBASE && d.firestoreId) {
            const uid = auth?.currentUser?.uid;
            console.log(`👍 Tentando ${isLiking ? 'curtir' : 'descurtir'} denúncia ${d.firestoreId} (User: ${uid || 'Anônimo'})`);
            
            if (isLiking) {
              curtirDenunciaFirebase(d.firestoreId, uid).catch(err => console.error('❌ Erro ao curtir no Firebase:', err));
            } else {
              descurtirDenunciaFirebase(d.firestoreId, uid).catch(err => console.error('❌ Erro ao descurtir no Firebase:', err));
            }
          }

          return {
            ...d,
            isLiked: isLiking,
            likes: isLiking ? d.likes + 1 : d.likes - 1,
          };
        }
        return d;
      })
    );
  };

  const adicionarComentario = (denunciaId: number, texto: string, usuario: { nome: string; avatar?: string }) => {
    const novoComentario: Comentario = {
      id: Date.now(),
      usuario,
      texto,
      tempoAtras: 'agora mesmo',
      timestamp: new Date(),
    };

    setDenuncias(prev =>
      prev.map(d =>
        d.id === denunciaId
          ? {
              ...d,
              comentarios: [...d.comentarios, novoComentario],
            }
          : d
      )
    );
  };

  const contarDenunciasMesAtual = (nomeUsuario: string): number => {
    const agora = new Date();
    const mesAtual = agora.getMonth();
    const anoAtual = agora.getFullYear();

    return denuncias.filter(d => {
      const dataDenuncia = new Date(d.timestamp);
      return (
        d.usuario.nome.toLowerCase() === nomeUsuario.toLowerCase() &&
        dataDenuncia.getMonth() === mesAtual &&
        dataDenuncia.getFullYear() === anoAtual
      );
    }).length;
  };

  const filtrarDenuncias = (filtros: FiltrosDenuncia) => {
    setFiltrosAtivos(filtros);
    
    let resultado = [...denuncias];

    // Filtro por status
    if (filtros.status && filtros.status.length > 0) {
      resultado = resultado.filter(d => 
        filtros.status!.some(s => d.status.toLowerCase().includes(s.toLowerCase()))
      );
    }

    // Filtro por tipo de resíduo
    if (filtros.tipos && filtros.tipos.length > 0) {
      resultado = resultado.filter(d => 
        d.tipos && d.tipos.some(t => 
          filtros.tipos!.some(ft => t.toLowerCase().includes(ft.toLowerCase()))
        )
      );
    }

    // Filtro por data
    if (filtros.dataInicio) {
      resultado = resultado.filter(d => d.timestamp >= filtros.dataInicio!);
    }
    if (filtros.dataFim) {
      resultado = resultado.filter(d => d.timestamp <= filtros.dataFim!);
    }

    setDenunciasFiltradas(resultado);
  };

  const limparFiltros = () => {
    setFiltrosAtivos({});
    setDenunciasFiltradas(denuncias);
  };

  // Atualiza denúncias filtradas quando denúncias mudam
  useEffect(() => {
    if (Object.keys(filtrosAtivos).length > 0) {
      filtrarDenuncias(filtrosAtivos);
    } else {
      setDenunciasFiltradas(denuncias);
    }
  }, [denuncias]);

  return (
    <DenunciaContext.Provider value={{ 
      denuncias, 
      denunciasFiltradas, 
      filtrosAtivos, 
      isLoading, 
      adicionarDenuncia, 
      curtirDenuncia, 
      adicionarComentario, 
      contarDenunciasMesAtual,
      filtrarDenuncias,
      limparFiltros
    }}>
      {children}
    </DenunciaContext.Provider>
  );
};

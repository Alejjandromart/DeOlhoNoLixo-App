import React, { createContext, useContext, useState, ReactNode } from 'react';

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

interface DenunciaContextData {
  denuncias: Denuncia[];
  adicionarDenuncia: (denuncia: Omit<Denuncia, 'id' | 'likes' | 'isLiked' | 'tempoAtras' | 'status' | 'comentarios'>) => void;
  curtirDenuncia: (id: number) => void;
  adicionarComentario: (denunciaId: number, texto: string, usuario: { nome: string; avatar?: string }) => void;
  contarDenunciasMesAtual: (nomeUsuario: string) => number;
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
  const [denuncias, setDenuncias] = useState<Denuncia[]>(MOCK_DENUNCIAS);

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

  const adicionarDenuncia = (novaDenuncia: Omit<Denuncia, 'id' | 'likes' | 'isLiked' | 'tempoAtras' | 'status' | 'comentarios'>) => {
    const denuncia: Denuncia = {
      ...novaDenuncia,
      id: Date.now(),
      likes: 0,
      isLiked: false,
      status: 'Pendente',
      tempoAtras: calcularTempoAtras(novaDenuncia.timestamp),
      comentarios: [],
    };

    setDenuncias(prev => [denuncia, ...prev]);
  };

  const curtirDenuncia = (id: number) => {
    setDenuncias(prev =>
      prev.map(d =>
        d.id === id
          ? {
              ...d,
              isLiked: !d.isLiked,
              likes: d.isLiked ? d.likes - 1 : d.likes + 1,
            }
          : d
      )
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

  return (
    <DenunciaContext.Provider value={{ denuncias, adicionarDenuncia, curtirDenuncia, adicionarComentario, contarDenunciasMesAtual }}>
      {children}
    </DenunciaContext.Provider>
  );
};

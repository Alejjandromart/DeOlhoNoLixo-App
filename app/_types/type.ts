import Ionicons from '@expo/vector-icons/Ionicons';
import type { ImageSourcePropType } from 'react-native';

export interface InputProps {
  rotulo: string;
  sugestao: string;
  valor: string;
  aoAlterarTexto: (texto: string) => void;
  nomeIcone: keyof typeof Ionicons.glyphMap;
  entradaSegura?: boolean;
  mostrarToggleSenha?: boolean;
  senhaVisivel?: boolean;
  aoAlternarSenha?: () => void;
  tipoTeclado?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  capitalizacaoAutomatica?: 'none' | 'sentences' | 'words' | 'characters';
  erro?: boolean; // Indica se o campo tem erro
  aoEnviar?: () => void; // Callback quando pressiona Enter
  tipoRetorno?: 'done' | 'next' | 'go' | 'search' | 'send'; // Tipo do botão do teclado
}

export interface BotaoProps {
  texto: string;
  aoPressionar: () => void;
  desativado?: boolean;
  carregando?: boolean;

  // Estilo
  variante?: 'contorno' | 'solido';
  corTexto?: string;
  corFundo?: string;     // usado em 'solido'
  corBorda?: string;     // usado em 'contorno'
  largura?: number | string;
  altura?: number;
  raio?: number;
}

export interface BotaoSocialProps {
  texto: string;
  aoPressionar: () => void;
  nomeIcone: keyof typeof Ionicons.glyphMap;
  corIcone?: string;
  tamanhoIcone?: number;
}

export interface BotaoGoogleProps {
  aoPressionar: () => void;
  texto?: string;
  desativado?: boolean;
  carregando?: boolean;
  largura?: number | string;
  altura?: number;
  raio?: number;
  fonteImagem?: ImageSourcePropType;
}

export interface DadosCadastro {
  nomeCompleto: string;
  email: string;
  nomeUsuario: string;
  senha: string;
  confirmarSenha: string;
  termosAceitos: boolean;
}

export interface ErrosValidacao {
  nomeCompleto?: string;
  email?: string;
  nomeUsuario?: string;
  senha?: string;
  confirmarSenha?: string;
  termos?: string;
}

export interface ResultadoValidacao {
  valido: boolean;
  erros: ErrosValidacao;
}

export interface PropsNavegacaoCadastro {
  navegar: (tela: string, params?: any) => void;
  voltar: () => void;
}

export interface RequisicaoCadastro {
  nomeCompleto: string;
  email: string;
  nomeUsuario: string;
  senha: string;
}

export interface RespostaCadastro {
  sucesso: boolean;
  mensagem: string;
  usuario?: {
    id: string;
    nomeCompleto: string;
    email: string;
    nomeUsuario: string;
    criadoEm: string;
  };
  token?: string;
}

export interface RespostaAuthSocial {
  sucesso: boolean;
  provider: 'google' | 'facebook' | 'apple';
  usuario?: {
    id: string;
    nome?: string;
    email?: string;
    fotoPerfil?: string;
  };
  token?: string;
}
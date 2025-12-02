import axios from 'axios';
import { Platform } from 'react-native';

// Para Android Emulator use 10.0.2.2, para iOS Simulator use localhost, para dispositivo físico use seu IP local
const getBaseUrl = () => {
  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_API_URL || 'http://localhost:8000';
  
  if (Platform.OS === 'android' && backendUrl.includes('localhost')) {
    return 'http://10.0.2.2:8000';
  }
  return backendUrl;
};

const FEED_API_URL = getBaseUrl();
const API_KEY = 'secure-api-key-12345';

export interface FeedDenuncia {
  id: string;
  description: string;
  category: string;
  timestamp: string;
  severity: string;
  geographicContext: string;
  environmentalImpact: string;
  images?: string[];
  location?: {
    latitude?: number;
    longitude?: number;
    address?: string;
  };
  userId?: string;
}

/**
 * Busca as denúncias mais recentes do feed
 * Utiliza cache Redis no backend para performance
 */
export const getFeedDenuncias = async (): Promise<FeedDenuncia[]> => {
  try {
    const response = await axios.get(`${FEED_API_URL}/feed`, {
      headers: {
        'X-API-Key': API_KEY,
      },
      timeout: 5000,
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao buscar feed:', error);
    throw error;
  }
};

/**
 * Adiciona uma nova denúncia ao feed
 * Atualiza automaticamente o cache Redis
 */
export const addDenunciaToFeed = async (denuncia: FeedDenuncia): Promise<void> => {
  try {
    await axios.post(`${FEED_API_URL}/feed`, denuncia, {
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });

    console.log('✅ Denúncia adicionada ao feed com sucesso');
  } catch (error) {
    console.error('❌ Erro ao adicionar denúncia ao feed:', error);
    throw error;
  }
};

/**
 * Verifica se o serviço de feed está online
 */
export const checkFeedServiceStatus = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${FEED_API_URL}/`, {
      timeout: 3000,
    });

    return response.data.status === 'online';
  } catch (error) {
    console.error('Serviço de feed offline:', error);
    return false;
  }
};

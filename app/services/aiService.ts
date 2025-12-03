/**
 * Serviço de integração com a API de IA para análise de imagens
 */

// Use o IP do seu computador na rede local para testar no celular
// Para encontrar seu IP: ipconfig (Windows) ou ifconfig (Mac/Linux)
const AI_API_URL = 'http://192.168.145.236:8000'; // IP local da máquina

export interface DeteccaoLixo {
  tipo: string;
  confianca: number;
  classe_original: string;
}

export interface ResultadoAnalise {
  sucesso: boolean;
  nome_arquivo: string;
  tamanho_kb: number;
  categoria_principal: string;
  resumo: {
    total_objetos: number;
    tipos_unicos: number;
    tipos_lista: string[];
  };
  deteccoes: DeteccaoLixo[];
  mensagem: string;
}

export interface ResultadoMultiplasAnalises {
  total_imagens: number;
  imagens_processadas: number;
  resumo_geral: {
    total_objetos: number;
    tipos_unicos: number;
    tipos_lista: string[];
  };
  resultados: ResultadoAnalise[];
}

class AIService {
  /**
   * Verifica se a API está disponível
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${AI_API_URL}/health`);
      const data = await response.json();
      return data.status === 'ok' && data.modelo_ativo;
    } catch (error) {
      console.error('Erro ao verificar saúde da API:', error);
      return false;
    }
  }

  /**
   * Analisa uma única imagem
   */
  async analisarImagem(imageUri: string): Promise<ResultadoAnalise> {
    try {
      // Converter URI para Blob
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      // Criar FormData
      const formData = new FormData();
      formData.append('file', blob, 'image.jpg');

      // Enviar para API
      const apiResponse = await fetch(`${AI_API_URL}/analisar/`, {
        method: 'POST',
        body: formData,
      });

      if (!apiResponse.ok) {
        throw new Error(`Erro na API: ${apiResponse.status}`);
      }

      const resultado = await apiResponse.json();
      return resultado;
    } catch (error) {
      console.error('Erro ao analisar imagem:', error);
      throw error;
    }
  }

  /**
   * Analisa múltiplas imagens
   */
  async analisarMultiplasImagens(imageUris: string[]): Promise<ResultadoMultiplasAnalises> {
    try {
      const formData = new FormData();

      // Adicionar todas as imagens ao FormData
      for (let i = 0; i < imageUris.length; i++) {
        const response = await fetch(imageUris[i]);
        const blob = await response.blob();
        formData.append('files', blob, `image_${i}.jpg`);
      }

      // Enviar para API
      const apiResponse = await fetch(`${AI_API_URL}/analisar-multiplas/`, {
        method: 'POST',
        body: formData,
      });

      if (!apiResponse.ok) {
        throw new Error(`Erro na API: ${apiResponse.status}`);
      }

      const resultado = await apiResponse.json();
      return resultado;
    } catch (error) {
      console.error('Erro ao analisar múltiplas imagens:', error);
      throw error;
    }
  }

  /**
   * Mapeia os tipos detectados pela IA para os tipos usados no app
   */
  mapearTiposParaApp(tiposDetectados: string[]): string[] {
    const mapeamento: { [key: string]: string } = {
      'Plástico': 'Plástico',
      'Papel': 'Papel',
      'Papelão': 'Papel',
      'Metal': 'Metal',
      'Vidro': 'Vidro',
      'Orgânico': 'Orgânico',
      'Bateria': 'Eletrônico',
      'Eletrônico': 'Eletrônico',
      'Perigoso': 'Perigoso',
      'Lixo Geral': 'Entulho'
    };

    const tiposApp = new Set<string>();
    tiposDetectados.forEach(tipo => {
      const tipoMapeado = mapeamento[tipo] || 'Entulho';
      tiposApp.add(tipoMapeado);
    });

    return Array.from(tiposApp);
  }
}

export const aiService = new AIService();

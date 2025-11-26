import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AIAnalysisResult, LocationData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to convert File to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the Data-URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const analyzeEcoImage = async (
  files: File[],
  location: LocationData | null
): Promise<AIAnalysisResult> => {
  if (files.length === 0) {
    throw new Error("Nenhuma imagem fornecida.");
  }

  // Prepare image parts
  const imageParts = await Promise.all(
    files.map(async (file) => ({
      inlineData: {
        mimeType: file.type,
        data: await fileToBase64(file),
      },
    }))
  );

  // Construct context string based on location
  let locationContext = "Localização desconhecida.";
  if (location) {
    locationContext = `Coordenadas GPS: Latitude ${location.latitude}, Longitude ${location.longitude}.`;
  }

  const prompt = `
    Analise esta(s) imagem(ns) de uma potencial denúncia ambiental.
    
    Contexto Geográfico: ${locationContext}
    
    Tarefas:
    1. Detecte os objetos visíveis relacionados a lixo ou poluição (ex: garrafas plásticas, entulho, lixo hospitalar).
    2. Analise o contexto geográfico visual (ex: perto de rio, área urbana, floresta).
    3. Calcule o impacto ambiental combinando os objetos e o local.
    4. Classifique a gravidade em: "Baixo", "Médio" ou "Crítico".
    5. Sugira uma categoria para a denúncia (ex: Doméstico, Hospitalar, Industrial, Entulho).
    6. Escreva uma descrição curta e formal sugerida para a denúncia.
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      objectsDetected: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Lista de objetos poluentes identificados.",
      },
      geographicContext: {
        type: Type.STRING,
        description: "Análise do ambiente onde o lixo se encontra.",
      },
      environmentalImpact: {
        type: Type.STRING,
        description: "Explicação breve do impacto ambiental estimado.",
      },
      severity: {
        type: Type.STRING,
        enum: ["Baixo", "Médio", "Crítico"],
        description: "Nível de gravidade da situação.",
      },
      suggestedCategory: {
        type: Type.STRING,
        description: "Categoria sugerida para o tipo de resíduo.",
      },
      suggestedDescription: {
        type: Type.STRING,
        description: "Um texto descritivo formal sugerindo o que o usuário deve relatar.",
      },
    },
    required: [
      "objectsDetected",
      "geographicContext",
      "environmentalImpact",
      "severity",
      "suggestedCategory",
      "suggestedDescription",
    ],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [...imageParts, { text: prompt }],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Resposta vazia da IA.");

    return JSON.parse(text) as AIAnalysisResult;
  } catch (error) {
    console.error("Erro na análise Gemini:", error);
    throw new Error("Falha ao analisar a imagem. Tente novamente.");
  }
};
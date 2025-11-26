export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface AIAnalysisResult {
  objectsDetected: string[];
  geographicContext: string;
  environmentalImpact: string;
  severity: 'Baixo' | 'Médio' | 'Crítico';
  suggestedCategory: string;
  suggestedDescription: string;
}

export interface ReportData {
  images: File[];
  description: string;
  category: string;
  location: LocationData | null;
  aiAnalysis: AIAnalysisResult | null;
}

export enum AppStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  READY = 'READY',
  SUBMITTING = 'SUBMITTING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
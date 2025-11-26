import React from 'react';
import { AIAnalysisResult } from '../types';
import { AlertTriangle, MapPin, Leaf, CheckCircle } from 'lucide-react';

interface AnalysisCardProps {
  analysis: AIAnalysisResult;
  isLoading?: boolean;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysis, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          <div className="h-3 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  const severityColors = {
    'Baixo': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Médio': 'bg-orange-100 text-orange-800 border-orange-200',
    'Crítico': 'bg-red-100 text-red-800 border-red-200 animate-pulse',
  };

  const severityColor = severityColors[analysis.severity] || severityColors['Baixo'];

  return (
    <div className="bg-white overflow-hidden rounded-2xl shadow-lg border border-gray-100 transition-all duration-500 ease-in-out transform translate-y-0 opacity-100">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 flex justify-between items-center">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Leaf size={18} />
          Análise Inteligente
        </h3>
        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${severityColor.replace('bg-', 'bg-opacity-90 bg-white ')}`}>
          {analysis.severity.toUpperCase()}
        </span>
      </div>
      
      <div className="p-5 space-y-4">
        {/* Objects */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Detectado</p>
          <div className="flex flex-wrap gap-2">
            {analysis.objectsDetected.map((obj, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md border border-gray-200">
                {obj}
              </span>
            ))}
          </div>
        </div>

        {/* Context & Impact */}
        <div className="grid grid-cols-1 gap-3">
            <div className="flex gap-3 items-start">
                <div className="mt-1 min-w-[20px]">
                    <MapPin size={18} className="text-blue-500" />
                </div>
                <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase">Contexto</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{analysis.geographicContext}</p>
                </div>
            </div>

            <div className="flex gap-3 items-start">
                <div className="mt-1 min-w-[20px]">
                    <AlertTriangle size={18} className="text-orange-500" />
                </div>
                <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase">Impacto Estimado</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{analysis.environmentalImpact}</p>
                </div>
            </div>
        </div>
        
        <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-600" />
            <p className="text-xs text-emerald-800">
                Categoria sugerida: <strong>{analysis.suggestedCategory}</strong>
            </p>
        </div>
      </div>
    </div>
  );
};
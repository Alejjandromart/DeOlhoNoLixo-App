import React, { useState, useEffect } from 'react';
import { ScanLine, MapPin, Leaf, FileText, Sparkles } from 'lucide-react';

export const AnalyzingState: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: "Escaneando imagem...", icon: ScanLine, color: "text-blue-500" },
    { label: "Identificando local...", icon: MapPin, color: "text-orange-500" },
    { label: "Calculando impacto...", icon: Leaf, color: "text-emerald-500" },
    { label: "Gerando relatório...", icon: FileText, color: "text-purple-500" },
  ];

  useEffect(() => {
    // Simulate asymptotic progress up to 95%
    const interval = setInterval(() => {
      setProgress((prev) => {
        const remaining = 95 - prev;
        // Slow down as we get closer to the end
        const increment = Math.max(0.2, remaining * 0.05); 
        return prev + increment;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Update text step based on progress
    if (progress < 25) setCurrentStep(0);
    else if (progress < 50) setCurrentStep(1);
    else if (progress < 75) setCurrentStep(2);
    else setCurrentStep(3);
  }, [progress]);

  const ActiveIcon = steps[currentStep].icon;

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-emerald-100 relative overflow-hidden transform transition-all">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -ml-16 -mb-16 opacity-50"></div>

      <div className="relative z-10 flex flex-col items-center text-center">
        
        {/* Icon Circle with Pulse and Transition */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-30 duration-1000"></div>
          <div className="w-20 h-20 bg-white rounded-full shadow-lg border border-gray-50 flex items-center justify-center relative z-10">
             <ActiveIcon 
                size={36} 
                className={`${steps[currentStep].color} transition-all duration-500 transform scale-100`} 
                strokeWidth={1.5}
             />
             <div className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                <Sparkles size={14} className="text-yellow-400 animate-pulse" />
             </div>
          </div>
        </div>

        {/* Main Text with fade effect */}
        <div className="h-16 flex flex-col justify-center items-center">
          <h3 className="text-xl font-bold text-gray-800 mb-1 transition-opacity duration-300 animate-in fade-in slide-in-from-bottom-2">
            {steps[currentStep].label}
          </h3>
          <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">
            Processando Inteligência Artificial
          </p>
        </div>

        {/* Custom Progress Bar */}
        <div className="w-full max-w-xs bg-gray-100 rounded-full h-2.5 overflow-hidden mt-4 shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600 relative transition-all duration-200 ease-linear"
            style={{ width: `${progress}%` }}
          >
            {/* Shimmer Effect */}
            <div className="absolute top-0 left-0 bottom-0 right-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {steps.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
                idx === currentStep 
                  ? 'w-8 bg-emerald-500' 
                  : idx < currentStep 
                    ? 'w-2 bg-emerald-300' 
                    : 'w-2 bg-gray-200'
              }`}
            />
          ))}
        </div>
        
      </div>
      
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
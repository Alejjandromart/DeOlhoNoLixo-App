import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Camera, X, Send, Trash2, Loader2 } from 'lucide-react';
import { LocationPicker } from './components/LocationPicker';
import { AnalysisCard } from './components/AnalysisCard';
import { AnalyzingState } from './components/AnalyzingState';
import { analyzeEcoImage } from './services/geminiService';
import { LocationData, AIAnalysisResult, AppStatus } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Doméstico');
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles]);

      // Create previews
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);

      // Trigger AI analysis automatically on first upload if not already analyzed
      // We pass the new combined list to the analysis function
      const combinedFiles = [...images, ...newFiles];
      triggerAnalysis(combinedFiles);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...previewUrls];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviewUrls(newPreviews);

    if (newImages.length === 0) {
        setAiResult(null);
        setStatus(AppStatus.IDLE);
    }
  };

  const triggerAnalysis = async (filesToAnalyze: File[]) => {
    setStatus(AppStatus.ANALYZING);
    try {
      const result = await analyzeEcoImage(filesToAnalyze, location);
      setAiResult(result);
      
      // Auto-fill fields based on AI
      if (result.suggestedDescription) setDescription(result.suggestedDescription);
      if (result.suggestedCategory) setCategory(result.suggestedCategory);
      
      setStatus(AppStatus.READY);
    } catch (error) {
      console.error(error);
      // Don't block the UI on error, just let user manual input
      setStatus(AppStatus.READY); 
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(AppStatus.SUBMITTING);
    // Simulate API submission
    setTimeout(() => {
      setStatus(AppStatus.SUCCESS);
    }, 2000);
  };

  if (status === AppStatus.SUCCESS) {
    return (
      <div className="min-h-screen bg-emerald-50 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full border border-emerald-100">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send size={40} className="text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Denúncia Enviada!</h2>
          <p className="text-gray-600 mb-6">
            Sua contribuição ajuda a manter nossa cidade mais limpa. As autoridades foram notificadas com a análise de prioridade <strong>{aiResult?.severity || 'Padrão'}</strong>.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
          >
            Nova Denúncia
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white px-6 py-4 sticky top-0 z-10 shadow-sm flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Realizar Denúncia</h1>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        
        {/* Image Section */}
        <section className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
             <h2 className="font-semibold text-gray-700">Evidências Fotográficas</h2>
             <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">{images.length} adicionadas</span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
             {previewUrls.map((url, index) => (
                <div key={index} className="relative aspect-square group animate-in zoom-in duration-300">
                  <img src={url} alt="Preview" className="w-full h-full object-cover rounded-xl border border-gray-100" />
                  <button 
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full hover:bg-red-500 transition-colors backdrop-blur-sm"
                  >
                    <X size={14} />
                  </button>
                </div>
             ))}
             
             <button 
               onClick={() => fileInputRef.current?.click()}
               className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-emerald-300 bg-emerald-50/50 rounded-xl text-emerald-600 hover:bg-emerald-50 transition-colors gap-2"
             >
               <Camera size={24} />
               <span className="text-xs font-medium">Adicionar</span>
             </button>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            multiple 
            className="hidden" 
          />
        </section>

        {/* AI Analysis State & Result */}
        {status === AppStatus.ANALYZING && (
           <AnalyzingState />
        )}
        
        {aiResult && status !== AppStatus.ANALYZING && (
           <AnalysisCard analysis={aiResult} />
        )}

        {/* Location Section */}
        <section>
             <LocationPicker 
                currentLocation={location} 
                onLocationFound={(loc) => {
                    setLocation(loc);
                    // Refine analysis with location if images exist
                    if (images.length > 0) triggerAnalysis(images);
                }} 
             />
        </section>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="bg-white rounded-2xl p-1 shadow-sm border border-gray-100">
             <textarea
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               placeholder="Descreva o problema e o local..."
               className="w-full p-4 min-h-[120px] bg-transparent outline-none text-gray-700 placeholder-gray-400 resize-none text-sm leading-relaxed"
             />
          </div>

          <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar">
             <div className="flex gap-2">
                {['Doméstico', 'Hospitalar', 'Industrial', 'Entulho', 'Eletrônico'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      category === cat 
                        ? 'bg-gray-800 text-white shadow-md scale-105' 
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
             </div>
          </div>

          {/* Footer Action */}
          <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-gray-100 p-4 flex justify-center pb-8 sm:pb-4 z-20">
             <button
               type="submit"
               disabled={images.length === 0 || status === AppStatus.SUBMITTING || status === AppStatus.ANALYZING}
               className={`w-full max-w-2xl bg-emerald-600 text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
             >
               {status === AppStatus.SUBMITTING ? (
                 <Loader2 className="animate-spin" />
               ) : (
                 <>Enviar Denúncia</>
               )}
             </button>
          </div>
          
          {/* Spacer for fixed footer */}
          <div className="h-24"></div>
        </form>
      </main>
    </div>
  );
};

export default App;
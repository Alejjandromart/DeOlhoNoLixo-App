import React, { useState } from 'react';
import { LocationData } from '../types';
import { MapPin, Loader2 } from 'lucide-react';

interface LocationPickerProps {
  onLocationFound: (loc: LocationData) => void;
  currentLocation: LocationData | null;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationFound, currentLocation }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocalização não suportada pelo navegador.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          address: `Lat: ${position.coords.latitude.toFixed(4)}, Long: ${position.coords.longitude.toFixed(4)}`
        };
        onLocationFound(loc);
        setLoading(false);
      },
      (err) => {
        setError("Não foi possível obter a localização. Verifique as permissões.");
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleGetLocation}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 border ${
            currentLocation 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${currentLocation ? 'bg-emerald-100' : 'bg-gray-100'}`}>
             {loading ? <Loader2 className="animate-spin text-emerald-600" size={20} /> : <MapPin className={currentLocation ? "text-emerald-600" : "text-gray-500"} size={20} />}
          </div>
          <div className="text-left">
            <span className="block text-sm font-medium">
                {currentLocation ? "Localização Confirmada" : "Adicionar Localização"}
            </span>
            <span className="block text-xs opacity-80 truncate max-w-[200px] sm:max-w-xs">
                {currentLocation ? currentLocation.address : "Toque para buscar GPS automático"}
            </span>
          </div>
        </div>
      </button>
      {error && <p className="text-xs text-red-500 mt-2 ml-2">{error}</p>}
    </div>
  );
};
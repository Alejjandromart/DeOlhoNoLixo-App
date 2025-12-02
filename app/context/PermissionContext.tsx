import React, { createContext, useContext, ReactNode } from 'react';
import { usePermissionPreferences } from '../hooks/usePermissionPreferences';

interface PermissionContextType {
  isGpsEnabled: boolean;
  isCameraEnabled: boolean;
  toggleGps: () => Promise<void>;
  toggleCamera: () => Promise<void>;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isGpsEnabled, isCameraEnabled, toggleGps, toggleCamera } = usePermissionPreferences();

  const value: PermissionContextType = {
    isGpsEnabled,
    isCameraEnabled,
    toggleGps,
    toggleCamera,
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissionContext = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissionContext deve ser usado dentro de PermissionProvider');
  }
  return context;
};

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PermissionPreferences {
  gpsEnabled: boolean;
  cameraEnabled: boolean;
}

const STORAGE_KEY = '@permission_preferences';

const DEFAULT_PREFERENCES: PermissionPreferences = {
  gpsEnabled: true,
  cameraEnabled: true,
};

export const usePermissionPreferences = () => {
  const [preferences, setPreferences] = useState<PermissionPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);

  // Load preferences from AsyncStorage on mount
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPreferences(JSON.parse(stored));
      } else {
        setPreferences(DEFAULT_PREFERENCES);
      }
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
      setPreferences(DEFAULT_PREFERENCES);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = useCallback(async (newPrefs: PermissionPreferences) => {
    try {
      setPreferences(newPrefs);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
    }
  }, []);

  const toggleGps = useCallback(async () => {
    const newPrefs = { ...preferences, gpsEnabled: !preferences.gpsEnabled };
    await savePreferences(newPrefs);
  }, [preferences, savePreferences]);

  const toggleCamera = useCallback(async () => {
    const newPrefs = { ...preferences, cameraEnabled: !preferences.cameraEnabled };
    await savePreferences(newPrefs);
  }, [preferences, savePreferences]);

  return {
    preferences,
    loading,
    toggleGps,
    toggleCamera,
    savePreferences,
    isGpsEnabled: preferences.gpsEnabled,
    isCameraEnabled: preferences.cameraEnabled,
  };
};

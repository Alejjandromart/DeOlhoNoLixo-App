import { usePermissionContext } from '../context/PermissionContext';

/**
 * Hook para verificar se o app pode usar GPS
 * Retorna true se a permissão está CONCEDIDA E o usuário ATIVOU no app
 */
export const useCanUseLocation = () => {
  const { isGpsEnabled } = usePermissionContext();
  return isGpsEnabled;
};

/**
 * Hook para verificar se o app pode usar câmera
 * Retorna true se a permissão está CONCEDIDA E o usuário ATIVOU no app
 */
export const useCanUseCamera = () => {
  const { isCameraEnabled } = usePermissionContext();
  return isCameraEnabled;
};

/**
 * Hook para obter informações de todas as permissões
 */
export const usePermissions = () => {
  const { isGpsEnabled, isCameraEnabled } = usePermissionContext();
  return {
    canUseLocation: isGpsEnabled,
    canUseCamera: isCameraEnabled,
  };
};

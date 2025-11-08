import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

export const useAuthRedirect = () => {
  const { user, loading } = useAuth();
  const navigation = useNavigation<any>();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      setIsReady(true);
      
      // Se o usuário estiver autenticado, redirecionar para Home
      if (user) {
        navigation.navigate('Home');
      }
    }
  }, [user, loading, navigation]);

  return { user, loading, isReady };
};

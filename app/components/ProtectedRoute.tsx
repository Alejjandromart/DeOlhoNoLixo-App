import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (!loading && !user) {
      // Se não estiver autenticado, redirecionar para tela de boas-vindas
      navigation.navigate('Welcome');
    }
  }, [user, loading, navigation]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#145A49" />
      </View>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0E3B34',
  },
});

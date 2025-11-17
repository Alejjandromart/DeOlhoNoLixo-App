import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet, Image } from 'react-native';
import { Splash } from '../screens/Auth/Splash';
import OnboardingScreen from "../screens/Auth/Onboarding";
import Inicial from '../screens/Auth/Inicial';
import LoginScreen from '../screens/Auth/Login';
import Cadastro from '../screens/Auth/Cadastro';
import TutorialScreen from '../screens/Auth/Tutorial';
import FeedScreen from '../screens/Home/FeedScreen';
import ConfiguracaoScreen from '../screens/Home/ConfiguracaoScreen';
import ProfileScreen from '../screens/Home/ProfileScreen';
import AlterarSenhaScreen from '../screens/Home/AlterarSenhaScreen';
import EsqueciSenha from '../screens/Auth/EsqueciSenha';
import RealizarDenuncia from '../screens/Denuncia/RealizarDenuncia';
import { useAuth } from '../context/AuthContext';
import { DenunciaProvider } from '../context/DenunciaContext';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Cadastro: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Tutorial: undefined;
  Feed: undefined;
  Configuracao: undefined;
  Profile: undefined;
  AlterarSenha: undefined;
  EsqueciSenha: undefined;
  RealizarDenuncia: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const RootStack = () => {
  const { user, loading } = useAuth();

  console.log('🔑 AuthNavigator - Loading:', loading, 'User:', user?.email || 'Nenhum');

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Image 
          source={require('../assets/images/splash.png')} 
          style={styles.splashImage}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <DenunciaProvider>
      <Stack.Navigator 
        screenOptions={{ headerShown: false }}
      >
        {user ? (
          // Usuário autenticado - Telas do app
          <>
            <Stack.Screen name="Feed" component={FeedScreen} />
            <Stack.Screen name="Configuracao" component={ConfiguracaoScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="AlterarSenha" component={AlterarSenhaScreen} />
            <Stack.Screen name="EsqueciSenha" component={EsqueciSenha} />
            <Stack.Screen name="Tutorial" component={TutorialScreen} />
            <Stack.Screen name="RealizarDenuncia" component={RealizarDenuncia} />
          </>
        ) : (
          // Usuário não autenticado - Telas de auth
          <>
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Welcome" component={Inicial} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Cadastro" component={Cadastro} />
            <Stack.Screen name="Register" component={Cadastro} />
            <Stack.Screen name="EsqueciSenha" component={EsqueciSenha} />
          </>
        )}
      </Stack.Navigator>
    </DenunciaProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0E3B34',
  },
  splashImage: {
    width: '100%',
    height: '100%',
  },
});

export default RootStack;

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet, Image } from 'react-native';
import { Splash } from '../screens/Auth/Splash';
import OnboardingScreen from "../screens/Auth/Onboarding";
import Inicial from '../screens/Auth/Inicial';
import LoginScreen from '../screens/Auth/Login';
import Cadastro from '../screens/Auth/Cadastro';
import TutorialScreen from '../screens/Auth/Tutorial';
import ProfileScreen from '../screens/Home/ProfileScreen';
import AlterarSenhaScreen from '../screens/Home/AlterarSenhaScreen';
import EsqueciSenha from '../screens/Auth/EsqueciSenha';
import DenunciaIA from '../screens/DenunciaIA';
import RealizarDenuncia from '../screens/Denuncia/RealizarDenuncia';
import DenunciaEnviadaScreen from '../screens/Denuncia/DenunciaEnviadaScreen';
import { useAuth } from '../context/AuthContext';
import { DenunciaProvider } from '../context/DenunciaContext';
import MainTabNavigator from './MainTabNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import PermissionsScreen from '../screens/Auth/PermissionsScreen';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Cadastro: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Tutorial: undefined;
  Permissions: undefined;
  MainTabs: undefined;
  Feed: undefined;
  Configuracao: undefined;
  Profile: undefined;
  AlterarSenha: undefined;
  EsqueciSenha: undefined;
  DenunciaIA: undefined;
  RealizarDenuncia: undefined;
  DenunciaEnviada: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const RootStack = () => {
  const { user, loading } = useAuth();
  const [targetRoute, setTargetRoute] = useState<'Tutorial' | 'MainTabs' | null>(null);

  useEffect(() => {
    const checkRoute = async () => {
      if (!user) {
        setTargetRoute(null);
        return;
      }

      try {
        const firstLogin = await AsyncStorage.getItem('@isFirstLogin');
        console.log('🎯 Checking first login flag:', firstLogin);
        
        if (firstLogin === 'true') {
          console.log('✅ First login detected! Will show Tutorial');
          await AsyncStorage.removeItem('@isFirstLogin');
          setTargetRoute('Tutorial');
        } else {
          console.log('❌ Not first login, going to MainTabs');
          setTargetRoute('MainTabs');
        }
      } catch (error) {
        console.error('Error checking first login:', error);
        setTargetRoute('MainTabs');
      }
    };

    checkRoute();
  }, [user]);

  console.log('🔑 AuthNavigator - Loading:', loading, 'User:', user?.email || 'Nenhum', 'Target:', targetRoute);

  // Show splash while checking auth or determining route for logged in user
  if (loading || (user && !targetRoute)) {
    console.log('⏳ AuthNavigator showing loading screen...');
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

  console.log('✅ AuthNavigator loading complete, rendering stack navigator with initialRoute:', user ? targetRoute : 'Splash');

  return (
    <DenunciaProvider>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={user ? targetRoute! : 'Splash'}
      >
        {user ? (
          // Usuário autenticado - Telas do app
          <>
            <Stack.Screen name="Tutorial" component={TutorialScreen} options={{ gestureEnabled: false }} />
            <Stack.Screen name="Permissions" component={PermissionsScreen} />
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="AlterarSenha" component={AlterarSenhaScreen} />
            <Stack.Screen name="EsqueciSenha" component={EsqueciSenha} />
            <Stack.Screen name="DenunciaIA" component={DenunciaIA} />
            <Stack.Screen name="RealizarDenuncia" component={RealizarDenuncia} />
            <Stack.Screen name="DenunciaEnviada" component={DenunciaEnviadaScreen} />
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
            <Stack.Screen name="Tutorial" component={TutorialScreen} />
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

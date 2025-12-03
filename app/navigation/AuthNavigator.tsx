import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet, Image, ActivityIndicator, Text } from 'react-native';
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
import { useAuth } from '../context/AuthContext';
import { useDenuncias } from '../context/DenunciaContext';
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
  Profile: undefined;
  AlterarSenha: undefined;
  EsqueciSenha: undefined;
  DenunciaIA: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const RootStack = () => {
  const { user, loading } = useAuth();
  const denunciaContext = useDenuncias();
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

  const denunciasLoading = denunciaContext?.isLoading ?? false;

  console.log('🔑 AuthNavigator - Loading:', loading, 'User:', user?.email || 'Nenhum', 'Target:', targetRoute, 'DenunciasLoading:', denunciasLoading);

  // Show splash while checking auth, determining route, or loading denuncias
  if (loading || (user && !targetRoute) || (user && denunciasLoading)) {
    console.log('⏳ AuthNavigator showing loading screen...');
    return (
      <View style={styles.loadingContainer}>
        <Image
          source={require('../assets/images/splash.png')}
          style={styles.splashImage}
          resizeMode="cover"
        />
        {denunciasLoading && (
          <View style={styles.loadingIndicator}>
            <ActivityIndicator size="large" color="#0A7D6F" />
            <Text style={styles.loadingText}>Carregando denúncias...</Text>
          </View>
        )}
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
  loadingIndicator: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RootStack;

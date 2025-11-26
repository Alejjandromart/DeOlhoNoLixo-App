// src/navigation/RootStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
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
import DenunciaIA from '../screens/DenunciaIA';

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
  NovaDenuncia: undefined;
  DenunciaIA: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const RootStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Splash" component={Splash} />
    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    <Stack.Screen name="Welcome" component={Inicial} />
    <Stack.Screen name="Cadastro" component={Cadastro} />
    <Stack.Screen name="Register" component={Cadastro} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Tutorial" component={TutorialScreen} />
    <Stack.Screen name="Feed" component={FeedScreen} />
    <Stack.Screen name="Configuracao" component={ConfiguracaoScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="AlterarSenha" component={AlterarSenhaScreen} />
    <Stack.Screen name="EsqueciSenha" component={EsqueciSenha} />
    <Stack.Screen name="DenunciaIA" component={DenunciaIA} />
  </Stack.Navigator>
);

export default RootStack;
// src/navigation/RootStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Splash } from '../screens/Auth/Splash';
import OnboardingScreen from "../screens/Auth/Onboarding";
import Inicial from '../screens/Auth/Inicial';
import LoginScreen from '../screens/Auth/Login';
import Cadastro from '../screens/Auth/Cadastro';
import TutorialScreen from '../screens/Auth/Tutorial';
// Implemente posteriormente
//import RegisterScreen from '../screens/RegisterScreen';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Cadastro: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Tutorial: undefined;
  Home: undefined; // Adicionada rota Home
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
    {/*<Stack.Screen name="Register" component={RegisterScreen} />*/}
    <Stack.Screen name="Home" component={Inicial} />
  </Stack.Navigator>
);

export default RootStack;
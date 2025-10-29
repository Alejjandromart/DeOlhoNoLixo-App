// src/navigation/RootStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Splash } from '../screens/BoasVindas/Splash';
import { Onboarding } from "../screens/BoasVindas/Onboarding";
import Inicial from '../screens/BoasVindas/Inicial';
import { supabase } from '../../lib/supabase';
import LoginScreen from '../screens/BoasVindas/Login';
// Implemente posteriormente
//import RegisterScreen from '../screens/RegisterScreen';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined; // Adicionada rota Home
};

const Stack = createStackNavigator<RootStackParamList>();

const RootStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Splash" component={Splash} />
    <Stack.Screen name="Onboarding" component={Onboarding} />
    <Stack.Screen name="Welcome" component={Inicial} />
    <Stack.Screen name="Login" component={LoginScreen} />
    {/*<Stack.Screen name="Register" component={RegisterScreen} />*/}
    <Stack.Screen name="Home" component={Inicial} />
  </Stack.Navigator>
);

export default RootStack;
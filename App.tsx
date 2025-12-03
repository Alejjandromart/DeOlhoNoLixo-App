import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './app/context/AuthContext';
import { DenunciaProvider } from './app/context/DenunciaContext';
import AuthNavigator from './app/navigation/AuthNavigator';
import { useFonts } from 'expo-font';
import { View, ActivityIndicator } from 'react-native';

export default function App() {
  console.log('📱 App component rendering...');
  const [fontsLoaded] = useFonts({
    'Poppins-Bold': require('./app/assets/fonts/Poppins-Bold.ttf'),
    'SpaceMono-Regular': require('./app/assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!fontsLoaded) {
    console.log('⏳ Waiting for fonts to load...');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0E3B34' }}>
        <ActivityIndicator size="large" color="#145A49" />
      </View>
    );
  }

  console.log('✅ Fonts loaded, rendering main app');

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <DenunciaProvider>
          <NavigationContainer>
            <AuthNavigator />
          </NavigationContainer>
        </DenunciaProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

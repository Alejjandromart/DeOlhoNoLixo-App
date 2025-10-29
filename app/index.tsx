import { useFonts } from 'expo-font';
import React from 'react';
import RootStack from './navigation/RootStack';

export default function App() {
    const [fontsLoaded] = useFonts({
        'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
        'SpaceMono-Regular': require('./assets/fonts/SpaceMono-Regular.ttf'),
    });

    if (!fontsLoaded) return null;

    return <RootStack />;
}
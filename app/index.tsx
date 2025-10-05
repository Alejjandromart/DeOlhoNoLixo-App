import { Text, View } from "react-native";
import React from "react";
import { Onboarding } from "./screens/BoasVindas/Onboarding";
import { Splash } from "./screens/BoasVindas/Splash";
import { useFonts } from 'expo-font';

export default function App() {
    const [fontsLoaded] = useFonts({
        'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
        'SpaceMono-Regular': require('./assets/fonts/SpaceMono-Regular.ttf'),
    });

    const [splashCompleted, setSplashCompleted] = React.useState(false);

    // Aguarda as fontes carregarem para garantir que fontFamily funcione
    if (!fontsLoaded) return null;

    return (
        <>
            {splashCompleted ? (
                <Onboarding />
            ) : (
                <Splash onComplete={() => setSplashCompleted(true)} />
            )}
        </>
    );
}
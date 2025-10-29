import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import { hideAsync } from 'expo-splash-screen';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/RootStack';
import { StackNavigationProp } from '@react-navigation/stack';

type Props = {
    onComplete?: (status: boolean) => void;
}

export function Splash({ onComplete }: Props) {
    const [lastStatus, setLastStatus] = useState<AVPlaybackStatus>({} as AVPlaybackStatus);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    function onPlaybackStatusUpdate(status: AVPlaybackStatus) {
        if (status.isLoaded) {
            hideAsync();
            // Verifica se o vídeo terminou
            if (status.didJustFinish) {
                onComplete?.(true); // Chama onComplete se definido
                navigation.navigate('Onboarding'); // Redireciona para a próxima página
            }
        }
    }

    return (
        <Video
            style={StyleSheet.absoluteFill}
            resizeMode={ResizeMode.COVER}
            source={require("../../assets/lottie/splash-animada.mp4")}
            isLooping={false}
            shouldPlay
            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        />
    );
}

export default Splash;
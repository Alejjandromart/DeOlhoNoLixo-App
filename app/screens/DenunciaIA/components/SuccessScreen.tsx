import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Reanimated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

interface SuccessScreenProps {
    onBackToHome: () => void;
}

function CheckmarkIcon() {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const checkAnim = useRef(new Animated.Value(0)).current;
    const ringAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4,
                tension: 60,
                useNativeDriver: true,
            }),
            Animated.timing(ringAnim, {
                toValue: 1,
                duration: 300,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.spring(checkAnim, {
                toValue: 1,
                friction: 5,
                tension: 80,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const checkOpacity = checkAnim.interpolate({
        inputRange: [0, 0.01, 1],
        outputRange: [0, 1, 1],
    });

    const ringOpacity = ringAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 1],
    });

    return (
        <Animated.View style={[styles.checkContainer, { transform: [{ scale: scaleAnim }] }]}>
            {/* Círculo de fundo */}
            <View style={styles.checkCircleBg} />
            {/* Anel externo */}
            <Animated.View style={[styles.checkCircleRing, { opacity: ringOpacity }]} />
            {/* Ícone de check */}
            <Animated.View
                style={[
                    styles.checkIconWrapper,
                    {
                        opacity: checkOpacity,
                        transform: [{ scale: checkAnim }],
                    },
                ]}
            >
                {/* Parte esquerda do check (linha curta) */}
                <View style={styles.checkLeft} />
                {/* Parte direita do check (linha longa) */}
                <View style={styles.checkRight} />
            </Animated.View>
        </Animated.View>
    );
}

export default function SuccessScreen({ onBackToHome }: SuccessScreenProps) {
    const navigation = useNavigation<any>();

    const handleGoToFeed = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs', params: { screen: 'Feed' } }],
        });
    };

    return (
        <LinearGradient colors={['#076653', '#0A4338']} style={styles.container}>
            <Reanimated.View style={styles.content} entering={ZoomIn.duration(500)}>
                <View style={styles.iconWrapper}>
                    <CheckmarkIcon />
                </View>
                <Reanimated.Text style={styles.title} entering={FadeIn.delay(600)}>
                    Denúncia Enviada com Sucesso!
                </Reanimated.Text>
                <Reanimated.Text style={styles.subtitle} entering={FadeIn.delay(750)}>
                    Agradecemos sua colaboração. Sua denúncia foi registrada no feed e encaminhada automaticamente por e-mail aos órgãos competentes.
                </Reanimated.Text>
                <Reanimated.View entering={FadeIn.delay(900)} style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleGoToFeed}>
                        <Text style={styles.buttonText}>Ir para o Feed</Text>
                    </TouchableOpacity>
                </Reanimated.View>
            </Reanimated.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: '90%',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    iconWrapper: {
        marginBottom: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkContainer: {
        width: 130,
        height: 130,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkCircleBg: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(164, 214, 94, 0.15)',
    },
    checkCircleRing: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 5,
        borderColor: '#A4D65E',
    },
    checkIconWrapper: {
        width: 60,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    checkLeft: {
        position: 'absolute',
        width: 6,
        height: 22,
        backgroundColor: '#A4D65E',
        borderRadius: 3,
        bottom: 0,
        left: 10,
        transform: [{ rotate: '45deg' }, { translateX: 4 }],
    },
    checkRight: {
        position: 'absolute',
        width: 6,
        height: 38,
        backgroundColor: '#A4D65E',
        borderRadius: 3,
        bottom: 0,
        right: 4,
        transform: [{ rotate: '-45deg' }, { translateX: -6 }],
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: '#FFFFFFCC',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#A4D65E',
        borderRadius: 30,
        paddingVertical: 16,
        paddingHorizontal: 40,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#115E4C',
        fontSize: 16,
        fontWeight: '700',
    },
});

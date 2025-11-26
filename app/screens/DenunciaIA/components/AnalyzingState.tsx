import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface AnalyzingStateProps {
    onComplete: () => void;
}

export default function AnalyzingState({ onComplete }: AnalyzingStateProps) {
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const scaleAnim = new Animated.Value(1);

    const steps = [
        { label: 'Escaneando imagem...', icon: 'scan-outline', color: '#3B82F6' },
        { label: 'Identificando local...', icon: 'location-outline', color: '#F97316' },
        { label: 'Calculando impacto...', icon: 'leaf-outline', color: '#10B981' },
        { label: 'Gerando relatório...', icon: 'document-text-outline', color: '#8B5CF6' },
    ];

    useEffect(() => {
        // Pulse animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Progress simulation
        const interval = setInterval(() => {
            setProgress((prev) => {
                const remaining = 100 - prev;
                const increment = Math.max(1, remaining * 0.1);
                const next = prev + increment;

                if (next >= 99.5) {
                    clearInterval(interval);
                    setTimeout(onComplete, 500);
                    return 100;
                }
                return next;
            });
        }, 80);

        return () => clearInterval(interval);
    }, [onComplete]);

    useEffect(() => {
        if (progress < 25) setCurrentStep(0);
        else if (progress < 50) setCurrentStep(1);
        else if (progress < 75) setCurrentStep(2);
        else setCurrentStep(3);
    }, [progress]);

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                {/* Decorative backgrounds */}
                <View style={[styles.blob, styles.blobTop]} />
                <View style={[styles.blob, styles.blobBottom]} />

                <View style={styles.content}>
                    {/* Icon with pulse */}
                    <View style={styles.iconContainer}>
                        <View style={styles.pulseOuter} />
                        <Animated.View
                            style={[
                                styles.iconCircle,
                                { transform: [{ scale: scaleAnim }] },
                            ]}
                        >
                            <Ionicons
                                name={steps[currentStep].icon as any}
                                size={36}
                                color={steps[currentStep].color}
                            />
                            <View style={styles.sparkleContainer}>
                                <Ionicons name="sparkles" size={14} color="#FBBF24" />
                            </View>
                        </Animated.View>
                    </View>

                    {/* Text */}
                    <View style={styles.textContainer}>
                        <Text style={styles.stepLabel}>{steps[currentStep].label}</Text>
                        <Text style={styles.subtitle}>Processando Inteligência Artificial</Text>
                    </View>

                    {/* Progress bar */}
                    <View style={styles.progressBarContainer}>
                        <View style={[styles.progressBar, { width: `${progress}%` }]}>
                            <View style={styles.shimmer} />
                        </View>
                    </View>

                    {/* Step indicators */}
                    <View style={styles.stepIndicators}>
                        {steps.map((_, idx) => (
                            <View
                                key={idx}
                                style={[
                                    styles.stepDot,
                                    idx === currentStep && styles.stepDotActive,
                                    idx < currentStep && styles.stepDotCompleted,
                                ]}
                            />
                        ))}
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 40,
        paddingHorizontal: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#D1FAE5',
        position: 'relative',
        overflow: 'hidden',
    },
    blob: {
        position: 'absolute',
        width: 128,
        height: 128,
        borderRadius: 64,
        opacity: 0.5,
    },
    blobTop: {
        top: -64,
        right: -64,
        backgroundColor: '#ECFDF5',
    },
    blobBottom: {
        bottom: -64,
        left: -64,
        backgroundColor: '#EFF6FF',
    },
    content: {
        alignItems: 'center',
        zIndex: 10,
    },
    iconContainer: {
        position: 'relative',
        marginBottom: 24,
    },
    pulseOuter: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#D1FAE5',
        opacity: 0.3,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#F9FAFB',
        position: 'relative',
    },
    sparkleContainer: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    textContainer: {
        alignItems: 'center',
        height: 64,
        justifyContent: 'center',
    },
    stepLabel: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 10,
        fontWeight: '600',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    progressBarContainer: {
        width: '100%',
        height: 10,
        backgroundColor: '#F3F4F6',
        borderRadius: 5,
        overflow: 'hidden',
        marginTop: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#10B981',
        borderRadius: 5,
        position: 'relative',
    },
    shimmer: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    stepIndicators: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 24,
    },
    stepDot: {
        width: 8,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#E5E7EB',
    },
    stepDotActive: {
        width: 32,
        backgroundColor: '#10B981',
    },
    stepDotCompleted: {
        backgroundColor: '#A7F3D0',
    },
});

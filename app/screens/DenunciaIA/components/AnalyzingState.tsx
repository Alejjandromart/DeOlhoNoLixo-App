import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface AnalyzingStateProps {
    onComplete: () => void;
    aiDone: boolean; // sinaliza que a IA real terminou
}

export default function AnalyzingState({ onComplete, aiDone }: AnalyzingStateProps) {
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const progressRef = useRef(0);
    const doneCalledRef = useRef(false);

    const steps = [
        { label: 'Escaneando imagem...', icon: 'scan-outline', color: '#3B82F6' },
        { label: 'Identificando local...', icon: 'location-outline', color: '#F97316' },
        { label: 'Calculando impacto...', icon: 'leaf-outline', color: '#10B981' },
        { label: 'Gerando relatório...', icon: 'document-text-outline', color: '#8B5CF6' },
    ];

    // Quando IA termina e progresso já passou de 95%, conclui imediatamente
    useEffect(() => {
        if (aiDone && progressRef.current >= 95 && !doneCalledRef.current) {
            doneCalledRef.current = true;
            setProgress(100);
            setTimeout(onComplete, 400);
        }
    }, [aiDone]);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
                Animated.timing(scaleAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
            ])
        ).start();

        const interval = setInterval(() => {
            setProgress((prev) => {
                const cap = aiDone ? 100 : 95; // trava em 95% enquanto IA não terminou
                if (prev >= cap) {
                    if (aiDone && !doneCalledRef.current) {
                        doneCalledRef.current = true;
                        clearInterval(interval);
                        setTimeout(onComplete, 400);
                        return 100;
                    }
                    return prev; // segura até a IA terminar
                }
                const remaining = cap - prev;
                const increment = Math.max(0.5, remaining * 0.06);
                const next = Math.min(prev + increment, cap);
                progressRef.current = next;
                return next;
            });
        }, 80);

        return () => clearInterval(interval);
    }, [aiDone]);

    useEffect(() => {
        if (progress < 25) setCurrentStep(0);
        else if (progress < 50) setCurrentStep(1);
        else if (progress < 75) setCurrentStep(2);
        else setCurrentStep(3);
    }, [progress]);

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={[styles.blob, styles.blobTop]} />
                <View style={[styles.blob, styles.blobBottom]} />

                <View style={styles.content}>
                    <View style={styles.iconContainer}>
                        <View style={styles.pulseOuter} />
                        <Animated.View style={[styles.iconCircle, { transform: [{ scale: scaleAnim }] }]}>
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

                    <View style={styles.textContainer}>
                        <Text style={styles.stepLabel}>{steps[currentStep].label}</Text>
                        <Text style={styles.subtitle}>Processando Inteligência Artificial</Text>
                    </View>

                    <View style={styles.progressBarContainer}>
                        <View style={[styles.progressBar, { width: `${progress}%` }]}>
                            <View style={styles.shimmer} />
                        </View>
                    </View>

                    <Text style={styles.progressText}>{Math.round(progress)}%</Text>

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
    blobTop: { top: -64, right: -64, backgroundColor: '#ECFDF5' },
    blobBottom: { bottom: -64, left: -64, backgroundColor: '#EFF6FF' },
    content: { alignItems: 'center', zIndex: 10 },
    iconContainer: { position: 'relative', marginBottom: 24 },
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
        top: 0, left: 0, bottom: 0, right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    progressText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
        marginTop: 6,
    },
    stepIndicators: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 20,
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

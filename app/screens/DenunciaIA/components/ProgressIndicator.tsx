import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface ProgressIndicatorProps {
    currentStep: number;
    totalSteps: number;
}

export default function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
    const animatedValues = useRef(
        Array.from({ length: totalSteps }).map(() => new Animated.Value(0))
    ).current;

    useEffect(() => {
        animatedValues.forEach((anim, index) => {
            if (index + 1 <= currentStep) {
                Animated.spring(anim, {
                    toValue: 1,
                    friction: 5,
                    tension: 40,
                    useNativeDriver: false,
                }).start();
            } else {
                Animated.timing(anim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: false,
                }).start();
            }
        });
    }, [currentStep]);

    return (
        <View style={styles.container}>
            <Text style={styles.stepText}>Passo {currentStep} de {totalSteps}</Text>
            <View style={styles.indicatorsContainer}>
                {Array.from({ length: totalSteps }).map((_, index) => {
                    const isActive = index + 1 <= currentStep;
                    const isCurrent = index + 1 === currentStep;
                    
                    const width = animatedValues[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [16, 32],
                    });

                    const backgroundColor = animatedValues[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: ['#E5E7EB', '#10B981'],
                    });

                    const scale = isCurrent
                        ? animatedValues[index].interpolate({
                              inputRange: [0, 1],
                              outputRange: [1, 1.1],
                          })
                        : 1;

                    return (
                        <Animated.View
                            key={index}
                            style={[
                                styles.indicator,
                                {
                                    width,
                                    backgroundColor,
                                    transform: [{ scaleY: scale }],
                                },
                            ]}
                        />
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    stepText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#059669',
    },
    indicatorsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    indicator: {
        height: 6,
        borderRadius: 3,
    },
});

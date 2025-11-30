import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface StepButtonProps {
    currentStep: number;
    onPress: () => void;
    label: string;
    disabled?: boolean;
}

export default function StepButton({ currentStep, onPress, label, disabled = false }: StepButtonProps) {
    const isLastStep = currentStep === 3;
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 24) + 8 }]}>
            <TouchableOpacity
                style={[
                    styles.button,
                    isLastStep ? styles.buttonSubmit : styles.buttonContinue,
                    disabled && styles.buttonDisabled,
                ]}
                onPress={onPress}
                activeOpacity={0.8}
                disabled={disabled}
            >
                <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>
                    {label}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        backgroundColor: 'transparent',
    },
    button: {
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonContinue: {
        backgroundColor: '#10B981',
    },
    buttonSubmit: {
        backgroundColor: '#059669',
    },
    buttonDisabled: {
        backgroundColor: '#9CA3AF',
        opacity: 0.6,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    buttonTextDisabled: {
        color: '#D1D5DB',
    },
});

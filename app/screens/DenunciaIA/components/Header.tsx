import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
    title: string;
    onBack: () => void;
    onCancel: () => void;
    canGoBack: boolean;
}

export default function Header({ title, onBack, onCancel, canGoBack }: HeaderProps) {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
            <TouchableOpacity
                style={[styles.button, !canGoBack && styles.buttonDisabled]}
                onPress={onBack}
                disabled={!canGoBack}
            >
                <Ionicons name="arrow-back" size={20} color={canGoBack ? '#1F2937' : '#D1D5DB'} />
            </TouchableOpacity>

            <Text style={styles.title}>{title}</Text>

            <TouchableOpacity style={styles.button} onPress={onCancel}>
                <Ionicons name="close" size={20} color="#9CA3AF" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingBottom: 16,
        backgroundColor: 'transparent',
    },
    button: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    buttonDisabled: {
        opacity: 0.3,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
});

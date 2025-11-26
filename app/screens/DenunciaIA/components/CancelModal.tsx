import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface CancelModalProps {
    visible: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

export default function CancelModal({ visible, onCancel, onConfirm }: CancelModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="close-circle" size={48} color="#EF4444" />
                    </View>

                    <Text style={styles.title}>Cancelar denúncia?</Text>
                    <Text style={styles.message}>
                        Se você sair agora, todas as informações preenchidas serão perdidas.
                    </Text>

                    <View style={styles.buttons}>
                        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
                            <Text style={styles.confirmButtonText}>Sim, descartar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                            <Text style={styles.cancelButtonText}>Continuar editando</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    modal: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        width: '100%',
        maxWidth: 320,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FEE2E2',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 8,
    },
    message: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    buttons: {
        gap: 12,
    },
    confirmButton: {
        backgroundColor: '#FEE2E2',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    confirmButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#DC2626',
    },
    cancelButton: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    cancelButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CustomModal from './CustomModal';

interface ConfirmModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export default function ConfirmModal({
  visible,
  title = 'Confirmação',
  message,
  onCancel,
  onConfirm,
  confirmLabel = 'Sim',
  cancelLabel = 'Cancelar',
}: ConfirmModalProps) {
  return (
    <CustomModal visible={visible} onClose={onCancel} title={title}>
      {message ? <Text style={styles.message}>{message}</Text> : null}

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.button, styles.confirm]} onPress={onConfirm}>
          <Text style={styles.confirmText}>{confirmLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onCancel}>
          <Text style={styles.cancelText}>{cancelLabel}</Text>
        </TouchableOpacity>
      </View>
    </CustomModal>
  );
}

const styles = StyleSheet.create({
  message: {
    fontSize: 14,
    color: '#444',
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  cancel: {
    backgroundColor: '#0A7D6F',
  },
  confirm: {
    backgroundColor: '#F3F4F6',
  },
  cancelText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  confirmText: {
    color: '#666',
    fontWeight: '600',
  },
});

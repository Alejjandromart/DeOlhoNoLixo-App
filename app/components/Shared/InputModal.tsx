import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import CustomModal from './CustomModal';

interface InputModalProps {
  visible: boolean;
  title?: string;
  placeholder?: string;
  initialValue?: string;
  onCancel: () => void;
  onSubmit: (value: string) => void;
  submitLabel?: string;
}

export default function InputModal({
  visible,
  title = 'Entrada',
  placeholder = '',
  initialValue = '',
  onCancel,
  onSubmit,
  submitLabel = 'Adicionar',
}: InputModalProps) {
  const [value, setValue] = useState(initialValue);

  // reset value when modal opens/closes
  React.useEffect(() => {
    setValue(initialValue);
  }, [visible, initialValue]);

  return (
    <CustomModal visible={visible} onClose={onCancel} title={title}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={setValue}
        autoFocus
      />

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.confirm]}
          onPress={() => onSubmit(value.trim())}
        >
          <Text style={styles.confirmText}>{submitLabel}</Text>
        </TouchableOpacity>
      </View>
    </CustomModal>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
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
    backgroundColor: '#F3F4F6',
  },
  confirm: {
    backgroundColor: '#0A7D6F',
  },
  cancelText: {
    color: '#333',
    fontWeight: '600',
  },
  confirmText: {
    color: '#fff',
    fontWeight: '700',
  },
});

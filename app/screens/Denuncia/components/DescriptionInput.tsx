import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface DescriptionInputProps {
  descricao: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  maxLength?: number;
}

export default function DescriptionInput({
  descricao,
  onChangeText,
  placeholder = "Descreva o problema com detalhes...",
  maxLength = 500
}: DescriptionInputProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        multiline
        numberOfLines={4}
        value={descricao}
        onChangeText={onChangeText}
        maxLength={maxLength}
      />
      <View style={styles.footer}>
        <Text style={styles.counter}>{descricao.length}/{maxLength}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  input: {
    fontSize: 16,
    color: '#1F2937',
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 0,
  },
  footer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  counter: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});

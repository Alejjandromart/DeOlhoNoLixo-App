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
      <View style={styles.conteudo}>
        <View style={styles.iconContainer}>
          <Ionicons name="create-outline" size={20} color="#0A7D6F" />
        </View>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          value={descricao}
          onChangeText={onChangeText}
          maxLength={maxLength}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  conteudo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F9F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 0,
  },
});

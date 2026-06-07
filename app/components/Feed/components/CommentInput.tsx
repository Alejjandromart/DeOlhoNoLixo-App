import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CommentInputProps {
  onAddComment: (texto: string) => void;
}

export default function CommentInput({ onAddComment }: CommentInputProps) {
  const [novoComentario, setNovoComentario] = useState('');
  const insets = useSafeAreaInsets();

  const handleEnviarComentario = () => {
    console.log('📝 Tentando enviar comentário:', novoComentario);
    if (novoComentario.trim()) {
      console.log('✅ Chamando onAddComment com:', novoComentario.trim());
      onAddComment(novoComentario.trim());
      setNovoComentario('');
      console.log('✅ Comentário enviado e input limpo');
    } else {
      console.log('❌ Comentário vazio, não enviado');
    }
  };

  return (
    <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.inputAvatar}>
        <Ionicons name="person-circle" size={32} color="#999" />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Participe da conversa..."
        placeholderTextColor="#999"
        value={novoComentario}
        onChangeText={setNovoComentario}
        multiline
        returnKeyType="send"
        onSubmitEditing={handleEnviarComentario}
        blurOnSubmit={false}
        autoCorrect={true}
        textAlignVertical="center"
      />
      <TouchableOpacity
        style={[styles.sendButton, !novoComentario.trim() && styles.sendButtonDisabled]}
        onPress={handleEnviarComentario}
        disabled={!novoComentario.trim()}
        activeOpacity={0.7}
      >
        <Ionicons
          name="send"
          size={20}
          color={novoComentario.trim() ? '#0A7D6F' : '#CCC'}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  inputAvatar: {
    width: 32,
    height: 32,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    maxHeight: 80,
    minHeight: 36,
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
  },
  sendButton: {
    padding: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

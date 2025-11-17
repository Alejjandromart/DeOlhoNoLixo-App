import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface ImagemSelecionada {
  uri: string;
  type: string;
  name: string;
}

interface ImagePickerProps {
  imagens: ImagemSelecionada[];
  onAdicionarImagem: () => void;
  onRemoverImagem: (index: number) => void;
}

export default function ImagePickerComponent({ imagens, onAdicionarImagem, onRemoverImagem }: ImagePickerProps) {
  const [confirmIndex, setConfirmIndex] = useState<number | null>(null);

  const handleRemoverImagem = (index: number) => {
    setConfirmIndex(index);
  };

  const handleConfirmRemove = () => {
    if (confirmIndex !== null) onRemoverImagem(confirmIndex);
    setConfirmIndex(null);
  };

  const handleCancelRemove = () => setConfirmIndex(null);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.botaoAdicionar}
        onPress={onAdicionarImagem}
        disabled={imagens.length >= 4}
      >
        <Ionicons name="camera-outline" size={20} color="#FFFFFF" />
        <Text style={styles.textoBotao}>Adicionar Imagem</Text>
      </TouchableOpacity>

      {imagens.length > 0 && (
        <View style={styles.gridImagens}>
          {imagens.map((imagem, index) => (
            <View key={index} style={styles.imagemContainer}>
              <Image source={{ uri: imagem.uri }} style={styles.imagem} />
              <TouchableOpacity
                style={styles.botaoRemover}
                onPress={() => handleRemoverImagem(index)}
              >
                <Ionicons name="close-circle" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ))}
          {imagens.length < 4 && (
            <TouchableOpacity
              style={styles.imagemPlaceholder}
              onPress={onAdicionarImagem}
            >
              <Ionicons name="add-outline" size={32} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Confirm remove modal (inline simple modal using CustomModal) */}
      {confirmIndex !== null && (
        <View style={confirmStyles.container} pointerEvents="box-none">
          <View style={confirmStyles.modal}>
            <Text style={confirmStyles.title}>Remover Imagem</Text>
            <Text style={confirmStyles.message}>Deseja remover esta imagem?</Text>
            <View style={confirmStyles.actions}>
              <TouchableOpacity style={confirmStyles.cancelButton} onPress={handleCancelRemove}>
                <Text style={confirmStyles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={confirmStyles.confirmButton} onPress={handleConfirmRemove}>
                <Text style={confirmStyles.confirmText}>Remover</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
  botaoAdicionar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A7D6F',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 12,
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  gridImagens: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  imagemContainer: {
    width: '48%',
    aspectRatio: 1.5,
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagem: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  botaoRemover: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
  },
  imagemPlaceholder: {
    width: '48%',
    aspectRatio: 1.5,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const confirmStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '84%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#444',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  confirmButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#0A7D6F',
  },
  cancelText: { color: '#333', fontWeight: '600' },
  confirmText: { color: '#fff', fontWeight: '700' },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
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

const { width } = Dimensions.get('window');
const COLUMN_GAP = 12;
const ITEM_WIDTH = (width - 40 - COLUMN_GAP) / 2; // 40 is padding (20 left + 20 right)

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
      <View style={styles.grid}>
        {imagens.map((imagem, index) => (
          <View key={index} style={styles.itemContainer}>
            <Image source={{ uri: imagem.uri }} style={styles.imagem} />
            <TouchableOpacity
              style={styles.botaoRemover}
              onPress={() => handleRemoverImagem(index)}
            >
              <View style={styles.botaoRemoverBg}>
                <Ionicons name="close" size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </View>
        ))}

        {imagens.length < 4 && (
          <TouchableOpacity
            style={[styles.itemContainer, styles.botaoAdicionar]}
            onPress={onAdicionarImagem}
          >
            <Ionicons name="camera-outline" size={32} color="#10B981" />
            <Text style={styles.textoAdicionar}>Adicionar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Confirm remove modal */}
      {confirmIndex !== null && (
        <View style={confirmStyles.overlay}>
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
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: COLUMN_GAP,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 0.75,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  imagem: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  botaoAdicionar: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#10B981',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoAdicionar: {
    marginTop: 8,
    color: '#10B981',
    fontWeight: '600',
    fontSize: 14,
  },
  botaoRemover: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  botaoRemoverBg: {
    backgroundColor: 'rgba(239, 68, 68, 0.9)', // Red
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const confirmStyles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: -20, // Compensate for parent padding
    right: -20,
    top: -100, // Cover enough area
    bottom: -100,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    height: Dimensions.get('window').height,
  },
  modal: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1F2937',
  },
  message: {
    fontSize: 15,
    color: '#4B5563',
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
  },
  confirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#EF4444',
  },
  cancelText: { color: '#374151', fontWeight: '600' },
  confirmText: { color: '#fff', fontWeight: '600' },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, TextInput, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface LocalizacaoData {
  latitude: number;
  longitude: number;
  endereco: string;
}

interface LocationPickerProps {
  localizacao: LocalizacaoData | null;
  obtendoLocalizacao: boolean;
  onObterLocalizacao: () => void;
  onSetLocalizacaoManual: (endereco: string) => void;
}

export default function LocationPicker({ 
  localizacao, 
  obtendoLocalizacao, 
  onObterLocalizacao,
  onSetLocalizacaoManual
}: LocationPickerProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [enderecoManual, setEnderecoManual] = useState('');
  const [enderecoDetectado, setEnderecoDetectado] = useState('');

  const handleLocationPress = () => {
    setShowConfirmModal(true);
  };

  const handleUseDetectedLocation = async () => {
    setShowConfirmModal(false);
    await onObterLocalizacao();
  };

  const handleManualInput = () => {
    setShowConfirmModal(false);
    setShowManualInput(true);
  };

  const handleConfirmManualAddress = () => {
    if (enderecoManual.trim().length < 5) {
      Alert.alert('Atenção', 'Por favor, insira um endereço válido');
      return;
    }
    onSetLocalizacaoManual(enderecoManual.trim());
    setShowManualInput(false);
    setEnderecoManual('');
  };

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={handleLocationPress}
        disabled={obtendoLocalizacao}
        activeOpacity={0.7}
      >
      <View style={styles.conteudo}>
        <View style={styles.iconContainer}>
          <Ionicons name="location-outline" size={20} color="#FFFFFF" />
        </View>
        <View style={styles.textoContainer}>
          {obtendoLocalizacao ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : localizacao ? (
            <Text style={styles.endereco} numberOfLines={1}>
              {localizacao.endereco}
            </Text>
          ) : (
            <Text style={styles.placeholder}>
              Toque para adicionar localização
            </Text>
          )}
        </View>
        {localizacao && (
          <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
        )}
      </View>
    </TouchableOpacity>

      {/* Modal de Confirmação */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Ionicons name="location" size={32} color="#0A7D6F" />
              <Text style={styles.modalTitle}>Adicionar Localização</Text>
            </View>
            
            <Text style={styles.modalDescription}>
              Como você deseja adicionar a localização da denúncia?
            </Text>

            <TouchableOpacity 
              style={styles.modalButton}
              onPress={handleUseDetectedLocation}
            >
              <Ionicons name="navigate-circle-outline" size={24} color="#0A7D6F" />
              <View style={styles.modalButtonText}>
                <Text style={styles.modalButtonTitle}>Usar localização atual</Text>
                <Text style={styles.modalButtonSubtitle}>Detectar automaticamente</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalButton}
              onPress={handleManualInput}
            >
              <Ionicons name="pencil-outline" size={24} color="#0A7D6F" />
              <View style={styles.modalButtonText}>
                <Text style={styles.modalButtonTitle}>Digitar endereço</Text>
                <Text style={styles.modalButtonSubtitle}>Adicionar manualmente</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setShowConfirmModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Input Manual */}
      <Modal
        visible={showManualInput}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowManualInput(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.inputModalContainer}>
            <View style={styles.modalHeader}>
              <Ionicons name="pencil" size={32} color="#0A7D6F" />
              <Text style={styles.modalTitle}>Digite o Endereço</Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Ex: Rua das Flores, 123 - Centro"
              placeholderTextColor="#999"
              value={enderecoManual}
              onChangeText={setEnderecoManual}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalSecondaryButton}
                onPress={() => {
                  setShowManualInput(false);
                  setEnderecoManual('');
                }}
              >
                <Text style={styles.modalSecondaryButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.modalPrimaryButton}
                onPress={handleConfirmManualAddress}
              >
                <Text style={styles.modalPrimaryButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0A7D6F',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  conteudo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textoContainer: {
    flex: 1,
  },
  endereco: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  placeholder: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '500',
    opacity: 0.9,
  },
  // Estilos dos Modais
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  inputModalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 12,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  modalButtonText: {
    flex: 1,
    marginLeft: 12,
  },
  modalButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  modalButtonSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  modalCancelButton: {
    marginTop: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#1A1A1A',
    marginBottom: 20,
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalSecondaryButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  modalSecondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  modalPrimaryButton: {
    flex: 1,
    backgroundColor: '#0A7D6F',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  modalPrimaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

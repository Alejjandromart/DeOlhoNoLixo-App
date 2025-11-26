import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PhotoChoiceModalProps {
  visible: boolean;
  onTakePhoto: () => void;
  onChooseGallery: () => void;
  onCancel: () => void;
}

const PhotoChoiceModal: React.FC<PhotoChoiceModalProps> = ({
  visible,
  onTakePhoto,
  onChooseGallery,
  onCancel,
}) => {
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
            <Ionicons name="camera" size={48} color="#10B981" />
          </View>

          <Text style={styles.title}>Adicionar Foto</Text>
          <Text style={styles.message}>Escolha uma opção</Text>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={onTakePhoto}
              activeOpacity={0.7}
            >
              <Ionicons name="camera-outline" size={20} color="#10B981" />
              <Text style={styles.optionText}>Tirar Foto</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={onChooseGallery}
              activeOpacity={0.7}
            >
              <Ionicons name="images-outline" size={20} color="#10B981" />
              <Text style={styles.optionText}>Escolher da Galeria</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

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
    backgroundColor: '#D1FAE5',
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
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D1FAE5',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
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

export default PhotoChoiceModal;

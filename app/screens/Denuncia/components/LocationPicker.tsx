import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
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
}

export default function LocationPicker({ 
  localizacao, 
  obtendoLocalizacao, 
  onObterLocalizacao 
}: LocationPickerProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onObterLocalizacao}
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
});

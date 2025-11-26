import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
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
  onEnderecoChange: (endereco: string) => void;
}

export default function LocationPicker({
  localizacao,
  obtendoLocalizacao,
  onObterLocalizacao,
  onEnderecoChange
}: LocationPickerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <View style={styles.iconContainer}>
          <Ionicons name="location-outline" size={20} color="#10B981" />
        </View>

        <TextInput
          style={styles.input}
          value={localizacao?.endereco || ''}
          onChangeText={onEnderecoChange}
          placeholder="Toque no botão para localizar..."
          placeholderTextColor="#9CA3AF"
          multiline
          editable={!!localizacao && !obtendoLocalizacao}
        />

        <TouchableOpacity
          style={styles.gpsButton}
          onPress={onObterLocalizacao}
          disabled={obtendoLocalizacao}
        >
          {obtendoLocalizacao ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons name="locate" size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>

      {!localizacao && !obtendoLocalizacao && (
        <Text style={styles.helperText}>
          É necessário obter a localização GPS primeiro.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 56,
  },
  iconContainer: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    paddingVertical: 8,
    marginRight: 8,
  },
  gpsButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  helperText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    marginLeft: 4,
  },
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface TrashTypeSelectorProps {
  tiposSelecionados: string[];
  tiposCustomizados: string[];
  onToggleTipo: (tipo: string) => void;
  onAdicionarTipo: () => void;
}

const TIPOS_PADRAO = ['Doméstico', 'Hospitalar'];

export default function TrashTypeSelector({ 
  tiposSelecionados, 
  tiposCustomizados,
  onToggleTipo,
  onAdicionarTipo 
}: TrashTypeSelectorProps) {
  const todosTipos = [...TIPOS_PADRAO, ...tiposCustomizados];

  return (
    <View style={styles.container}>
      <View style={styles.tiposContainer}>
        {todosTipos.map((tipo, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.botaoTipo,
              tiposSelecionados.includes(tipo) && styles.botaoTipoSelecionado,
            ]}
            onPress={() => onToggleTipo(tipo)}
          >
            <Text
              style={[
                styles.textoTipo,
                tiposSelecionados.includes(tipo) && styles.textoTipoSelecionado,
              ]}
            >
              {tipo}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.botaoAdicionar}
          onPress={onAdicionarTipo}
        >
          <Ionicons name="add-outline" size={20} color="#0A7D6F" />
        </TouchableOpacity>
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
  tiposContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  botaoTipo: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  botaoTipoSelecionado: {
    backgroundColor: '#0A7D6F',
    borderColor: '#0A7D6F',
  },
  textoTipo: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  textoTipoSelecionado: {
    color: '#FFFFFF',
  },
  botaoAdicionar: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#0A7D6F',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

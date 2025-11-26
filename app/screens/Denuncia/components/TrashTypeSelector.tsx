import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface TrashTypeSelectorProps {
  tiposSelecionados: string[];
  tiposCustomizados: string[];
  onToggleTipo: (tipo: string) => void;
  onAdicionarTipo: () => void;
}

const TIPOS_PADRAO = ['Doméstico', 'Hospitalar', 'Entulho', 'Eletrônico'];

export default function TrashTypeSelector({
  tiposSelecionados,
  tiposCustomizados,
  onToggleTipo,
  onAdicionarTipo
}: TrashTypeSelectorProps) {
  // Filter out duplicates if any
  const todosTipos = Array.from(new Set([...TIPOS_PADRAO, ...tiposCustomizados]));

  return (
    <View style={styles.container}>
      <View style={styles.tiposContainer}>
        {todosTipos.map((tipo, index) => {
          const isSelected = tiposSelecionados.includes(tipo);
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.botaoTipo,
                isSelected && styles.botaoTipoSelecionado,
              ]}
              onPress={() => onToggleTipo(tipo)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.textoTipo,
                  isSelected && styles.textoTipoSelecionado,
                ]}
              >
                {tipo}
              </Text>
              {isSelected && (
                <Ionicons name="checkmark" size={16} color="#FFFFFF" style={{ marginLeft: 4 }} />
              )}
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={styles.botaoAdicionar}
          onPress={onAdicionarTipo}
        >
          <Ionicons name="add" size={20} color="#10B981" />
          <Text style={styles.textoAdicionar}>Outro</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  tiposContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  botaoTipo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  botaoTipoSelecionado: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  textoTipo: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },
  textoTipoSelecionado: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  botaoAdicionar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#10B981',
    borderStyle: 'dashed',
  },
  textoAdicionar: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 4,
  },
});

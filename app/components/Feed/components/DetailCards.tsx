import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DetailCardsProps {
  tipos: string[];
  tempoAtras: string;
}

export default function DetailCards({ tipos, tempoAtras }: DetailCardsProps) {
  return (
    <View style={styles.detailCards}>
      <View style={styles.detailCard}>
        <Ionicons name="alert-circle-outline" size={24} color="#0A7D6F" />
        <Text style={styles.detailCardLabel}>Impacto</Text>
        <Text style={styles.detailCardValue}>Alto</Text>
      </View>

      <View style={styles.detailCard}>
        <Ionicons name="trash-outline" size={24} color="#0A7D6F" />
        <Text style={styles.detailCardLabel}>Tipo</Text>
        <Text style={styles.detailCardValue}>
          {tipos.length > 0 ? tipos[0] : 'Geral'}
        </Text>
      </View>

      <View style={styles.detailCard}>
        <Ionicons name="time-outline" size={24} color="#0A7D6F" />
        <Text style={styles.detailCardLabel}>Data</Text>
        <Text style={styles.detailCardValue}>{tempoAtras}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  detailCards: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  detailCard: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 4,
  },
  detailCardLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  detailCardValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
});

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
        <View style={[styles.iconBg, { backgroundColor: '#FFEBEE' }]}>
          <Ionicons name="alert-circle" size={24} color="#D32F2F" />
        </View>
        <Text style={styles.detailCardLabel}>Impacto</Text>
        <Text style={styles.detailCardValue}>Alto</Text>
      </View>

      <View style={styles.detailCard}>
        <View style={[styles.iconBg, { backgroundColor: '#E0F2F1' }]}>
          <Ionicons name="trash" size={24} color="#0A7D6F" />
        </View>
        <Text style={styles.detailCardLabel}>Tipo</Text>
        <Text style={styles.detailCardValue} numberOfLines={2}>
          {tipos.length > 0 ? tipos.join(', ') : 'Geral'}
        </Text>
      </View>

      <View style={styles.detailCard}>
        <View style={[styles.iconBg, { backgroundColor: '#E3F2FD' }]}>
          <Ionicons name="time" size={24} color="#1976D2" />
        </View>
        <Text style={styles.detailCardLabel}>Postado</Text>
        <Text style={styles.detailCardValue} numberOfLines={2}>{tempoAtras}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  detailCards: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  detailCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  iconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailCardLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  detailCardValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '700',
    textAlign: 'center',
  },
});

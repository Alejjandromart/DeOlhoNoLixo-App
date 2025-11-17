import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InfoSectionProps {
  localizacao: string;
  status: string;
  latitude?: number;
  longitude?: number;
}

export default function InfoSection({ localizacao, status, latitude, longitude }: InfoSectionProps) {
  return (
    <>
      {/* Localização */}
      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={20} color="#666" />
        <Text style={styles.infoText}>{localizacao}</Text>
      </View>

      {/* Status */}
      <View style={styles.infoRow}>
        <Ionicons name="checkmark-circle-outline" size={20} color="#0A7D6F" />
        <Text style={[styles.infoText, { color: '#0A7D6F', fontWeight: '600' }]}>
          {status}
        </Text>
      </View>

      {/* Coordenadas */}
      {latitude && longitude && (
        <View style={styles.infoRow}>
          <Ionicons name="navigate-outline" size={20} color="#666" />
          <Text style={styles.infoText}>
            {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
});

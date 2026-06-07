import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InfoSectionProps {
  localizacao: string;
  status: string;
  latitude?: number;
  longitude?: number;
}

// Helper para obter cores do status
const getStatusColors = (statusText: string) => {
  const statusLower = statusText.toLowerCase();

  if (statusLower.includes('pendente') || statusLower.includes('aguardando')) {
    return { bg: '#FFF3E0', text: '#E65100', icon: '#F57C00' }; // Laranja
  } else if (statusLower.includes('em andamento') || statusLower.includes('processando')) {
    return { bg: '#E3F2FD', text: '#1565C0', icon: '#1976D2' }; // Azul
  } else if (statusLower.includes('resolvido') || statusLower.includes('concluído')) {
    return { bg: '#E8F5E9', text: '#2E7D32', icon: '#388E3C' }; // Verde
  } else if (statusLower.includes('cancelado') || statusLower.includes('rejeitado')) {
    return { bg: '#FFEBEE', text: '#C62828', icon: '#D32F2F' }; // Vermelho
  }

  return { bg: '#F5F5F5', text: '#616161', icon: '#757575' }; // Cinza padrão
};

export default function InfoSection({ localizacao, status, latitude, longitude }: InfoSectionProps) {
  const statusColors = getStatusColors(status);

  return (
    <View style={[styles.container, { marginBottom: 20 }]}>
      {/* Status Badge */}
      <View style={styles.statusContainer}>
        <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
          <Ionicons name="checkmark-circle" size={18} color={statusColors.icon} />
          <Text style={[styles.statusText, { color: statusColors.text }]}>{status}</Text>
        </View>
      </View>

      {/* Localização */}
      <View style={styles.locationContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="location-sharp" size={28} color="#0A7D6F" />
        </View>
        <View style={styles.locationInfo}>
          <Text style={styles.locationLabel}>Localização</Text>
          <Text style={styles.locationText}>{localizacao}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  statusContainer: {
    flexDirection: 'row',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  statusText: {
    fontWeight: '700',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  locationText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  coordsText: {
    fontSize: 12,
    color: '#999',
  },
});

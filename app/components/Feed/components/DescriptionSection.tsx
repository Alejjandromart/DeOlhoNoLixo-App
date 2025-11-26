import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DescriptionSectionProps {
  descricao: string;
}

export default function DescriptionSection({ descricao }: DescriptionSectionProps) {
  return (
    <View style={styles.descriptionContainer}>
      <Text style={styles.sectionTitle}>Descrição</Text>
      <Text style={styles.descriptionText}>{descricao}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  descriptionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TagsListProps {
  tipos: string[];
}

export default function TagsList({ tipos }: TagsListProps) {
  if (!tipos || tipos.length === 0) return null;

  return (
    <View style={styles.tagsContainer}>
      {tipos.map((tipo, index) => (
        <View key={index} style={styles.tag}>
          <Text style={styles.tagText}>{tipo}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#9BC938',
  },
  tagText: {
    fontSize: 12,
    color: '#0A7D6F',
    fontWeight: '600',
  },
});

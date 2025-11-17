import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ExpandedActionsProps {
  likes: number;
  isLiked: boolean;
  onLikePress: () => void;
}

export default function ExpandedActions({ likes, isLiked, onLikePress }: ExpandedActionsProps) {
  return (
    <View style={styles.actionsContainer}>
      <TouchableOpacity style={styles.actionButton} onPress={onLikePress}>
        <Ionicons
          name={isLiked ? 'heart' : 'heart-outline'}
          size={24}
          color={isLiked ? '#FF6B6B' : '#666'}
        />
        <Text style={[styles.actionText, isLiked && { color: '#FF6B6B' }]}>
          {likes} curtida{likes !== 1 ? 's' : ''}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton}>
        <Ionicons name="share-social-outline" size={24} color="#666" />
        <Text style={styles.actionText}>Compartilhar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton}>
        <Ionicons name="bookmark-outline" size={24} color="#666" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: '#666',
  },
});

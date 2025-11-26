import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LikeExplosion from '../../LikeExplosion';

interface ExpandedActionsProps {
  likes: number;
  isLiked: boolean;
  onLikePress: () => void;
  descricao?: string;
  localizacao?: string;
}

export default function ExpandedActions({
  likes,
  isLiked,
  onLikePress,
  descricao = '',
  localizacao = ''
}: ExpandedActionsProps) {
  const [showExplosion, setShowExplosion] = useState(false);

  const handlePress = () => {
    if (!isLiked) {
      setShowExplosion(true);
      setTimeout(() => setShowExplosion(false), 600);
    }
    onLikePress();
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${descricao}\n\nLocalização: ${localizacao}`,
        title: 'Compartilhar Denúncia - DeOlhoNoLixo',
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  return (
    <View style={styles.actionsContainer}>
      <TouchableOpacity style={styles.actionButton} onPress={handlePress}>
        {showExplosion ? (
          <LikeExplosion size={28} color="#FF6B6B" particleCount={8} />
        ) : (
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={28}
            color={isLiked ? '#FF6B6B' : '#666'}
          />
        )}
        <Text style={[styles.actionText, isLiked && { color: '#FF6B6B' }]}>
          {likes} curtida{likes !== 1 ? 's' : ''}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
        <Ionicons name="share-social-outline" size={28} color="#666" />
        <Text style={styles.actionText}>Compartilhar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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

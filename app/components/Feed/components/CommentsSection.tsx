import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Comentario } from '../../../context/DenunciaContext';

interface CommentsSectionProps {
  comentarios: Comentario[];
}

export default function CommentsSection({ comentarios }: CommentsSectionProps) {

  return (
    <View style={styles.commentsContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Comentários</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{comentarios.length}</Text>
        </View>
      </View>
      
      {comentarios.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubble-outline" size={48} color="#E0E0E0" />
          <Text style={styles.emptyText}>Seja o primeiro a comentar!</Text>
        </View>
      ) : (
        <View style={styles.commentsList}>
          {comentarios.map((comentario) => (
            <View key={comentario.id} style={styles.commentItem}>
              <View style={styles.commentAvatar}>
                {comentario.usuario.avatar ? (
                  <Image source={{ uri: comentario.usuario.avatar }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarInitials}>
                      {comentario.usuario.nome.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.commentContent}>
                <View style={styles.commentBubble}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentAuthor}>{comentario.usuario.nome}</Text>
                    <Text style={styles.commentTime}>{comentario.tempoAtras}</Text>
                  </View>
                  <Text style={styles.commentText}>{comentario.texto}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  commentsContainer: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  badge: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0A7D6F',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    marginTop: 12,
    fontWeight: '500',
  },
  commentsList: {
    gap: 16,
  },
  commentItem: {
    flexDirection: 'row',
    gap: 12,
  },
  commentAvatar: {
    marginTop: 4,
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0A7D6F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  commentContent: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 16,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
  },
  commentTime: {
    fontSize: 11,
    color: '#999',
  },
  commentText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
});

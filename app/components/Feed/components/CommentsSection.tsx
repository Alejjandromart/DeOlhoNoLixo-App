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
      <Text style={styles.sectionTitle}>Comentários</Text>
      
      {comentarios.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum comentário ainda</Text>
      ) : (
        <View style={styles.commentsList}>
          {comentarios.map((comentario) => (
            <View key={comentario.id} style={styles.commentItem}>
              <View style={styles.commentAvatar}>
                {comentario.usuario.avatar ? (
                  <Image source={{ uri: comentario.usuario.avatar }} style={styles.avatarImage} />
                ) : (
                  <Ionicons name="person-circle" size={32} color="#999" />
                )}
              </View>
              <View style={styles.commentContent}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAuthor}>{comentario.usuario.nome}</Text>
                  <Text style={styles.commentTime}>{comentario.tempoAtras}</Text>
                </View>
                <Text style={styles.commentText}>{comentario.texto}</Text>
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
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  commentsList: {
    gap: 16,
    marginBottom: 16,
  },
  commentItem: {
    flexDirection: 'row',
    gap: 12,
  },
  commentAvatar: {
    width: 32,
    height: 32,
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  commentTime: {
    fontSize: 12,
    color: '#999',
  },
  commentText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

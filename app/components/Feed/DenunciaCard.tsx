import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, PanResponder, Animated } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  ExpandedUserInfo,
  ImageCarousel,
  InfoSection,
  TagsList,
  DescriptionSection,
  DetailCards,
  CommentsSection,
  ExpandedActions,
  CommentInput,
} from './components';
import { Comentario } from '../../context/DenunciaContext';

interface DenunciaCardProps {
  usuario: {
    nome: string;
    avatar?: string;
  };
  localizacao: string;
  status: string;
  tempoAtras: string;
  descricao: string;
  imagens: string[];
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  likes?: number;
  isLiked?: boolean;
  tipos?: string[];
  latitude?: number;
  longitude?: number;
  comentarios?: Comentario[];
  onAddComment?: (texto: string) => void;
}

export default function DenunciaCard({
  usuario,
  localizacao,
  status,
  tempoAtras,
  descricao,
  imagens,
  onLike,
  onComment,
  onShare,
  likes = 0,
  isLiked = false,
  tipos = [],
  latitude,
  longitude,
  comentarios = [],
  onAddComment,
}: DenunciaCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          Animated.timing(translateY, {
            toValue: 500,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            handleCloseComments();
            translateY.setValue(0);
          });
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleCardPress = () => {
    setExpanded(true);
  };

  const handleCloseExpanded = () => {
    setExpanded(false);
  };

  const handleCommentsPress = () => {
    setShowComments(true);
  };

  const handleCloseComments = () => {
    setShowComments(false);
  };

  return (
    <>
      <TouchableOpacity activeOpacity={0.8} onPress={handleCardPress}>
        <View style={styles.card}>
      {/* Header do Card */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            {usuario.avatar ? (
              <Image source={{ uri: usuario.avatar }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={24} color="#666" />
            )}
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{usuario.nome}</Text>
            <View style={styles.metaInfo}>
              <Text style={styles.location}>{localizacao}</Text>
              <Text style={styles.separator}>|</Text>
              <Text style={styles.status}>{status}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.time}>{tempoAtras}</Text>
      </View>

      {/* Descrição */}
      <Text style={styles.description}>{descricao}</Text>

      {/* Grid de Imagens */}
      <View style={styles.imagesGrid}>
        {imagens.slice(0, 4).map((uri, index) => (
          <View
            key={index}
            style={[
              styles.imageContainer,
              imagens.length === 1 && styles.imageSingle,
              imagens.length === 2 && styles.imageDouble,
              imagens.length === 3 && index === 0 && styles.imageTripleFirst,
              imagens.length === 3 && index > 0 && styles.imageTripleOther,
              imagens.length === 4 && styles.imageQuad,
            ]}
          >
            <Image source={{ uri }} style={styles.image} />
            {index === 3 && imagens.length > 4 && (
              <View style={styles.moreImagesOverlay}>
                <Text style={styles.moreImagesText}>+{imagens.length - 4}</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onLike}>
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={22}
            color={isLiked ? '#FF3B30' : '#666'}
          />
          {likes > 0 && <Text style={styles.actionText}>{likes}</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleCommentsPress}>
          <Ionicons name="chatbubble-outline" size={20} color="#666" />
          {comentarios.length > 0 && <Text style={styles.actionText}>{comentarios.length}</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onShare}>
          <Ionicons name="share-social-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>
        </View>
      </TouchableOpacity>

      {/* Modal Expandido */}
      <Modal
        visible={expanded}
        animationType="slide"
        transparent={false}
        onRequestClose={handleCloseExpanded}
      >
        <View style={styles.expandedContainer}>
          {/* Header fixo com título e botão de voltar */}
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={handleCloseExpanded} style={styles.backButtonHeader}>
              <Ionicons name="arrow-back" size={24} color="#666" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.titleDeOlho}>DeOlho</Text>
              <Text style={styles.titleNoLixo}>NoLixo</Text>
            </View>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView 
            style={styles.expandedContent} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            {/* Carrossel de Imagens */}
            <ImageCarousel imagens={imagens} />

            <View style={styles.expandedBody}>
              {/* Ações logo abaixo da imagem */}
              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.actionBtn} onPress={onLike}>
                  <Ionicons
                    name={isLiked ? 'heart' : 'heart-outline'}
                    size={26}
                    color={isLiked ? '#FF3B30' : '#333'}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={onShare}>
                  <Ionicons name="share-social-outline" size={26} color="#333" />
                </TouchableOpacity>
                <View style={styles.actionSpacer} />
                <View style={styles.viewsContainer}>
                  <Ionicons name="eye-outline" size={22} color="#666" />
                  <Text style={styles.viewsText}>{likes}</Text>
                </View>
              </View>

              {/* Barra divisória */}
              <View style={styles.divider} />

              {/* Info do Usuário */}
              <ExpandedUserInfo usuario={usuario} tempoAtras={tempoAtras} />

              {/* Barra divisória */}
              <View style={styles.divider} />

              {/* Informações de Localização e Status */}
              <InfoSection
                localizacao={localizacao}
                status={status}
                latitude={latitude}
                longitude={longitude}
              />

              {/* Tags de Tipos de Lixo */}
              <TagsList tipos={tipos} />

              {/* Barra divisória */}
              <View style={styles.divider} />

              {/* Descrição Completa */}
              <DescriptionSection descricao={descricao} />

              {/* Barra divisória */}
              <View style={styles.divider} />

              {/* Cards de Detalhes */}
              <DetailCards tipos={tipos} tempoAtras={tempoAtras} />

              {/* Barra divisória */}
              <View style={styles.divider} />

              {/* Seção de Comentários */}
              <CommentsSection comentarios={comentarios} />
            </View>
          </ScrollView>

          {/* Input de Comentário Fixo */}
          <CommentInput 
            onAddComment={(texto) => {
              console.log('💬 DenunciaCard recebeu comentário:', texto);
              if (onAddComment) {
                onAddComment(texto);
              } else {
                console.log('⚠️ onAddComment não está definido!');
              }
            }} 
          />
        </View>
      </Modal>

      {/* Modal de Comentários */}
      <Modal
        visible={showComments}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseComments}
      >
        <TouchableOpacity 
          style={styles.commentsModalOverlay}
          activeOpacity={1}
          onPress={handleCloseComments}
        >
          <Animated.View 
            style={[
              styles.commentsModalContainer,
              {
                transform: [{ translateY }],
              },
            ]}
          >
            <TouchableOpacity activeOpacity={1}>
            {/* Indicador de arrastar */}
            <View style={styles.dragIndicatorContainer} {...panResponder.panHandlers}>
              <View style={styles.dragIndicator} />
            </View>

            {/* Lista de Comentários */}
            <ScrollView 
              style={styles.commentsModalScroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {comentarios.length === 0 ? (
                <View style={styles.emptyCommentsContainer}>
                  <Ionicons name="chatbubble-outline" size={48} color="#CCC" />
                  <Text style={styles.emptyCommentsText}>Nenhum comentário ainda</Text>
                  <Text style={styles.emptyCommentsSubtext}>Seja o primeiro a comentar!</Text>
                </View>
              ) : (
                comentarios.map((comentario, index) => (
                  <View key={index} style={styles.commentItem}>
                    <View style={styles.commentAvatar}>
                      {comentario.usuario.avatar ? (
                        <Image source={{ uri: comentario.usuario.avatar }} style={styles.commentAvatarImage} />
                      ) : (
                        <Ionicons name="person" size={20} color="#666" />
                      )}
                    </View>
                    <View style={styles.commentContent}>
                      <View style={styles.commentHeader}>
                        <Text style={styles.commentUserName}>{comentario.usuario.nome}</Text>
                        <Text style={styles.commentTime}>{comentario.tempoAtras}</Text>
                      </View>
                      <Text style={styles.commentText}>{comentario.texto}</Text>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>

            {/* Input de Comentário */}
            <View style={styles.commentsModalInputContainer}>
              <CommentInput 
                onAddComment={(texto) => {
                  if (onAddComment) {
                    onAddComment(texto);
                  }
                }} 
              />
            </View>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 12,
    paddingBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 3,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  location: {
    fontSize: 10,
    color: '#666',
  },
  separator: {
    fontSize: 10,
    color: '#CCC',
    marginHorizontal: 4,
  },
  status: {
    fontSize: 10,
    color: '#0A7D6F',
    fontWeight: '600',
  },
  time: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  description: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  imageContainer: {
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  imageSingle: {
    width: '100%',
    height: 240,
  },
  imageDouble: {
    width: '49.5%',
    height: 180,
  },
  imageTripleFirst: {
    width: '100%',
    height: 180,
  },
  imageTripleOther: {
    width: '49.5%',
    height: 120,
  },
  imageQuad: {
    width: '49.5%',
    height: 120,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  moreImagesOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreImagesText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
    fontWeight: '600',
  },
  spacer: {
    flex: 1,
  },
  // Estilos do Modal Expandido
  expandedContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButtonHeader: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
  },
  titleDeOlho: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0A7D6F',
  },
  titleNoLixo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
  },
  expandedContent: {
    flex: 1,
  },
  expandedBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  actionBtn: {
    padding: 8,
    marginRight: 16,
  },
  actionSpacer: {
    flex: 1,
  },
  viewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  viewsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 16,
  },
  // Estilos do Modal de Comentários
  commentsModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  commentsModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 0,
  },
  dragIndicatorContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
  },
  commentsModalHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  commentsModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  commentsModalScroll: {
    maxHeight: 400,
    paddingHorizontal: 20,
  },
  emptyCommentsContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyCommentsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptyCommentsSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  commentItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  commentAvatarImage: {
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
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  commentTime: {
    fontSize: 12,
    color: '#999',
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  commentsModalInputContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
});

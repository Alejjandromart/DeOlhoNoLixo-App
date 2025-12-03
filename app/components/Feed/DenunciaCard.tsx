import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, Share, Platform, StatusBar } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import LikeExplosion from '../LikeExplosion';
import CommentsModal from './CommentsModal';
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
  onBookmark?: () => void;
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
  onBookmark,
  likes = 0,
  isLiked = false,
  tipos = [],
  latitude,
  longitude,
  comentarios = [],
  onAddComment,
}: DenunciaCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showLikeExplosion, setShowLikeExplosion] = useState(false);
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);

  useEffect(() => {
    setLocalIsLiked(isLiked);
  }, [isLiked]);

  const handleCardPress = () => {
    setExpanded(true);
  };

  const handleCloseExpanded = () => {
    setExpanded(false);
  };

  const handleLikePress = () => {
    if (!localIsLiked) {
      setShowLikeExplosion(true);
      setLocalIsLiked(true);

      setTimeout(() => {
        setShowLikeExplosion(false);
      }, 600);
    } else {
      setLocalIsLiked(false);
    }

    onLike?.();
  };

  const handleOpenComments = () => {
    setCommentsModalVisible(true);
    onComment?.();
  };

  const handleCloseComments = () => {
    setCommentsModalVisible(false);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${descricao}\n\nLocalização: ${localizacao}`,
        title: 'Compartilhar Denúncia - DeOlhoNoLixo',
      });
      onShare?.();
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  // Helper para obter cores do status
  const getStatusColors = (statusText: string | undefined) => {
    if (!statusText) {
      return { bg: '#F5F5F5', text: '#666' }; // Cinza padrão
    }
    
    const statusLower = statusText.toLowerCase();

    if (statusLower.includes('pendente') || statusLower.includes('aguardando')) {
      return { bg: '#FFF3E0', text: '#E65100', icon: '#F57C00' }; // Laranja
    } else if (statusLower.includes('em andamento') || statusLower.includes('processando') || statusLower.includes('análise')) {
      return { bg: '#E3F2FD', text: '#1565C0', icon: '#1976D2' }; // Azul
    } else if (statusLower.includes('resolvido') || statusLower.includes('concluído')) {
      return { bg: '#E8F5E9', text: '#2E7D32', icon: '#388E3C' }; // Verde
    } else if (statusLower.includes('cancelado') || statusLower.includes('rejeitado')) {
      return { bg: '#FFEBEE', text: '#C62828', icon: '#D32F2F' }; // Vermelho
    }

    return { bg: '#F5F5F5', text: '#616161', icon: '#757575' }; // Cinza padrão
  };

  const statusColors = getStatusColors(status);

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
              <Text style={styles.separator}>•</Text>
              <Text style={styles.time}>{tempoAtras}</Text>
            </View>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
          <Text style={[styles.statusText, { color: statusColors.text }]}>{status}</Text>
        </View>
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
              { borderRadius: 16 }
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
        <TouchableOpacity style={styles.actionButton} onPress={handleLikePress}>
          {showLikeExplosion ? (
            <LikeExplosion size={24} color="#FF3B30" particleCount={6} />
          ) : (
            <Ionicons
              name={localIsLiked ? 'heart' : 'heart-outline'}
              size={24}
              color={localIsLiked ? '#FF3B30' : '#666'}
            />
          )}
          {likes > 0 && <Text style={styles.actionText}>{likes}</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleOpenComments}>
          <Ionicons name="chatbubble-outline" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color="#666" />
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
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.expandedContainer}>
          <ScrollView 
            style={styles.expandedContent} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            <View>
              {/* Carrossel de Imagens */}
              <ImageCarousel imagens={imagens} />

              {/* Botão de Voltar Estilo Perfil */}
              <TouchableOpacity 
                onPress={handleCloseExpanded} 
                style={styles.absoluteCloseButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="arrow-back" size={26} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Botões de Ação (Movido para cima) */}
            <ExpandedActions 
              likes={likes} 
              isLiked={localIsLiked} 
              onLikePress={handleLikePress}
              descricao={descricao}
              localizacao={localizacao}
            />

            <View style={styles.expandedBody}>
              {/* Info do Usuário */}
              <ExpandedUserInfo usuario={usuario} tempoAtras={tempoAtras} />

              <View style={styles.divider} />

              {/* Descrição Completa */}
              <DescriptionSection descricao={descricao} />

              <View style={styles.divider} />

              {/* Status Badge */}
              <View style={styles.statusSection}>
                <View style={[styles.statusBadgeExpanded, { backgroundColor: statusColors.bg }]}>
                  <Ionicons name="checkmark-circle" size={18} color={statusColors.icon} />
                  <Text style={[styles.statusTextExpanded, { color: statusColors.text }]}>{status}</Text>
                </View>
              </View>

              {/* Tags de Tipos de Lixo */}
              <TagsList tipos={tipos} />

              <View style={styles.divider} />

              {/* Informações de Localização */}
              <InfoSection
                localizacao={localizacao}
                status={status}
                latitude={latitude}
                longitude={longitude}
              />

              <View style={styles.divider} />

              <View style={styles.divider} />

              {/* Cards de Detalhes */}
              <DetailCards tipos={tipos} tempoAtras={tempoAtras} />

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
      <CommentsModal
        visible={commentsModalVisible}
        onClose={handleCloseComments}
        comentarios={comentarios}
        onAddComment={onAddComment}
      />
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
  time: {
    fontSize: 10,
    color: '#999',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
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
  // Estilos do Modal Expandido
  expandedContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  expandedContent: {
    flex: 1,
  },
  expandedBody: {
    padding: 16,
  },
  statusSection: {
    marginBottom: 16,
  },
  statusBadgeExpanded: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    alignSelf: 'flex-start',
  },
  statusTextExpanded: {
    fontWeight: '700',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  absoluteCloseButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'white',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
  },
});

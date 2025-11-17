import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal } from 'react-native';
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

  const handleCardPress = () => {
    setExpanded(true);
  };

  const handleCloseExpanded = () => {
    setExpanded(false);
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

        <TouchableOpacity style={styles.actionButton} onPress={() => { handleCardPress(); onComment?.(); }}>
          <Ionicons name="chatbubble-outline" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onShare}>
          <Ionicons name="share-outline" size={20} color="#666" />
        </TouchableOpacity>

        <View style={styles.spacer} />

        <TouchableOpacity style={styles.actionButton} onPress={onBookmark}>
          <Ionicons name="bookmark-outline" size={20} color="#666" />
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
          {/* Header do Modal */}
          <View style={styles.expandedHeader}>
            <TouchableOpacity onPress={handleCloseExpanded} style={styles.closeButton}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.expandedTitle}>DeOlhoNoLixo</Text>
            <View style={{ width: 24 }} />
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
              {/* Info do Usuário */}
              <ExpandedUserInfo usuario={usuario} tempoAtras={tempoAtras} />

              {/* Informações de Localização e Status */}
              <InfoSection
                localizacao={localizacao}
                status={status}
                latitude={latitude}
                longitude={longitude}
              />

              {/* Tags de Tipos de Lixo */}
              <TagsList tipos={tipos} />

              {/* Descrição Completa */}
              <DescriptionSection descricao={descricao} />

              {/* Cards de Detalhes */}
              <DetailCards tipos={tipos} tempoAtras={tempoAtras} />

              {/* Seção de Comentários */}
              <CommentsSection comentarios={comentarios} />

              {/* Botões de Ação */}
              <ExpandedActions likes={likes} isLiked={isLiked} onLikePress={onLike || (() => {})} />
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
    backgroundColor: '#F5F5F5',
  },
  expandedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0A7D6F',
    paddingHorizontal: 12,
    paddingTop: 20,
    paddingBottom: 14,
    minHeight: 70,
  },
  closeButton: {
    padding: 4,
  },
  expandedTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  expandedContent: {
    flex: 1,
  },
  expandedBody: {
    padding: 16,
  },
});

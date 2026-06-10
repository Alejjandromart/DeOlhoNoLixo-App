import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, Share, Platform, StatusBar, KeyboardAvoidingView } from 'react-native';
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
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const DESCRICAO_MAX = 120;

function DescricaoTruncada({ descricao, onVerMais }: { descricao: string; onVerMais: () => void }) {
  const longa = descricao.length > DESCRICAO_MAX;
  const texto = longa ? descricao.slice(0, DESCRICAO_MAX).trimEnd() + '…' : descricao;

  return (
    <Text style={stylesCard.description}>
      {texto}
      {longa && (
        <Text style={stylesCard.verMais} onPress={onVerMais}>
          {' '}ver mais
        </Text>
      )}
    </Text>
  );
}

interface DenunciaCardProps {
  id: string;
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
  id,
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
  const [localComments, setLocalComments] = useState<Comentario[]>(comentarios);

  const scrollViewRef = useRef<ScrollView>(null);
  const scrollTargetRef = useRef<'none' | 'descricao' | 'comentarios'>('none');
  const bodyYRef = useRef(0);
  const descricaoYRef = useRef(0);
  const comentariosYRef = useRef(0);

  const helperCalcularTempoAtras = (date: Date): string => {
    const diff = Date.now() - date.getTime();
    const min = Math.floor(diff / 60_000);
    const h = Math.floor(diff / 3_600_000);
    const d = Math.floor(diff / 86_400_000);
    if (min < 1) return 'agora';
    if (min === 1) return 'há 1 minuto';
    if (min < 60) return `há ${min} minutos`;
    if (h === 1) return 'há 1 hora';
    if (h < 24) return `há ${h} horas`;
    if (d === 1) return 'há 1 dia';
    if (d < 7) return `há ${d} dias`;
    if (d < 30) return `há ${Math.floor(d / 7)} semana${Math.floor(d / 7) > 1 ? 's' : ''}`;
    const m = Math.floor(d / 30);
    return `há ${m} ${m === 1 ? 'mês' : 'meses'}`;
  };

  useEffect(() => {
    let unsubscribe = () => {};
    
    if (expanded || commentsModalVisible) {
      const q = query(
        collection(db, 'denuncias', id, 'comentarios'),
        orderBy('timestamp', 'asc')
      );
      
      unsubscribe = onSnapshot(q, (snapshot) => {
        const commentsList = snapshot.docs.map(docSnap => {
          const data = docSnap.data();
          const ts = (data.timestamp as Timestamp)?.toDate?.() ?? new Date();
          return {
            id: docSnap.id,
            userId: data.userId ?? '',
            usuario: data.usuario ?? { nome: 'Usuário' },
            texto: data.texto ?? '',
            timestamp: ts,
            tempoAtras: helperCalcularTempoAtras(ts),
          };
        });
        setLocalComments(commentsList);
      }, (error) => {
        console.error("Erro ao carregar comentários:", error);
      });
    }

    return () => unsubscribe();
  }, [expanded, commentsModalVisible, id]);

  const handleCardPress = (target: 'none' | 'descricao' | 'comentarios' = 'none') => {
    scrollTargetRef.current = target;
    setExpanded(true);
  };

  const handleCloseExpanded = () => {
    scrollTargetRef.current = 'none';
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
      const hasMaps = latitude != null && longitude != null;
      const mapsUrl = hasMaps ? `https://www.google.com/maps?q=${latitude},${longitude}` : null;
      const lines = [
        '🚨 *DeOlhoNoLixo* — Denúncia de Descarte Irregular',
        '',
        `📍 Local: ${localizacao}`,
        `📝 ${descricao}`,
      ];
      if (mapsUrl) lines.push(`\n🗺️ Ver local: ${mapsUrl}`);
      if (id) lines.push(`\n📲 Abrir no app: deolhoapp:///denuncia/${id}`);

      await Share.share({
        message: lines.join('\n'),
        title: 'DeOlhoNoLixo — Denúncia de Descarte Irregular',
      });
      onShare?.();
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  // Helper para obter cores do status
  const getStatusColors = (statusText: string) => {
    const statusLower = statusText.toLowerCase();

    if (statusLower.includes('pendente') || statusLower.includes('aguardando')) {
      return { bg: '#FFF3E0', text: '#E65100' }; // Laranja
    } else if (statusLower.includes('em andamento') || statusLower.includes('processando')) {
      return { bg: '#E3F2FD', text: '#1565C0' }; // Azul
    } else if (statusLower.includes('resolvido') || statusLower.includes('concluído')) {
      return { bg: '#E8F5E9', text: '#2E7D32' }; // Verde
    } else if (statusLower.includes('cancelado') || statusLower.includes('rejeitado')) {
      return { bg: '#FFEBEE', text: '#C62828' }; // Vermelho
    }

    return { bg: '#F5F5F5', text: '#616161' }; // Cinza padrão
  };

  const statusColors = getStatusColors(status);

  return (
    <>
      <TouchableOpacity activeOpacity={0.8} onPress={() => handleCardPress('none')}>
        <View style={stylesCard.card}>
      {/* Header do Card */}
      <View style={stylesCard.header}>
        <View style={stylesCard.userInfo}>
          <View style={stylesCard.avatar}>
            {usuario.avatar ? (
              <Image source={{ uri: usuario.avatar }} style={stylesCard.avatarImage} />
            ) : (
              <Ionicons name="person" size={24} color="#666" />
            )}
          </View>
          <View style={stylesCard.userDetails}>
            <Text style={stylesCard.userName}>{usuario.nome}</Text>
            <View style={stylesCard.metaInfo}>
              <Text style={stylesCard.location}>{localizacao}</Text>
              <Text style={stylesCard.separator}>•</Text>
              <Text style={stylesCard.time}>{tempoAtras}</Text>
            </View>
          </View>
        </View>
        <View style={[stylesCard.statusBadge, { backgroundColor: statusColors.bg }]}>
          <Text style={[stylesCard.statusText, { color: statusColors.text }]}>{status}</Text>
        </View>
      </View>

      {/* Descrição com "ver mais" */}
      <DescricaoTruncada descricao={descricao} onVerMais={() => handleCardPress('descricao')} />

      {/* Grid de Imagens */}
      <View style={stylesCard.imagesGrid}>
        {imagens.slice(0, 4).map((uri, index) => (
          <View
            key={index}
            style={[
              stylesCard.imageContainer,
              imagens.length === 1 && stylesCard.imageSingle,
              imagens.length === 2 && stylesCard.imageDouble,
              imagens.length === 3 && index === 0 && stylesCard.imageTripleFirst,
              imagens.length === 3 && index > 0 && stylesCard.imageTripleOther,
              imagens.length === 4 && stylesCard.imageQuad,
              { borderRadius: 16 }
            ]}
          >
            <Image source={{ uri }} style={stylesCard.image} />
            {index === 3 && imagens.length > 4 && (
              <View style={stylesCard.moreImagesOverlay}>
                <Text style={stylesCard.moreImagesText}>+{imagens.length - 4}</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Actions */}
      <View style={stylesCard.actions}>
        <TouchableOpacity style={stylesCard.actionButton} onPress={handleLikePress}>
          {showLikeExplosion ? (
            <LikeExplosion size={24} color="#FF3B30" particleCount={6} />
          ) : (
            <Ionicons
              name={localIsLiked ? 'heart' : 'heart-outline'}
              size={24}
              color={localIsLiked ? '#FF3B30' : '#666'}
            />
          )}
          {likes > 0 && <Text style={stylesCard.actionText}>{likes}</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={stylesCard.actionButton} onPress={() => handleCardPress('comentarios')}>
          <Ionicons name="chatbubble-outline" size={22} color="#666" />
          {localComments.length > 0 && (
            <Text style={stylesCard.actionText}>{localComments.length}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={stylesCard.actionButton} onPress={handleShare}>
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
        onShow={() => {
          if (scrollTargetRef.current === 'none') return;
          setTimeout(() => {
            const y = scrollTargetRef.current === 'comentarios'
              ? bodyYRef.current + comentariosYRef.current
              : bodyYRef.current + descricaoYRef.current;
            scrollViewRef.current?.scrollTo({ y, animated: true });
          }, 200);
        }}
      >
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <KeyboardAvoidingView
          style={stylesCard.expandedContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'android' ? 0 : 0}
        >
          <ScrollView
            ref={scrollViewRef}
            style={stylesCard.expandedContent}
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
                style={stylesCard.absoluteCloseButton}
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
              denunciaId={id}
              latitude={latitude}
              longitude={longitude}
            />

            <View
              style={stylesCard.expandedBody}
              onLayout={(e) => { bodyYRef.current = e.nativeEvent.layout.y; }}
            >
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

              <View style={stylesCard.divider} />

              {/* Descrição Completa */}
              <View onLayout={(e) => { descricaoYRef.current = e.nativeEvent.layout.y; }}>
                <DescriptionSection descricao={descricao} />
              </View>

              <View style={stylesCard.divider} />

              {/* Cards de Detalhes */}
              <DetailCards tipos={tipos} tempoAtras={tempoAtras} />

              <View style={stylesCard.divider} />

              {/* Seção de Comentários */}
              <View onLayout={(e) => { comentariosYRef.current = e.nativeEvent.layout.y; }}>
                <CommentsSection comentarios={localComments} />
              </View>
            </View>
          </ScrollView>

          {/* Input de Comentário Fixo */}
          <CommentInput
            onAddComment={(texto) => {
              if (onAddComment) onAddComment(texto);
            }}
          />
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal de Comentários */}
      <CommentsModal
        visible={commentsModalVisible}
        onClose={handleCloseComments}
        comentarios={localComments}
        onAddComment={onAddComment}
      />
    </>
  );
}

const stylesCard = StyleSheet.create({
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
  verMais: {
    fontWeight: '700',
    color: '#0A7D6F',
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
  absoluteCloseButton: {
    position: 'absolute',
    top: 28,
    left: 28,
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

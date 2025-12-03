import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useDenuncias } from '../../context/DenunciaContext';
import { useNavigation } from '@react-navigation/native';
import BottomTabBar from '../../components/BottomTabBar';
import DenunciaCard from '../../components/Feed/DenunciaCard';
import FilterModal from '../../components/Feed/FilterModal';
import { getFeedDenuncias, FeedDenuncia } from '../../services/feedService';
import { FiltrosDenuncia } from '../../context/DenunciaContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const FeedScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const denunciaContext = useDenuncias();
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [feedDenuncias, setFeedDenuncias] = useState<any[]>([]);
  const [useFeedService, setUseFeedService] = useState(false); // FALSE = usa Firebase Context
  const [userName, setUserName] = useState(user?.displayName || user?.email?.split('@')[0] || 'Usuário');
  const insets = useSafeAreaInsets();

  // Usa denúncias filtradas se houver filtros ativos, senão usa todas
  const todasDenuncias = denunciaContext?.denuncias || [];
  const denunciasFiltradas = denunciaContext?.denunciasFiltradas || [];
  const filtrosAtivos = denunciaContext?.filtrosAtivos || {};
  const temFiltros = Object.keys(filtrosAtivos).length > 0;
  const denuncias = temFiltros ? denunciasFiltradas : todasDenuncias;
  const isInitialLoad = denunciaContext?.isLoading ?? true;
  
  console.log(`📊 FeedScreen: ${denuncias.length} denúncias (loading: ${isInitialLoad})`);
  const curtirDenuncia = denunciaContext?.curtirDenuncia || ((id: number) => { });
  const adicionarComentario = denunciaContext?.adicionarComentario || ((denunciaId: number, texto: string, usuario: any) => { });

  useEffect(() => {
    const fetchUserName = async () => {
      if (user?.uid) {
        try {
          const docRef = doc(db, 'usuarios', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserName(data.nomeUsuario || user.displayName || user.email?.split('@')[0] || 'Usuário');
          }
        } catch (error) {
          console.log("Erro ao buscar nome do usuário:", error);
        }
      }
    };
    fetchUserName();
  }, [user]);

  const handleApplyFilters = (filtros: FiltrosDenuncia) => {
    denunciaContext?.filtrarDenuncias(filtros);
  };

  const handleClearFilters = () => {
    denunciaContext?.limparFiltros();
  };

  const handleAddComment = async (denunciaId: number, texto: string) => {
    console.log('🔵 FeedScreen handleAddComment chamado');
    console.log('📋 DenunciaId:', denunciaId);
    console.log('💭 Texto:', texto);
    console.log('👤 User email:', user?.email);

    // Busca dados do usuário do Firestore
    let usuario = {
      nome: user?.email?.split('@')[0] || 'Usuário',
      avatar: undefined as string | undefined,
    };

    if (user?.uid) {
      try {
        const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          usuario = {
            nome: userData.nomeUsuario || userData.nomeCompleto || usuario.nome,
            avatar: userData.photoURL || undefined,
          };
        }
      } catch (error) {
        console.warn('⚠️ Não foi possível buscar avatar do usuário:', error);
      }
    }

    console.log('👤 Usuario criado:', usuario);
    console.log('🔧 Chamando adicionarComentario...');
    adicionarComentario(denunciaId, texto, usuario);
    console.log('✅ adicionarComentario chamado');
  };

  // Firebase já sincroniza automaticamente via DenunciaContext
  // Comentado para evitar conflito com Firebase Firestore
  // useEffect(() => {
  //   loadFeedFromBackend();
  // }, []);

  // BackendRedis desabilitado - Firebase sincroniza via Context
  const loadFeedFromBackend = async () => {
    try {
      console.log('ℹ️ Usando denúncias do Firebase Context (BackendRedis desabilitado)');
      return; // Não faz nada, apenas para compatibilidade
      const data = await getFeedDenuncias();
      
      // Converte do formato FeedDenuncia para o formato do Context
      const converted = data.map((item: FeedDenuncia, index: number) => {
        const timestamp = new Date(item.timestamp);
        const now = new Date();
        const diffMs = now.getTime() - timestamp.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        let tempoAtras = 'Agora';
        if (diffMins < 1) tempoAtras = 'Agora';
        else if (diffMins < 60) tempoAtras = `${diffMins} min atrás`;
        else if (diffHours < 24) tempoAtras = `${diffHours}h atrás`;
        else tempoAtras = `${diffDays}d atrás`;
        
        console.log('📸 Imagens recebidas:', item.images?.length || 0, 'primeira:', item.images?.[0]?.substring(0, 50));
        
        return {
          id: index + 1,
          usuario: {
            nome: item.userId?.split('@')[0] || 'Usuário',
            avatar: undefined,
          },
          imagens: item.images || [],
          descricao: item.description,
          localizacao: item.geographicContext,
          latitude: item.location?.latitude,
          longitude: item.location?.longitude,
          tipos: [item.category],
          timestamp: timestamp,
          tempoAtras: tempoAtras,
          status: 'Pendente',
          likes: 0,
          comentarios: [],
          curtida: false,
          isLiked: false,
        };
      });
      
      setFeedDenuncias(converted);
      console.log(`✅ ${converted.length} denúncias carregadas do feed`);
    } catch (error) {
      console.warn('⚠️ Erro ao carregar feed, usando dados locais:', error);
      setUseFeedService(false); // Fallback para Context local
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigation.navigate('Welcome');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Firebase já sincroniza automaticamente via listener
    console.log('🔄 Refresh: denúncias do Firebase Context');
    // Pequeno delay para feedback visual
    await new Promise(resolve => setTimeout(resolve, 500));
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <View style={styles.safeArea}>
        {/* Conteúdo */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 100, paddingTop: insets.top + 20 }]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#0A7D6F"
              colors={['#0A7D6F']}
            />
          }
        >
          <View style={styles.feedSection}>
            <View style={styles.feedHeader}>
              <View>
                <View style={styles.titleContainer}>
                  <Text style={styles.titleGreen}>DeOlho</Text>
                  <Text style={styles.titleBlack}>NoLixo</Text>
                </View>
                <Text style={styles.subtitle}>Olá, {userName}</Text>
              </View>
              <View style={styles.headerButtons}>
                <TouchableOpacity
                  onPress={() => setShowFilterModal(true)}
                  style={[styles.filterButton, temFiltros && styles.filterButtonActive]}
                >
                  <Ionicons 
                    name="options-outline" 
                    size={24} 
                    color={temFiltros ? "#0A7D6F" : "#333"} 
                  />
                  {temFiltros && <View style={styles.filterBadge} />}
                </TouchableOpacity>
              </View>
            </View>

            {isInitialLoad ? (
              <View style={styles.emptyState}>
                <Ionicons name="hourglass-outline" size={64} color="#0A7D6F" />
                <Text style={styles.emptyTitle}>Carregando denúncias...</Text>
                <Text style={styles.emptyText}>
                  Sincronizando com o Firebase
                </Text>
              </View>
            ) : denuncias.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="newspaper-outline" size={64} color="#999" />
                <Text style={styles.emptyTitle}>Nenhuma denúncia ainda</Text>
                <Text style={styles.emptyText}>
                  Seja o primeiro a reportar um problema na sua região!
                </Text>
              </View>
            ) : (
              <View style={styles.feedCards}>
                {denuncias.map((denuncia) => (
                  <DenunciaCard
                    key={denuncia.id}
                    usuario={denuncia.usuario}
                    localizacao={denuncia.localizacao}
                    status={denuncia.status}
                    tempoAtras={denuncia.tempoAtras}
                    descricao={denuncia.descricao}
                    imagens={denuncia.imagens}
                    likes={denuncia.likes}
                    isLiked={denuncia.isLiked}
                    tipos={denuncia.tipos}
                    latitude={denuncia.latitude}
                    longitude={denuncia.longitude}
                    comentarios={denuncia.comentarios}
                    onLike={() => curtirDenuncia(denuncia.id)}
                    onComment={() => console.log('Comentar', denuncia.id)}
                    onShare={() => console.log('Compartilhar', denuncia.id)}
                    onBookmark={() => console.log('Salvar', denuncia.id)}
                    onAddComment={(texto) => handleAddComment(denuncia.id, texto)}
                  />
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      {/* Modal de Filtros Avançados */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={handleApplyFilters}
        filtrosAtuais={filtrosAtivos}
      />
    </View>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleGreen: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0B846C',
  },
  titleBlack: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    paddingTop: 16,
  },
  feedSection: {
    marginBottom: 24,
  },
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
    justifyContent: 'space-between',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: '#E8F5E9',
  },
  filterBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0A7D6F',
  },
  filterMenu: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  feedCards: {
    gap: 0,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});

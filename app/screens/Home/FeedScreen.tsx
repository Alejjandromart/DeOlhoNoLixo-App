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
import { useNavigation, useIsFocused } from '@react-navigation/native';
import BottomTabBar from '../../components/BottomTabBar';
import DenunciaCard from '../../components/Feed/DenunciaCard';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const FeedScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const { denuncias, loadingFeed, curtirDenuncia, adicionarComentario } = useDenuncias();
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filterOption, setFilterOption] = useState<'recente' | 'proximo'>('recente');
  const insets = useSafeAreaInsets();

  const [userData, setUserData] = useState<{ nome: string; avatar: string | null }>({
    nome: user?.displayName || user?.email?.split('@')[0] || 'Usuário',
    avatar: null,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, 'users', user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setUserData({
            nome: snap.data().displayName || snap.data().nome || user.displayName || user.email?.split('@')[0] || 'Usuário',
            avatar: snap.data().photoBase64 || null,
          });
        }
      } catch (e) {
        console.error('Erro ao buscar dados do usuário no feed:', e);
      }
    };
    if (isFocused) {
      fetchUserData();
    }
  }, [user?.uid, isFocused]);

  if (loadingFeed) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' }}>
        <Text style={{ color: '#0A7D6F', marginTop: 10 }}>Carregando denúncias...</Text>
      </View>
    );
  }

  const handleFilterSelect = (option: 'recente' | 'proximo') => {
    setFilterOption(option);
    setShowFilterMenu(false);
  };

  const handleAddComment = (denunciaId: string, texto: string) => {
    const usuario = {
      nome: userData.nome,
      avatar: userData.avatar || null,
    };

    adicionarComentario(denunciaId, texto, usuario);
  };

  const handleLogout = async () => {
    await signOut();
    navigation.navigate('Welcome');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simula carregamento de dados
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const userName = userData.nome;

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
              <TouchableOpacity
                onPress={() => setShowFilterMenu(!showFilterMenu)}
                style={styles.filterButton}
              >
                <Ionicons name="options-outline" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Menu de Filtro */}
            {showFilterMenu && (
              <View style={styles.filterMenu}>
                <TouchableOpacity
                  style={[styles.filterOption, filterOption === 'recente' && styles.filterOptionActive]}
                  onPress={() => handleFilterSelect('recente')}
                >
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color={filterOption === 'recente' ? '#0A7D6F' : '#666'}
                  />
                  <Text style={[styles.filterText, filterOption === 'recente' && styles.filterTextActive]}>
                    Mais Recente
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterOption, filterOption === 'proximo' && styles.filterOptionActive]}
                  onPress={() => handleFilterSelect('proximo')}
                >
                  <Ionicons
                    name="map-outline"
                    size={20}
                    color={filterOption === 'proximo' ? '#0A7D6F' : '#666'}
                  />
                  <Text style={[styles.filterText, filterOption === 'proximo' && styles.filterTextActive]}>
                    Mais Próximo
                  </Text>
                </TouchableOpacity>
              </View>
            )}


            {denuncias.length === 0 ? (
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
                     id={denuncia.id}
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
  filterButton: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  filterOptionActive: {
    backgroundColor: '#E8F5E9',
  },
  filterText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#0A7D6F',
    fontWeight: '600',
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

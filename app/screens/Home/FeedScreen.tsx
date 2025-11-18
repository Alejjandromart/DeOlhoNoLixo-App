import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Share,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useDenuncias } from '../../context/DenunciaContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import BottomTabBar from '../../components/BottomTabBar';
import DenunciaCard from '../../components/Feed/DenunciaCard';

const FeedScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const denunciaContext = useDenuncias();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [showWelcome, setShowWelcome] = useState(!route.params?.showFeed);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filterOption, setFilterOption] = useState<'recente' | 'proximo'>('recente');

  const denuncias = denunciaContext?.denuncias || [];
  const curtirDenuncia = denunciaContext?.curtirDenuncia || ((id: number) => {});
  const adicionarComentario = denunciaContext?.adicionarComentario || ((denunciaId: number, texto: string, usuario: any) => {});

  const handleFilterSelect = (option: 'recente' | 'proximo') => {
    setFilterOption(option);
    setShowFilterMenu(false);
  };

  const handleAddComment = (denunciaId: number, texto: string) => {
    console.log('🔵 FeedScreen handleAddComment chamado');
    console.log('📋 DenunciaId:', denunciaId);
    console.log('💭 Texto:', texto);
    console.log('👤 User email:', user?.email);
    
    const usuario = {
      nome: user?.email?.split('@')[0] || 'Usuário',
      avatar: undefined,
    };
    
    console.log('👤 Usuario criado:', usuario);
    console.log('🔧 Chamando adicionarComentario...');
    adicionarComentario(denunciaId, texto, usuario);
    console.log('✅ adicionarComentario chamado');
  };

  const handleShare = async (denuncia: any) => {
    try {
      const result = await Share.share({
        message: `Denúncia: ${denuncia.descricao}\n\nLocalização: ${denuncia.localizacao}\nStatus: ${denuncia.status}\n\nVia DeOlhoNoLixo App`,
        title: 'Compartilhar Denúncia',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Compartilhado via:', result.activityType);
        } else {
          console.log('Compartilhado com sucesso');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Compartilhamento cancelado');
      }
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível compartilhar a denúncia.');
      console.error('Erro ao compartilhar:', error);
    }
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

  const handleGoToFeed = () => {
    setShowWelcome(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: showWelcome ? '#0A7D6F' : '#F5F5F5' }} edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        {!showWelcome ? (
          <View style={styles.feedHeaderTop}>
            <View style={{ width: 52 }} />
            <View style={styles.titleContainer}>
              <Text style={styles.titleDeOlho}>DeOlho</Text>
              <Text style={styles.titleNoLixo}>NoLixo</Text>
            </View>
            <TouchableOpacity 
              onPress={() => setShowFilterMenu(!showFilterMenu)} 
              style={styles.filterButtonTop}
            >
              <Ionicons name="options-outline" size={28} color="#333" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Olá! 👋</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Configuracao')} 
                style={styles.settingsButton}
              >
                <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Conteúdo */}
        <ScrollView 
          style={[styles.content, showWelcome && styles.contentWelcome]}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            !showWelcome ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#0A7D6F"
                colors={['#0A7D6F']}
              />
            ) : undefined
          }
        >
          {showWelcome ? (
            /* Tela de Boas-Vindas */
            <>
              <View style={styles.welcomeCard}>
                <View style={styles.iconContainer}>
                  <Ionicons name="checkmark-circle" size={64} color="#9BC938" />
                </View>
                <Text style={styles.welcomeTitle}>Bem-vindo ao De Olho no Lixo!</Text>
                <Text style={styles.welcomeText}>
                  Você está logado com sucesso. Contribua para uma cidade mais limpa
                  reportando problemas e acompanhando denúncias da comunidade.
                </Text>
              </View>

              {/* Cards de Funcionalidades */}
              <View style={styles.featuresContainer}>
                <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate('RealizarDenuncia')}>
                  <Ionicons name="camera-outline" size={32} color="#9BC938" />
                  <Text style={styles.featureTitle}>Reportar</Text>
                  <Text style={styles.featureDescription}>
                    Tire foto e reporte problemas de lixo
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard} onPress={handleGoToFeed}>
                  <Ionicons name="newspaper-outline" size={32} color="#9BC938" />
                  <Text style={styles.featureTitle}>Feed</Text>
                  <Text style={styles.featureDescription}>
                    Visualize denúncias da comunidade
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard}>
                  <Ionicons name="map-outline" size={32} color="#9BC938" />
                  <Text style={styles.featureTitle}>Mapa</Text>
                  <Text style={styles.featureDescription}>
                    Veja reportes na sua região
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard}>
                  <Ionicons name="trophy-outline" size={32} color="#9BC938" />
                  <Text style={styles.featureTitle}>Ranking</Text>
                  <Text style={styles.featureDescription}>
                    Usuários mais ativos
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            /* Feed de Denúncias */
            <View style={styles.feedSection}>

              
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
                      onShare={() => handleShare(denuncia)}
                      onAddComment={(texto) => handleAddComment(denuncia.id, texto)}
                    />
                  ))}
                </View>
              )}
            </View>
          )}
        </ScrollView>

      {/* Modal de Filtro */}
      <Modal
        visible={showFilterMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFilterMenu(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowFilterMenu(false)}
        >
          <View style={styles.filterModalContent}>
            <TouchableOpacity 
              style={[styles.filterModalOption, filterOption === 'recente' && styles.filterModalOptionActive]}
              onPress={() => handleFilterSelect('recente')}
            >
              <Ionicons 
                name="time-outline" 
                size={24} 
                color={filterOption === 'recente' ? '#FFFFFF' : '#333'} 
              />
              <Text style={[styles.filterModalText, filterOption === 'recente' && styles.filterModalTextActive]}>
                Mais Recente
              </Text>
            </TouchableOpacity>
            
            <View style={styles.filterDivider} />
            
            <TouchableOpacity 
              style={[styles.filterModalOption, filterOption === 'proximo' && styles.filterModalOptionActive]}
              onPress={() => handleFilterSelect('proximo')}
            >
              <Ionicons 
                name="map-outline" 
                size={24} 
                color={filterOption === 'proximo' ? '#FFFFFF' : '#333'} 
              />
              <Text style={[styles.filterModalText, filterOption === 'proximo' && styles.filterModalTextActive]}>
                Mais Próximo
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <BottomTabBar 
        currentRoute="Feed" 
        onHomePress={() => setShowWelcome(true)}
      />
      </View>
    </SafeAreaView>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#0A7D6F',
  },
  feedHeaderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#F5F5F5',
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
  filterButtonTop: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#9BC938',
    fontWeight: '500',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  settingsButton: {
    backgroundColor: 'rgba(155, 201, 56, 0.2)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(155, 201, 56, 0.3)',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  content: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentWelcome: {
    backgroundColor: 'transparent',
  },
  contentContainer: {
    paddingTop: 16,
    paddingBottom: 100,
  },
  welcomeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  iconContainer: {
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 15,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.9,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  featureCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 13,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 18,
  },
  feedSection: {
    marginBottom: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 95,
    paddingRight: 20,
  },
  filterModalContent: {
    backgroundColor: 'rgba(64, 64, 64, 0.95)',
    borderRadius: 16,
    padding: 8,
    minWidth: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  filterModalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
    borderRadius: 12,
  },
  filterModalOptionActive: {
    backgroundColor: 'rgba(10, 125, 111, 0.8)',
  },
  filterModalText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  filterModalTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  filterDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 4,
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

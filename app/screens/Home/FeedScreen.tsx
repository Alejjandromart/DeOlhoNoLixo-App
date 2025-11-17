import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useDenuncias } from '../../context/DenunciaContext';
import { useNavigation } from '@react-navigation/native';
import BottomTabBar from '../../components/BottomTabBar';
import DenunciaCard from '../../components/Feed/DenunciaCard';

const FeedScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const denunciaContext = useDenuncias();
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
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
    <View style={{ flex: 1, backgroundColor: showWelcome ? '#0A7D6F' : '#F5F5F5' }}>
      {/* Header */}
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

      <SafeAreaView style={styles.safeArea}>
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
              <View style={styles.feedHeader}>
                <TouchableOpacity onPress={() => setShowWelcome(true)} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.sectionTitle}>Feed de Denúncias</Text>
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
          )}
        </ScrollView>
      </SafeAreaView>
      <BottomTabBar currentRoute="Feed" />
    </View>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#0A7D6F',
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
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  backButton: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    flex: 1,
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

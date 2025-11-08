import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const HomeScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<any>();

  const handleLogout = async () => {
    await signOut();
    navigation.navigate('Welcome');
  };

  return (
    <LinearGradient colors={['#145A49', '#0E3B34']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá! 👋</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Conteúdo Principal */}
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.welcomeCard}>
            <View style={styles.iconContainer}>
              <Ionicons name="checkmark-circle" size={64} color="#A4D65E" />
            </View>
            <Text style={styles.welcomeTitle}>Bem-vindo ao De Olho no Lixo!</Text>
            <Text style={styles.welcomeText}>
              Você está logado com sucesso. Em breve, você poderá reportar problemas
              de lixo, acompanhar suas denúncias e contribuir para uma cidade mais limpa.
            </Text>
          </View>

          {/* Cards de Funcionalidades (Preview) */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureCard}>
              <Ionicons name="camera-outline" size={32} color="#A4D65E" />
              <Text style={styles.featureTitle}>Reportar</Text>
              <Text style={styles.featureDescription}>
                Tire foto e reporte problemas de lixo
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Ionicons name="map-outline" size={32} color="#A4D65E" />
              <Text style={styles.featureTitle}>Mapa</Text>
              <Text style={styles.featureDescription}>
                Visualize reportes na sua região
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Ionicons name="analytics-outline" size={32} color="#A4D65E" />
              <Text style={styles.featureTitle}>Histórico</Text>
              <Text style={styles.featureDescription}>
                Acompanhe suas denúncias
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Ionicons name="trophy-outline" size={32} color="#A4D65E" />
              <Text style={styles.featureTitle}>Ranking</Text>
              <Text style={styles.featureDescription}>
                Veja os usuários mais ativos
              </Text>
            </View>
          </View>

          {/* Informações do Usuário */}
          <View style={styles.userInfoCard}>
            <Text style={styles.userInfoTitle}>Suas Informações</Text>
            <View style={styles.userInfoRow}>
              <Ionicons name="mail-outline" size={20} color="#A4D65E" />
              <Text style={styles.userInfoText}>{user?.email}</Text>
            </View>
            <View style={styles.userInfoRow}>
              <Ionicons name="finger-print-outline" size={20} color="#A4D65E" />
              <Text style={styles.userInfoText}>ID: {user?.id.slice(0, 8)}...</Text>
            </View>
            <View style={styles.userInfoRow}>
              <Ionicons name="calendar-outline" size={20} color="#A4D65E" />
              <Text style={styles.userInfoText}>
                Membro desde: {new Date(user?.created_at || '').toLocaleDateString('pt-BR')}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#A4D65E',
    fontWeight: '500',
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
  },
  contentContainer: {
    padding: 20,
  },
  welcomeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 24,
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
  userInfoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  userInfoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfoText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 12,
    opacity: 0.9,
  },
});

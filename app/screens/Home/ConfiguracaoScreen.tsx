import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Switch, ScrollView, Alert, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/RootStack';
import { useAuth } from '../../context/AuthContext';
import ConfirmationModal from '../../components/ConfirmationModal';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

type ConfiguracaoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Configuracao'>;

const ConfiguracaoScreen = () => {
  const navigation = useNavigation<ConfiguracaoScreenNavigationProp>();
  const isFocused = useIsFocused();
  const { signOut, user } = useAuth();
  const [cidade, setCidade] = useState('');
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [gpsEnabled, setGpsEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const carregarDados = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, 'users', user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setCidade(snap.data().cidade ?? '');
          setPhotoBase64(snap.data().photoBase64 ?? null);
        }
      } catch (e) {
        console.error('Erro ao carregar dados nas configs:', e);
      }
    };

    const verificarPermissoes = async () => {
      try {
        const { status: locationStatus } = await Location.getForegroundPermissionsAsync();
        setGpsEnabled(locationStatus === 'granted');

        const { status: cameraStatus } = await ImagePicker.getCameraPermissionsAsync();
        setCameraEnabled(cameraStatus === 'granted');
      } catch (e) {
        console.error('Erro ao verificar permissões:', e);
      }
    };

    if (isFocused) {
      carregarDados();
      verificarPermissoes();
    }
  }, [user?.uid, isFocused]);

  const handleToggleGps = async () => {
    const { status: currentStatus } = await Location.getForegroundPermissionsAsync();
    if (currentStatus === 'granted') {
      Alert.alert(
        'Desativar Localização',
        'Para desativar a permissão de localização, você precisa alterar as configurações do seu dispositivo nas configurações do sistema.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Configurações', onPress: () => Linking.openSettings() }
        ]
      );
    } else {
      const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
      setGpsEnabled(newStatus === 'granted');
    }
  };

  const handleToggleCamera = async () => {
    const { status: currentStatus } = await ImagePicker.getCameraPermissionsAsync();
    if (currentStatus === 'granted') {
      Alert.alert(
        'Desativar Câmera',
        'Para desativar a permissão de câmera, você precisa alterar as configurações do seu dispositivo nas configurações do sistema.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Configurações', onPress: () => Linking.openSettings() }
        ]
      );
    } else {
      const { status: newStatus } = await ImagePicker.requestCameraPermissionsAsync();
      setCameraEnabled(newStatus === 'granted');
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const handleDeleteAccount = () => {
    // TODO: Implement delete account logic
    console.log("Delete account confirmed");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Configurações</Text>

        {/* Profile Card */}
        <TouchableOpacity style={styles.profileCard} onPress={() => navigation.navigate('Profile')}>
          <LinearGradient
            colors={['#0B846C', '#076653']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileGradient}
          >
            {photoBase64 ? (
              <Image source={{ uri: photoBase64 }} style={styles.profileImage} />
            ) : (
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {user?.displayName ? user.displayName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : '?'}
                </Text>
              </View>
            )}
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.displayName || 'Usuário'}</Text>
              <Text style={styles.profileLocation}>{cidade || 'Sem cidade definida'}</Text>
            </View>
            <View style={styles.profileAction}>
              <Feather name="chevron-right" size={20} color="#FFF" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.sectionHeader}>GERAL</Text>

        {/* Settings Group */}
        <View style={styles.cardContainer}>
          <TouchableOpacity style={styles.optionItem} onPress={() => navigation.navigate('AlterarSenha')}>
            <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
              <Feather name="shield" size={20} color="#0B846C" />
            </View>
            <Text style={styles.optionLabel}>Segurança e Senha</Text>
            <Feather name="chevron-right" size={20} color="#C7C7CC" />
          </TouchableOpacity>

          <View style={styles.separator} />

          <View style={styles.optionItem}>
            <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
              <MaterialIcons name="location-pin" size={20} color="#1976D2" />
            </View>
            <Text style={styles.optionLabel}>Localização (GPS)</Text>
            <Switch
              trackColor={{ false: "#E0E0E0", true: "#0B846C" }}
              thumbColor={"#FFFFFF"}
              ios_backgroundColor="#E0E0E0"
              onValueChange={handleToggleGps}
              value={gpsEnabled}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.optionItem}>
            <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}>
              <Feather name="camera" size={20} color="#F57C00" />
            </View>
            <Text style={styles.optionLabel}>Acesso à Câmera</Text>
            <Switch
              trackColor={{ false: "#E0E0E0", true: "#0B846C" }}
              thumbColor={"#FFFFFF"}
              ios_backgroundColor="#E0E0E0"
              onValueChange={handleToggleCamera}
              value={cameraEnabled}
            />
          </View>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.optionItem} onPress={() => navigation.navigate('Tutorial')}>
            <View style={[styles.iconBox, { backgroundColor: '#E0F7FA' }]}>
              <Feather name="help-circle" size={20} color="#00BCD4" />
            </View>
            <Text style={styles.optionLabel}>Ver Tutorial</Text>
            <Feather name="chevron-right" size={20} color="#C7C7CC" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionHeader}>CONTA</Text>

        {/* Logout */}
        <View style={styles.cardContainer}>
          <TouchableOpacity style={styles.optionItem} onPress={() => setLogoutModalVisible(true)}>
            <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
              <Feather name="log-out" size={20} color="#0B846C" />
            </View>
            <Text style={styles.optionLabel}>Sair da Conta</Text>
          </TouchableOpacity>
        </View>

        {/* Delete Account - Separated with danger styling */}
        <View style={[styles.cardContainer, styles.dangerCard]}>
          <TouchableOpacity style={styles.optionItem} onPress={() => setDeleteModalVisible(true)}>
            <View style={[styles.iconBox, { backgroundColor: '#FFEBEE' }]}>
              <Feather name="trash-2" size={20} color="#D32F2F" />
            </View>
            <Text style={[styles.optionLabel, { color: '#D32F2F', fontWeight: '700' }]}>Excluir Conta Permanentemente</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>Versão 1.0.0</Text>
      </ScrollView>

      <ConfirmationModal
        visible={logoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        onConfirm={handleLogout}
        title="Sair da Conta"
        message="Tem certeza que deseja sair? Você precisará fazer login novamente."
        confirmText="Sair"
        type="warning"
      />

      <ConfirmationModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleDeleteAccount}
        title="Excluir Conta"
        message="Esta ação é irreversível. Todos os seus dados serão permanentemente excluídos."
        confirmText="Excluir Permanentemente"
        type="danger"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: 24,
  },
  profileCard: {
    marginBottom: 32,
    borderRadius: 24,
    shadowColor: '#0B846C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  profileGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileLocation: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  profileAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 12,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  dangerCard: {
    borderWidth: 1.5,
    borderColor: '#FFCDD2',
    marginBottom: 32,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    minHeight: 64,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  separator: {
    height: 1,
    backgroundColor: '#F2F2F7',
    marginLeft: 72,
  },
  versionText: {
    textAlign: 'center',
    color: '#8E8E93',
    fontSize: 13,
    marginBottom: 32,
  },
});

export default ConfiguracaoScreen;

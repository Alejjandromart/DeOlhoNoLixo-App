import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Switch, ScrollView, ActivityIndicator, Animated, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/RootStack';
import { useAuth } from '../../context/AuthContext';
import { usePermissionPreferences } from '../../hooks/usePermissionPreferences';
import ConfirmationModal from '../../components/ConfirmationModal';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import * as Location from 'expo-location';
import { Camera, useCameraPermissions } from 'expo-camera';
import * as Linking from 'expo-linking';

type ConfiguracaoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Configuracao'>;

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
}

const ConfiguracaoScreen = () => {
  const navigation = useNavigation<ConfiguracaoScreenNavigationProp>();
  const { signOut, user } = useAuth();
  const { isGpsEnabled, isCameraEnabled, toggleGps, toggleCamera } = usePermissionPreferences();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastProps>({ message: '', type: 'success', visible: false });
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  const fetchUserData = useCallback(async () => {
    if (user?.uid) {
      try {
        const docRef = doc(db, 'usuarios', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
      checkPermissions();
    }, [fetchUserData])
  );

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, visible: true });
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true })
    ]).start(() => {
      setToast({ message: '', type: 'success', visible: false });
    });
  };

  const checkPermissions = async () => {
    try {
      const { status: locationStatus } = await Location.getForegroundPermissionsAsync();
      // Just check, don't set state - we use preferences now

      if (cameraPermission) {
        // Camera permission check only
      }
    } catch (error) {
      console.error('Erro ao verificar permissões:', error);
    }
  };

  const handleToggleGps = async () => {
    await toggleGps();
    showToast(
      isGpsEnabled ? 'Localização desativada no app' : 'Localização ativada no app',
      'success'
    );
  };

  const handleToggleCamera = async () => {
    if (!isCameraEnabled) {
      // Only request permission if enabling
      try {
        const permission = await requestCameraPermission();
        if (!permission.granted) {
          showToast('Permissão de câmera foi negada no dispositivo', 'error');
          return;
        }
      } catch (error) {
        console.error('Erro ao solicitar permissão de câmera:', error);
        showToast('Erro ao solicitar permissão', 'error');
        return;
      }
    }
    await toggleCamera();
    showToast(
      isCameraEnabled ? 'Câmera desativada no app' : 'Câmera ativada no app',
      'success'
    );
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
            <Image
              source={(userData?.photoURL || user?.photoURL) ? { uri: userData?.photoURL || user?.photoURL } : require('../../assets/images/CAPI.png')}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userData?.nomeCompleto || user?.displayName || 'Usuário'}</Text>
              <Text style={styles.profileLocation}>{userData?.cidade || 'Cidade não informada'}</Text>
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
              value={isGpsEnabled}
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
              value={isCameraEnabled}
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

      {/* Modern Toast Notification */}
      {toast.visible && (
        <Animated.View style={[styles.toast, styles[`toast_${toast.type}`], { opacity: toastOpacity }]}>
          <View style={styles.toastContent}>
            <Feather 
              name={toast.type === 'success' ? 'check-circle' : toast.type === 'error' ? 'alert-circle' : 'info'} 
              size={20} 
              color="white" 
              style={{ marginRight: 12 }}
            />
            <Text style={styles.toastMessage}>{toast.message}</Text>
          </View>
        </Animated.View>
      )}
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
  toast: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  toast_success: {
    backgroundColor: '#34C759',
  },
  toast_error: {
    backgroundColor: '#FF3B30',
  },
  toast_info: {
    backgroundColor: '#007AFF',
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toastMessage: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
});

export default ConfiguracaoScreen;

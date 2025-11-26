import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useCameraPermissions, PermissionStatus as CameraPermissionStatus } from 'expo-camera';
import Animated, { FadeIn, FadeOut, SlideInDown } from 'react-native-reanimated';

const PermissionsScreen = () => {
  const navigation = useNavigation<any>();
  
  // Hook para permissão de câmera
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  
  // State para permissão de localização
  const [locationPermission, setLocationPermission] = useState<Location.PermissionStatus | null>(null);

  // Verifica as permissões ao carregar a tela
  useEffect(() => {
    const checkPermissions = async () => {
      const locationStatus = await Location.getForegroundPermissionsAsync();
      setLocationPermission(locationStatus.status);

      // Se ambas já estiverem concedidas, navega para a tela principal
      if (locationStatus.status === 'granted' && cameraPermission?.status === 'granted') {
        navigation.replace('MainTabs');
      }
    };

    checkPermissions();
  }, [cameraPermission?.status]); // Re-executa se o status da câmera mudar

  const requestPermissions = async () => {
    // Solicita permissão de localização
    const locationResponse = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(locationResponse.status);

    // Solicita permissão de câmera
    const cameraResponse = await requestCameraPermission();

    // Se ambas forem concedidas, navega para o app
    if (locationResponse.status === 'granted' && cameraResponse.granted) {
      navigation.replace('MainTabs');
    }
  };

  const handleContinue = () => {
    if (locationPermission === 'granted' && cameraPermission?.status === 'granted') {
      navigation.replace('MainTabs');
    } else {
      // Abre as configurações do app para o usuário conceder manualmente
      Linking.openSettings();
    }
  };

  const handleSkip = () => {
    navigation.replace('MainTabs');
  };

  const allPermissionsGranted = locationPermission === 'granted' && cameraPermission?.status === 'granted';

  return (
    <LinearGradient colors={['#076653', '#0A4338']} style={styles.container}>
      <Animated.View style={styles.content} entering={SlideInDown.duration(800).delay(200)}>
        <View style={styles.header}>
          <Feather name="shield" size={48} color="#A4D65E" />
          <Text style={styles.title}>Quase lá! Precisamos de algumas permissões</Text>
          <Text style={styles.subtitle}>
            Para que você possa denunciar o lixo corretamente, precisamos de acesso à sua câmera e localização. Seus dados estão seguros conosco.
          </Text>
        </View>

        <View style={styles.permissionsList}>
          <PermissionItem
            icon="map-pin"
            name="Localização (GPS)"
            description="Para marcar o local exato da denúncia."
            status={locationPermission}
          />
          <PermissionItem
            icon="camera"
            name="Câmera"
            description="Para fotografar o lixo e anexar à denúncia."
            status={cameraPermission?.status ?? null}
          />
        </View>

        <View style={styles.footer}>
          {!allPermissionsGranted ? (
            <TouchableOpacity style={styles.primaryButton} onPress={requestPermissions}>
              <Text style={styles.primaryButtonText}>Permitir Acesso</Text>
            </TouchableOpacity>
          ) : (
            <Animated.View entering={FadeIn} exiting={FadeOut}>
              <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
                <Text style={styles.primaryButtonText}>Continuar</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
          <TouchableOpacity style={styles.secondaryButton} onPress={handleSkip}>
            <Text style={styles.secondaryButtonText}>Agora não</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </LinearGradient>
  );
};

interface PermissionItemProps {
  icon: keyof typeof Feather.glyphMap;
  name: string;
  description: string;
  status: Location.PermissionStatus | CameraPermissionStatus | null;
}

const PermissionItem = ({ icon, name, description, status }: PermissionItemProps) => {
  const getStatusInfo = () => {
    if (status === 'granted') {
      return { text: 'Permitido', color: '#A4D65E', icon: 'check-circle' as const };
    }
    if (status === 'denied') {
      return { text: 'Negado', color: '#FF6B6B', icon: 'x-circle' as const };
    }
    return { text: 'Pendente', color: '#FFD93D', icon: 'alert-circle' as const };
  };

  const statusInfo = getStatusInfo();

  return (
    <View style={styles.permissionItem}>
      <View style={[styles.iconContainer, { backgroundColor: `${statusInfo.color}20` }]}>
        <Feather name={icon} size={24} color={statusInfo.color} />
      </View>
      <View style={styles.permissionTextContainer}>
        <Text style={styles.permissionName}>{name}</Text>
        <Text style={styles.permissionDescription}>{description}</Text>
      </View>
      <View style={styles.statusContainer}>
        <Feather name={statusInfo.icon} size={18} color={statusInfo.color} />
        <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#FFFFFFCC',
    textAlign: 'center',
    lineHeight: 22,
  },
  permissionsList: {
    gap: 16,
    marginBottom: 32,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 16,
    borderRadius: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  permissionTextContainer: {
    flex: 1,
  },
  permissionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  permissionDescription: {
    fontSize: 13,
    color: '#FFFFFF99',
    marginTop: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#A4D65E',
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#115E4C',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FFFFFF99',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default PermissionsScreen;

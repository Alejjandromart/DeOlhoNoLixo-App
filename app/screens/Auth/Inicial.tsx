import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import CadastroScreen from './Cadastro';
import type { CadastroSheetRef } from './Cadastro';
import LoginScreen from './Login';
import type { LoginSheetRef } from './Login';
import EsqueciSenhaScreen from './EsqueciSenha';
import type { EsqueciSenhaSheetRef } from './EsqueciSenha';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Navigation Types
type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation?: HomeScreenNavigationProp;
}

const { width, height } = Dimensions.get('window');

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const cadastroRef = useRef<CadastroSheetRef>(null);
  const loginRef = useRef<LoginSheetRef>(null);
  const esqueciSenhaRef = useRef<EsqueciSenhaSheetRef>(null);

  const handleLoginPress = () => {
    loginRef.current?.abrir();
  };

  const handleRegisterPress = () => {
    cadastroRef.current?.abrir();
  };

  const handleEsqueciSenhaPress = () => {
    esqueciSenhaRef.current?.abrir();
  };

  return (
    <BottomSheetModalProvider>
      <View style={styles.safeArea}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        <ImageBackground
          source={require('../../assets/images/backgroundInicial.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          {/* Blur/Dark Overlay for better text readability */}
          <View style={styles.overlay} />
          
          <View style={styles.container}>
            {/* Logo Section - Top Third */}
            <View style={styles.logoSection}>
              <Image
                source={require('../../assets/images/LogoDeOlho.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Title and Slogan Section - Middle */}
            <View style={styles.titleSection}>
              
              <View style={styles.sloganContainer}>
                <Text style={styles.titlePrimary}>Você</Text>
                <Text style={styles.titleSecondary}>Faz a diferença!</Text>
              </View>
            </View>

            {/* Buttons Section - Bottom */}
            <View style={[styles.buttonSection, { marginBottom: insets.bottom + 24 }]}>
              <TouchableOpacity
                style={[styles.button, styles.loginButton]}
                onPress={handleLoginPress}
                activeOpacity={0.8}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.registerButton]}
                onPress={handleRegisterPress}
                activeOpacity={0.8}
              >
                <Text style={styles.registerButtonText}>Cadastrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* BottomSheets que sobem sobre a tela inicial */}
      <LoginScreen ref={loginRef} abrirCadastro={handleRegisterPress} abrirEsqueciSenha={handleEsqueciSenhaPress} />
      <CadastroScreen ref={cadastroRef} abrirLogin={handleLoginPress} />
      <EsqueciSenhaScreen ref={esqueciSenhaRef} voltarParaLogin={handleLoginPress} />
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 77, 46, 0.65)',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  
  // Logo Section
  logoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    width: width * 0.80,
    height: width * 0.80,
    maxWidth: 450,
    maxHeight: 450,
  },

  // Title Section
  titleSection: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
  titlePrimary: {
    fontSize: 46,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  titleSecondary: {
    fontSize: 36,
    fontWeight: '300',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 1,
    marginTop: -15,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4

  },
  sloganContainer: {
    marginTop: 24,
    alignItems: 'center',
  },

  // Button Section
  buttonSection: {
    paddingBottom: 16,
    gap: 16,
  },
  button: {
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  loginButton: {
    backgroundColor: '#A4D65E',
  },
  loginButtonText: {
    color: '#1a4d2e',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  registerButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default HomeScreen;
import React from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
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

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const handleRegisterPress = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
          <View style={styles.buttonSection}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 77, 46, 0.65)',
    backdropFilter: 'blur(1px)',
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
    marginTop: width * 0.40,
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
    paddingBottom: 40,
    gap: 16,
    marginBottom: 40,
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
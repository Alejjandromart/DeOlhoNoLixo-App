import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Image,
  TextInput,
  Dimensions,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from "../../../lib/supabase";
import * as Linking from 'expo-linking';


// --- INICIALIZAÇÃO DO WEB BROWSER ---
// Garante que o navegador da web feche após a autenticação

// --- Mock Data ---
const MOCK_VALID_USERNAMES = ['admin', 'user'];
const MOCK_CORRECT_PASSWORD = 'password123';

// --- Navigation Types ---
type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  // Adicione uma tela para onde o usuário vai após o login, ex: AppHome
  AppHome: { userInfo: { name: string; email: string; picture?: string } };
};

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation?: LoginScreenNavigationProp;
}

const { width, height } = Dimensions.get('window');

const LoginScreen: React.FC<LoginScreenProps> = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  // --- State Management (EXISTENTE) ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Movido para dentro do componente funcional

  // Focus and Error States (EXISTENTE)
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');




  // --- Handlers (EXISTENTES E MODIFICADOS) ---

  const validateEmailRealTime = (text: string) => {
    if (!text) {
      setEmailError('');
      return;
    }

    if (text.includes('@')) {
      if (!text.endsWith('@gmail.com')) {
        setEmailError('O domínio de e-mail deve ser @gmail.com');
      } else {
        setEmailError('');
      }
    } else {
      if (!MOCK_VALID_USERNAMES.includes(text)) {
        setEmailError('Usuário inexistente');
      } else {
        setEmailError('');
      }
    }
  };

  const isEmailValid = (text: string): boolean => {
      if (!text) return false;
      if (text.includes('@')) {
          return text.endsWith('@gmail.com');
      } else {
          return MOCK_VALID_USERNAMES.includes(text);
      }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) setEmailError('');
    if (passwordError) setPasswordError('');
    validateEmailRealTime(text);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) setPasswordError('');
  };

  const handleLoginPress = () => {
    setEmailError('');
    setPasswordError('');

    if (!isEmailValid(email)) {
      if (!email) {
          setEmailError('Campo obrigatório');
      } else {
        validateEmailRealTime(email);
      }
      return;
    }

    if (password !== MOCK_CORRECT_PASSWORD) {
      setPasswordError('Senha incorreta');
      return;
    }

    console.log('Login successful:', { email, password });
    navigation.navigate('AppHome', { userInfo: { name: email, email: '' } });
  };

  // --- MODIFICAÇÃO IMPORTANTE AQUI ---
  // A função que antes só dava console.log agora chama o promptAsync do Google
  const handleGoogleLoginPress = async () => {
  if (loading) return; // Previne cliques múltiplos
  setLoading(true); // Inicia o carregamento

  const redirectUrl = Linking.createURL('/');
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
    },
  });

  if (error) {
    Alert.alert('Erro', error.message);
    console.error('Erro no login com Google:', error);
  }

  setLoading(false); // Finaliza o carregamento (mesmo se der erro)
};

  const handleBackPress = () => navigation.goBack();
  const handleForgotPasswordPress = () => navigation.navigate('ForgotPassword');
  const handleRegisterPress = () => navigation.navigate('Register');
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // --- Renderização do Componente (Sem alterações na estrutura) ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Top Section */}
          <ImageBackground
            source={require('../../assets/images/backgroundInicial.png')}
            style={styles.topSection}
            resizeMode="cover"
          >
            <View style={styles.topOverlay} />
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress} activeOpacity={0.7}>
              <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <Image source={require('../../assets/images/LogoDeOlho.png')} style={styles.logo} resizeMode="contain" />
            </View>
          </ImageBackground>

          {/* Card Container */}
          <View style={styles.cardContainer}>
            <Text style={styles.welcomeTitle}>Bem-Vindo de Volta</Text>
            
            {/* Campos de Input e Erros */}
            {/* (Esta parte permanece a mesma) */}
            <View style={styles.inputSection}>
              <View style={[
                styles.inputContainer,
                emailFocused && styles.inputContainerFocused,
                !!emailError && styles.inputContainerError
              ]}>
                <Ionicons name="person-outline" size={22} color="#FFFFFF" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Usuario ou E-mail"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={email}
                  onChangeText={handleEmailChange}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
              <View style={[
                styles.inputContainer,
                passwordFocused && styles.inputContainerFocused,
                !!passwordError && styles.inputContainerError
              ]}>
                <Ionicons name="lock-closed-outline" size={22} color="#FFFFFF" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Senha"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={password}
                  onChangeText={handlePasswordChange}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon} activeOpacity={0.7}>
                  <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={22} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
              <TouchableOpacity onPress={handleForgotPasswordPress} activeOpacity={0.7} style={styles.forgotPasswordContainer}>
                <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress} activeOpacity={0.8}>
              <Text style={styles.loginButtonText}>Entrar</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Ou</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Button - Agora ele funciona! */}
            <TouchableOpacity 
              style={styles.googleButton} 
              onPress={handleGoogleLoginPress} 
              activeOpacity={0.8}
              disabled={loading} 
            >
                {loading ? (
                    <ActivityIndicator size="small" color="#115E4C" />
                ) : (
                    <Image source={require('../../assets/images/iconGoogle.png')} style={styles.googleIcon} resizeMode="contain" />
                )}
              
            </TouchableOpacity>

            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Ainda não tem conta? </Text>
              <TouchableOpacity onPress={handleRegisterPress} activeOpacity={0.7}>
                <Text style={styles.registerLink}>Cadastra-se</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// --- Estilos (sem alterações) ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#115E4C' },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  topSection: { width: '100%', height: height * 0.35, justifyContent: 'center', alignItems: 'center' },
  topOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(26, 77, 46, 0.5)' },
  backButton: { position: 'absolute', top: Platform.OS === 'android' ? StatusBar.currentHeight || 40 : 50, left: 20, width: 44, height: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 22, backgroundColor: 'rgba(0, 0, 0, 0.2)', zIndex: 10 },
  logoContainer: { justifyContent: 'center', alignItems: 'center' },
  logo: { width: width * 0.25, height: width * 0.25, maxWidth: 120, maxHeight: 120 },
  cardContainer: { flex: 1, backgroundColor: '#115E4C', borderTopLeftRadius: 40, borderTopRightRadius: 40, marginTop: -40, paddingHorizontal: 28, paddingTop: 40, paddingBottom: 30, minHeight: height * 0.65 },
  welcomeTitle: { fontSize: 28, fontWeight: '700', color: '#FFFFFF', textAlign: 'center', marginBottom: 24, letterSpacing: 0.5 },
  inputSection: { marginBottom: 16, gap: 4 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent', borderWidth: 2, borderColor: 'rgba(255, 255, 255, 0.4)', borderRadius: 28, paddingHorizontal: 18, height: 56, marginTop: 12 },
  inputContainerFocused: { borderColor: '#A4D65E' },
  inputContainerError: { borderColor: '#FF5A5F' }, 
  inputIcon: { marginRight: 12 },
  textInput: { flex: 1, color: '#FFFFFF', fontSize: 16, fontWeight: '500', paddingVertical: 0 },
  eyeIcon: { padding: 4, marginLeft: 8 },
  errorText: { color: '#FF5A5F', fontSize: 13, fontWeight: '500', paddingLeft: 20, marginTop: 6 },
  forgotPasswordContainer: { alignSelf: 'flex-end', marginTop: 12 },
  forgotPasswordText: { color: '#70E0C4', fontSize: 14, fontWeight: '600' },
  loginButton: { backgroundColor: '#A4D65E', borderRadius: 28, paddingVertical: 18, alignItems: 'center', justifyContent: 'center', marginTop: 24, marginBottom: 24, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  loginButtonText: { color: '#115E4C', fontSize: 18, fontWeight: '700', letterSpacing: 0.5 },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255, 255, 255, 0.3)' },
  dividerText: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 14, fontWeight: '500', marginHorizontal: 16 },
  googleButton: { backgroundColor: '#FFFFFF', borderRadius: 28, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 24, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 6 },
  googleIcon: { width: 28, height: 28 },
  registerContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  registerText: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 14, fontWeight: '500' },
  registerLink: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', textDecorationLine: 'underline' },
});

export default LoginScreen;
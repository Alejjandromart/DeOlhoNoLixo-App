import React, { useMemo, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import BotaoGoogle from '../../components/SocialButton';
import CustomInput from '../../components/CustomInputCadastro';

export interface LoginSheetRef {
  abrir: () => void;
  fechar: () => void;
}

// Mock Data
const MOCK_VALID_USERNAMES = ['admin', 'user'];
const MOCK_CORRECT_PASSWORD = 'password123';

interface DadosLogin {
  email: string;
  senha: string;
}

const LoginScreen = forwardRef<LoginSheetRef>((_, ref) => {
  const sheetRef = useRef<BottomSheetModal>(null);

  useImperativeHandle(ref, () => ({
    abrir: () => sheetRef.current?.present(),
    fechar: () => sheetRef.current?.dismiss(),
  }));

  const pontos = useMemo(() => ['70%'], []);
  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      backgroundColor="#005b4f"
      opacity={0.5}
    />
  );

  // Estado do formulário
  const [dados, setDados] = useState<DadosLogin>({
    email: '',
    senha: '',
  });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const atualizar = (campo: keyof DadosLogin, valor: string) => {
    setDados((prev) => ({ ...prev, [campo]: valor }));
    if (campo === 'email' && emailError) setEmailError('');
    if (campo === 'senha' && passwordError) setPasswordError('');
  };

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
    atualizar('email', text);
    validateEmailRealTime(text);
  };

  const handleLoginPress = () => {
    setEmailError('');
    setPasswordError('');

    if (!isEmailValid(dados.email)) {
      if (!dados.email) {
        setEmailError('Campo obrigatório');
      } else {
        validateEmailRealTime(dados.email);
      }
      return;
    }

    if (dados.senha !== MOCK_CORRECT_PASSWORD) {
      setPasswordError('Senha incorreta');
      return;
    }

    Alert.alert('Sucesso', 'Login realizado com sucesso!');
    sheetRef.current?.dismiss();
  };

  const handleGoogleLoginPress = async () => {
    if (carregando) return;
    setCarregando(true);
    // TODO: Implementar lógica de login com Google
    Alert.alert('Google', 'Integração Google aqui.');
    setCarregando(false);
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={pontos}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={false}
      keyboardBehavior="extend"
      android_keyboardInputMode="adjustResize"
      backgroundStyle={{ backgroundColor: 'transparent' }}
      handleIndicatorStyle={{ backgroundColor: '#FFFFFF80', width: 48 }}
    >
      <LinearGradient
        colors={['#076653', '#0E3B34']}
        style={styles.cartao}
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.botaoVoltar} onPress={() => sheetRef.current?.dismiss()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.titulo}>Login</Text>
          <View style={{ width: 40 }} />
        </View>

        <BottomSheetScrollView
          contentContainerStyle={styles.conteudo}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.boasVindas}>Bem-Vindo de Volta</Text>

          <CustomInput
            rotulo="Usuário ou E-mail"
            sugestao="Digite seu usuário ou email"
            valor={dados.email}
            aoAlterarTexto={handleEmailChange}
            nomeIcone="person-outline"
            tipoTeclado="email-address"
          />
          {emailError ? <Text style={styles.erro}>{emailError}</Text> : null}

          <CustomInput
            rotulo="Senha*"
            sugestao="Digite sua senha"
            valor={dados.senha}
            aoAlterarTexto={(t) => atualizar('senha', t)}
            nomeIcone="lock-closed-outline"
            entradaSegura
            mostrarToggleSenha
            senhaVisivel={mostrarSenha}
            aoAlternarSenha={() => setMostrarSenha((v) => !v)}
          />
          {passwordError ? <Text style={styles.erro}>{passwordError}</Text> : null}

          <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: 8 }}>
            <Text style={styles.esqueceuSenha}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLoginPress}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Entrar</Text>
          </TouchableOpacity>

          <View style={styles.divisor}>
            <View style={styles.linha} />
            <Text style={styles.divisorTexto}>Ou</Text>
            <View style={styles.linha} />
          </View>

          <BotaoGoogle 
            texto="Continuar com Google" 
            aoPressionar={handleGoogleLoginPress}
            carregando={carregando}
          />

          <TouchableOpacity style={{ alignItems: 'center', marginTop: 8 }} onPress={() => sheetRef.current?.dismiss()}>
            <Text style={styles.rodape}>
              Ainda não tem conta? <Text style={styles.link}>Cadastre-se</Text>
            </Text>
          </TouchableOpacity>
        </BottomSheetScrollView>
      </LinearGradient>
    </BottomSheetModal>
  );
});

export default LoginScreen;

const styles = StyleSheet.create({
  cartao: {
    flex: 1,
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 24,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 8,
    justifyContent: 'space-between',
  },
  botaoVoltar: { padding: 6 },
  titulo: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    flex: 1,
  },
  conteudo: {
    paddingHorizontal: 18,
    paddingBottom: 40,
    flexGrow: 1,
  },
  boasVindas: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 6,
  },
  erro: { 
    color: '#FFD6D6', 
    marginTop: -8, 
    marginBottom: 10, 
    fontSize: 12 
  },
  esqueceuSenha: { 
    color: '#70E0C4', 
    fontSize: 14, 
    fontWeight: '600' 
  },
  loginButton: { 
    backgroundColor: '#A4D65E', 
    borderRadius: 30, 
    paddingVertical: 18, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 24, 
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderColor: '#0E3B34',
  },
  loginButtonText: { 
    color: '#115E4C', 
    fontSize: 18, 
    fontWeight: '700', 
    letterSpacing: 0.5 
  },
  divisor: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 16 
  },
  linha: { 
    flex: 1, 
    height: 1, 
    backgroundColor: '#FFFFFF60' 
  },
  divisorTexto: { 
    color: '#FFFFFF', 
    marginHorizontal: 12, 
    fontWeight: '700',
    fontSize: 14,
  },
  rodape: { 
    color: '#FFFFFF', 
    fontSize: 14,
    fontWeight: '500',
  },
  link: { 
    textDecorationLine: 'underline', 
    fontWeight: '700',
    color: '#C8DEA1',
  },
});
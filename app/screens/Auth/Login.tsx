import React, { useRef, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomInput from '../../components/CustomInputCadastro';
import { useAuth } from '../../context/AuthContext';

export interface LoginSheetRef {
  abrir: () => void;
  fechar: () => void;
}

interface LoginScreenProps {
  abrirCadastro?: () => void;
  abrirEsqueciSenha?: () => void;
}

interface DadosLogin {
  email: string;
  senha: string;
}

const LoginScreen = forwardRef<LoginSheetRef, LoginScreenProps>(({ abrirCadastro, abrirEsqueciSenha }, ref) => {
  const navigation = useNavigation<any>();
  const { signIn } = useAuth();
  const [visivel, setVisivel] = useState(false);

  // Refs para os campos de input
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  useImperativeHandle(ref, () => ({
    abrir: () => setVisivel(true),
    fechar: () => setVisivel(false),
  }));

  // Estado do formulário
  const [dados, setDados] = useState<DadosLogin>({
    email: '',
    senha: '',
  });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const atualizar = useCallback((campo: keyof DadosLogin, valor: string) => {
    setDados((prev) => ({ ...prev, [campo]: valor }));
    // Limpar erros ao digitar
    if (campo === 'email') setEmailError('');
    if (campo === 'senha') setPasswordError('');
  }, []);

  // Função de login usando Firebase
  const handleSignIn = async () => {
    setEmailError('');
    setPasswordError('');

    // Validações básicas
    if (!dados.email.trim()) {
      setEmailError('Campo obrigatório');
      return;
    }

    if (!dados.senha.trim()) {
      setPasswordError('Campo obrigatório');
      return;
    }

    try {
      setCarregando(true);

      // Login com Firebase Auth
      const { error } = await signIn(dados.email, dados.senha);

      if (error) {
        // Tratar erros específicos do Firebase Auth
        const errorCode = error.code;
        if (errorCode === 'auth/invalid-email') {
          setEmailError('E-mail inválido');
        } else if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
          setEmailError('E-mail ou senha incorretos');
          setPasswordError('E-mail ou senha incorretos');
        } else if (errorCode === 'auth/too-many-requests') {
          Alert.alert('Erro', 'Muitas tentativas. Tente novamente mais tarde.');
        } else {
          Alert.alert('Erro', 'Falha ao fazer login. Verifique suas credenciais.');
          console.error(error);
        }
        setCarregando(false);
        return;
      }

      // Login bem-sucedido
      setVisivel(false);
      // navigation.navigate('Feed'); // Removido - AuthNavigator cuida disso automaticamente
    } catch (err: any) {
      console.error('Erro no login:', err);
      Alert.alert('Erro', 'Falha inesperada. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const handleLoginPress = handleSignIn;

  return (
    <Modal
      visible={visivel}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setVisivel(false)}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1, justifyContent: 'flex-end' }}
        >
          <LinearGradient
            colors={['#076653', '#0E3B34']}
            style={styles.cartao}
          >
            {/* Cabeçalho */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.botaoVoltar} onPress={() => setVisivel(false)}>
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.titulo}>Login</Text>
              <View style={{ width: 40 }} />
            </View>

            <ScrollView
              contentContainerStyle={styles.conteudo}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.boasVindas}>Bem-Vindo de Volta</Text>

              <CustomInput
                ref={emailInputRef}
                rotulo="E-mail"
                sugestao="Digite seu e-mail"
                valor={dados.email}
                aoAlterarTexto={(t) => atualizar('email', t)}
                nomeIcone="person-outline"
                tipoTeclado="email-address"
                erro={!!emailError}
                tipoRetorno="next"
                aoEnviar={() => passwordInputRef.current?.focus()}
              />
              {emailError ? <Text style={styles.erro}>{emailError}</Text> : null}

              <CustomInput
                ref={passwordInputRef}
                rotulo="Senha*"
                sugestao="Digite sua senha"
                valor={dados.senha}
                aoAlterarTexto={(t) => atualizar('senha', t)}
                nomeIcone="lock-closed-outline"
                entradaSegura
                mostrarToggleSenha
                senhaVisivel={mostrarSenha}
                aoAlternarSenha={() => setMostrarSenha((v) => !v)}
                erro={!!passwordError}
                tipoRetorno="done"
                aoEnviar={handleLoginPress}
              />
              {passwordError ? <Text style={styles.erro}>{passwordError}</Text> : null}

              <TouchableOpacity
                style={{ alignSelf: 'flex-end', marginTop: 8 }}
                onPress={() => {
                  setVisivel(false);
                  setTimeout(() => {
                    abrirEsqueciSenha?.();
                  }, 300);
                }}
              >
                <Text style={styles.esqueceuSenha}>Esqueceu a senha?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.loginButton,
                  carregando && styles.loginButtonDisabled
                ]}
                onPress={handleLoginPress}
                activeOpacity={0.8}
                disabled={carregando}
              >
                {carregando ? (
                  <ActivityIndicator color="#115E4C" />
                ) : (
                  <Text style={styles.loginButtonText}>Entrar</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={{ alignItems: 'center', marginTop: 8 }}
                onPress={() => {
                  setVisivel(false);
                  setTimeout(() => {
                    abrirCadastro?.();
                  }, 300);
                }}
              >
                <Text style={styles.rodape}>
                  Ainda não tem conta? <Text style={styles.link}>Cadastre-se</Text>
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </LinearGradient>
        </KeyboardAvoidingView>
      </View>
    </Modal>
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
  loginButtonDisabled: {
    opacity: 0.5,
  },
  loginButtonText: {
    color: '#115E4C',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5
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

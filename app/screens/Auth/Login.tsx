import React, { useRef, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
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
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const { signIn } = useAuth();
  const insets = useSafeAreaInsets();
  const [visivel, setVisivel] = useState(false);

  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  useImperativeHandle(ref, () => ({
    abrir: () => setVisivel(true),
    fechar: () => setVisivel(false),
  }));

  const [dados, setDados] = useState<DadosLogin>({ email: '', senha: '' });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const atualizar = useCallback((campo: keyof DadosLogin, valor: string) => {
    setDados((prev) => ({ ...prev, [campo]: valor }));
    if (campo === 'email') setEmailError('');
    if (campo === 'senha') setPasswordError('');
  }, []);

  const handleSignIn = async () => {
    setEmailError('');
    setPasswordError('');

    if (!dados.email.trim()) { setEmailError('Campo obrigatório'); return; }
    if (!dados.senha.trim()) { setPasswordError('Campo obrigatório'); return; }

    try {
      setCarregando(true);
      const { error } = await signIn(dados.email, dados.senha);

      if (error) {
        const errorCode = error.code;
        if (errorCode === 'auth/invalid-email') {
          setEmailError('E-mail inválido');
        } else if (
          errorCode === 'auth/user-not-found' ||
          errorCode === 'auth/wrong-password' ||
          errorCode === 'auth/invalid-credential'
        ) {
          setEmailError('E-mail ou senha incorretos');
          setPasswordError('E-mail ou senha incorretos');
        } else if (errorCode === 'auth/too-many-requests') {
          Alert.alert('Erro', 'Muitas tentativas. Tente novamente mais tarde.');
        } else {
          Alert.alert('Erro', 'Falha ao fazer login. Verifique suas credenciais.');
        }
        setCarregando(false);
        return;
      }

      setVisivel(false);
    } catch (err: any) {
      Alert.alert('Erro', 'Falha inesperada. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Modal
      visible={visivel}
      animationType="slide"
      transparent={false}
      statusBarTranslucent
      onRequestClose={() => setVisivel(false)}
    >
      <LinearGradient colors={['#076653', '#0a2e28']} style={styles.root}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity style={styles.botaoVoltar} onPress={() => setVisivel(false)}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.titulo}>Login</Text>
          <View style={{ width: 40 }} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={[styles.conteudo, { paddingBottom: insets.bottom + 32 }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Icon */}
            <View style={styles.iconSection}>
              <View style={styles.iconCircle}>
                <Ionicons name="person-outline" size={44} color="#A4D65E" />
              </View>
              <Text style={styles.boasVindas}>Bem-Vindo de Volta</Text>
              <Text style={styles.subtitulo}>Entre com sua conta para continuar</Text>
            </View>

            {/* Fields */}
            <View style={styles.fieldsSection}>
              <CustomInput
                ref={emailInputRef}
                rotulo="E-mail"
                sugestao="Digite seu e-mail"
                valor={dados.email}
                aoAlterarTexto={(t) => atualizar('email', t)}
                nomeIcone="mail-outline"
                tipoTeclado="email-address"
                erro={!!emailError}
                tipoRetorno="next"
                aoEnviar={() => passwordInputRef.current?.focus()}
              />
              {emailError ? <Text style={styles.erro}>{emailError}</Text> : null}

              <CustomInput
                ref={passwordInputRef}
                rotulo="Senha"
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
                aoEnviar={handleSignIn}
              />
              {passwordError ? <Text style={styles.erro}>{passwordError}</Text> : null}

              <TouchableOpacity
                style={styles.esqueciContainer}
                onPress={() => {
                  setVisivel(false);
                  setTimeout(() => abrirEsqueciSenha?.(), 300);
                }}
              >
                <Text style={styles.esqueceuSenha}>Esqueceu a senha?</Text>
              </TouchableOpacity>
            </View>

            {/* Actions */}
            <View style={styles.actionsSection}>
              <TouchableOpacity
                style={[styles.loginButton, carregando && styles.buttonDisabled]}
                onPress={handleSignIn}
                activeOpacity={0.85}
                disabled={carregando}
              >
                {carregando ? (
                  <ActivityIndicator color="#115E4C" />
                ) : (
                  <Text style={styles.loginButtonText}>Entrar</Text>
                )}
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>ou</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={styles.cadastroButton}
                onPress={() => {
                  setVisivel(false);
                  setTimeout(() => abrirCadastro?.(), 300);
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.cadastroButtonText}>Criar uma conta</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </Modal>
  );
});

export default LoginScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    justifyContent: 'space-between',
  },
  botaoVoltar: { padding: 8 },
  titulo: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    flex: 1,
  },
  conteudo: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  iconSection: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 36,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(164, 214, 94, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(164, 214, 94, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  boasVindas: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
  fieldsSection: {
    gap: 2,
  },
  erro: {
    color: '#FFB3B3',
    marginTop: -4,
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 12,
  },
  esqueciContainer: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginBottom: 4,
    padding: 4,
  },
  esqueceuSenha: {
    color: '#70E0C4',
    fontSize: 14,
    fontWeight: '600',
  },
  actionsSection: {
    marginTop: 28,
    gap: 16,
  },
  loginButton: {
    backgroundColor: '#A4D65E',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: { opacity: 0.5 },
  loginButtonText: {
    color: '#0a2e28',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  dividerText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
  },
  cadastroButton: {
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  cadastroButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});

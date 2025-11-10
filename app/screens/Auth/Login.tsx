import React, { useMemo, useRef, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
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
import { supabase } from '../../lib/supabase';
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
  const sheetRef = useRef<BottomSheetModal>(null);
  
  // Refs para os campos de input
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

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

  const atualizar = useCallback((campo: keyof DadosLogin, valor: string) => {
    setDados((prev) => ({ ...prev, [campo]: valor }));
    // Limpar erros ao digitar
    if (campo === 'email') setEmailError('');
    if (campo === 'senha') setPasswordError('');
  }, []);

  // Função de login usando Supabase
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

      let emailParaLogin = dados.email;

      // Verificar se o input é um email ou username
      const isEmail = dados.email.includes('@');

      // Se não for email, buscar o email pelo username na tabela users
      if (!isEmail) {
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('email')
          .eq('user_name', dados.email)
          .single();

        if (profileError || !profileData) {
          setEmailError('Usuário não encontrado');
          setCarregando(false);
          return;
        }

        emailParaLogin = profileData.email;
      }

      // Login com Supabase Auth usando o email
      // Isso verifica automaticamente se o email existe e se a senha está correta
      const { error } = await signIn(emailParaLogin, dados.senha);

      if (error) {
        // Tratar erros específicos do Supabase Auth
        if (error.message.includes('Invalid login credentials')) {
          // Senha incorreta ou email não existe
          if (isEmail) {
            setEmailError('E-mail ou senha incorretos');
            setPasswordError('E-mail ou senha incorretos');
          } else {
            setPasswordError('Senha incorreta');
          }
        } else if (error.message.includes('Email not confirmed')) {
          setEmailError('Confirme seu e-mail antes de fazer login');
          Alert.alert('E-mail não confirmado', 'Por favor, confirme seu e-mail antes de fazer login.');
        } else if (error.message.includes('User not found')) {
          setEmailError('Usuário não encontrado');
        } else {
          // Erro genérico
          Alert.alert('Erro', error.message);
        }
        setCarregando(false);
        return;
      }

      // Login bem-sucedido
      sheetRef.current?.dismiss();
      navigation.navigate('Home');
    } catch (err: any) {
      console.error('Erro no login:', err);
      Alert.alert('Erro', 'Falha inesperada. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const handleLoginPress = handleSignIn;

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
            ref={emailInputRef}
            rotulo="Usuário ou E-mail"
            sugestao="Digite seu usuário ou email"
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
              sheetRef.current?.dismiss();
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

          <TouchableOpacity 
            style={{ alignItems: 'center', marginTop: 8 }} 
            onPress={() => {
              sheetRef.current?.dismiss();
              setTimeout(() => {
                abrirCadastro?.();
              }, 300);
            }}
          >
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
  loginButtonDisabled: {
    opacity: 0.5,
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
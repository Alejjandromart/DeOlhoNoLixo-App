import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
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

export interface EsqueciSenhaSheetRef {
  abrir: () => void;
  fechar: () => void;
}

interface EsqueciSenhaScreenProps {
  voltarParaLogin?: () => void;
}

const EsqueciSenhaScreen = forwardRef<EsqueciSenhaSheetRef, EsqueciSenhaScreenProps>(
  ({ voltarParaLogin }, ref) => {
    const { resetPassword } = useAuth();
    const insets = useSafeAreaInsets();
    const [visivel, setVisivel] = useState(false);

    const emailInputRef = useRef<TextInput>(null);

    useImperativeHandle(ref, () => ({
      abrir: () => setVisivel(true),
      fechar: () => setVisivel(false),
    }));

    const [email, setEmail] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [emailError, setEmailError] = useState('');

    const handleResetPassword = async () => {
      setEmailError('');

      if (!email.trim()) { setEmailError('Campo obrigatório'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError('E-mail inválido'); return; }

      try {
        setCarregando(true);
        const { error } = await resetPassword(email);
        if (error) throw error;

        Alert.alert(
          'E-mail Enviado!',
          'Enviamos um link de redefinição de senha. Verifique sua caixa de entrada.',
          [{
            text: 'OK',
            onPress: () => {
              setVisivel(false);
              setTimeout(() => {
                voltarParaLogin?.();
                setEmail('');
              }, 200);
            },
          }]
        );
      } catch (err: any) {
        if (err.code === 'auth/user-not-found') {
          setEmailError('E-mail não encontrado');
        } else if (err.code === 'auth/invalid-email') {
          setEmailError('E-mail inválido');
        } else {
          Alert.alert('Erro', 'Falha inesperada. Tente novamente.');
        }
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
        onRequestClose={() => { if (!carregando) setVisivel(false); }}
      >
        <LinearGradient colors={['#076653', '#0a2e28']} style={styles.root}>
          <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

          {/* Header */}
          <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
            <TouchableOpacity
              style={styles.botaoVoltar}
              onPress={() => setVisivel(false)}
              disabled={carregando}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.titulo}>Redefinir Senha</Text>
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
              <View style={styles.iconSection}>
                <View style={styles.iconCircle}>
                  <Ionicons name="lock-open-outline" size={48} color="#A4D65E" />
                </View>
                <Text style={styles.titulo2}>Esqueceu sua senha?</Text>
                <Text style={styles.descricao}>
                  Digite o e-mail da sua conta e enviaremos um link para você criar uma nova senha.
                </Text>
              </View>

              <CustomInput
                ref={emailInputRef}
                rotulo="E-mail"
                sugestao="Digite seu e-mail"
                valor={email}
                aoAlterarTexto={(t) => { setEmail(t); if (emailError) setEmailError(''); }}
                nomeIcone="mail-outline"
                tipoTeclado="email-address"
                erro={!!emailError}
                tipoRetorno="done"
                aoEnviar={handleResetPassword}
              />
              {emailError ? <Text style={styles.erro}>{emailError}</Text> : null}

              <View style={styles.actionsSection}>
                <TouchableOpacity
                  style={[styles.enviarButton, carregando && styles.buttonDisabled]}
                  onPress={handleResetPassword}
                  activeOpacity={0.85}
                  disabled={carregando}
                >
                  {carregando ? (
                    <ActivityIndicator color="#0a2e28" />
                  ) : (
                    <Text style={styles.enviarButtonText}>Enviar Link</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.voltarButton}
                  onPress={() => {
                    setVisivel(false);
                    setTimeout(() => voltarParaLogin?.(), 300);
                  }}
                  disabled={carregando}
                >
                  <Text style={styles.voltarButtonText}>Voltar para o Login</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </LinearGradient>
      </Modal>
    );
  }
);

export default EsqueciSenhaScreen;

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
    paddingTop: 16,
  },
  iconSection: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 36,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(164, 214, 94, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(164, 214, 94, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  titulo2: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  descricao: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  erro: {
    color: '#FFB3B3',
    marginTop: -4,
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 12,
  },
  actionsSection: {
    marginTop: 28,
    gap: 16,
  },
  enviarButton: {
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
  enviarButtonText: {
    color: '#0a2e28',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  voltarButton: {
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  voltarButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});

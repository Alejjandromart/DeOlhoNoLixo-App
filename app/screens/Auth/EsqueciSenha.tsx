import React, { useMemo, useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import CustomInput from '../../components/CustomInputCadastro';
import CustomModal from '../../components/Shared/CustomModal';
import { auth } from '../../lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export interface EsqueciSenhaSheetRef {
  abrir: () => void;
  fechar: () => void;
}

interface EsqueciSenhaScreenProps {
  voltarParaLogin?: () => void;
}

const EsqueciSenhaScreen = forwardRef<EsqueciSenhaSheetRef, EsqueciSenhaScreenProps>(
  ({ voltarParaLogin }, ref) => {
    const sheetRef = useRef<BottomSheetModal>(null);
    const emailInputRef = useRef<TextInput>(null);

    useImperativeHandle(ref, () => ({
      abrir: () => sheetRef.current?.present(),
      fechar: () => sheetRef.current?.dismiss(),
    }));

    // Estado para controlar o tamanho do sheet baseado no teclado
    const [tecladoAtivo, setTecladoAtivo] = useState(false);
    const pontos = useMemo(() => [tecladoAtivo ? '95%' : '65%'], [tecladoAtivo]);

    // Listener do teclado
    useEffect(() => {
      const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
        setTecladoAtivo(true);
      });
      const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        setTecladoAtivo(false);
      });

      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, []);

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
    const [email, setEmail] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [emailEnviado, setEmailEnviado] = useState(false);
    const emailAccepted = /^[^\s@]+@gmail\.com$/i.test(email);

    // Estado do Modal
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalAction, setModalAction] = useState<(() => void) | null>(null);

    const showModal = (title: string, message: string, action: (() => void) | null = null) => {
      setModalTitle(title);
      setModalMessage(message);
      setModalAction(() => action);
      setModalVisible(true);
    };

    const handleModalClose = () => {
      setModalVisible(false);
      if (modalAction) {
        modalAction();
        setModalAction(null);
      }
    };

    const handleResetPassword = async () => {
      setEmailError('');

      // Validação básica
      if (!email.trim()) {
        setEmailError('Campo obrigatório');
        return;
      }

      // Validar formato de email e domínio @gmail.com somente
      const emailRegex = /^[^\s@]+@gmail\.com$/i;
      if (!emailRegex.test(email)) {
        setEmailError('E-mail inválido. Use um e-mail @gmail.com');
        return;
      }

      try {
        setCarregando(true);

        // Enviar email de redefinição de senha com Firebase
        await sendPasswordResetEmail(auth, email);

        // Sucesso
        setEmailEnviado(true);
        showModal(
          'E-mail Enviado!',
          'Enviamos um link de redefinição de senha para seu e-mail. Verifique sua caixa de entrada.',
          () => {
            sheetRef.current?.dismiss();
            setTimeout(() => {
              voltarParaLogin?.();
              // Resetar estado após fechar
              setEmail('');
              setEmailEnviado(false);
            }, 200);
          }
        );
      } catch (err: any) {
        console.error('Erro ao resetar senha:', err);
        if (err.code === 'auth/user-not-found') {
          setEmailError('E-mail não encontrado');
        } else if (err.code === 'auth/invalid-email') {
          setEmailError('E-mail inválido');
        } else if (err.code === 'auth/network-request-failed') {
          showModal('Sem Conexão', 'Verifique sua conexão com a internet e tente novamente.');
        } else {
          showModal('Erro', 'Falha inesperada. Tente novamente.');
        }
      } finally {
        setCarregando(false);
      }
    };

    return (
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={pontos}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={!carregando}
        keyboardBehavior="extend"
        android_keyboardInputMode="adjustResize"
        backgroundStyle={{ backgroundColor: 'transparent' }}
        handleIndicatorStyle={{ backgroundColor: '#FFFFFF80', width: 48 }}
      >
        <CustomModal
          visible={modalVisible}
          onClose={handleModalClose}
          title={modalTitle}
        >
          <Text style={{ fontSize: 16, color: '#333', lineHeight: 24 }}>
            {modalMessage}
          </Text>
          <TouchableOpacity
            style={{
              marginTop: 20,
              backgroundColor: '#076653',
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: 'center',
            }}
            onPress={handleModalClose}
          >
            <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>
              {modalAction ? 'OK' : 'Entendi'}
            </Text>
          </TouchableOpacity>
        </CustomModal>

        <LinearGradient colors={['#076653', '#0E3B34']} style={styles.cartao}>
          {/* Cabeçalho */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.botaoVoltar}
              onPress={() => sheetRef.current?.dismiss()}
              disabled={carregando}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.titulo}>Redefinir Senha</Text>
            <View style={{ width: 40 }} />
          </View>

          <BottomSheetScrollView
            contentContainerStyle={styles.conteudo}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo/Ícone */}
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <Ionicons name="lock-closed-outline" size={48} color="#A4D65E" />
              </View>
            </View>

            <Text style={styles.descricao}>
              Enviaremos um link seguro para que você crie uma nova senha imediatamente.
            </Text>

            <Text style={styles.aviso}>
              Não compartilhe este link de redefinição com ninguém.
            </Text>

            <CustomInput
              ref={emailInputRef}
              rotulo="Usuário ou E-mail"
              sugestao="Digite seu usuário ou email"
              valor={email}
              aoAlterarTexto={(t) => {
                setEmail(t);
                if (emailError) setEmailError('');
              }}
              nomeIcone="person-outline"
              tipoTeclado="email-address"
              erro={!!emailError}
              tipoRetorno="done"
              aoEnviar={handleResetPassword}
            />
            {emailError ? <Text style={styles.erro}>{emailError}</Text> : null}
            {!emailError && email.length > 0 ? (
              <Text style={[styles.inlineHint, emailAccepted ? styles.hintOk : styles.hintError]}>
                {emailAccepted ? 'E-mail aceito.' : 'Use um e-mail @gmail.com.'}
              </Text>
            ) : null}

            <TouchableOpacity
              style={[styles.enviarButton, carregando && styles.enviarButtonDisabled]}
              onPress={handleResetPassword}
              activeOpacity={0.8}
              disabled={carregando}
            >
              {carregando ? (
                <ActivityIndicator color="#115E4C" />
              ) : (
                <Text style={styles.enviarButtonText}>Enviar Link</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={{ alignItems: 'center', marginTop: 24, marginBottom: 32 }}
              onPress={() => {
                sheetRef.current?.dismiss();
                setTimeout(() => {
                  voltarParaLogin?.();
                }, 300);
              }}
              disabled={carregando}
            >
              <Text style={styles.rodape}>
                Lembrou a senha? <Text style={styles.link}>Fazer Login</Text>
              </Text>
            </TouchableOpacity>
          </BottomSheetScrollView>
        </LinearGradient>
      </BottomSheetModal>
    );
  }
);

export default EsqueciSenhaScreen;

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
  inlineHint: {
    fontSize: 12,
    marginTop: -6,
    marginBottom: 8,
    color: '#757575',
  },
  hintOk: { color: '#34C759' },
  hintError: { color: '#FF3B30' },
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
    paddingBottom: 60,
    flexGrow: 1,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(164, 214, 94, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#A4D65E',
  },
  descricao: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 20,
  },
  aviso: {
    fontSize: 13,
    fontWeight: '400',
    color: '#FFD6A5',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 18,
    marginTop: -10,
  },
  erro: {
    color: '#FFD6D6',
    marginTop: -8,
    marginBottom: 10,
    fontSize: 12,
  },
  enviarButton: {
    backgroundColor: '#A4D65E',
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderColor: '#0E3B34',
  },
  enviarButtonDisabled: {
    opacity: 0.5,
  },
  enviarButtonText: {
    color: '#115E4C',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
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

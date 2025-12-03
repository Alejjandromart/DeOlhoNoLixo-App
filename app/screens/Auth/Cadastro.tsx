import React, { useMemo, useRef, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Feather } from '@expo/vector-icons';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import BotaoGoogle from '../../components/SocialButton';
import CustomInput from '../../components/CustomInputCadastro';
import CustomCheckbox from '../../components/CustomCheckbox'; // Importar o novo componente
import CustomModal from '../../components/Shared/CustomModal';
import type {
  DadosCadastro,
  ErrosValidacao,
  ResultadoValidacao,
  RespostaCadastro,
} from '../../_types/type';
import { useAuth } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export interface CadastroSheetRef {
  abrir: () => void;
  fechar: () => void;
}

interface CadastroScreenProps {
  abrirLogin?: () => void;
}

const CadastroScreen = forwardRef<CadastroSheetRef, CadastroScreenProps>(({ abrirLogin }, ref) => {
  const navigation = useNavigation<any>();
  const { signUp, signInWithGoogle } = useAuth();
  const sheetRef = useRef<BottomSheetModal>(null);

  // Refs para os campos de input
  const nomeCompletoInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const nomeUsuarioInputRef = useRef<TextInput>(null);
  const senhaInputRef = useRef<TextInput>(null);
  const confirmarSenhaInputRef = useRef<TextInput>(null);

  useImperativeHandle(ref, () => ({
    abrir: () => sheetRef.current?.present(),
    fechar: () => sheetRef.current?.dismiss(),
  }));

  const pontos = useMemo(() => ['95%'], []);
  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      opacity={0.5}
    />
  );

  // Estado do formulário
  const [dados, setDados] = useState<DadosCadastro>({
    nomeCompleto: '',
    email: '',
    nomeUsuario: '',
    senha: '',
    confirmarSenha: '',
    termosAceitos: false,
  });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState<ErrosValidacao>({});

  // Estado do Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const showModal = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  const atualizar = useCallback((campo: keyof DadosCadastro, valor: string | boolean) => {
    setDados((prev) => ({ ...prev, [campo]: valor } as DadosCadastro));
    // Limpar erro do campo ao digitar
    setErros((e) => ({ ...e, [campo]: undefined }));
  }, []);

  // Validações em tempo real para senha e email
  const senhaChecks = {
    length: dados.senha.length >= 8,
    upper: /[A-Z]/.test(dados.senha),
    lower: /[a-z]/.test(dados.senha),
    number: /\d/.test(dados.senha),
    special: /[!@#$%^&*]/.test(dados.senha),
  };
  const senhaAllValid = Object.values(senhaChecks).every(Boolean);
  const emailAccepted = /^[^\s@]+@gmail\.com$/i.test(dados.email);

  // Validação de email: somente domínios @gmail.com são permitidos
  const emailValido = (v: string) => /^[^\s@]+@gmail\.com$/i.test(v);

  // Validação de senha: mínimo 8 caracteres, ao menos 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial
  const senhaValida = (s: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(s);

  const validar = (d: DadosCadastro): ResultadoValidacao => {
    const e: ErrosValidacao = {};
    if (!d.nomeCompleto.trim()) e.nomeCompleto = 'Informe o nome completo.';
    if (!d.email.trim()) e.email = 'Informe o e-mail.';
    else if (!emailValido(d.email)) e.email = 'E-mail deve ser do domínio @gmail.com.';
    if (!d.nomeUsuario.trim() || d.nomeUsuario.length < 3) e.nomeUsuario = 'Mín. 3 caracteres.';
    if (!senhaValida(d.senha)) e.senha = 'Senha deve ter mín. 8 caracteres e incluir 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial.';
    if (d.confirmarSenha !== d.senha) e.confirmarSenha = 'As senhas não coincidem.';
    if (!d.termosAceitos) e.termos = 'Aceite os termos.';
    return { valido: Object.keys(e).length === 0, erros: e };
  };

  const resultado = useMemo(() => validar(dados), [dados]);

  // Função de cadastro usando Firebase
  const handleSignUp = async () => {
    const { valido, erros: e } = validar(dados);
    if (!valido) return setErros(e);

    try {
      setCarregando(true);

      // Definir flag ANTES do cadastro para evitar race condition com o AuthNavigator
      // O onAuthStateChanged dispara assim que o signUp ocorre, antes desta função continuar
      await AsyncStorage.setItem('@isFirstLogin', 'true');

      // Cadastrar usuário usando o contexto de autenticação
      // Nota: Firebase Auth cria o usuário apenas com email e senha.
      // Para salvar dados adicionais (nome, username), seria necessário usar Firestore ou updateProfile.
      const { user, error } = await signUp(dados.email, dados.senha);

      if (error) {
        // Se falhar, remove a flag
        await AsyncStorage.removeItem('@isFirstLogin');

        const errorCode = error.code;
        if (errorCode === 'auth/email-already-in-use') {
          showModal('Erro', 'Este e-mail já está em uso.');
        } else if (errorCode === 'auth/invalid-email') {
          showModal('Erro', 'E-mail inválido.');
        } else if (errorCode === 'auth/weak-password') {
          showModal('Erro', 'A senha é muito fraca.');
        } else if (errorCode === 'auth/network-request-failed') {
          showModal('Sem Conexão', 'Verifique sua conexão com a internet e tente novamente.');
        } else {
          showModal('Erro', 'Falha ao cadastrar. Tente novamente.');
          console.error(error);
        }
        return;
      }

      if (user) {
        // Salvar dados adicionais no Firestore
        try {
          await setDoc(doc(db, 'usuarios', user.uid), {
            nomeCompleto: dados.nomeCompleto,
            nomeUsuario: dados.nomeUsuario,
            email: dados.email,
            createdAt: new Date().toISOString(),
            photoURL: null,
            cidade: 'Itacoatiara',
          });
        } catch (firestoreError) {
          console.error('Erro ao salvar dados no Firestore:', firestoreError);
          // Não impedir o login, mas talvez avisar ou tentar novamente depois
        }
      }

      // Cadastro bem-sucedido
      console.log('✅ Cadastro bem-sucedido! Flag @isFirstLogin já definida.');
      sheetRef.current?.dismiss();
      // O AuthNavigator vai detectar e redirecionar para Tutorial
    } catch (err) {
      // Se der erro inesperado, remove a flag
      await AsyncStorage.removeItem('@isFirstLogin');
      showModal('Erro', 'Falha inesperada. Tente novamente.');
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  const onCadastrar = handleSignUp;

  const onGoogle = async () => {
    if (carregando) return;
    setCarregando(true);

    try {
      const { error } = await signInWithGoogle();

      if (error) {
        if (error.code === '7') { // DEVELOPER_ERROR
          showModal('Erro de Configuração', 'Verifique o webClientId no AuthContext.');
        } else if (error.code === '-5') { // SIGN_IN_CANCELLED
          console.log('Cadastro cancelado pelo usuário');
        } else {
          showModal('Erro', 'Falha ao cadastrar com Google. Tente novamente.');
          console.error(error);
        }
      } else {
        // Signup successful - AuthNavigator handles navigation
        console.log('✅ Cadastro com Google bem-sucedido!');
        sheetRef.current?.dismiss();
      }
    } catch (err) {
      console.error('Erro inesperado no Google Cadastro:', err);
      showModal('Erro', 'Ocorreu um erro inesperado.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={pontos}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={false}
      keyboardBehavior="interactive"
      android_keyboardInputMode="adjustResize"
      backgroundStyle={{ backgroundColor: 'transparent' }}
      handleIndicatorStyle={{ backgroundColor: '#FFFFFF80', width: 48 }}
      enableDynamicSizing={false}
    >
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
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
          onPress={() => setModalVisible(false)}
        >
          <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>
            Entendi
          </Text>
        </TouchableOpacity>
      </CustomModal>

      {/* Conteúdo do sheet com gradiente e cantos arredondados para parecer o card da imagem */}
      <LinearGradient
        colors={['#076653', '#0E3B34']}
        style={styles.cartao}
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.botaoVoltar} onPress={() => sheetRef.current?.dismiss()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.titulo}>Cadastro</Text>
          <View style={{ width: 40 }} />
        </View>

        <BottomSheetScrollView
          contentContainerStyle={styles.conteudo}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.boasVindas}>Bom ter você aqui</Text>

          <CustomInput
            ref={nomeCompletoInputRef}
            rotulo="Nome Completo"
            sugestao="Digite seu nome completo"
            valor={dados.nomeCompleto}
            aoAlterarTexto={(t) => atualizar('nomeCompleto', t)}
            nomeIcone="person-outline"
            capitalizacaoAutomatica="words"
            erro={!!erros.nomeCompleto}
            tipoRetorno="next"
            aoEnviar={() => emailInputRef.current?.focus()}
          />
          {erros.nomeCompleto ? <Text style={styles.erro}>{erros.nomeCompleto}</Text> : null}

          <CustomInput
            ref={emailInputRef}
            rotulo="Email*"
            sugestao="Digite seu email"
            valor={dados.email}
            aoAlterarTexto={(t) => atualizar('email', t)}
            nomeIcone="mail-outline"
            tipoTeclado="email-address"
            erro={!!erros.email}
            tipoRetorno="next"
            aoEnviar={() => nomeUsuarioInputRef.current?.focus()}
          />
          {erros.email ? <Text style={styles.erro}>{erros.email}</Text> : null}
          {!erros.email && dados.email.length > 0 ? (
            <Text style={[styles.inlineHint, emailAccepted ? styles.hintOk : styles.hintError]}>
              {emailAccepted ? 'E-mail aceito.' : 'Use um e-mail @gmail.com.'}
            </Text>
          ) : null}

          <CustomInput
            ref={nomeUsuarioInputRef}
            rotulo="Nome de Usuário"
            sugestao="Digite seu nome de usuário"
            valor={dados.nomeUsuario}
            aoAlterarTexto={(t) => atualizar('nomeUsuario', t)}
            nomeIcone="person-outline"
            erro={!!erros.nomeUsuario}
            tipoRetorno="next"
            aoEnviar={() => senhaInputRef.current?.focus()}
          />
          {erros.nomeUsuario ? <Text style={styles.erro}>{erros.nomeUsuario}</Text> : null}

          <CustomInput
            ref={senhaInputRef}
            rotulo="Senha*"
            sugestao="Digite sua senha"
            valor={dados.senha}
            aoAlterarTexto={(t) => atualizar('senha', t)}
            nomeIcone="lock-closed-outline"
            entradaSegura
            mostrarToggleSenha
            senhaVisivel={mostrarSenha}
            aoAlternarSenha={() => setMostrarSenha((v) => !v)}
            erro={!!erros.senha}
            tipoRetorno="next"
            aoEnviar={() => confirmarSenhaInputRef.current?.focus()}
          />
          {erros.senha ? <Text style={styles.erro}>{erros.senha}</Text> : null}

          <View style={styles.passwordChecklist}>
            <View style={styles.passwordRow}>
              <Feather name={senhaChecks.length ? 'check-circle' : 'circle'} size={16} color={senhaChecks.length ? '#34C759' : '#C7C7CC'} />
              <Text style={styles.passwordHint}>Mín. 8 caracteres</Text>
            </View>
            <View style={styles.passwordRow}>
              <Feather name={senhaChecks.upper ? 'check-circle' : 'circle'} size={16} color={senhaChecks.upper ? '#34C759' : '#C7C7CC'} />
              <Text style={styles.passwordHint}>Pelo menos 1 letra maiúscula</Text>
            </View>
            <View style={styles.passwordRow}>
              <Feather name={senhaChecks.lower ? 'check-circle' : 'circle'} size={16} color={senhaChecks.lower ? '#34C759' : '#C7C7CC'} />
              <Text style={styles.passwordHint}>Pelo menos 1 letra minúscula</Text>
            </View>
            <View style={styles.passwordRow}>
              <Feather name={senhaChecks.number ? 'check-circle' : 'circle'} size={16} color={senhaChecks.number ? '#34C759' : '#C7C7CC'} />
              <Text style={styles.passwordHint}>Pelo menos 1 número</Text>
            </View>
            <View style={styles.passwordRow}>
              <Feather name={senhaChecks.special ? 'check-circle' : 'circle'} size={16} color={senhaChecks.special ? '#34C759' : '#C7C7CC'} />
              <Text style={styles.passwordHint}>Pelo menos 1 caractere especial (!@#$%^&*)</Text>
            </View>
          </View>

          <CustomInput
            ref={confirmarSenhaInputRef}
            rotulo="Confirmar Senha*"
            sugestao="Digite novamente a senha"
            valor={dados.confirmarSenha}
            aoAlterarTexto={(t) => atualizar('confirmarSenha', t)}
            nomeIcone="lock-closed-outline"
            entradaSegura
            mostrarToggleSenha
            senhaVisivel={mostrarConfirmarSenha}
            aoAlternarSenha={() => setMostrarConfirmarSenha((v) => !v)}
            erro={!!erros.confirmarSenha}
            tipoRetorno="done"
            aoEnviar={onCadastrar}
          />
          {erros.confirmarSenha ? <Text style={styles.erro}>{erros.confirmarSenha}</Text> : null}

          <CustomCheckbox
            value={dados.termosAceitos}
            onValueChange={(v) => atualizar('termosAceitos', v)}
            labelComponent={
              <Text style={styles.termosTexto}>
                Eu concordo com os <Text style={styles.link}>Terms & Conditions</Text>
              </Text>
            }
          />
          {erros.termos ? <Text style={styles.erro}>{erros.termos}</Text> : null}

          <TouchableOpacity
            style={[
              styles.cadastrarButton,
              carregando && styles.cadastrarButtonDisabled
            ]}
            onPress={onCadastrar}
            activeOpacity={0.8}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#115E4C" />
            ) : (
              <Text style={styles.cadastrarButtonText}>Cadastrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divisor}>
            <View style={styles.linha} />
            <Text style={styles.divisorTexto}>Ou</Text>
            <View style={styles.linha} />
          </View>

          <BotaoGoogle texto="Continuar com Google" aoPressionar={onGoogle} />

          <TouchableOpacity
            style={{ alignItems: 'center', marginTop: 8 }}
            onPress={() => {
              sheetRef.current?.dismiss();
              setTimeout(() => {
                abrirLogin?.();
              }, 300);
            }}
          >
            <Text style={styles.rodape}>
              Já tem uma conta? <Text style={styles.link}>Fazer Login</Text>
            </Text>
          </TouchableOpacity>
        </BottomSheetScrollView>
      </LinearGradient>
    </BottomSheetModal>
  );
});

export default CadastroScreen;

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
    paddingBottom: 120,
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
  erro: { color: '#FFD6D6', marginTop: -8, marginBottom: 10, fontSize: 12 },
  linhaTermos: { flexDirection: 'row', alignItems: 'center', marginTop: 2, marginBottom: 10 },
  termosTexto: { color: '#FFFFFF', fontSize: 14, flex: 1 },
  link: {
    textDecorationLine: 'underline',
    fontWeight: '700',
    color: '#C8DEA1',
  },
  cadastrarButton: {
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
    borderWidth: 2,
    borderColor: '#0E3B34',
  },
  cadastrarButtonDisabled: {
    opacity: 0.5,
  },
  cadastrarButtonText: {
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
  inlineHint: {
    fontSize: 12,
    marginTop: -6,
    marginBottom: 8,
    color: '#757575',
  },
  hintOk: { color: '#34C759' },
  hintError: { color: '#FF3B30' },
  passwordChecklist: {
    marginTop: 8,
    marginBottom: 8,
    paddingLeft: 2,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  passwordHint: {
    marginLeft: 8,
    fontSize: 12,
    color: '#666',
  },
});
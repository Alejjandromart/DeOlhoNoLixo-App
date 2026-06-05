import React, { useMemo, useRef, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomInput from '../../components/CustomInputCadastro';
import CustomCheckbox from '../../components/CustomCheckbox';
import type {
  DadosCadastro,
  ErrosValidacao,
  ResultadoValidacao,
} from '../../_types/type';
import { useAuth } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';

export interface CadastroSheetRef {
  abrir: () => void;
  fechar: () => void;
}

interface CadastroScreenProps {
  abrirLogin?: () => void;
}

const CadastroScreen = forwardRef<CadastroSheetRef, CadastroScreenProps>(({ abrirLogin }, ref) => {
  const navigation = useNavigation<any>();
  const { signUp } = useAuth();
  const [visivel, setVisivel] = useState(false);

  // Refs para os campos de input
  const nomeCompletoInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const nomeUsuarioInputRef = useRef<TextInput>(null);
  const senhaInputRef = useRef<TextInput>(null);
  const confirmarSenhaInputRef = useRef<TextInput>(null);

  useImperativeHandle(ref, () => ({
    abrir: () => setVisivel(true),
    fechar: () => setVisivel(false),
  }));

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

  const atualizar = useCallback((campo: keyof DadosCadastro, valor: string | boolean) => {
    setDados((prev) => ({ ...prev, [campo]: valor } as DadosCadastro));
    // Limpar erro do campo ao digitar
    setErros((e) => ({ ...e, [campo]: undefined }));
  }, []);

  const emailValido = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const validar = (d: DadosCadastro): ResultadoValidacao => {
    const e: ErrosValidacao = {};
    if (!d.nomeCompleto.trim()) e.nomeCompleto = 'Informe o nome completo.';
    if (!emailValido(d.email)) e.email = 'E-mail inválido.';
    if (!d.nomeUsuario.trim() || d.nomeUsuario.length < 3) e.nomeUsuario = 'Mín. 3 caracteres.';
    if (d.senha.length < 6) e.senha = 'Mín. 6 caracteres.';
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
      const { error } = await signUp(dados.email, dados.senha);

      if (error) {
        // Se falhar, remove a flag
        await AsyncStorage.removeItem('@isFirstLogin');

        const errorCode = error.code;
        if (errorCode === 'auth/email-already-in-use') {
          Alert.alert('Erro', 'Este e-mail já está em uso.');
        } else if (errorCode === 'auth/invalid-email') {
          Alert.alert('Erro', 'E-mail inválido.');
        } else if (errorCode === 'auth/weak-password') {
          Alert.alert('Erro', 'A senha é muito fraca.');
        } else {
          Alert.alert('Erro', 'Falha ao cadastrar. Tente novamente.');
          console.error(error);
        }
        return;
      }

      // Cadastro bem-sucedido
      // Criar perfil no Firestore com os dados do formulário
      const currentUser = auth.currentUser;
      if (currentUser) {
        await setDoc(doc(db, 'users', currentUser.uid), {
          displayName: dados.nomeCompleto.trim(),
          email: dados.email,
          cidade: '',
          updatedAt: serverTimestamp(),
        });
        // Também atualiza Firebase Auth displayName
        await updateProfile(currentUser, { displayName: dados.nomeCompleto.trim() });
      }

      console.log('✅ Cadastro bem-sucedido! Flag @isFirstLogin já definida.');
      setVisivel(false);
      // O AuthNavigator vai detectar e redirecionar para Tutorial
    } catch (err) {
      // Se der erro inesperado, remove a flag
      await AsyncStorage.removeItem('@isFirstLogin');
      Alert.alert('Erro', 'Falha inesperada. Tente novamente.');
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  const onCadastrar = handleSignUp;

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
          {/* Conteúdo do sheet com gradiente e cantos arredondados para parecer o card da imagem */}
          <LinearGradient
            colors={['#076653', '#0E3B34']}
            style={styles.cartao}
          >
            {/* Cabeçalho */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.botaoVoltar} onPress={() => setVisivel(false)}>
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.titulo}>Cadastro</Text>
              <View style={{ width: 40 }} />
            </View>

            <ScrollView
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

              <TouchableOpacity
                style={{ alignItems: 'center', marginTop: 8 }}
                onPress={() => {
                  setVisivel(false);
                  setTimeout(() => {
                    abrirLogin?.();
                  }, 300);
                }}
              >
                <Text style={styles.rodape}>
                  Já tem uma conta? <Text style={styles.link}>Fazer Login</Text>
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </LinearGradient>
        </KeyboardAvoidingView>
      </View>
    </Modal>
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
  rodape: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
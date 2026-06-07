import React, { useMemo, useRef, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
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
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const { signUp } = useAuth();
  const insets = useSafeAreaInsets();
  const [visivel, setVisivel] = useState(false);

  const nomeCompletoInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const nomeUsuarioInputRef = useRef<TextInput>(null);
  const senhaInputRef = useRef<TextInput>(null);
  const confirmarSenhaInputRef = useRef<TextInput>(null);

  useImperativeHandle(ref, () => ({
    abrir: () => setVisivel(true),
    fechar: () => setVisivel(false),
  }));

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
    if (!d.termosAceitos) e.termos = 'Aceite os termos para continuar.';
    return { valido: Object.keys(e).length === 0, erros: e };
  };

  const handleSignUp = async () => {
    const { valido, erros: e } = validar(dados);
    if (!valido) return setErros(e);

    try {
      setCarregando(true);
      await AsyncStorage.setItem('@isFirstLogin', 'true');

      const { error } = await signUp(dados.email, dados.senha);

      if (error) {
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
        }
        return;
      }

      const currentUser = auth.currentUser;
      if (currentUser) {
        await setDoc(doc(db, 'users', currentUser.uid), {
          displayName: dados.nomeCompleto.trim(),
          email: dados.email,
          cidade: '',
          updatedAt: serverTimestamp(),
        });
        await updateProfile(currentUser, { displayName: dados.nomeCompleto.trim() });
      }

      setVisivel(false);
    } catch (err) {
      await AsyncStorage.removeItem('@isFirstLogin');
      Alert.alert('Erro', 'Falha inesperada. Tente novamente.');
      console.error(err);
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
          <Text style={styles.titulo}>Cadastro</Text>
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
            <Text style={styles.boasVindas}>Bom ter você aqui</Text>
            <Text style={styles.subtitulo}>Preencha os dados para criar sua conta</Text>

            <View style={styles.fieldsSection}>
              <CustomInput
                ref={nomeCompletoInputRef}
                rotulo="Nome Completo"
                sugestao="Seu nome completo"
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
                rotulo="E-mail"
                sugestao="seu@email.com"
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
                sugestao="@seu_usuario"
                valor={dados.nomeUsuario}
                aoAlterarTexto={(t) => atualizar('nomeUsuario', t)}
                nomeIcone="at-outline"
                erro={!!erros.nomeUsuario}
                tipoRetorno="next"
                aoEnviar={() => senhaInputRef.current?.focus()}
              />
              {erros.nomeUsuario ? <Text style={styles.erro}>{erros.nomeUsuario}</Text> : null}

              <View style={styles.senhasRow}>
                <View style={styles.senhaField}>
                  <CustomInput
                    ref={senhaInputRef}
                    rotulo="Senha"
                    sugestao="Mín. 6 caracteres"
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
                </View>
                <View style={styles.senhaField}>
                  <CustomInput
                    ref={confirmarSenhaInputRef}
                    rotulo="Confirmar Senha"
                    sugestao="Repita a senha"
                    valor={dados.confirmarSenha}
                    aoAlterarTexto={(t) => atualizar('confirmarSenha', t)}
                    nomeIcone="lock-closed-outline"
                    entradaSegura
                    mostrarToggleSenha
                    senhaVisivel={mostrarConfirmarSenha}
                    aoAlternarSenha={() => setMostrarConfirmarSenha((v) => !v)}
                    erro={!!erros.confirmarSenha}
                    tipoRetorno="done"
                    aoEnviar={handleSignUp}
                  />
                  {erros.confirmarSenha ? <Text style={styles.erro}>{erros.confirmarSenha}</Text> : null}
                </View>
              </View>

              <View style={styles.termosContainer}>
                <CustomCheckbox
                  value={dados.termosAceitos}
                  onValueChange={(v) => atualizar('termosAceitos', v)}
                  labelComponent={
                    <Text style={styles.termosTexto}>
                      Eu li e concordo com os <Text style={styles.link}>Termos e Condições</Text>
                    </Text>
                  }
                />
                {erros.termos ? <Text style={[styles.erro, { marginTop: 4 }]}>{erros.termos}</Text> : null}
              </View>
            </View>

            <View style={styles.actionsSection}>
              <TouchableOpacity
                style={[styles.cadastrarButton, carregando && styles.buttonDisabled]}
                onPress={handleSignUp}
                activeOpacity={0.85}
                disabled={carregando}
              >
                {carregando ? (
                  <ActivityIndicator color="#0a2e28" />
                ) : (
                  <Text style={styles.cadastrarButtonText}>Criar Conta</Text>
                )}
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>ou</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => {
                  setVisivel(false);
                  setTimeout(() => abrirLogin?.(), 300);
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.loginButtonText}>Já tenho uma conta</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </Modal>
  );
});

export default CadastroScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 4,
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
    paddingTop: 20,
  },
  boasVindas: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginBottom: 24,
  },
  fieldsSection: {
    gap: 2,
  },
  senhasRow: {
    flexDirection: 'row',
    gap: 12,
  },
  senhaField: {
    flex: 1,
  },
  termosContainer: {
    marginTop: 8,
    marginBottom: 4,
  },
  termosTexto: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    flex: 1,
  },
  link: {
    textDecorationLine: 'underline',
    fontWeight: '700',
    color: '#A4D65E',
  },
  erro: {
    color: '#FFB3B3',
    marginTop: -4,
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 11,
  },
  actionsSection: {
    marginTop: 24,
    gap: 16,
  },
  cadastrarButton: {
    backgroundColor: '#A4D65E',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#A4D65E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonDisabled: { opacity: 0.5 },
  cadastrarButtonText: {
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
  loginButton: {
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});

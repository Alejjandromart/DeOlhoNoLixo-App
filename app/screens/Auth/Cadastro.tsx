// app/screens/CadastroScreen.tsx
import React, { useMemo, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
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
import CustomCheckbox from '../../components/CustomCheckbox'; // Importar o novo componente
import type {
  DadosCadastro,
  ErrosValidacao,
  ResultadoValidacao,
  RespostaCadastro,
} from '../../_types/type';

export interface CadastroSheetRef {
  abrir: () => void;
  fechar: () => void;
}

// Simulação de serviço de cadastro (substitua pelo seu backend)
async function cadastrar(payload: DadosCadastro): Promise<RespostaCadastro> {
  await new Promise((r) => setTimeout(r, 900));
  return {
    sucesso: true,
    mensagem: 'Cadastro realizado!',
    usuario: {
      id: 'usr_1',
      nomeCompleto: payload.nomeCompleto,
      email: payload.email,
      nomeUsuario: payload.nomeUsuario,
      criadoEm: new Date().toISOString(),
    },
    token: 'fake.jwt',
  };
}

const CadastroScreen = forwardRef<CadastroSheetRef>((_, ref) => {
  const sheetRef = useRef<BottomSheetModal>(null);

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

  const atualizar = (campo: keyof DadosCadastro, valor: string | boolean) => {
    setDados((prev) => ({ ...prev, [campo]: valor } as DadosCadastro));
    if (erros[campo as keyof ErrosValidacao]) {
      setErros((e) => ({ ...e, [campo]: undefined }));
    }
  };

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

  const onCadastrar = async () => {
    const { valido, erros: e } = validar(dados);
    if (!valido) return setErros(e);

    try {
      setCarregando(true);
      const resp = await cadastrar(dados);
      if (resp.sucesso) {
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        sheetRef.current?.dismiss();
      } else {
        Alert.alert('Erro', resp.mensagem || 'Não foi possível cadastrar.');
      }
    } catch {
      Alert.alert('Erro', 'Falha inesperada. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const onGoogle = () => Alert.alert('Google', 'Integração Google aqui.');

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
        >
          <Text style={styles.boasVindas}>Bom ter você aqui</Text>

          <CustomInput
            rotulo="Nome Completo"
            sugestao="Digite seu nome completo"
            valor={dados.nomeCompleto}
            aoAlterarTexto={(t) => atualizar('nomeCompleto', t)}
            nomeIcone="person-outline"
            capitalizacaoAutomatica="words"
          />
          {erros.nomeCompleto ? <Text style={styles.erro}>{erros.nomeCompleto}</Text> : null}

          <CustomInput
            rotulo="Email*"
            sugestao="Digite seu email"
            valor={dados.email}
            aoAlterarTexto={(t) => atualizar('email', t)}
            nomeIcone="mail-outline"
            tipoTeclado="email-address"
          />
          {erros.email ? <Text style={styles.erro}>{erros.email}</Text> : null}

          <CustomInput
            rotulo="Nome de Usuário"
            sugestao="Digite seu nome de usuário"
            valor={dados.nomeUsuario}
            aoAlterarTexto={(t) => atualizar('nomeUsuario', t)}
            nomeIcone="person-outline"
          />
          {erros.nomeUsuario ? <Text style={styles.erro}>{erros.nomeUsuario}</Text> : null}

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
          {erros.senha ? <Text style={styles.erro}>{erros.senha}</Text> : null}

          <CustomInput
            rotulo="Confirmar Senha*"
            sugestao="Digite novamente a senha"
            valor={dados.confirmarSenha}
            aoAlterarTexto={(t) => atualizar('confirmarSenha', t)}
            nomeIcone="lock-closed-outline"
            entradaSegura
            mostrarToggleSenha
            senhaVisivel={mostrarConfirmarSenha}
            aoAlternarSenha={() => setMostrarConfirmarSenha((v) => !v)}
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

          <TouchableOpacity style={{ alignItems: 'center', marginTop: 8 }} onPress={() => sheetRef.current?.dismiss()}>
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
});
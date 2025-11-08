// app/components/CustomInput.tsx
import React, { useState, useCallback, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { InputProps } from '../_types/type';

const CustomInput = forwardRef<TextInput, InputProps>(({
  rotulo,
  sugestao,
  valor,
  aoAlterarTexto,
  nomeIcone,
  entradaSegura = false,
  mostrarToggleSenha = false,
  senhaVisivel = false,
  aoAlternarSenha,
  tipoTeclado = 'default',
  capitalizacaoAutomatica = 'none',
  erro = false,
  aoEnviar,
  tipoRetorno = 'next',
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const [localValue, setLocalValue] = useState(valor);
  const timerRef = useRef<any>(null);

  // Expor métodos do TextInput para o componente pai
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur(),
    clear: () => inputRef.current?.clear(),
    isFocused: () => inputRef.current?.isFocused() || false,
  } as TextInput));

  // Sincroniza valor externo com local apenas quando não está focado
  useEffect(() => {
    if (!isFocused) {
      setLocalValue(valor);
    }
  }, [valor, isFocused]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setLocalValue(valor);
  }, [valor]);
  
  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const handleChangeText = useCallback((text: string) => {
    // Atualiza imediatamente o valor local (não causa re-render do pai)
    setLocalValue(text);
    
    // Debounce ao chamar o callback do pai para evitar re-renders excessivos
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    timerRef.current = setTimeout(() => {
      aoAlterarTexto(text);
    }, 0);
  }, [aoAlterarTexto]);

  return (
    <View style={styles.container}>
      <Text style={styles.rotulo}>{rotulo}</Text>

      <View
        style={[
          styles.campo,
          isFocused && styles.campoFocado,
          erro && styles.campoErro,
        ]}
      >
        <Ionicons name={nomeIcone} size={20} color="#FFFFFF" style={styles.iconeEsq} />

        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={sugestao}
          placeholderTextColor="#FFFFFF80"
          value={localValue}
          onChangeText={handleChangeText}
          keyboardType={tipoTeclado}
          autoCapitalize={capitalizacaoAutomatica}
          secureTextEntry={entradaSegura && !senhaVisivel}
          selectionColor="#B0FFCB"
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCorrect={false}
          spellCheck={false}
          textContentType="none"
          underlineColorAndroid="transparent"
          importantForAutofill="no"
          maxLength={200}
          blurOnSubmit={false}
          returnKeyType={tipoRetorno}
          onSubmitEditing={aoEnviar}
        />

        {mostrarToggleSenha && (
          <TouchableOpacity onPress={aoAlternarSenha} style={styles.iconeDir}>
            <Ionicons
              name={senhaVisivel ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
});

CustomInput.displayName = 'CustomInput';

// ❗️ Removida a comparação excessiva que causava atraso na digitação
// Agora só evita re-renderizações óbvias e pesadas
const arePropsEqual = (prevProps: InputProps, nextProps: InputProps) => {
  return (
    prevProps.valor === nextProps.valor &&
    prevProps.senhaVisivel === nextProps.senhaVisivel &&
    prevProps.erro === nextProps.erro
  );
};

export default React.memo(CustomInput, arePropsEqual);

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  rotulo: { color: '#FFFFFF', fontSize: 14, fontWeight: '500', marginBottom: 8 },
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 25,
    borderWidth: 1.25,
    borderColor: '#FFFFFF',
    paddingHorizontal: 14,
    backgroundColor: 'transparent',
  },
  campoFocado: {
    borderColor: '#A4D65E',
    borderWidth: 2,
  },
  campoErro: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
  },
  iconeEsq: { marginRight: 10 },
  input: { flex: 1, color: '#FFFFFF', fontSize: 16, paddingVertical: 0 },
  iconeDir: { padding: 6, marginLeft: 6 },
});

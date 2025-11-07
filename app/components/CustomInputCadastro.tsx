// app/components/CustomInput.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { InputProps } from '../_types/type';

const CustomInput: React.FC<InputProps> = ({
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
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.rotulo}>{rotulo}</Text>

      <View style={[
        styles.campo,
        isFocused && styles.campoFocado
      ]}>
        <Ionicons name={nomeIcone} size={20} color="#FFFFFF" style={styles.iconeEsq} />

        <TextInput
          style={styles.input}
          placeholder={sugestao}
          placeholderTextColor="#FFFFFF80"
          value={valor}
          onChangeText={aoAlterarTexto}
          keyboardType={tipoTeclado}
          autoCapitalize={capitalizacaoAutomatica}
          secureTextEntry={entradaSegura && !senhaVisivel}
          selectionColor="#B0FFCB"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
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
};

export default CustomInput;

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
  iconeEsq: { marginRight: 10 },
  input: { flex: 1, color: '#FFFFFF', fontSize: 16, paddingVertical: 0 },
  iconeDir: { padding: 6, marginLeft: 6 },
});
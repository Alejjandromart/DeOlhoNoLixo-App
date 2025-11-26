// app/components/BotaoGoogle.tsx
import React from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
} from 'react-native';
import type { BotaoGoogleProps } from '../_types/type';

const BotaoGoogle: React.FC<BotaoGoogleProps> = ({
  aoPressionar,
  texto = 'Cadastrar com Google',
  desativado = false,
  carregando = false,
  largura = '100%',
  // aumentar a altura padrão para deixar o botão mais "grosso"
  altura = 56,
  raio = 999,
  fonteImagem,
}) => {
  const disabled = desativado || carregando;
  const logo = fonteImagem ?? require('../assets/images/iconGoogle.png');

  return (
    <TouchableOpacity
      onPress={aoPressionar}
      activeOpacity={0.9}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={texto}
      style={[
        styles.botao,
        {
          width: largura as number | `${number}%`,
          height: altura,
          borderRadius: raio,
          opacity: disabled ? 0.7 : 1,
        },
      ]}
    >
      {carregando ? (
        <ActivityIndicator color="#3c4043" />
      ) : (
        <View style={styles.conteudo}>
          <View style={styles.iconeWrap}>
            <Image source={logo} style={styles.icone} />
          </View>
          <Text style={styles.texto}>{texto}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default BotaoGoogle;

const styles = StyleSheet.create({
  botao: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DADCE0',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 12,
  },
  conteudo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconeWrap: {
    width: 22,
    height: 22,
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icone: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  texto: {
    color: '#3c4043',
    fontSize: 17,
    fontWeight: '700',
  },
});
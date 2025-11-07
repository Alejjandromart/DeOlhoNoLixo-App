// app/components/CustomButton.tsx
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, Platform } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { BotaoProps } from '../_types/type';

const CustomButton: React.FC<BotaoProps> = ({
  texto,
  aoPressionar,
  desativado = false,
  carregando = false,

  // Estilo
  variante = 'contorno',
  corTexto = '#FFFFFF',
  corFundo = '#FFFFFF',        // usado se variante = 'solido'
  corBorda = '#C8DEA1',        // verde-claro do contorno
  largura = '100%',
  altura = 56,
  raio = 999,                  // pill
}) => {
  const disabled = desativado || carregando;

  return (
    <Pressable
      onPress={aoPressionar}
      disabled={disabled}
      android_ripple={
        variante === 'contorno'
          ? { color: 'rgba(200,222,161,0.18)', radius: 280 }
          : { color: 'rgba(0,0,0,0.06)' }
      }
      style={({ pressed }) => [
        styles.base,
        { 
          width: largura as number | `${number}%`,
          height: altura, 
          borderRadius: raio 
        },
        variante === 'contorno' ? styles.contorno : styles.solido,
        variante === 'contorno'
          ? { borderColor: corBorda, backgroundColor: pressed ? 'rgba(255,255,255,0.06)' : 'transparent' }
          : { backgroundColor: corFundo, opacity: pressed ? 0.92 : 1 },
        disabled ? (variante === 'contorno' ? styles.desativadoContorno : styles.desativadoSolido) : undefined,
      ]}
    >

      {carregando ? (
        <ActivityIndicator color={corTexto} />
      ) : (
        <View style={styles.conteudo}>
          <Text
            style={[
              styles.texto,
              { color: corTexto },
              disabled && (variante === 'contorno' ? styles.textoDesativadoContorno : styles.textoDesativadoSolido),
            ]}
          >
            {texto}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
  },
  contorno: {
    borderWidth: 2,
  },
  solido: {
    // sombra leve opcional no preenchido
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  conteudo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  texto: {
    fontSize: 16,
    fontWeight: '700',
  },
  // Estados desativados
  desativadoContorno: {
    borderColor: '#C8DEA178',
  },
  desativadoSolido: {
    opacity: 0.6,
  },
  textoDesativadoContorno: {
    color: '#FFFFFFCC',
  },
  textoDesativadoSolido: {
    color: '#2d5f3d',
  },
});
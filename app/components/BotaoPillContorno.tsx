import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  texto: string;
  aoPressionar: () => void;
  desativado?: boolean;
};

const BotaoPillContorno: React.FC<Props> = ({ texto, aoPressionar, desativado }) => {
  return (
    <Pressable
      onPress={aoPressionar}
      disabled={desativado}
      android_ripple={{ color: 'rgba(200,222,161,0.18)', radius: 280 }}
      style={({ pressed }) => [
        styles.botao,
        { opacity: desativado ? 0.6 : 1, backgroundColor: pressed ? 'rgba(255,255,255,0.06)' : 'transparent' },
      ]}
    >
      <View style={styles.conteudo}>
        <Text style={styles.texto}>{texto}</Text>
        <View style={styles.iconeWrap}>
          <Ionicons name="chevron-forward" size={18} color="#C8DEA1" />
          <Ionicons name="chevron-forward" size={18} color="#C8DEA1" style={{ marginLeft: -6 }} />
        </View>
      </View>
    </Pressable>
  );
};

export default BotaoPillContorno;

const styles = StyleSheet.create({
  botao: {
    height: 56,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#C8DEA1',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    alignSelf: 'center',
    minWidth: 180,
  },
  conteudo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  texto: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginRight: 12,
  },
  iconeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
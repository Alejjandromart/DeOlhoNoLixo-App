import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface ExpandedUserInfoProps {
  usuario: {
    nome: string;
    avatar?: string;
  };
  tempoAtras: string;
}

export default function ExpandedUserInfo({ usuario, tempoAtras }: ExpandedUserInfoProps) {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        {usuario.avatar ? (
          <Image source={{ uri: usuario.avatar }} style={styles.avatarImage} />
        ) : (
          <Ionicons name="person" size={32} color="#666" />
        )}
      </View>
      <View style={styles.details}>
        <Text style={styles.userName}>{usuario.nome}</Text>
        <Text style={styles.time}>{tempoAtras}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  details: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
});

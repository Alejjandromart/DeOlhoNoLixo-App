import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import VideoTutorial from '../..//components/VideoTutorial';
import BotaoPillContorno from '../..//components/BotaoPillContorno';

const TutorialScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const onVoltar = () => navigation.goBack();
  const onPular = () => navigation.goBack(); // ajuste para navegar para a tela desejada

  return (
    <LinearGradient colors={['#145A49', '#0E3B34']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onVoltar} style={styles.backButton}>
              <View style={styles.backButtonBg}>
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            <Text style={styles.titulo}>Tutorial</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Vídeo */}
          <View style={styles.videoWrap}>
            <VideoTutorial
              iniciarTocando={false}
              
            />
          </View>

          {/* Botão Pular */}
          <View style={styles.footer}>
            <BotaoPillContorno texto="Pular" aoPressionar={onPular} />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default TutorialScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 36, // desce mais o header
    paddingBottom: 10,
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    marginLeft: 0,
    marginTop: 12, // desce mais o botão
  },
  backButtonBg: {
    backgroundColor: 'rgba(44, 141, 117, 0.95)', // mais visível
    borderRadius: 24,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
  },
  titulo: {
    flex: 1,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  videoWrap: {
    flex: 1,
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    marginTop: 0,
    marginBottom: 24, // sobe mais o botão de pular
    alignItems: 'center',
  },
});
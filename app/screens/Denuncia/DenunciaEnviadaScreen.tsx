import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

const DenunciaEnviadaScreen = () => {
  const navigation = useNavigation<any>();

  const handleGoToFeed = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs', params: { screen: 'Feed' } }],
    });
  };

  return (
    <LinearGradient colors={['#076653', '#0A4338']} style={styles.container}>
      <Animated.View style={styles.content} entering={ZoomIn.duration(600)}>
        <LottieView
          source={require('../../assets/lottie/success-animation.json')}
          autoPlay
          loop={false}
          style={styles.lottie}
        />
        <Animated.Text style={styles.title} entering={FadeIn.delay(300)}>Denúncia Enviada com Sucesso!</Animated.Text>
        <Animated.Text style={styles.subtitle} entering={FadeIn.delay(400)}>
          Agradecemos sua colaboração. Sua denúncia foi registrada no feed e encaminhada automaticamente por e-mail aos órgãos competentes.
        </Animated.Text>
        <Animated.View entering={FadeIn.delay(600)} style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleGoToFeed}>
            <Text style={styles.buttonText}>Ir para o Feed</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '90%',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  lottie: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFFCC',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#A4D65E',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#115E4C',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default DenunciaEnviadaScreen;

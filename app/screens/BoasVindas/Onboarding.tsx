import React, { useState } from "react";
import { Text, StyleSheet, View, Pressable, StatusBar, Dimensions} from "react-native"; 
import { Stack, router } from "expo-router";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {Gesture, GestureDetector, Directions} from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';


const { width: SCREEN_WIDTH } = Dimensions.get('window');

const icons: Record<string, React.ReactElement> = {
  city: <MaterialCommunityIcons name="city-variant-outline" size={220} color="#2394daff" />,
  map_marker_radius_outline: <MaterialCommunityIcons name="map-marker-radius-outline" size={220} color="#d97e16ff" />,
  progress_check: <MaterialCommunityIcons name="progress-check" size={220} color="#15e434ff" />,
}

const onboardSteps = [
  {
    icon:"city",
    title: "Sem Lixo na Sua Cidade",
    description: "O DeOlho NoLixo transforma sua observação em ação, mapeando e notificando descartes irregulares.",
  },
  {
    icon:"map_marker_radius_outline",
    title: "Denuncie em Segundos",
    description: "O poder está em suas mãos. Use a câmera e a localização para registrar o problema. Nós cuidamos do resto.",
  },
  {
    icon:"progress_check",
    title: "O Impacto na sua região",
    description: "Veja o Feed e acompanhe o progresso das denúncias da comunidade em tempo real.",
  }
]

export function Onboarding() {
  const [screenIndex, setScreenIndex] = useState(0);
  
  // Valor compartilhado para controlar a posição do carrossel
  const translateX = useSharedValue(0);

  // Estilo animado para o carrossel
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // Função para atualizar o índice da tela
  const updateScreenIndex = (index: number) => {
    setScreenIndex(index);
  };

  // Gesto de arrastar
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Atualiza a posição em tempo real enquanto arrasta
      translateX.value = event.translationX + screenIndex * -SCREEN_WIDTH;
    })
    .onEnd((event) => {
      // Decide se deve ir para a próxima tela, anterior ou voltar
      const { translationX, velocityX } = event;
      const threshold = SCREEN_WIDTH / 3; // Limite para decidir se muda de tela

      let newIndex = screenIndex;

      if (translationX > threshold || velocityX > 900) {
        // Arrastou para a direita ou velocidade alta para direita
        newIndex = Math.max(0, screenIndex - 1);
      } else if (translationX < -threshold || velocityX < -500) {
        // Arrastou para a esquerda ou velocidade alta para esquerda
        newIndex = Math.min(onboardSteps.length - 1, screenIndex + 1);
      }

      // Anima suavemente para a nova posição
      translateX.value = withSpring(newIndex * -SCREEN_WIDTH, {
        damping: 40,
        stiffness: 120,
      });

      // Atualiza o estado da tela
      runOnJS(updateScreenIndex)(newIndex);
    });

  const onContinue = () => {
    const isLastScreen = screenIndex === onboardSteps.length - 1;
    if(isLastScreen){
      endOnboarding()
    }else{
      const newIndex = screenIndex + 1;
      translateX.value = withSpring(newIndex * -SCREEN_WIDTH, {
        damping: 20,
        stiffness: 100,
      });
      setScreenIndex(newIndex);
    }
  };

  const endOnboarding = () => {
    setScreenIndex(0);
    // push('/'); para direcionar para a tela de boas vindas
    router.back();
  };

  return (  
    <GestureDetector gesture={panGesture}>
      <LinearGradient
        colors={['#0A3849', '#9BC938']}
        style={styles.page}
        start={{ x: 0.8, y: 0 }}
        end={{ x: 0.8, y: .8 }}
      >
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar barStyle="light-content" backgroundColor="#0A3849" />

        {/* Indicador de passos */}
        <View style={styles.stepIndicadorContainer}>
          {onboardSteps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.stepIndicador,
                {
                  backgroundColor: index === screenIndex ? '#e9bf18ff' : '#dbd1d1ff',
                  opacity: 0.9,
                },
              ]}
            />
          ))}
        </View>

        {/* Carrossel animado */}
        <Animated.View style={[styles.carousel, animatedStyle]}>
          {onboardSteps.map((step, index) => (
            <View key={index} style={styles.screen}>
              <View style={styles.image}>
                {icons[step.icon]}
              </View>
              
              <View>
                <Text style={styles.title}>{step.title}</Text>
                <Text style={styles.description}>{step.description}</Text>
              </View>
            </View>
          ))}
        </Animated.View>

        {/* Botões fixos */}
        <View style={styles.fixedButtonsRow}>
          <Text onPress={endOnboarding} style={styles.buttonText}>Pular</Text>
          <Pressable onPress={onContinue} style={styles.button}>
            <Text style={styles.buttonText}>Continua</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  page:{
    flex:1,
  },
  stepIndicadorContainer:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 60,
    marginTop: 50, 
    paddingHorizontal: 20,
  },
  stepIndicador:{
    width: 100,
    height: 5,
    backgroundColor: '#dbd1d1ff',
    borderRadius: 20,
    flex: 1,

  },
  carousel: {
    flexDirection: 'row',
    width: SCREEN_WIDTH * onboardSteps.length,
  },
  screen: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    
  },
  image:{
    alignSelf: 'center',
    marginBottom: 100,
    marginTop: 40,
  },
  
  title:{
    justifyContent: 'center',
    textAlign: 'center',
    color: '#fdfdfd',
    fontSize: 56,
    fontWeight: 'bold',
    marginTop: 15,
    lineHeight: 60,
    flexWrap: 'wrap',


  },
  description:{
    color: '#FFF',
    opacity: 0.95,
    textAlign: 'center',
    fontSize: 20,
    marginTop: 20,
    lineHeight: 25,
    fontFamily: "Inter"

  },
  buttonsRow:{
    marginTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,

  },
  fixedButtonsRow:{
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button:{
    backgroundColor: '#302e38',
    padding: 15,
    borderRadius: 50,
    opacity: 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    flex: 1,

  },
  buttonText:{
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  }

});


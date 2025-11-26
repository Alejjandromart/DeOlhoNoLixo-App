import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Animated, LayoutChangeEvent } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TabButton from './TabButton';
import CentralButton from './CentralButton';
import AnimatedSlider from './AnimatedSlider';
import { COLORS } from './colors';

const BottomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const currentRoute = state.routes[state.index].name;

  // Animações de escala para os botões
  const [scaleAnim] = useState(new Animated.Value(1));
  const [homeScale] = useState(new Animated.Value(1));
  const [profileScale] = useState(new Animated.Value(1));

  // Posições e dimensões dos botões
  const [feedLayout, setFeedLayout] = useState({ x: 0, width: 0 });
  const [profileLayout, setProfileLayout] = useState({ x: 0, width: 0 });

  // Posição do slider animado (0 = Feed, 1 = Perfil)
  const sliderPosition = useSharedValue(state.index);

  const isActive = (route: string) => currentRoute === route;

  // Atualiza a posição do slider quando a rota muda
  useEffect(() => {
    sliderPosition.value = withSpring(state.index, {
      damping: 20,
      stiffness: 120,
      mass: 0.5,
    });
  }, [state.index]);

  // Handlers de layout
  const handleFeedLayout = (event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    setFeedLayout({ x, width });
  };

  const handleProfileLayout = (event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    setProfileLayout({ x, width });
  };

  // Estilo animado para o slider
  const sliderAnimatedStyle = useAnimatedStyle(() => {
    const distance = profileLayout.x - feedLayout.x;
    return {
      transform: [{ translateX: sliderPosition.value * distance }],
    };
  });

  // Animação de feedback ao tocar
  const animateTab = (scaleValue: Animated.Value, route: string) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: state.routes.find(r => r.name === route)?.key || '',
      canPreventDefault: true,
    });

    if (!isActive(route) && !event.defaultPrevented) {
      navigation.navigate(route);
    }

    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCentralPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate('DenunciaIA');
    });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.innerContainer, { paddingBottom: Math.max(insets.bottom, 16) + 12 }]}>

        <AnimatedSlider
          animatedStyle={sliderAnimatedStyle}
          leftPosition={feedLayout.x + (feedLayout.width / 2) - 32}
          color={COLORS.primary}
        />

        <TabButton
          route="Feed"
          isActive={isActive('Feed')}
          icon="home"
          iconOutline="home-outline"
          label="Home"
          scaleAnim={homeScale}
          onPress={() => animateTab(homeScale, 'Feed')}
          onLayout={handleFeedLayout}
          colors={COLORS}
        />

        <CentralButton
          scaleAnim={scaleAnim}
          onPress={handleCentralPress}
          label="Denunciar"
          colors={COLORS}
        />

        <TabButton
          route="Configuracao"
          isActive={isActive('Configuracao')}
          icon="person"
          iconOutline="person-outline"
          label="Perfil"
          scaleAnim={profileScale}
          onPress={() => animateTab(profileScale, 'Configuracao')}
          onLayout={handleProfileLayout}
          colors={COLORS}
        />

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  innerContainer: {
    flexDirection: 'row',
    paddingTop: 12,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    position: 'relative',
  },
});

export default BottomTabBar;

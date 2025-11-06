import React, { useEffect } from 'react';
import { StyleSheet, ImageBackground } from 'react-native';
import { hideAsync } from 'expo-splash-screen';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/RootStack';
import { StackNavigationProp } from '@react-navigation/stack';

type Props = {
  onComplete?: (status: boolean) => void;
};

const SPLASH_DURATION = 2500;

export function Splash({ onComplete }: Props) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const timer = setTimeout(() => {
      hideAsync();
      onComplete?.(true);
      navigation.navigate('Onboarding');
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
    
  }, [navigation, onComplete]);

  return (
    <ImageBackground
      style={styles.container}
      source={require('../../assets/images/splash.png')}
      resizeMode="cover"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Splash;
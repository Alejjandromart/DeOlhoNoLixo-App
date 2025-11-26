import React, { useEffect } from 'react';
import { StyleSheet, ImageBackground } from 'react-native';
import { hideAsync } from 'expo-splash-screen';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/RootStack';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  onComplete?: (status: boolean) => void;
};

const SPLASH_DURATION = 2500;

export function Splash({ onComplete }: Props) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    console.log("Splash screen mounted");
    let timer: ReturnType<typeof setTimeout>;

    const checkFirstTime = async () => {
      timer = setTimeout(async () => {
        console.log("Splash timer finished");
        try {
          await hideAsync();
        } catch (e) {
          console.warn("Error hiding splash screen:", e);
        }
        
        try {
          const hasSeenOnboarding = await AsyncStorage.getItem('@hasSeenOnboarding');
          
          if (hasSeenOnboarding === 'true') {
            console.log("User has seen onboarding, navigating to Welcome");
            navigation.navigate('Welcome');
          } else {
            console.log("First time user, navigating to Onboarding");
            navigation.navigate('Onboarding');
          }
        } catch (error) {
          console.error('Error checking onboarding status:', error);
          navigation.navigate('Onboarding');
        }
        
        onComplete?.(true);
      }, SPLASH_DURATION);
    };
    
    checkFirstTime();

    return () => {
      console.log("Splash screen unmounting, clearing timer");
      if (timer) clearTimeout(timer);
    };
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
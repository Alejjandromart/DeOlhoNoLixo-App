import React from 'react';
import { StyleSheet } from 'react-native';
import Reanimated, { AnimatedStyle } from 'react-native-reanimated';
import { ViewStyle } from 'react-native';

interface AnimatedSliderProps {
  animatedStyle: AnimatedStyle<ViewStyle>;
  leftPosition: number;
  color: string;
}

const AnimatedSlider: React.FC<AnimatedSliderProps> = ({
  animatedStyle,
  leftPosition,
  color,
}) => {
  return (
    <Reanimated.View 
      style={[
        styles.slider,
        { backgroundColor: `${color}15`, left: leftPosition },
        animatedStyle,
      ]} 
    />
  );
};

const styles = StyleSheet.create({
  slider: {
    position: 'absolute',
    top: 12,
    width: 64,
    height: 64,
    borderRadius: 20,
    zIndex: 0,
  },
});

export default AnimatedSlider;

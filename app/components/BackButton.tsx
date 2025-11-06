import React from 'react';
import { TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BackButtonProps {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  color?: string;
  size?: number;
}

const BackButton: React.FC<BackButtonProps> = ({ onPress, style, color = '#000', size = 24 }) => {
  return (
    <TouchableOpacity onPress={onPress} style={style} activeOpacity={0.7}>
      <Ionicons name="chevron-back" size={size} color={color} />
    </TouchableOpacity>
  );
};

export default BackButton;

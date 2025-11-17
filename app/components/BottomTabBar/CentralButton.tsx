import React from 'react';
import { TouchableOpacity, Animated, View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface CentralButtonProps {
  scaleAnim: Animated.Value;
  onPress: () => void;
  label: string;
  colors: {
    primaryDark: string;
    background: string;
    textActive: string;
  };
}

const CentralButton: React.FC<CentralButtonProps> = ({
  scaleAnim,
  onPress,
  label,
  colors,
}) => {
  return (
    <TouchableOpacity
      style={styles.centralButtonContainer}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Animated.View style={[
        styles.centralButton,
        { transform: [{ scale: scaleAnim }] }
      ]}>
        <View style={[styles.centralButtonGradient, { 
          backgroundColor: colors.primaryDark,
          borderColor: colors.background,
        }]}>
          <Feather name="alert-circle" size={28} color="#FFFFFF" />
        </View>
      </Animated.View>
      <Text style={[styles.centralLabel, { color: colors.textActive }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  centralButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
    zIndex: 2,
  },
  centralButton: {
    marginBottom: 8,
  },
  centralButtonGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 4,
  },
  centralLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 4,
  },
});

export default CentralButton;

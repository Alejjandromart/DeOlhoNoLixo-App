import React from 'react';
import { TouchableOpacity, Animated, View, Text, StyleSheet, LayoutChangeEvent, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TabButtonProps {
  route: string;
  isActive: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  iconOutline: keyof typeof Ionicons.glyphMap;
  label: string;
  scaleAnim: Animated.Value;
  onPress: () => void;
  onLayout: (event: LayoutChangeEvent) => void;
  colors: {
    primary: string;
    inactive: string;
    textActive: string;
    textInactive: string;
  };
}

const TabButton: React.FC<TabButtonProps> = ({
  isActive,
  icon,
  iconOutline,
  label,
  scaleAnim,
  onPress,
  onLayout,
  colors,
}) => {
  const activeIconStyle: ViewStyle = isActive ? {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  } : {};

  return (
    <TouchableOpacity
      style={styles.tabButton}
      onLayout={onLayout}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Animated.View style={[
        styles.tabContent,
        { transform: [{ scale: scaleAnim }] }
      ]}>
        <View style={[styles.iconWrapper, activeIconStyle]}>
          <Ionicons
            name={isActive ? icon : iconOutline}
            size={24}
            color={isActive ? colors.primary : colors.inactive}
          />
        </View>
        <Text style={[
          styles.tabLabel,
          { color: isActive ? colors.textActive : colors.textInactive }
        ]}>
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    minWidth: 70,
  },
  iconWrapper: {
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default TabButton;


import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

interface CustomCheckboxProps {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
  labelComponent: React.ReactNode;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ value, onValueChange, labelComponent }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onValueChange(!value)} activeOpacity={0.7}>
      <View style={[styles.box, value && styles.boxChecked]}>
        {value && <MaterialIcons name="check" size={18} color="#0E3B34" />}
      </View>
      {labelComponent}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: 'transparent',
  },
  boxChecked: {
    backgroundColor: '#A4D65E',
    borderColor: '#A4D65E',
  },
});

export default CustomCheckbox;

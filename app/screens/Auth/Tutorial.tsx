
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import BackButton from '../../components/BackButton'; // Assuming BackButton is in components
import Colors from '../../constants/Colors'; // Assuming you have a Colors constant file

const { width } = Dimensions.get('window');

const TutorialScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <BackButton />
      
      <View style={styles.videoContainer}>
        {/* This is a placeholder for the video player */}
        <Text style={styles.videoPlaceholderText}>Video Player Placeholder</Text>
      </View>

      <TouchableOpacity style={styles.skipButton} onPress={() => navigation.goBack()}>
        <Text style={styles.skipButtonText}>Pular</Text>
        <MaterialIcons name="fast-forward" size={24} color={Colors.light.tint} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 50,
  },
  videoContainer: {
    width: width * 0.9,
    height: width * 0.9 * (9 / 16), // 16:9 aspect ratio
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 20,
  },
  videoPlaceholderText: {
    color: '#888',
    fontSize: 16,
  },
  skipButton: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  skipButtonText: {
    fontSize: 18,
    color: Colors.light.tint,
    marginRight: 5,
    fontWeight: 'bold',
  },
});

export default TutorialScreen;

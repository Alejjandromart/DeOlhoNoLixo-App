import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStack';

type ConfiguracaoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Configuracao'>;

const ConfiguracaoScreen = () => {
  const navigation = useNavigation<ConfiguracaoScreenNavigationProp>();
  const [gpsEnabled, setGpsEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Configuração</Text>

      <TouchableOpacity style={styles.profileSection} onPress={() => navigation.navigate('Profile')}>
        <LinearGradient
          colors={['#076653', '#0A4338']}
          style={styles.profileGradient}
        >
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }} // Placeholder
            style={styles.profileImage}
          />
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}>Luane Araujo</Text>
            <Text style={styles.profileLocation}>Itacoatiara</Text>
          </View>
          <Feather name="chevron-right" size={24} color="white" />
        </LinearGradient>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Modificação</Text>

      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('AlterarSenha')}>
          <View style={styles.optionLeft}>
            <View style={styles.iconContainer}>
                <Feather name="shield" size={24} color="#076653" />
            </View>
            <Text style={styles.optionText}>Alterar senha</Text>
          </View>
          <Feather name="chevron-right" size={24} color="#757575" />
        </TouchableOpacity>

        <View style={styles.option}>
            <View style={styles.optionLeft}>
                <View style={styles.iconContainer}>
                    <MaterialIcons name="location-pin" size={24} color="#076653" />
                </View>
                <Text style={styles.optionText}>GPS</Text>
            </View>
            <Switch
                trackColor={{ false: "#767577", true: "#076653" }}
                thumbColor={gpsEnabled ? "#f4f3f4" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => setGpsEnabled(previousState => !previousState)}
                value={gpsEnabled}
            />
        </View>

        <View style={styles.option}>
            <View style={styles.optionLeft}>
                <View style={styles.iconContainer}>
                    <Feather name="camera" size={24} color="#076653" />
                </View>
                <Text style={styles.optionText}>Câmera</Text>
            </View>
            <Switch
                trackColor={{ false: "#767577", true: "#076653" }}
                thumbColor={cameraEnabled ? "#f4f3f4" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => setCameraEnabled(previousState => !previousState)}
                value={cameraEnabled}
            />
        </View>
      </View>

      <TouchableOpacity style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Excluir Conta</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton}>
        <Feather name="log-out" size={22} color="white" style={styles.logoutIcon} />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileSection: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 30,
  },
  profileGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'white',
  },
  profileTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  profileName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileLocation: {
    color: 'white',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#757575',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  optionsContainer: {
    width: '100%',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    width: '100%',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#E0F2F1',
    borderRadius: 10,
    padding: 8,
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
  },
  deleteButton: {
    width: '100%',
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FF3B30',
    alignItems: 'center',
    marginTop: 20,
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    width: '100%',
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#E63946',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 15,
    position: 'absolute',
    bottom: 40,
    shadowColor: '#E63946',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ConfiguracaoScreen;

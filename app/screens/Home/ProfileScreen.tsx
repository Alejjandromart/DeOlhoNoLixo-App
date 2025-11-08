import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [usuario, setUsuario] = useState('Luane Araujo');
  const [email, setEmail] = useState('luane.araujo@example.com');
  const [cidade, setCidade] = useState('Itacoatiara');

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Feather name="arrow-left" size={26} color="#333" />
      </TouchableOpacity>

      <Text style={styles.header}>Perfil</Text>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Card com Gradiente e Foto */}
        <View style={styles.profileCardWrapper}>
          {/* Foto posicionada para ficar metade fora */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.cameraButton}>
              <Feather name="camera" size={18} color="white" />
            </TouchableOpacity>
          </View>
          
          {/* Card Verde */}
          <View style={styles.profileCard}>
            <LinearGradient
              colors={['#076653', '#0A4338']}
              style={styles.profileGradient}
            >
              <Text style={styles.profileName}>Luane Araujo</Text>
              <Text style={styles.profileLocation}>Itacoatiara</Text>
            </LinearGradient>
          </View>
        </View>
    
        {/* Formulário */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Usuário</Text>
          <View style={styles.inputContainer}>
            <Feather name="user" size={20} color="#076653" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nome de usuário"
              value={usuario}
              onChangeText={setUsuario}
              placeholderTextColor="#999"
            />
          </View>

          <Text style={styles.sectionTitle}>E-mail</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={20} color="#076653" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="seu.email@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor="#999"
            />
          </View>

          <Text style={styles.sectionTitle}>Cidade</Text>
          <View style={styles.inputContainer}>
            <Feather name="map-pin" size={20} color="#076653" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Sua cidade"
              value={cidade}
              onChangeText={setCidade}
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Salvar alterações</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E8E8',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'white',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 55,
    marginBottom: 20,
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileCardWrapper: {
    alignItems: 'center',
    marginBottom: 70,
  },
  imageContainer: {
    position: 'relative',
    zIndex: 2,
    marginBottom: -55,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: 'white',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#A4D65E',
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  profileCard: {
    width: '100%',
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  profileGradient: {
    alignItems: 'center',
    paddingTop: 65,
    paddingBottom: 25,
    paddingHorizontal: 20,
  },
  profileName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  profileLocation: {
    color: 'white',
    fontSize: 16,
    opacity: 0.95,
  },
  formContainer: {
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    marginTop: 5,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#A4D65E',
    borderRadius: 15,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#A4D65E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default ProfileScreen;

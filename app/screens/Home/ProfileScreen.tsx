import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Modal, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile, updateEmail } from 'firebase/auth';
import { db, storage, auth } from '../../lib/firebase';
import * as ImagePicker from 'expo-image-picker';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
}

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [cidade, setCidade] = useState('');
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // Evita que informações antigas sejam exibidas antes do carregamento inicial
  const [initialLoading, setInitialLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<ToastProps>({ message: '', type: 'success', visible: false });
  const toastOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user?.uid) {
          const docRef = doc(db, 'usuarios', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            // Dados existem no Firestore - usar eles
            const data = docSnap.data();
            setNomeCompleto(data.nomeCompleto || user.displayName || '');
            setNomeUsuario(data.nomeUsuario || '');
            setEmail(data.email || user.email || '');
            setCidade(data.cidade || '');
            setPhotoURL(data.photoURL || user.photoURL);
          } else {
            // Primeiro acesso - usar dados do Firebase Auth
            setNomeCompleto(user.displayName || '');
            setNomeUsuario(user.email?.split('@')[0] || '');
            setEmail(user.email || '');
            setCidade('Itacoatiara'); // Cidade padrão
            setPhotoURL(user.photoURL);
            
            // Criar documento inicial no Firestore
            await setDoc(docRef, {
              nomeCompleto: user.displayName || '',
              nomeUsuario: user.email?.split('@')[0] || '',
              email: user.email || '',
              cidade: 'Itacoatiara',
              photoURL: user.photoURL || null,
              criadoEm: new Date().toISOString()
            });
          }
        } else {
          // Se não houver usuário autenticado, resetar campos
          setNomeCompleto('');
          setNomeUsuario('');
          setEmail('');
          setCidade('');
          setPhotoURL(null);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        // Em caso de erro, ainda tenta usar dados do Auth
        if (user) {
          setNomeCompleto(user.displayName || '');
          setNomeUsuario(user.email?.split('@')[0] || '');
          setEmail(user.email || '');
          setPhotoURL(user.photoURL);
        }
      } finally {
        // Sempre desliga o carregamento inicial após a tentativa
        setInitialLoading(false);
      }
    };

    // Sinaliza que estamos iniciando o carregamento
    setInitialLoading(true);
    fetchUserData();
  }, [user]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showToast('Precisamos de acesso à galeria para trocar a foto.', 'error');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      handleImageUpload(result.assets[0].uri);
    }
  };

  const handleImageUpload = async (uri: string) => {
    if (!user) return;
    setUploading(true);
    try {
      // Convert URI to Blob using XMLHttpRequest (more reliable for local files on Android)
      const blob: Blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log('XHR Error:', e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });

      const filename = `profile_photos/${user.uid}_${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);

      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      setPhotoURL(downloadURL);
      
      // Atualizar Auth e Firestore imediatamente com a nova foto
      await updateProfile(user, { photoURL: downloadURL });
      await setDoc(doc(db, 'usuarios', user.uid), { photoURL: downloadURL }, { merge: true });
      
      showToast('Foto de perfil atualizada!', 'success');
    } catch (error) {
      console.error("Erro ao upload imagem:", error);
      showToast('Falha ao enviar a imagem.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, visible: true });
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true })
    ]).start(() => {
      setToast({ message: '', type: 'success', visible: false });
    });
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Atualizar ou Criar no Firestore (merge: true garante que não sobrescreva outros campos se criar agora)
      await setDoc(doc(db, 'usuarios', user.uid), {
        nomeCompleto,
        nomeUsuario,
        cidade,
        email: user.email // Garantir que o email esteja lá também
      }, { merge: true });

      // Atualizar Auth Profile (Display Name)
      if (nomeCompleto !== user.displayName) {
        await updateProfile(user, { displayName: nomeCompleto });
      }

      // Atualizar Email no Auth
      if (email !== user.email) {
        await updateEmail(user, email);
      }

      showToast('Perfil atualizado com sucesso!', 'success');
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      showToast('Falha ao atualizar perfil.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' }}>
        <ActivityIndicator size="large" color="#076653" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Feather name="arrow-left" size={26} color="#333" />
      </TouchableOpacity>

      <Text style={styles.header}>Editar Perfil</Text>

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
            {uploading ? (
              <View style={[styles.profileImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#ddd' }]}>
                <ActivityIndicator color="#076653" />
              </View>
            ) : (
              <Image
                source={photoURL ? { uri: photoURL } : require('../../assets/images/CAPI.jpeg')}
                style={styles.profileImage}
              />
            )}
            <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
              <Feather name="camera" size={18} color="white" />
            </TouchableOpacity>
          </View>
          
          {/* Card Verde */}
          <View style={styles.profileCard}>
            <LinearGradient
              colors={['#076653', '#0A4338']}
              style={styles.profileGradient}
            >
              <Text style={styles.profileName}>{nomeUsuario || 'Usuário'}</Text>
              <Text style={styles.profileLocation}>{cidade || 'Cidade não informada'}</Text>
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
              value={nomeUsuario}
              onChangeText={setNomeUsuario}
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
        <TouchableOpacity 
          style={[styles.saveButton, loading && { opacity: 0.7 }]} 
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveButtonText}>Salvar alterações</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Modern Toast Notification */}
      {toast.visible && (
        <Animated.View style={[styles.toast, styles[`toast_${toast.type}`], { opacity: toastOpacity }]}>
          <View style={styles.toastContent}>
            <Feather 
              name={toast.type === 'success' ? 'check-circle' : toast.type === 'error' ? 'alert-circle' : 'info'} 
              size={20} 
              color="white" 
              style={{ marginRight: 12 }}
            />
            <Text style={styles.toastMessage}>{toast.message}</Text>
          </View>
        </Animated.View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
    // borderWidth: 1,
    // borderColor: '#E0E0E0',
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
  toast: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  toast_success: {
    backgroundColor: '#34C759',
  },
  toast_error: {
    backgroundColor: '#FF3B30',
  },
  toast_info: {
    backgroundColor: '#007AFF',
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toastMessage: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
});

export default ProfileScreen;

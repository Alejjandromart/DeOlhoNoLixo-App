import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const AlterarSenhaScreen = () => {
  const navigation = useNavigation();
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [emailRecuperacao, setEmailRecuperacao] = useState('');

  const handleAlterarSenha = () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    if (novaSenha.length < 6) {
      Alert.alert('Erro', 'A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    // Aqui você implementaria a lógica de alterar senha
    Alert.alert('Sucesso', 'Senha alterada com sucesso!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  const handleEsqueciSenha = () => {
    setModalVisible(true);
  };

  const handleEnviarEmail = () => {
    if (!emailRecuperacao) {
      Alert.alert('Erro', 'Por favor, digite seu e-mail');
      return;
    }

    // Aqui você implementaria a lógica de enviar email de recuperação
    Alert.alert(
      'E-mail Enviado!', 
      `Um link de recuperação foi enviado para ${emailRecuperacao}`,
      [
        { 
          text: 'OK', 
          onPress: () => {
            setModalVisible(false);
            setEmailRecuperacao('');
          }
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Feather name="arrow-left" size={26} color="#333" />
      </TouchableOpacity>

      <Text style={styles.header}>Alterar Senha</Text>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.iconHeader}>
          <View style={styles.iconCircle}>
            <Feather name="lock" size={40} color="#076653" />
          </View>
          <Text style={styles.subtitle}>
            Digite sua senha atual e escolha uma nova senha
          </Text>
        </View>

        {/* Senha Atual */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Senha Atual</Text>
          <View style={styles.inputContainer}>
            <Feather name="lock" size={20} color="#076653" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha atual"
              value={senhaAtual}
              onChangeText={setSenhaAtual}
              secureTextEntry={!mostrarSenhaAtual}
              placeholderTextColor="#999"
            />
            <TouchableOpacity onPress={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}>
              <Feather 
                name={mostrarSenhaAtual ? "eye" : "eye-off"} 
                size={20} 
                color="#757575" 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleEsqueciSenha} style={styles.forgotButton}>
            <Text style={styles.forgotText}>Esqueceu sua senha?</Text>
          </TouchableOpacity>

          {/* Nova Senha */}
          <Text style={styles.label}>Nova Senha</Text>
          <View style={styles.inputContainer}>
            <Feather name="lock" size={20} color="#076653" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Digite sua nova senha"
              value={novaSenha}
              onChangeText={setNovaSenha}
              secureTextEntry={!mostrarNovaSenha}
              placeholderTextColor="#999"
            />
            <TouchableOpacity onPress={() => setMostrarNovaSenha(!mostrarNovaSenha)}>
              <Feather 
                name={mostrarNovaSenha ? "eye" : "eye-off"} 
                size={20} 
                color="#757575" 
              />
            </TouchableOpacity>
          </View>

          {/* Confirmar Nova Senha */}
          <Text style={styles.label}>Confirmar Nova Senha</Text>
          <View style={styles.inputContainer}>
            <Feather name="lock" size={20} color="#076653" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Digite novamente sua nova senha"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry={!mostrarConfirmarSenha}
              placeholderTextColor="#999"
            />
            <TouchableOpacity onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}>
              <Feather 
                name={mostrarConfirmarSenha ? "eye" : "eye-off"} 
                size={20} 
                color="#757575" 
              />
            </TouchableOpacity>
          </View>

          {/* Dicas de Segurança */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Dicas para uma senha segura:</Text>
            <View style={styles.tipRow}>
              <Feather name="check-circle" size={16} color="#076653" />
              <Text style={styles.tipText}>Pelo menos 6 caracteres</Text>
            </View>
            <View style={styles.tipRow}>
              <Feather name="check-circle" size={16} color="#076653" />
              <Text style={styles.tipText}>Use letras e números</Text>
            </View>
            <View style={styles.tipRow}>
              <Feather name="check-circle" size={16} color="#076653" />
              <Text style={styles.tipText}>Evite informações pessoais</Text>
            </View>
          </View>
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity style={styles.saveButton} onPress={handleAlterarSenha}>
          <Text style={styles.saveButtonText}>Alterar Senha</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal Esqueci Senha */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Feather name="x" size={24} color="#757575" />
            </TouchableOpacity>

            <View style={styles.modalIconCircle}>
              <Feather name="mail" size={36} color="#076653" />
            </View>

            <Text style={styles.modalTitle}>Esqueceu sua senha?</Text>
            <Text style={styles.modalSubtitle}>
              Digite seu e-mail e enviaremos um link para recuperar sua senha
            </Text>

            <View style={styles.modalInputContainer}>
              <Feather name="mail" size={20} color="#076653" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Digite seu e-mail"
                value={emailRecuperacao}
                onChangeText={setEmailRecuperacao}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
            </View>

            <TouchableOpacity style={styles.modalButton} onPress={handleEnviarEmail}>
              <Text style={styles.modalButtonText}>Enviar link de recuperação</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: 10,
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  iconHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    marginBottom: 20,
  },
  label: {
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
    marginBottom: 15,
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
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: -10,
  },
  forgotText: {
    color: '#076653',
    fontSize: 14,
    fontWeight: '600',
  },
  tipsContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E0F2F1',
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  tipText: {
    fontSize: 13,
    color: '#757575',
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: '#076653',
    borderRadius: 15,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#076653',
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
  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
    padding: 5,
  },
  modalIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 20,
  },
  modalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  modalButton: {
    backgroundColor: '#076653',
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#076653',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalCancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#757575',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default AlterarSenhaScreen;

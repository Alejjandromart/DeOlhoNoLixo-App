import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TextInput as RNTextInput, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useAuth } from '../../context/AuthContext';
import { useDenuncias } from '../../context/DenunciaContext';
import Header from './components/Header';
import ImagePickerComponent from './components/ImagePicker';
import LocationPicker from './components/LocationPicker';
import DescriptionInput from './components/DescriptionInput';
import TrashTypeSelector from './components/TrashTypeSelector';
import SubmitButton from './components/SubmitButton';
import CustomModal from '../../components/Shared/CustomModal';
import ConfirmModal from '../../components/Shared/ConfirmModal';
import InputModal from '../../components/Shared/InputModal';

interface ImagemSelecionada {
  uri: string;
  type: string;
  name: string;
}

interface LocalizacaoData {
  latitude: number;
  longitude: number;
  endereco: string;
}

export default function RealizarDenuncia() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const denunciaContext = useDenuncias();

  if (!denunciaContext) {
    console.error('DenunciaContext não está disponível');
  }

  // Estados
  const [imagens, setImagens] = useState<ImagemSelecionada[]>([]);
  const [localizacao, setLocalizacao] = useState<LocalizacaoData | null>(null);
  const [descricao, setDescricao] = useState('');
  const [tiposSelecionados, setTiposSelecionados] = useState<string[]>([]);
  const [tiposCustomizados, setTiposCustomizados] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [obtendoLocalizacao, setObtendoLocalizacao] = useState(false);
  const [showAddImageModal, setShowAddImageModal] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showAddTypeModal, setShowAddTypeModal] = useState(false);

  // Verificar se há alterações não salvas
  const temAlteracoes = () => {
    return imagens.length > 0 || localizacao !== null || descricao.trim() !== '' || tiposSelecionados.length > 0;
  };

  // Confirmar ao voltar se houver alterações
  const handleVoltar = () => {
    // use ConfirmModal instead of Alert
    if (temAlteracoes()) {
      setShowExitConfirm(true);
    } else {
      navigation.goBack();
    }
  };

  // Solicitar permissões ao montar o componente
  useEffect(() => {
    (async () => {
      // Permissão de câmera
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera para adicionar fotos.');
      }

      // Permissão de galeria
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (mediaStatus !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para adicionar fotos.');
      }

      // Permissão de localização
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      if (locationStatus !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à localização para registrar a denúncia.');
      }
    })();
  }, []);

  // Obter localização atual
  const obterLocalizacaoAtual = async () => {
    try {
      setObtendoLocalizacao(true);
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erro', 'Permissão de localização não concedida');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Obter endereço a partir das coordenadas
      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const enderecoFormatado = `${address.street || ''}, ${address.name || ''} - ${address.city || ''}, ${address.region || ''}`;

      setLocalizacao({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        endereco: enderecoFormatado,
      });

      Alert.alert('Sucesso', 'Localização obtida com sucesso!');
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      Alert.alert('Erro', 'Não foi possível obter a localização');
    } finally {
      setObtendoLocalizacao(false);
    }
  };

  // Adicionar imagem da câmera
  const tirarFoto = async () => {
    try {
      if (imagens.length >= 4) {
        Alert.alert('Limite atingido', 'Você pode adicionar no máximo 4 imagens');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const novaImagem: ImagemSelecionada = {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: `foto_${Date.now()}.jpg`,
        };
        setImagens([...imagens, novaImagem]);
      }
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
      Alert.alert('Erro', 'Não foi possível tirar a foto');
    }
  };

  // Adicionar imagem da galeria
  const selecionarDaGaleria = async () => {
    try {
      if (imagens.length >= 4) {
        Alert.alert('Limite atingido', 'Você pode adicionar no máximo 4 imagens');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 4 - imagens.length,
      });

      if (!result.canceled) {
        const novasImagens: ImagemSelecionada[] = result.assets.map((asset, index) => ({
          uri: asset.uri,
          type: 'image/jpeg',
          name: `imagem_${Date.now()}_${index}.jpg`,
        }));
        setImagens([...imagens, ...novasImagens].slice(0, 4));
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem');
    }
  };

  // Mostrar opções de adicionar imagem
  const mostrarOpcoesImagem = () => {
    setShowAddImageModal(true);
  };

  // Alternar seleção de tipo
  const toggleTipo = (tipo: string) => {
    if (tiposSelecionados.includes(tipo)) {
      setTiposSelecionados(tiposSelecionados.filter(t => t !== tipo));
    } else {
      setTiposSelecionados([...tiposSelecionados, tipo]);
    }
  };

  // Adicionar novo tipo customizado
  const adicionarTipoCustomizado = () => {
    setShowAddTypeModal(true);
  };

  // Validar formulário
  const validarFormulario = (): boolean => {
    if (imagens.length === 0) {
      Alert.alert('Atenção', 'Adicione pelo menos uma imagem da denúncia');
      return false;
    }

    if (!localizacao) {
      Alert.alert('Atenção', 'Adicione a localização da denúncia');
      return false;
    }

    if (!descricao.trim()) {
      Alert.alert('Atenção', 'Adicione uma descrição da denúncia');
      return false;
    }

    if (tiposSelecionados.length === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos um tipo de lixo');
      return false;
    }

    return true;
  };

  // Enviar denúncia
  const enviarDenuncia = async () => {
    if (!validarFormulario()) return;

    try {
      setCarregando(true);

      // Extrair nome do usuário do email
      const nomeUsuario = user?.email?.split('@')[0] || 'Usuário';
      const nomeFormatado = nomeUsuario.charAt(0).toUpperCase() + nomeUsuario.slice(1);

      // Adicionar denúncia ao contexto
      if (denunciaContext?.adicionarDenuncia) {
        denunciaContext.adicionarDenuncia({
          usuario: {
            nome: nomeFormatado,
            avatar: undefined,
          },
          localizacao: localizacao!.endereco,
          descricao: descricao.trim(),
          imagens: imagens.map(img => img.uri),
          latitude: localizacao!.latitude,
          longitude: localizacao!.longitude,
          tipos: tiposSelecionados,
          timestamp: new Date(),
        });
      } else {
        console.warn('Contexto de denúncias não disponível - denúncia não será adicionada ao feed');
      }

      // TODO: Quando tiver backend, descomentar o código abaixo
      /*
      // Criar FormData para enviar imagens
      const formData = new FormData();
      
      // Adicionar imagens
      imagens.forEach((imagem, index) => {
        formData.append('imagens', {
          uri: imagem.uri,
          type: imagem.type,
          name: imagem.name,
        } as any);
      });

      // Adicionar outros dados
      formData.append('descricao', descricao);
      formData.append('tipos', JSON.stringify(tiposSelecionados));
      formData.append('latitude', localizacao!.latitude.toString());
      formData.append('longitude', localizacao!.longitude.toString());
      formData.append('endereco', localizacao!.endereco);
      formData.append('usuarioId', user?.id || '');

      const API_URL = 'http://seu-servidor.com/api/denuncias';

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar denúncia');
      }

      const data = await response.json();
      */

      Alert.alert(
        'Sucesso!',
        'Sua denúncia foi enviada com sucesso e está sendo analisada.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );

      // Limpar formulário
      setImagens([]);
      setLocalizacao(null);
      setDescricao('');
      setTiposSelecionados([]);

    } catch (error) {
      console.error('Erro ao enviar denúncia:', error);
      Alert.alert('Erro', 'Não foi possível enviar a denúncia. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <LinearGradient
      colors={['#E8E8E8', '#C0C0C0']}
      style={styles.container}
    >
      <Header 
        titulo="Realizar Denúncia" 
        onVoltar={handleVoltar} 
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ImagePickerComponent
          imagens={imagens}
          onAdicionarImagem={mostrarOpcoesImagem}
          onRemoverImagem={(index) => {
            const novasImagens = imagens.filter((_, i) => i !== index);
            setImagens(novasImagens);
          }}
        />

        <LocationPicker
          localizacao={localizacao}
          obtendoLocalizacao={obtendoLocalizacao}
          onObterLocalizacao={obterLocalizacaoAtual}
        />

        <DescriptionInput
          descricao={descricao}
          onChangeText={setDescricao}
          placeholder="Lixo acumulado na rua Carlos Castelo há muito tempo e os órgãos responsáveis não fazem nada"
        />

        <TrashTypeSelector
          tiposSelecionados={tiposSelecionados}
          tiposCustomizados={tiposCustomizados}
          onToggleTipo={toggleTipo}
          onAdicionarTipo={adicionarTipoCustomizado}
        />

        <SubmitButton
          onPress={enviarDenuncia}
          loading={carregando}
          label="Enviar"
        />
      </ScrollView>

      {/* Modal: opções de adicionar imagem */}
      <CustomModal
        visible={showAddImageModal}
        onClose={() => setShowAddImageModal(false)}
        title="Adicionar Imagem"
      >
        <View style={{ gap: 12 }}>
          <TouchableOpacity
            style={{ paddingVertical: 12, borderRadius: 10, backgroundColor: '#0A7D6F', alignItems: 'center' }}
            onPress={async () => { setShowAddImageModal(false); await tirarFoto(); }}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>Tirar Foto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ paddingVertical: 12, borderRadius: 10, backgroundColor: '#F3F4F6', alignItems: 'center' }}
            onPress={async () => { setShowAddImageModal(false); await selecionarDaGaleria(); }}
          >
            <Text style={{ color: '#0A7D6F', fontWeight: '700' }}>Escolher da Galeria</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ paddingVertical: 12, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center' }}
            onPress={() => setShowAddImageModal(false)}
          >
            <Text style={{ color: '#666' }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </CustomModal>

      {/* Modal: adicionar tipo customizado */}
      <InputModal
        visible={showAddTypeModal}
        title="Adicionar Tipo"
        placeholder="Ex: Eletrônico, Orgânico, etc."
        onCancel={() => setShowAddTypeModal(false)}
        onSubmit={(value) => {
          if (value && value.length > 0) {
            const tipoCapitalizado = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
            
            // Adicionar aos tipos customizados se ainda não existe
            if (!tiposCustomizados.includes(tipoCapitalizado) && 
                !['Doméstico', 'Hospitalar'].includes(tipoCapitalizado)) {
              setTiposCustomizados([...tiposCustomizados, tipoCapitalizado]);
            }
            
            // Adicionar aos tipos selecionados se ainda não está selecionado
            if (!tiposSelecionados.includes(tipoCapitalizado)) {
              setTiposSelecionados([...tiposSelecionados, tipoCapitalizado]);
            }
          }
          setShowAddTypeModal(false);
        }}
      />

      {/* Modal: confirmar ao sair */}
      <ConfirmModal
        visible={showExitConfirm}
        title="Descartar denúncia?"
        message="Você tem alterações não salvas. Deseja realmente sair?"
        onCancel={() => setShowExitConfirm(false)}
        onConfirm={() => { setShowExitConfirm(false); navigation.goBack(); }}
        confirmLabel="Sair"
        cancelLabel="Cancelar"
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
});

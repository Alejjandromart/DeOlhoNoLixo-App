# Tela DenunciaIA

## Descrição

A tela **DenunciaIA** é uma implementação mobile (React Native/Expo) baseada na aplicação web **ecoreport**. Esta tela permite que os usuários façam denúncias ambientais com o auxílio de inteligência artificial para análise automática das imagens e geração de descrições.

## Características

### 🎯 Fluxo em 3 Passos

1. **Passo 1: Fotos e Localização**
   - Adicionar até 3 fotos (câmera ou galeria)
   - Obter localização via GPS ou inserir manualmente
   - Validação de campos obrigatórios

2. **Passo 2: Análise e Descrição**
   - Animação de análise por IA
   - Geração automática de descrição
   - Identificação de categorias (tags)
   - Possibilidade de editar o texto gerado

3. **Passo 3: Revisão**
   - Visualização de todas as informações
   - Opção de editar qualquer passo
   - Confirmação antes do envio

4. **Tela de Sucesso**
   - Número de protocolo gerado
   - Timeline de status
   - Opção de voltar ao início

### 🎨 Design

- **Gradiente verde**: Tema ambiental consistente
- **Animações suaves**: Transições entre passos
- **Componentes modulares**: Fácil manutenção
- **UI/UX moderna**: Inspirada no design web do ecoreport

### 🧩 Componentes

- `Header.tsx` - Cabeçalho com navegação
- `ProgressIndicator.tsx` - Indicador de progresso
- `Step1PhotosLocation.tsx` - Seleção de fotos e localização
- `Step2Description.tsx` - Análise IA e descrição
- `Step3Review.tsx` - Revisão final
- `AnalyzingState.tsx` - Animação de análise
- `SuccessScreen.tsx` - Tela de sucesso
- `CancelModal.tsx` - Modal de confirmação de cancelamento
- `StepButton.tsx` - Botão de navegação entre passos

## Como Usar

### Navegação

Para navegar para a tela DenunciaIA:

```typescript
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();
navigation.navigate('DenunciaIA');
```

### Exemplo de Uso

```typescript
// No seu componente
<TouchableOpacity onPress={() => navigation.navigate('DenunciaIA')}>
  <Text>Fazer Denúncia com IA</Text>
</TouchableOpacity>
```

## Permissões Necessárias

A tela solicita automaticamente as seguintes permissões:

- 📷 **Câmera**: Para tirar fotos
- 🖼️ **Galeria**: Para selecionar fotos existentes
- 📍 **Localização**: Para obter coordenadas GPS

## Estrutura de Dados

```typescript
interface ReportData {
  id: string;
  photos: string[];
  location: string;
  coordinates?: { lat: number; lng: number };
  description: string;
  category: string;
  aiAnalysis?: {
    severity: string;
    tags: string[];
  };
}
```

## Diferenças da Versão Web

- Adaptado para React Native (sem HTML/CSS)
- Uso de componentes nativos (TouchableOpacity, ScrollView, etc.)
- Integração com APIs nativas (ImagePicker, Location)
- Navegação via React Navigation
- Estilização com StyleSheet

## Próximos Passos

- [ ] Integrar com backend real
- [ ] Implementar upload de imagens
- [ ] Conectar com API de IA real
- [ ] Adicionar validação de formulário mais robusta
- [ ] Implementar sistema de notificações
- [ ] Adicionar suporte offline

## Tecnologias Utilizadas

- React Native
- Expo
- TypeScript
- React Navigation
- Expo Image Picker
- Expo Location
- Expo Linear Gradient
- Ionicons

## Autor

Desenvolvido com base no projeto **ecoreport** (aplicação web) e adaptado para mobile seguindo os padrões do projeto **DeOlhoNoLixo-App**.

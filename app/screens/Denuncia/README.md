# Tela de Realizar Denúncia

Esta tela permite que usuários autenticados reportem problemas relacionados ao descarte inadequado de lixo.

## 📁 Estrutura de Componentes

```
Denuncia/
├── RealizarDenuncia.tsx         # Componente principal
└── components/
    ├── index.ts                 # Exportações centralizadas
    ├── Header.tsx               # Cabeçalho com botão de voltar
    ├── ImagePicker.tsx          # Seleção e gerenciamento de imagens
    ├── LocationPicker.tsx       # Captura de localização GPS
    ├── DescriptionInput.tsx     # Campo de descrição do problema
    ├── TrashTypeSelector.tsx    # Seletor de tipo de lixo
    └── SubmitButton.tsx         # Botão de envio do formulário
```

## 🧩 Componentes

### `Header`
Cabeçalho da tela com título e botão de voltar.

**Props:**
- `titulo: string` - Título exibido no cabeçalho
- `onVoltar: () => void` - Callback ao pressionar botão voltar

---

### `ImagePickerComponent`
Gerencia a seleção e visualização de até 4 imagens.

**Props:**
- `imagens: ImagemSelecionada[]` - Array de imagens selecionadas
- `onAdicionarImagem: () => void` - Callback para adicionar nova imagem
- `onRemoverImagem: (index: number) => void` - Callback para remover imagem

**Funcionalidades:**
- Tirar foto com câmera
- Selecionar da galeria
- Preview de imagens
- Limite de 4 imagens
- Remover imagens individualmente

---

### `LocationPicker`
Captura e exibe a localização atual do usuário.

**Props:**
- `localizacao: LocalizacaoData | null` - Dados da localização atual
- `obtendoLocalizacao: boolean` - Estado de carregamento
- `onObterLocalizacao: () => void` - Callback para obter localização

**Funcionalidades:**
- Solicita permissão de localização
- Obtém coordenadas GPS
- Converte coordenadas em endereço legível
- Feedback visual de sucesso

---

### `DescriptionInput`
Campo de texto multiline para descrição detalhada do problema.

**Props:**
- `descricao: string` - Texto da descrição
- `onChangeText: (text: string) => void` - Callback de mudança de texto
- `placeholder?: string` - Texto de placeholder (opcional)
- `maxLength?: number` - Limite de caracteres (padrão: 500)

---

### `TrashTypeSelector`
Seletor para escolher o tipo de lixo reportado.

**Props:**
- `tipoSelecionado: 'domestico' | 'hospitalar' | null` - Tipo selecionado
- `onSelectTipo: (tipo: 'domestico' | 'hospitalar') => void` - Callback de seleção

**Opções:**
- Doméstico
- Hospitalar

---

### `SubmitButton`
Botão de envio do formulário com estado de loading.

**Props:**
- `onPress: () => void` - Callback ao pressionar
- `loading: boolean` - Exibe indicador de carregamento
- `label?: string` - Texto do botão (padrão: "Enviar")

---

## 🔄 Fluxo de Uso

1. **Adicionar Imagens**: Usuário tira fotos ou seleciona da galeria
2. **Capturar Localização**: Toque no botão para obter localização GPS
3. **Descrever Problema**: Digite descrição detalhada do problema
4. **Selecionar Tipo**: Escolha entre Doméstico ou Hospitalar
5. **Enviar**: Submete o formulário (validação automática)

## ✅ Validações

Antes do envio, o sistema valida:
- ✓ Pelo menos 1 imagem adicionada
- ✓ Localização capturada
- ✓ Descrição preenchida
- ✓ Tipo de lixo selecionado

## 🎨 Design

- **Cores principais**: Verde (#0A7D6F), Verde claro (#9BC938)
- **Fundo**: Gradiente cinza (#E8E8E8 → #C0C0C0)
- **Cartão**: Branco com sombra suave
- **Feedback visual**: Ícones de confirmação e cores de status

## 🔌 Integração com API

O componente está preparado para enviar dados via `FormData`:
- Imagens (multipart)
- Descrição
- Tipo de lixo
- Coordenadas (latitude/longitude)
- Endereço formatado
- ID do usuário autenticado

**Endpoint esperado:**
```
POST /api/denuncias
Content-Type: multipart/form-data
Authorization: Bearer {token}
```

## 🔐 Permissões Necessárias

- **Câmera**: Para tirar fotos
- **Galeria**: Para selecionar imagens existentes
- **Localização**: Para capturar coordenadas GPS

As permissões são solicitadas automaticamente ao iniciar a tela.

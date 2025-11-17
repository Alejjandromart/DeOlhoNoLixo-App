# BottomTabBar

Componente de navegação inferior moderno e animado para o aplicativo De Olho no Lixo.

## 📋 Índice

- [Estrutura](#estrutura)
- [Como Funciona](#como-funciona)
- [Configuração](#configuração)
- [Personalização](#personalização)
- [Exemplos de Uso](#exemplos-de-uso)

## 🏗️ Estrutura

O BottomTabBar foi dividido em componentes modulares para melhor organização e manutenibilidade:

```
BottomTabBar/
├── index.tsx              # Componente principal que orquestra todos os subcomponentes
├── TabButton.tsx          # Botão de navegação (Home, Perfil)
├── CentralButton.tsx      # Botão central destacado (Denunciar)
├── AnimatedSlider.tsx     # Indicador visual animado (quadrado verde)
└── colors.ts              # Paleta de cores centralizada
```

### Responsabilidades de Cada Arquivo

#### `index.tsx`
- **Função**: Componente principal que gerencia estado e lógica de navegação
- **Responsabilidades**:
  - Controla qual rota está ativa
  - Gerencia animações e transições
  - Coordena posicionamento dos subcomponentes
  - Mede layouts para animações precisas

#### `TabButton.tsx`
- **Função**: Botão de navegação reutilizável
- **Responsabilidades**:
  - Renderiza ícone e label
  - Aplica estilos de estado ativo/inativo
  - Gerencia animação de escala ao tocar
  - Reporta layout ao componente pai

#### `CentralButton.tsx`
- **Função**: Botão de ação principal (Denunciar)
- **Responsabilidades**:
  - Botão circular elevado
  - Animação de escala personalizada
  - Estilo destacado com sombra

#### `AnimatedSlider.tsx`
- **Função**: Indicador visual de tab ativa
- **Responsabilidades**:
  - Quadrado de fundo verde translúcido
  - Animação suave entre posições
  - Usa Reanimated para performance 60fps

#### `colors.ts`
- **Função**: Constantes de cores do tema
- **Responsabilidades**:
  - Define paleta de cores consistente
  - Facilita mudanças de tema
  - Single source of truth para cores

## ⚙️ Como Funciona

### Fluxo de Navegação

1. **Usuário toca em um botão** → `TabButton` ou `CentralButton`
2. **Animação de feedback** → Escala reduz (0.85x) e retorna (1x)
3. **Navegação** → `navigation.navigate(routeName)`
4. **Atualização de rota** → `currentRoute` prop muda
5. **Slider se move** → `AnimatedSlider` desliza para nova posição

### Sistema de Animações

#### Reanimated (UI Thread)
```typescript
// Usado para o slider - não bloqueia JavaScript
const sliderPosition = useSharedValue(0);
sliderPosition.value = withSpring(1); // 60fps garantido
```

#### Animated API (JS Thread)
```typescript
// Usado para feedback de toque nos botões
Animated.sequence([
  Animated.timing(scale, { toValue: 0.85 }),
  Animated.spring(scale, { toValue: 1 })
]);
```

### Medição de Layout

O componente usa `onLayout` para medir posições reais dos botões:

```typescript
const handleFeedLayout = (event: LayoutChangeEvent) => {
  const { x, width } = event.nativeEvent.layout;
  setFeedLayout({ x, width });
};
```

Isso garante que o slider se posicione perfeitamente, independente do tamanho da tela.

## 🔧 Configuração

### Props Disponíveis

```typescript
interface BottomTabBarProps {
  currentRoute?: string;  // Rota ativa atual (padrão: 'Feed')
}
```

### Uso Básico

```tsx
import BottomTabBar from '../../components/BottomTabBar';

function MyScreen() {
  return (
    <View style={{ flex: 1 }}>
      {/* Seu conteúdo */}
      <BottomTabBar currentRoute="Feed" />
    </View>
  );
}
```

### Configurar Navegação

O componente usa `@react-navigation/native`. Configure suas rotas:

```typescript
// No seu navigator
<Stack.Screen name="Feed" component={FeedScreen} />
<Stack.Screen name="Configuracao" component={ConfigScreen} />
<Stack.Screen name="NovaDenuncia" component={NewReportScreen} />
```

## 🎨 Personalização

### Alterar Cores (SEM mudar UX)

Edite `colors.ts`:

```typescript
export const COLORS = {
  primary: '#10B981',        // Cor principal (ícones ativos, slider)
  primaryDark: '#059669',    // Botão central
  inactive: '#94A3B8',       // Ícones inativos
  background: '#FFFFFF',     // Fundo da barra
  shadow: 'rgba(0, 0, 0, 0.1)',
  border: '#F1F5F9',
  textActive: '#1E293B',     // Texto ativo
  textInactive: '#64748B',   // Texto inativo
};
```

### Ajustar Tamanho do Slider (SEM mudar UX)

Em `AnimatedSlider.tsx`, ajuste dimensões:

```typescript
const styles = StyleSheet.create({
  slider: {
    width: 64,      // Largura do quadrado
    height: 64,     // Altura do quadrado
    borderRadius: 20, // Arredondamento
  },
});
```

### Mudar Ícones (SEM mudar UX)

Em `index.tsx`, modifique props do `TabButton`:

```tsx
<TabButton
  icon="home"              // Ícone ativo
  iconOutline="home-outline" // Ícone inativo
  label="Home"
  // ...
/>
```

Veja todos os ícones disponíveis: [Ionicons](https://ionic.io/ionicons)

### Ajustar Animações (SEM mudar UX)

#### Velocidade do Slider

Em `index.tsx`:

```typescript
sliderPosition.value = withSpring(target, {
  damping: 20,      // Maior = mais lento (10-40)
  stiffness: 120,   // Maior = mais rápido (50-200)
  mass: 0.5,        // Maior = mais inércia (0.1-2)
});
```

#### Feedback de Toque

Em `index.tsx`:

```typescript
Animated.timing(scaleValue, {
  toValue: 0.85,    // Menor = mais comprimido (0.7-0.95)
  duration: 100,    // Milissegundos (50-200)
});
```

### Adicionar Novo Botão (MUDA UX)

⚠️ **Atenção**: Isso muda a experiência do usuário!

1. Adicione a rota no navigator
2. Em `index.tsx`, adicione novo `TabButton`:

```tsx
<TabButton
  route="NovaRota"
  isActive={isActive('NovaRota')}
  icon="star"
  iconOutline="star-outline"
  label="Novo"
  scaleAnim={newScale}
  onPress={() => animateTab(newScale, 'NovaRota')}
  onLayout={handleNewLayout}
  colors={COLORS}
/>
```

3. Ajuste lógica do slider para 3+ botões

## 📱 Exemplos de Uso

### Exemplo Completo em uma Tela

```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import BottomTabBar from '../../components/BottomTabBar';

const FeedScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Seu conteúdo aqui */}
      
      {/* Barra de navegação */}
      <BottomTabBar currentRoute="Feed" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default FeedScreen;
```

### Detectar Rota Atual Dinamicamente

```tsx
import { useRoute } from '@react-navigation/native';

function MyScreen() {
  const route = useRoute();
  
  return (
    <View style={{ flex: 1 }}>
      {/* Conteúdo */}
      <BottomTabBar currentRoute={route.name} />
    </View>
  );
}
```

## 🎯 Boas Práticas

### ✅ Faça

- Use `currentRoute` prop para indicar tab ativa
- Mantenha as cores em `colors.ts`
- Teste em diferentes tamanhos de tela
- Use ícones do Ionicons para consistência

### ❌ Não Faça

- Não modifique estilos inline diretamente
- Não adicione lógica de negócio nos componentes visuais
- Não altere z-index sem entender a hierarquia
- Não remova `onLayout` (quebra animações)

## 🐛 Troubleshooting

### Slider não alinha corretamente
- **Causa**: Botões não mediram layout ainda
- **Solução**: Verifique se `onLayout` está sendo chamado

### Animação travando
- **Causa**: Muitas operações na thread JS
- **Solução**: Use Reanimated para animações críticas

### Ícones não aparecem
- **Causa**: Nome do ícone incorreto
- **Solução**: Verifique em [Ionicons Directory](https://ionic.io/ionicons)

### Botão não navega
- **Causa**: Rota não configurada no navigator
- **Solução**: Adicione `<Stack.Screen>` no seu navigator

## 📊 Performance

- **60fps garantido** no slider (Reanimated UI thread)
- **Medição lazy** de layout (apenas quando necessário)
- **Re-renders otimizados** (componentes separados)
- **Bundle size**: ~8KB (sem dependências extras)

## 🔄 Changelog

### v1.0.0 - Refatoração Modular
- Dividido em componentes separados
- Implementado slider animado
- Adicionado suporte a medição dinâmica
- Melhorado sistema de cores

---

**Dúvidas?** Consulte a documentação do React Navigation e Reanimated.

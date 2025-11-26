import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  ViewToken,
  TouchableOpacity,
  Text,
  ListRenderItemInfo,
  useWindowDimensions,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedRef,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
  interpolateColor,
  withSpring,
  SharedValue,
  AnimatedRef,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from 'expo-video';
import LottieView from 'lottie-react-native';

// --- Data ---
interface TutorialData {
  id: number;
  mainVideo: any;
  floatingIconGif: any;
  text: string;
  description: string;
  textColor: string;
  backgroundColor: string;
  cardColor: string;
}

const tutorialData: TutorialData[] = [
  {
    id: 1,
    mainVideo: require('../../assets/videos/1denuncia.gif'),
    floatingIconGif: require('../../assets/videos/1camera.gif'),
    text: 'Denuncie Lixo Irregular',
    description: 'Tire uma foto do lixo, adicione a localização e faça sua denúncia em poucos segundos.',
    textColor: '#ffffff',
    backgroundColor: '#FF6B6B',
    cardColor: '#FFD93D',
  },
  {
    id: 2,
    mainVideo: require('../../assets/videos/2feed.gif'),
    floatingIconGif: require('../../assets/videos/2mensagem.gif'),
    text: 'Acompanhe em Tempo Real',
    description: 'Veja todas as denúncias da sua região no feed e acompanhe o progresso das ações.',
    textColor: '#ffffff',
    backgroundColor: '#4ECDC4',
    cardColor: '#FF6B6B',
  },
  {
    id: 3,
    mainVideo: require('../../assets/videos/3acoes.gif'),
    floatingIconGif: require('../../assets/videos/3publico.gif'),
    text: 'Faça Parte da Comunidade',
    description: 'Comente, curta e compartilhe denúncias para aumentar a pressão por soluções.',
    textColor: '#ffffff',
    backgroundColor: '#FFD93D',
    cardColor: '#4ECDC4',
  },
  {
    id: 4,
    mainVideo: null,
    floatingIconGif: require('../../assets/videos/4cidade.gif'),
    text: 'Veja o Impacto',
    description: 'Acompanhe suas contribuições e veja como sua cidade está ficando mais limpa.',
    textColor: '#ffffff',
    backgroundColor: '#628532ff',
    cardColor: '#90EE90',
  },
];

// --- Components ---

// TutorialRenderItem
type RenderItemProps = {
  index: number;
  x: SharedValue<number>;
  item: TutorialData;
};

const TutorialRenderItem = ({ index, x, item }: RenderItemProps) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  const contentAnimationStyle = useAnimatedStyle(() => {
    const translateYAnimation = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [100, 0, 100],
      Extrapolation.CLAMP,
    );

    const opacityAnimation = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [0, 1, 0],
      Extrapolation.CLAMP,
    );

    return {
      opacity: opacityAnimation,
      transform: [{ translateY: translateYAnimation }],
    };
  });

  const cardAnimationStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [0.8, 1, 0.8],
      Extrapolation.CLAMP,
    );
    
    const rotateVal = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [15, 0, -15],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ scale }, { rotate: `${rotateVal}deg` }],
    };
  });

  return (
    <View style={[styles.itemContainer, { width: SCREEN_WIDTH }]}>
      
      {/* Visual Container (Video direto sem card) */}
      <View style={styles.visualContainer}>
        {item.id === 4 ? (
          // Quarta tela: Animação Lottie
          <View style={styles.videoContainer}>
            <LottieView
              source={require('../../assets/lottie/1Beautiful city.json')}
              style={styles.video}
              autoPlay
              loop
            />
          </View>
        ) : (
          // Outras telas: GIF
          <View style={styles.videoContainer}>
            <Image
              source={item.mainVideo}
              style={styles.video}
              resizeMode="contain"
            />
          </View>
        )}

        {/* Floating Icon Badge */}
        <Animated.View style={[styles.floatingIconBadge, contentAnimationStyle]}>
          {item.floatingIconGif && (
            <Image 
              source={item.floatingIconGif} 
              style={styles.gifIcon}
              resizeMode="contain"
            />
          )}
        </Animated.View>
      </View>

      {/* Text Content */}
      <Animated.View style={[contentAnimationStyle, { alignItems: 'center', marginTop: 40 }]}>
        <Text style={[styles.itemText, { color: item.textColor }]}>
          {item.text}
        </Text>
        <Text style={[styles.itemDescription, { color: item.textColor }]}>
          {item.description}
        </Text>
      </Animated.View>
    </View>
  );
};

// TutorialDot
type DotProps = {
  index: number;
  x: SharedValue<number>;
};

const TutorialDot = ({ index, x }: DotProps) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  const animatedDotStyle = useAnimatedStyle(() => {
    const widthAnimation = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [10, 20, 10],
      Extrapolation.CLAMP,
    );

    const opacityAnimation = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [0.5, 1, 0.5],
      Extrapolation.CLAMP,
    );
    return {
      width: widthAnimation,
      opacity: opacityAnimation,
    };
  });

  return (
    <Animated.View style={[styles.dots, animatedDotStyle]} />
  );
};

// TutorialPagination
type PaginationProps = {
  data: TutorialData[];
  x: SharedValue<number>;
};

const TutorialPagination = ({ data, x }: PaginationProps) => {
  return (
    <View style={styles.paginationContainer}>
      {data.map((_, index) => {
        return <TutorialDot index={index} x={x} key={index} />;
      })}
    </View>
  );
};

// TutorialButton
type ButtonProps = {
  dataLength: number;
  flatListIndex: SharedValue<number>;
  flatListRef: AnimatedRef<FlatList<TutorialData>>;
  x: SharedValue<number>;
};

const TutorialButton = ({ flatListRef, flatListIndex, dataLength, x }: ButtonProps) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const navigation = useNavigation<any>();

  const buttonAnimationStyle = useAnimatedStyle(() => {
    return {
      width:
        flatListIndex.value === dataLength - 1
          ? withSpring(140)
          : withSpring(60),
      height: 60,
    };
  });

  const arrowAnimationStyle = useAnimatedStyle(() => {
    return {
      width: 30,
      height: 30,
      opacity:
        flatListIndex.value === dataLength - 1 ? withTiming(0) : withTiming(1),
      transform: [
        {
          translateX:
            flatListIndex.value === dataLength - 1
              ? withTiming(100)
              : withTiming(0),
        },
      ],
    };
  });

  const textAnimationStyle = useAnimatedStyle(() => {
    return {
      opacity:
        flatListIndex.value === dataLength - 1 ? withTiming(1) : withTiming(0),
      transform: [
        {
          translateX:
            flatListIndex.value === dataLength - 1
              ? withTiming(0)
              : withTiming(-100),
        },
      ],
    };
  });
  
  const animatedColor = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      x.value,
      [0, SCREEN_WIDTH, 2 * SCREEN_WIDTH, 3 * SCREEN_WIDTH],
      ['#854b4bff', '#387874ff', '#7f7138ff', '#64892fff']
    );

    return {
      backgroundColor: backgroundColor,
    };
  });

  return (
    <TouchableWithoutFeedback
      onPress={async () => {
        if (flatListIndex.value < dataLength - 1) {
          flatListRef.current?.scrollToIndex({ index: flatListIndex.value + 1 });
        } else {
          // Finalizar tutorial
          try {
            // Opcional: marcar tutorial como visto se necessário, 
            // mas o login já marca isFirstLogin.
            // await AsyncStorage.setItem('@hasSeenTutorial', 'true');
          } catch (e) {
            console.log(e);
          }
          navigation.replace('Permissions');
        }
      }}>
      <Animated.View
        style={[styles.buttonContainer, buttonAnimationStyle, animatedColor]}>
        <Animated.Text style={[styles.textButton, textAnimationStyle]}>
          Começar
        </Animated.Text>
        <Animated.View style={[styles.arrow, arrowAnimationStyle]}>
          <Ionicons name="arrow-forward" size={30} color="#FFF" />
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

// --- Main Screen ---

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const TutorialScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  const flatListRef = useAnimatedRef<FlatList<TutorialData>>();
  const x = useSharedValue(0);
  const flatListIndex = useSharedValue(0);

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      flatListIndex.value = viewableItems[0].index;
    }
  };

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      x.value = event.contentOffset.x;
    },
  });

  const handleSkip = () => {
    navigation.replace('MainTabs');
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    const isLastScreen = flatListIndex.value === tutorialData.length - 1;

    return {
      opacity: isLastScreen ? withTiming(0) : withTiming(1),
      pointerEvents: isLastScreen ? 'none' : 'auto',
    };
  });

  const animatedBackgroundColor = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      x.value,
      [0, SCREEN_WIDTH, 2 * SCREEN_WIDTH, 3 * SCREEN_WIDTH],
      ['#FF6B6B', '#4ECDC4', '#FFD93D', '#A4D65E']
    );

    return {
      backgroundColor: backgroundColor,
    };
  });

  return (
    <Animated.View style={[styles.container, animatedBackgroundColor]}>

      <AnimatedTouchableOpacity
        style={[styles.skipButton, buttonAnimatedStyle]}
        onPress={handleSkip}>
        <Text style={styles.skipButtonText}>Pular  </Text>
        <Feather name="chevron-right" size={24} color="white" />
      </AnimatedTouchableOpacity>

      <Animated.FlatList
        ref={flatListRef}
        onScroll={onScroll}
        data={tutorialData}
        renderItem={({ item, index }: ListRenderItemInfo<TutorialData>) => {
          return <TutorialRenderItem item={item} index={index} x={x} />;
        }}
        keyExtractor={item => item.id.toString()}
        scrollEventThrottle={16}
        horizontal={true}
        bounces={false}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          minimumViewTime: 300,
          viewAreaCoveragePercentThreshold: 10,
        }}
      />
      <View style={styles.bottomContainer}>
        <TutorialPagination data={tutorialData} x={x} />
        <TutorialButton
          flatListRef={flatListRef}
          flatListIndex={flatListIndex}
          dataLength={tutorialData.length}
          x={x}
        />
      </View>
    </Animated.View>
  );
};

export default TutorialScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Fallback background
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 50,
    right: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 20,
    zIndex: 10,
  },
  skipButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 30,
    paddingVertical: 30,
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  // RenderItem styles
  itemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 80,
  },
  visualContainer: {
    width: '100%',
    height: 420,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  videoContainer: {
    width: 300,
    height: 500,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  floatingIconBadge: {
    position: 'absolute',
    top: 0,
    left: 40,
    width: 80,
    height: 80,
    borderRadius: 20, // Squircle shape like app icons
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    transform: [{ rotate: '-10deg' }],
    borderWidth: 4,
    borderColor: '#fff',
  },
  gifIcon: {
    width: 60,
    height: 60,
  },
  itemText: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    marginHorizontal: 20,
  },
  itemDescription: {
    textAlign: 'center',
    fontSize: 16,
    marginHorizontal: 30,
    lineHeight: 24,
  },
  circleContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  // Pagination styles
  paginationContainer: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dots: {
    height: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  // Button styles
  buttonContainer: {
    padding: 10,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  arrow: {
    position: 'absolute',
  },
  textButton: { color: 'white', fontSize: 16, position: 'absolute' },
});
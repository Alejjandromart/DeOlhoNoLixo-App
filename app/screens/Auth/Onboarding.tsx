import {
  StyleSheet,
  View,
  FlatList,
  ViewToken,
  TouchableOpacity,
  Text,
  ListRenderItemInfo, // Importado para tipagem do renderItem
} from 'react-native';
import React from 'react';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedRef,
  useAnimatedStyle, // Importação necessária
  withTiming,         // Importação necessária
} from 'react-native-reanimated';
import data, {OnboardingData} from '../../data/data';
import Pagination from '../../components/Pagination';
import CustomButton from '../../components/CustomButton';
import RenderItem from '../../components/RenderItem';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../navigation/RootStack';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  'Onboarding'
>;

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();

  const flatListRef = useAnimatedRef<FlatList<OnboardingData>>();
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

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem('@hasSeenOnboarding', 'true');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
    navigation.navigate('Welcome');
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    const isLastScreen = flatListIndex.value === data.length - 1;

    return {
      opacity: isLastScreen ? withTiming(0) : withTiming(1),
      pointerEvents: isLastScreen ? 'none' : 'auto',
    };
  });

  return (
    <View style={styles.container}>

      <AnimatedTouchableOpacity
        style={[styles.skipButton, buttonAnimatedStyle]}
        onPress={handleSkip}>
        <Text style={styles.skipButtonText}>Pular  </Text>
        <Feather name="chevron-right" size={24} color="white" />
      </AnimatedTouchableOpacity>

      <Animated.FlatList
        ref={flatListRef}
        onScroll={onScroll}
        data={data}
        renderItem={({item, index}: ListRenderItemInfo<OnboardingData>) => {
          return <RenderItem item={item} index={index} x={x} />;
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
        <Pagination data={data} x={x} />
        <CustomButton
          flatListRef={flatListRef}
          flatListIndex={flatListIndex}
          dataLength={data.length}
          x={x}
        />
      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 40,
    right: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#6c6d6dff',
    borderRadius: 20,
    elevation: 5,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    opacity: 0.8,
    zIndex: 1, // Adicionado para garantir que fique acima do FlatList
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
});
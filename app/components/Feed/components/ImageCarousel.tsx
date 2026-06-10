import React, { useState } from 'react';
import { View, Image, ScrollView, StyleSheet, Dimensions } from 'react-native';

interface ImageCarouselProps {
  imagens: string[];
  onIndexChange?: (index: number) => void;
  width?: number;
  style?: any;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ImageCarousel({ imagens, onIndexChange, width = SCREEN_WIDTH, style }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
    onIndexChange?.(index);
  };

  const innerWidth = width - 32;

  return (
    <View style={[styles.container, style, { width: innerWidth }]}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ width: innerWidth, height: 260 }}
        contentContainerStyle={{ width: innerWidth * imagens.length }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={innerWidth}
      >
        {imagens.map((uri, index) => (
          <Image
            key={index}
            source={{ uri }}
            style={[styles.image, { width: innerWidth }]}
          />
        ))}
      </ScrollView>

      {/* Indicadores de página */}
      {imagens.length > 1 && (
        <View style={styles.pagination}>
          {imagens.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                currentIndex === index && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 260,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    alignSelf: 'center',
  },
  image: {
    height: 260,
    resizeMode: 'cover',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 6,
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0B846C',
  },
});

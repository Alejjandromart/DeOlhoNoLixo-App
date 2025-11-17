import React, { useState } from 'react';
import { View, Image, ScrollView, StyleSheet, Dimensions } from 'react-native';

interface ImageCarouselProps {
  imagens: string[];
  onIndexChange?: (index: number) => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ImageCarousel({ imagens, onIndexChange }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / SCREEN_WIDTH);
    setCurrentIndex(index);
    onIndexChange?.(index);
  };

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {imagens.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.image} />
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
  carousel: {
    height: 280,
    backgroundColor: '#000',
  },
  image: {
    width: SCREEN_WIDTH,
    height: 280,
    resizeMode: 'contain',
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
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  paginationDotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
});

import React, { useCallback, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  fonteVideo?: number;           // require('.../tutorial.mp4')
  iniciarTocando?: boolean;      // padrão: true
  repetir?: boolean;             // padrão: true
  onPlayStateChange?: (tocando: boolean) => void;
};

const VideoTutorial: React.FC<Props> = ({
  fonteVideo,
  iniciarTocando = true,
  repetir = true,
  onPlayStateChange,
}) => {
  const videoRef = useRef<Video>(null);
  const [tocando, setTocando] = useState<boolean>(!!iniciarTocando);

  const alternarPlay = useCallback(async () => {
    const player = videoRef.current;
    if (!player) return;
    try {
      if (tocando) {
        await player.pauseAsync();
        setTocando(false);
        onPlayStateChange?.(false);
      } else {
        await player.playAsync();
        setTocando(true);
        onPlayStateChange?.(true);
      }
    } catch {
      // silencia erros transitórios do player
    }
  }, [tocando, onPlayStateChange]);

  return (
    <View style={styles.card}>
      <Video
        ref={videoRef}
        style={StyleSheet.absoluteFill}
        source={
          fonteVideo ??
          // Ajuste este caminho para o seu arquivo real:
          require('../assets/videos/VideoTutorial.mp4')
        }
        resizeMode={ResizeMode.COVER}
        shouldPlay={iniciarTocando}
        isLooping={repetir}
        useNativeControls={false}
        onPlaybackStatusUpdate={(status: any) => {
          if ('isPlaying' in status) setTocando(!!status.isPlaying);
        }}
      />
      {/* Ícone de play centralizado quando não está tocando */}
      {!tocando && (
        <View style={styles.playOverlay} pointerEvents="none">
          <Ionicons name="play-circle" size={72} color="rgba(255,255,255,0.85)" />
        </View>
      )}
      {/* Área clicável cobrindo o vídeo inteiro para pausar/despausar */}
      <Pressable style={StyleSheet.absoluteFill} onPress={alternarPlay} />
    </View>
  );
};

export default VideoTutorial;

const styles = StyleSheet.create({
  card: {
    width: '100%',
    aspectRatio: 9 / 16, // retângulo vertical (ajuste conforme necessário)
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#0b2f29',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
});
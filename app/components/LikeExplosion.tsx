import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
    withTiming,
    interpolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface LikeExplosionProps {
    size?: number;
    color?: string;
    particleCount?: number;
}

// Cores vibrantes para as partículas
const PARTICLE_COLORS = [
    '#FF6B9D', // Rosa
    '#C44569', // Rosa escuro
    '#FFC312', // Amarelo
    '#12CBC4', // Azul claro
    '#A3CB38', // Verde
    '#FDA7DF', // Rosa claro
    '#ED4C67', // Vermelho
    '#F79F1F', // Laranja
];

interface ParticleProps {
    index: number;
    total: number;
    radius: number;
    size: number;
}

const Particle: React.FC<ParticleProps> = ({ index, total, radius, size }) => {
    const progress = useSharedValue(0);

    // Calculamos o ângulo para cada partícula explodir em círculo
    const angle = (index * (2 * Math.PI)) / total;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    // Cor da partícula
    const particleColor = PARTICLE_COLORS[index % PARTICLE_COLORS.length];

    useEffect(() => {
        progress.value = withTiming(1, { duration: 500 }, () => {
            progress.value = 0; // Reset
        });
    }, []);

    const rStyle = useAnimatedStyle(() => {
        const scale = interpolate(progress.value, [0, 0.5, 1], [0, 1, 0]);
        const opacity = interpolate(progress.value, [0, 0.5, 1], [1, 1, 0]);
        const translateX = interpolate(progress.value, [0, 1], [0, x]);
        const translateY = interpolate(progress.value, [0, 1], [0, y]);

        return {
            opacity,
            transform: [{ translateX }, { translateY }, { scale }],
        };
    });

    return (
        <Animated.View
            style={[
                styles.particle,
                rStyle,
                {
                    backgroundColor: particleColor,
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                }
            ]}
        />
    );
};

const LikeExplosion: React.FC<LikeExplosionProps> = ({
    size = 40,
    color = '#E63946',
    particleCount = 8,
}) => {
    const scale = useSharedValue(1);
    const radius = size * 1.5;
    const particleSize = size * 0.2;

    useEffect(() => {
        // Animação do Coração (Bounce)
        scale.value = withSequence(
            withSpring(0.6, { damping: 10, stiffness: 200 }), // Encolhe rápido
            withSpring(1.2, { damping: 10, stiffness: 200 }), // Cresce além do tamanho
            withSpring(1, { damping: 10, stiffness: 200 })    // Volta ao normal
        );
    }, []);

    const rIconStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <View style={styles.container}>
            <View style={styles.wrapper}>
                {/* Renderiza as partículas */}
                {Array.from({ length: particleCount }).map((_, index) => (
                    <Particle
                        key={index}
                        index={index}
                        total={particleCount}
                        radius={radius}
                        size={particleSize}
                    />
                ))}

                {/* Ícone do Coração */}
                <Animated.View style={[rIconStyle, styles.iconContainer]}>
                    <Ionicons
                        name="heart"
                        size={size}
                        color={color}
                    />
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    wrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    particle: {
        position: 'absolute',
    },
    iconContainer: {
        zIndex: 10,
    },
});

export default LikeExplosion;

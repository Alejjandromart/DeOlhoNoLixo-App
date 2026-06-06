import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LikeExplosion from '../../components/LikeExplosion';

const LikeButtonExample = () => {
    const [liked, setLiked] = useState(false);
    const [showExplosion, setShowExplosion] = useState(false);
    const [likeCount, setLikeCount] = useState(42);

    const handleLike = () => {
        if (!liked) {
            setLiked(true);
            setShowExplosion(true);
            setLikeCount(prev => prev + 1);

            // Remove a animação após completar
            setTimeout(() => {
                setShowExplosion(false);
            }, 600);
        } else {
            setLiked(false);
            setLikeCount(prev => prev - 1);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Like Button Animation Demo</Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={handleLike}
                    style={styles.likeButton}
                    activeOpacity={0.7}
                >
                    {showExplosion && <LikeExplosion size={32} color="#E63946" particleCount={8} />}

                    {!showExplosion && (
                        <Ionicons
                            name={liked ? 'heart' : 'heart-outline'}
                            size={32}
                            color={liked ? '#E63946' : '#8E8E93'}
                        />
                    )}
                </TouchableOpacity>

                <Text style={styles.likeCount}>{likeCount}</Text>
            </View>

            <Text style={styles.instructions}>
                Toque no coração para ver a animação!
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1C1C1E',
        marginBottom: 40,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    likeButton: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    likeCount: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1C1C1E',
        minWidth: 30,
    },
    instructions: {
        marginTop: 40,
        fontSize: 14,
        color: '#8E8E93',
        textAlign: 'center',
    },
});

export default LikeButtonExample;

import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Comentario } from '../../context/DenunciaContext';

// Função para gerar cor do avatar baseada no nome
const getAvatarColor = (name: string): string => {
    const colors = ['#0A7D6F', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#6C5CE7', '#A29BFE'];
    const charCode = name.charCodeAt(0);
    return colors[charCode % colors.length];
};

interface CommentsModalProps {
    visible: boolean;
    onClose: () => void;
    comentarios: Comentario[];
    onAddComment?: (texto: string) => void;
}

export default function CommentsModal({ visible, onClose, comentarios, onAddComment }: CommentsModalProps) {
    const insets = useSafeAreaInsets();
    const [commentText, setCommentText] = useState('');

    // DEBUG: Ver comentários recebidos
    React.useEffect(() => {
        if (visible) {
            console.log('💬 CommentsModal aberto com', comentarios?.length || 0, 'comentários:', comentarios);
        }
    }, [visible, comentarios]);

    const handleSendComment = () => {
        if (commentText.trim() && onAddComment) {
            onAddComment(commentText.trim());
            setCommentText('');
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={onClose}
                />

                <KeyboardAvoidingView 
                    style={styles.modalContainer}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.dragHandle} />
                        <Text style={styles.headerTitle}>Comentários</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {/* Lista de Comentários */}
                    <ScrollView
                        style={styles.commentsContainer}
                        contentContainerStyle={styles.commentsContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {!comentarios || comentarios.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Ionicons name="chatbubble-outline" size={48} color="#CCC" />
                                <Text style={styles.emptyText}>Nenhum comentário ainda</Text>
                                <Text style={styles.emptySubtext}>Seja o primeiro a comentar!</Text>
                            </View>
                        ) : (
                            <>
                                {comentarios.map((comentario, index) => {
                                    console.log(`🔍 Renderizando comentário ${index}:`, comentario);
                                    return (
                                        <View key={comentario.id || index} style={styles.commentItem}>
                                            <View style={styles.commentAvatar}>
                                                {comentario.usuario?.avatar ? (
                                                    <Image 
                                                        source={{ uri: comentario.usuario.avatar }} 
                                                        style={styles.avatarImage} 
                                                    />
                                                ) : (
                                                    <View style={[styles.avatarPlaceholder, { backgroundColor: getAvatarColor(comentario.usuario?.nome || 'U') }]}>
                                                        <Text style={styles.avatarText}>
                                                            {(comentario.usuario?.nome || 'U')[0].toUpperCase()}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                            <View style={styles.commentContent}>
                                                <View style={styles.commentHeader}>
                                                    <Text style={styles.commentAuthor}>
                                                        {typeof comentario.usuario === 'string' ? comentario.usuario : comentario.usuario?.nome || 'Usuário'}
                                                    </Text>
                                                    <Text style={styles.commentTime}>{comentario.tempoAtras}</Text>
                                                </View>
                                                <Text style={styles.commentText}>{comentario.texto}</Text>
                                            </View>
                                        </View>
                                    );
                                })}
                            </>
                        )}
                    </ScrollView>

                    {/* Input de Comentário */}
                    <View style={[styles.inputContainer, { paddingBottom: insets.bottom }]}>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="Adicione um comentário..."
                                placeholderTextColor="#999"
                                value={commentText}
                                onChangeText={setCommentText}
                                multiline
                                maxLength={500}
                            />
                            <TouchableOpacity
                                onPress={handleSendComment}
                                disabled={!commentText.trim()}
                                style={[
                                    styles.sendButton,
                                    !commentText.trim() && styles.sendButtonDisabled
                                ]}
                            >
                                <Ionicons
                                    name="send"
                                    size={18}
                                    color="#FFFFFF"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    backdrop: {
        flex: 1,
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
        flexDirection: 'column',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        position: 'relative',
    },
    dragHandle: {
        position: 'absolute',
        top: 8,
        width: 40,
        height: 4,
        backgroundColor: '#DDD',
        borderRadius: 2,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1C1C1E',
        marginTop: 8,
    },
    closeButton: {
        position: 'absolute',
        right: 16,
        top: 12,
        padding: 4,
    },
    commentsContainer: {
        flexGrow: 1,
        flexShrink: 1,
    },
    commentsContent: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 16,
        flexGrow: 1,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
    },
    commentItem: {
        flexDirection: 'row',
        paddingVertical: 16,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    commentAvatar: {
        marginRight: 12,
        marginTop: 2,
        width: 32,
        height: 32,
        borderRadius: 16,
        overflow: 'hidden',
    },
    avatarImage: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    avatarPlaceholder: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    commentContent: {
        flex: 1,
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        gap: 8,
    },
    commentAuthor: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1C1C1E',
    },
    commentText: {
        fontSize: 15,
        color: '#333',
        lineHeight: 22,
    },
    commentTime: {
        fontSize: 13,
        color: '#999',
    },
    inputContainer: {
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        paddingHorizontal: 16,
        paddingVertical: 10,
        minHeight: 48,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#1C1C1E',
        maxHeight: 100,
        paddingVertical: 0,
    },
    sendButton: {
        marginLeft: 12,
        padding: 6,
        backgroundColor: '#0A7D6F',
        borderRadius: 20,
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButtonDisabled: {
        opacity: 0.4,
        backgroundColor: '#CCC',
    },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Comentario } from '../../context/DenunciaContext';

interface CommentsModalProps {
    visible: boolean;
    onClose: () => void;
    comentarios: Comentario[];
    onAddComment?: (texto: string) => void;
}

export default function CommentsModal({ visible, onClose, comentarios, onAddComment }: CommentsModalProps) {
    const insets = useSafeAreaInsets();
    const [commentText, setCommentText] = useState('');

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
                    style={[styles.modalContainer, { paddingBottom: insets.bottom }]}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
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
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {comentarios.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Ionicons name="chatbubble-outline" size={48} color="#CCC" />
                                <Text style={styles.emptyText}>Nenhum comentário ainda</Text>
                                <Text style={styles.emptySubtext}>Seja o primeiro a comentar!</Text>
                            </View>
                        ) : (
                            comentarios.map((comentario, index) => (
                                <View key={index} style={styles.commentItem}>
                                    <View style={styles.commentAvatar}>
                                        {comentario.usuario?.avatar ? (
                                            <Image source={{ uri: comentario.usuario.avatar }} style={styles.avatarImage} />
                                        ) : (
                                            <View style={styles.avatarPlaceholder}>
                                                <Text style={styles.avatarInitials}>
                                                    {((typeof comentario.usuario === 'string' ? comentario.usuario : comentario.usuario?.nome) || 'U').charAt(0).toUpperCase()}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                    <View style={styles.commentContent}>
                                        <Text style={styles.commentAuthor}>
                                            {typeof comentario.usuario === 'string' ? comentario.usuario : comentario.usuario?.nome || 'Usuário'}
                                        </Text>
                                        <Text style={styles.commentText}>{comentario.texto}</Text>
                                        <Text style={styles.commentTime}>{comentario.tempoAtras}</Text>
                                    </View>
                                </View>
                            ))
                        )}
                    </ScrollView>

                    {/* Input de Comentário */}
                    <View style={styles.inputContainer}>
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
                                    size={20}
                                    color={commentText.trim() ? '#0A7D6F' : '#CCC'}
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
        flex: 1,
        paddingHorizontal: 16,
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
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    commentAvatar: {
        marginRight: 12,
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
        backgroundColor: '#0A7D6F',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitials: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
    },
    commentContent: {
        flex: 1,
    },
    commentAuthor: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1C1C1E',
        marginBottom: 4,
    },
    commentText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
        marginBottom: 4,
    },
    commentTime: {
        fontSize: 12,
        color: '#999',
    },
    inputContainer: {
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#1C1C1E',
        maxHeight: 100,
        paddingVertical: 4,
    },
    sendButton: {
        marginLeft: 8,
        padding: 4,
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
});

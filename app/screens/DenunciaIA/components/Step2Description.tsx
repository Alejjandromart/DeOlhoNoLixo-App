import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ReportData } from '../DenunciaIA';
import AnalyzingState from './AnalyzingState';

interface Props {
    data: ReportData;
    updateData: (data: Partial<ReportData>) => void;
}

export default function Step2Description({ data, updateData }: Props) {
    const [isAnalyzing, setIsAnalyzing] = useState(data.description.length === 0);
    const [hasAnalyzed, setHasAnalyzed] = useState(false);

    useEffect(() => {
        // Chamar IA automaticamente apenas uma vez se não houver descrição
        if (!hasAnalyzed && data.description.length === 0 && data.photos.length > 0) {
            setHasAnalyzed(true);
            handleAnalysisComplete();
        }
    }, []);

    const handleAnalysisComplete = async () => {
        try {
            console.log('🤖 Iniciando análise da IA...');
            console.log('📸 Imagens:', data.photos);
            console.log('📍 Coordenadas:', data.coordinates);

            const formData = new FormData();
            
            // Adicionar todas as imagens
            for (let i = 0; i < data.photos.length; i++) {
                const photoUri = data.photos[i];
                formData.append('files', {
                    uri: photoUri,
                    type: 'image/jpeg',
                    name: `image_${i}.jpg`,
                } as any);
            }

            // Adicionar coordenadas se disponível
            if (data.coordinates) {
                formData.append('latitude', data.coordinates.lat.toString());
                formData.append('longitude', data.coordinates.lng.toString());
            }

            console.log('🌐 Enviando requisição para IA...');

            // Chamar API da IA
            const response = await fetch('http://192.168.0.3:8000/analyze', {
                method: 'POST',
                body: formData,
                // NÃO adicionar Content-Type - o fetch adiciona automaticamente com o boundary correto
            });

            console.log('📡 Resposta da IA - Status:', response.status);

            if (response.ok) {
                const aiAnalysis = await response.json();
                console.log('✅ Análise da IA concluída:', JSON.stringify(aiAnalysis, null, 2));

                // Atualizar apenas uma vez com a descrição da IA
                const aiDescription = aiAnalysis.suggestedDescription || 'Denúncia registrada';
                console.log('📝 Definindo descrição da IA:', aiDescription);
                
                updateData({
                    description: aiDescription,
                    aiAnalysis: {
                        severity: aiAnalysis.severity || 'medium',
                        tags: aiAnalysis.objectsDetected || [],
                    },
                });
                
                setHasAnalyzed(true);
            } else {
                console.error('❌ Erro na API da IA');
                // Usar valores padrão em caso de erro
                updateData({
                    description: 'Denúncia registrada. Por favor, adicione mais detalhes.',
                    aiAnalysis: {
                        severity: 'medium',
                        tags: ['Geral'],
                    },
                });
                setHasAnalyzed(true);
            }
        } catch (error) {
            console.error('❌ Erro ao analisar com IA:', error);
            // Usar valores padrão em caso de erro
            updateData({
                description: 'Denúncia registrada. Por favor, adicione mais detalhes.',
                aiAnalysis: {
                    severity: 'medium',
                    tags: ['Geral'],
                },
            });
            setHasAnalyzed(true);
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (isAnalyzing) {
        return <AnalyzingState onComplete={handleAnalysisComplete} />;
    }

    return (
        <View style={styles.container}>
            {/* Description Card */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Descrição</Text>
                    <View style={styles.aiBadge}>
                        <Ionicons name="sparkles" size={12} color="#8B5CF6" />
                        <Text style={styles.aiBadgeText}>Sugestão da IA</Text>
                    </View>
                </View>

                <View style={styles.textAreaContainer}>
                    <TextInput
                        style={styles.textArea}
                        value={data.description}
                        onChangeText={(text) => updateData({ description: text })}
                        placeholder="Descreva o problema..."
                        placeholderTextColor="#9CA3AF"
                        multiline
                        numberOfLines={6}
                        textAlignVertical="top"
                    />
                    <View style={styles.charCounter}>
                        <Text style={styles.charCounterText}>{data.description.length}/500</Text>
                    </View>
                </View>

                {data.aiAnalysis && (
                    <View style={styles.tagsContainer}>
                        <Text style={styles.tagsLabel}>TIPOS IDENTIFICADOS</Text>
                        <View style={styles.tags}>
                            {data.aiAnalysis.tags.map((tag, i) => (
                                <View key={i} style={styles.tag}>
                                    <Ionicons name="pricetag" size={10} color="#059669" />
                                    <Text style={styles.tagText}>{tag}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
            </View>

            {/* Info Card */}
            <View style={styles.infoCard}>
                <View style={styles.infoIconContainer}>
                    <Ionicons name="create-outline" size={18} color="#059669" />
                </View>
                <View style={styles.infoContent}>
                    <Text style={styles.infoTitle}>Revise o texto</Text>
                    <Text style={styles.infoText}>
                        A inteligência artificial gerou este texto e categorias com base nas imagens. Sinta-se
                        à vontade para editar.
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 24,
    },
    card: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    aiBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#F5F3FF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    aiBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#8B5CF6',
    },
    textAreaContainer: {
        position: 'relative',
    },
    textArea: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        padding: 16,
        fontSize: 14,
        color: '#1F2937',
        minHeight: 160,
    },
    charCounter: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    charCounterText: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    tagsContainer: {
        marginTop: 16,
    },
    tagsLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#9CA3AF',
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D1FAE5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
    },
    tagText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#059669',
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: '#ECFDF5',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#D1FAE5',
        gap: 12,
    },
    infoIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#065F46',
        marginBottom: 4,
    },
    infoText: {
        fontSize: 12,
        color: '#059669',
        lineHeight: 18,
    },
});

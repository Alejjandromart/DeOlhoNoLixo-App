import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ReportData } from '../DenunciaIA';

interface Props {
    data: ReportData;
    onEditStep: (step: number) => void;
}

export default function Step3Review({ data, onEditStep }: Props) {
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={styles.title}>Resumo da Denúncia</Text>
                <Text style={styles.subtitle}>Verifique se as informações estão corretas.</Text>
            </View>

            {/* Photos Review */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Fotos</Text>
                    <TouchableOpacity onPress={() => onEditStep(1)}>
                        <Text style={styles.editButton}>Editar</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosScroll}>
                    {data.photos.map((photo, i) => (
                        <Image key={i} source={{ uri: photo }} style={styles.photoThumb} />
                    ))}
                    {data.photos.length === 0 && (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>Nenhuma foto adicionada</Text>
                        </View>
                    )}
                </ScrollView>
            </View>

            {/* Description Review */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Descrição</Text>
                    <TouchableOpacity onPress={() => onEditStep(2)}>
                        <Text style={styles.editButton}>Editar</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.descriptionBox}>
                    <Text style={styles.descriptionText}>{data.description}</Text>
                </View>
            </View>

            {/* Location Review */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Localização</Text>
                    <TouchableOpacity onPress={() => onEditStep(1)}>
                        <Text style={styles.editButton}>Editar</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.locationBox}>
                    <View style={styles.decorativePin}>
                        <Ionicons name="location" size={80} color="#D1FAE5" />
                    </View>

                    <View style={styles.locationContent}>
                        <View style={styles.locationIcon}>
                            <Ionicons name="location" size={24} color="#10B981" />
                        </View>

                        <View style={styles.locationInfo}>
                            <Text style={styles.locationLabel}>ENDEREÇO IDENTIFICADO</Text>
                            <Text style={styles.locationAddress}>
                                {data.location || 'Localização não informada'}
                            </Text>
                            {data.coordinates && (
                                <View style={styles.coordinates}>
                                    <Text style={styles.coordinatesText}>Lat: {data.coordinates.lat.toFixed(5)}</Text>
                                    <View style={styles.coordinatesSeparator} />
                                    <Text style={styles.coordinatesText}>Lng: {data.coordinates.lng.toFixed(5)}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 8,
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    card: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 24,
        marginBottom: 20,
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
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    editButton: {
        fontSize: 14,
        fontWeight: '600',
        color: '#10B981',
    },
    photosScroll: {
        flexDirection: 'row',
    },
    photoThumb: {
        width: 96,
        height: 96,
        borderRadius: 16,
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    emptyState: {
        width: '100%',
        paddingVertical: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        alignItems: 'center',
    },
    emptyStateText: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    descriptionBox: {
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    descriptionText: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 22,
    },
    locationBox: {
        backgroundColor: '#ECFDF5',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#D1FAE5',
        padding: 16,
        position: 'relative',
        overflow: 'hidden',
    },
    decorativePin: {
        position: 'absolute',
        right: -16,
        bottom: -16,
        opacity: 0.5,
        transform: [{ rotate: '12deg' }],
    },
    locationContent: {
        flexDirection: 'row',
        gap: 16,
        zIndex: 10,
    },
    locationIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
    },
    locationInfo: {
        flex: 1,
    },
    locationLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#059669',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    locationAddress: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        lineHeight: 20,
    },
    coordinates: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginTop: 6,
    },
    coordinatesText: {
        fontSize: 10,
        fontFamily: 'monospace',
        color: '#6B7280',
    },
    coordinatesSeparator: {
        width: 2,
        height: 12,
        backgroundColor: '#D1D5DB',
    },
});

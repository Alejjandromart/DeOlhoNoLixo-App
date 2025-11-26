import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, Animated } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ReportData } from '../DenunciaIA';
import AlertModal from './AlertModal';
import PhotoChoiceModal from './PhotoChoiceModal';

interface Props {
    data: ReportData;
    updateData: (data: Partial<ReportData>) => void;
}

export default function Step1PhotosLocation({ data, updateData }: Props) {
    const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success'>(
        data.location ? 'success' : 'idle'
    );
    const [showPhotoChoiceModal, setShowPhotoChoiceModal] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        type: 'warning' as 'success' | 'warning' | 'error' | 'info',
        title: '',
        message: '',
    });
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const MAX_PHOTOS = 3;

    useEffect(() => {
        if (locationStatus === 'loading') {
            Animated.loop(
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                })
            ).start();
        } else {
            rotateAnim.setValue(0);
        }
    }, [locationStatus]);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const showAlert = (type: 'success' | 'warning' | 'error' | 'info', title: string, message: string) => {
        setAlertConfig({ type, title, message });
        setShowAlertModal(true);
    };

    const handleAddPhoto = async () => {
        if (data.photos.length >= MAX_PHOTOS) {
            showAlert('warning', 'Limite atingido', 'Você pode adicionar no máximo 3 fotos');
            return;
        }
        setShowPhotoChoiceModal(true);
    };

    const handleTakePhoto = async () => {
        setShowPhotoChoiceModal(false);
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            updateData({ photos: [...data.photos, result.assets[0].uri] });
        }
    };

    const handleChooseFromGallery = async () => {
        setShowPhotoChoiceModal(false);
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            quality: 0.8,
            selectionLimit: MAX_PHOTOS - data.photos.length,
        });

        if (!result.canceled) {
            const newPhotos = result.assets.map((asset) => asset.uri);
            updateData({ photos: [...data.photos, ...newPhotos].slice(0, MAX_PHOTOS) });
        }
    };

    const handleRemovePhoto = (index: number) => {
        const newPhotos = [...data.photos];
        newPhotos.splice(index, 1);
        updateData({ photos: newPhotos });
    };

    const handleLocate = async () => {
        try {
            setLocationStatus('loading');

            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                showAlert('error', 'Erro', 'Permissão de localização não concedida');
                setLocationStatus('idle');
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            const [address] = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            const formattedAddress = `${address.street || ''}, ${address.name || ''} - ${address.city || ''}, ${address.region || ''}`;

            updateData({
                location: formattedAddress,
                coordinates: {
                    lat: location.coords.latitude,
                    lng: location.coords.longitude,
                },
            });
            setLocationStatus('success');
        } catch (error) {
            console.error('Erro ao obter localização:', error);
            showAlert('error', 'Erro', 'Não foi possível obter a localização');
            setLocationStatus('idle');
        }
    };

    return (
        <View style={styles.container}>
            {/* Photos Section */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Adicionar Fotos</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                            {data.photos.length}/{MAX_PHOTOS} Máx
                        </Text>
                    </View>
                </View>

                <View style={styles.photosGrid}>
                    {data.photos.map((photo, index) => (
                        <View key={index} style={styles.photoContainer}>
                            <Image source={{ uri: photo }} style={styles.photo} />
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => handleRemovePhoto(index)}
                            >
                                <Ionicons name="close" size={14} color="#EF4444" />
                            </TouchableOpacity>
                        </View>
                    ))}

                    {data.photos.length < MAX_PHOTOS && (
                        <TouchableOpacity style={styles.addPhotoButton} onPress={handleAddPhoto}>
                            <View style={styles.addPhotoIcon}>
                                <Ionicons name="add" size={20} color="#10B981" />
                            </View>
                            <Text style={styles.addPhotoText}>Adicionar</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {data.photos.length < MAX_PHOTOS ? (
                    <TouchableOpacity style={styles.galleryButton} onPress={handleAddPhoto}>
                        <Ionicons name="images-outline" size={18} color="#059669" />
                        <Text style={styles.galleryButtonText}>Adicionar foto</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.galleryButtonDisabled}>
                        <Ionicons name="images-outline" size={18} color="#9CA3AF" />
                        <Text style={styles.galleryButtonTextDisabled}>Limite de fotos atingido</Text>
                    </View>
                )}
            </View>

            {/* Location Section */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Localizar</Text>

                <Text style={styles.locationLabel}>Endereço</Text>
                <View style={styles.locationContainer}>
                    <TouchableOpacity
                        style={[
                            styles.gpsButton,
                            locationStatus === 'loading' && styles.gpsButtonLoading,
                        ]}
                        onPress={handleLocate}
                        disabled={locationStatus === 'loading'}
                    >
                        {locationStatus === 'loading' ? (
                            <Animated.View style={{ transform: [{ rotate: spin }] }}>
                                <Ionicons
                                    name="sync"
                                    size={24}
                                    color="#3B82F6"
                                />
                            </Animated.View>
                        ) : (
                            <Ionicons
                                name="location"
                                size={24}
                                color="#10B981"
                            />
                        )}
                    </TouchableOpacity>

                    <View style={styles.locationInputContainer}>
                        <TextInput
                            style={styles.locationInput}
                            value={data.location}
                            onChangeText={(text) => updateData({ location: text })}
                            placeholder="Digite o endereço ou use o GPS"
                            placeholderTextColor="#9CA3AF"
                            multiline
                            numberOfLines={2}
                        />
                        {locationStatus === 'success' && (
                            <Ionicons
                                name="checkmark-circle"
                                size={18}
                                color="#10B981"
                                style={styles.checkIcon}
                            />
                        )}
                    </View>
                </View>

                <Text style={styles.locationHint}>
                    {locationStatus === 'loading'
                        ? 'Buscando coordenadas via satélite...'
                        : 'Toque no ícone de mapa para buscar automático.'}
                </Text>
            </View>

            <Text style={styles.footerText}>
                As fotos são limitadas a 3 para garantir um envio rápido. A IA analisará o local
                automaticamente.
            </Text>

            <PhotoChoiceModal
                visible={showPhotoChoiceModal}
                onTakePhoto={handleTakePhoto}
                onChooseGallery={handleChooseFromGallery}
                onCancel={() => setShowPhotoChoiceModal(false)}
            />

            <AlertModal
                visible={showAlertModal}
                type={alertConfig.type}
                title={alertConfig.title}
                message={alertConfig.message}
                onConfirm={() => setShowAlertModal(false)}
            />
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
    badge: {
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#9CA3AF',
    },
    photosGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 16,
    },
    photoContainer: {
        width: '30%',
        aspectRatio: 1,
        position: 'relative',
    },
    photo: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    removeButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    addPhotoButton: {
        width: '30%',
        aspectRatio: 1,
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#D1FAE5',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addPhotoIcon: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
    },
    addPhotoText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#10B981',
        marginTop: 8,
    },
    galleryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ECFDF5',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },
    galleryButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#059669',
    },
    galleryButtonDisabled: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9FAFB',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
    },
    galleryButtonTextDisabled: {
        fontSize: 14,
        fontWeight: '500',
        color: '#9CA3AF',
    },
    locationContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
        alignItems: 'center',
    },
    gpsButton: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: '#ECFDF5',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#D1FAE5',
    },
    gpsButtonLoading: {
        backgroundColor: '#EFF6FF',
        borderColor: '#BFDBFE',
    },
    locationInputContainer: {
        flex: 1,
        position: 'relative',
    },
    locationLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#10B981',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
        marginTop: 16,
    },
    locationInput: {
        backgroundColor: '#F3F4F6',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingRight: 40,
        fontSize: 14,
        fontWeight: '500',
        color: '#1F2937',
        minHeight: 56,
        maxHeight: 80,
        textAlignVertical: 'top',
    },
    checkIcon: {
        position: 'absolute',
        right: 16,
        top: '50%',
        marginTop: -9,
    },
    locationHint: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 12,
        paddingHorizontal: 4,
    },
    footerText: {
        fontSize: 12,
        color: '#9CA3AF',
        textAlign: 'center',
        lineHeight: 18,
        paddingHorizontal: 16,
    },
});

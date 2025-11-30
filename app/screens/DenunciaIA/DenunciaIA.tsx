import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useAuth } from '../../context/AuthContext';
import { useDenuncias } from '../../context/DenunciaContext';
import { addDenunciaToFeed, FeedDenuncia } from '../../services/feedService';

import Header from '../DenunciaIA/components/Header';
import ProgressIndicator from '../DenunciaIA/components/ProgressIndicator';
import Step1PhotosLocation from '../DenunciaIA/components/Step1PhotosLocation';
import Step2Description from '../DenunciaIA/components/Step2Description';
import Step3Review from '../DenunciaIA/components/Step3Review';
import SuccessScreen from '../DenunciaIA/components/SuccessScreen';
import CancelModal from '../DenunciaIA/components/CancelModal';
import StepButton from '../DenunciaIA/components/StepButton';
import AlertModal from '../DenunciaIA/components/AlertModal';

export enum Step {
    PhotosAndLocation = 1,
    AnalysisAndDescription = 2,
    Review = 3,
    Success = 4,
}

export interface ReportData {
    id: string;
    photos: string[];
    location: string;
    coordinates?: { lat: number; lng: number };
    description: string;
    category: string;
    aiAnalysis?: {
        severity: string;
        tags: string[];
    };
}

export default function DenunciaIA() {
    const navigation = useNavigation();
    const { user } = useAuth();
    const { adicionarDenuncia, contarDenunciasMesAtual } = useDenuncias();

    const [currentStep, setCurrentStep] = useState<number>(Step.PhotosAndLocation);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        type: 'warning' as 'success' | 'warning' | 'error' | 'info',
        title: '',
        message: '',
    });
    const [reportData, setReportData] = useState<ReportData>({
        id: Math.random().toString(36).substring(7),
        photos: [],
        location: '',
        description: '',
        category: 'ambiental',
    });

    const updateData = (newData: Partial<ReportData>) => {
        setReportData((prev) => ({ ...prev, ...newData }));
    };

    const showAlert = (type: 'success' | 'warning' | 'error' | 'info', title: string, message: string) => {
        setAlertConfig({ type, title, message });
        setShowAlertModal(true);
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        } else {
            handleCancel();
        }
    };

    const handleNext = () => {
        if (currentStep === Step.PhotosAndLocation) {
            if (reportData.photos.length === 0) {
                showAlert('warning', 'Atenção', 'Por favor, adicione pelo menos uma foto.');
                return;
            }
            if (!reportData.location) {
                showAlert('warning', 'Atenção', 'Por favor, indique a localização.');
                return;
            }
        }
        if (currentStep === Step.AnalysisAndDescription) {
            if (!reportData.description.trim()) {
                showAlert('warning', 'Atenção', 'A descrição não pode estar vazia.');
                return;
            }
        }
        setCurrentStep((prev) => prev + 1);
    };

    const handleEditStep = (step: number) => {
        setCurrentStep(step);
    };

    const handleSubmit = async () => {
        if (!user?.email) {
            showAlert('error', 'Erro', 'Usuário não autenticado.');
            return;
        }

        try {
            setIsSubmitting(true);

            // Verificar limite mensal
            const denunciasNoMes = await contarDenunciasMesAtual(user.email);
            if (denunciasNoMes >= 5) {
                showAlert(
                    'warning',
                    'Limite atingido',
                    'Você já realizou 5 denúncias este mês. Tente novamente no próximo mês.'
                );
                return;
            }

            // Preparar dados da denúncia no formato correto do Context
            const novaDenuncia = {
                usuario: {
                    nome: user.email || 'Usuário Anônimo',
                    avatar: undefined,
                },
                imagens: reportData.photos,
                descricao: reportData.description || 'Denúncia registrada pela análise inteligente.',
                localizacao: reportData.location || 'Localização não especificada',
                latitude: reportData.coordinates?.lat,
                longitude: reportData.coordinates?.lng,
                tipos: reportData.aiAnalysis?.tags || ['IA'],
                timestamp: new Date(), // Objeto Date, não string
            };

            console.log('📤 Enviando denúncia:', novaDenuncia);

            // Adicionar ao Context (local)
            adicionarDenuncia(novaDenuncia);

            // 1. Enviar ao BackendRedis (feed com cache)
            try {
                const feedDenuncia: FeedDenuncia = {
                    id: reportData.id,
                    description: reportData.description || 'Denúncia registrada pela análise inteligente.',
                    category: reportData.aiAnalysis?.tags?.[0] || 'Ambiental',
                    timestamp: new Date().toISOString(),
                    severity: reportData.aiAnalysis?.severity || 'Média',
                    geographicContext: reportData.location || 'Localização não especificada',
                    environmentalImpact: reportData.description || 'Impacto não especificado',
                    images: reportData.photos,
                    location: reportData.coordinates ? {
                        latitude: reportData.coordinates.lat,
                        longitude: reportData.coordinates.lng,
                        address: reportData.location,
                    } : undefined,
                    userId: user.email,
                };

                await addDenunciaToFeed(feedDenuncia);
                console.log('✅ Denúncia adicionada ao feed com cache Redis');
            } catch (feedError) {
                console.warn('⚠️ Erro ao adicionar ao feed (continuando):', feedError);
                // Não bloqueia o fluxo se o feed falhar
            }

            // 2. Notificar órgão responsável via email
            try {
                console.log('📧 Notificando órgão responsável...');
                
                const formData = new FormData();
                
                // Adicionar imagens
                for (let i = 0; i < reportData.photos.length; i++) {
                    formData.append('files', {
                        uri: reportData.photos[i],
                        type: 'image/jpeg',
                        name: `image_${i}.jpg`,
                    } as any);
                }
                
                // Adicionar coordenadas
                if (reportData.coordinates) {
                    formData.append('latitude', reportData.coordinates.lat.toString());
                    formData.append('longitude', reportData.coordinates.lng.toString());
                }
                
                // Adicionar informações da denúncia
                formData.append('localizacao', reportData.location || 'Localização não especificada');
                formData.append('usuario', user.email || 'Anônimo');
                formData.append('categoria', reportData.category || 'ambiental');
                
                console.log('🌐 Enviando para:', 'http://192.168.0.3:8000/analyze-and-notify');
                
                const notifyResponse = await fetch('http://192.168.0.3:8000/analyze-and-notify', {
                    method: 'POST',
                    body: formData,
                });
                
                console.log('📡 Status da resposta:', notifyResponse.status);
                
                if (notifyResponse.ok) {
                    const notifyResult = await notifyResponse.json();
                    console.log('✅ Resposta completa:', JSON.stringify(notifyResult, null, 2));
                    console.log('📧 Email enviado para:', notifyResult.orgao?.email);
                } else {
                    const errorText = await notifyResponse.text();
                    console.error('❌ Erro ao notificar:', errorText);
                }
            } catch (emailError) {
                console.warn('⚠️ Erro ao enviar email (continuando):', emailError);
                // Não bloqueia o fluxo se o email falhar
            }

            console.log('✅ Denúncia enviada com sucesso!');
            setCurrentStep(Step.Success);
        } catch (error) {
            console.error('❌ Erro ao enviar denúncia:', error);
            showAlert('error', 'Erro', 'Não foi possível enviar a denúncia. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (reportData.photos.length > 0 || reportData.location || reportData.description) {
            setShowCancelModal(true);
        } else {
            navigation.goBack();
        }
    };

    const confirmCancel = () => {
        setReportData({
            id: Math.random().toString(36).substring(7),
            photos: [],
            location: '',
            description: '',
            category: 'ambiental',
        });
        setCurrentStep(Step.PhotosAndLocation);
        setShowCancelModal(false);
        navigation.goBack();
    };

    // Success Screen
    if (currentStep === Step.Success) {
        return <SuccessScreen onBackToHome={() => navigation.goBack()} />;
    }

    const getStepTitle = () => {
        switch (currentStep) {
            case 1:
                return 'Realizar Denúncia';
            case 2:
                return 'Análise Inteligente';
            case 3:
                return 'Revisar Denúncia';
            default:
                return 'Denúncia IA';
        }
    };

    return (
        <LinearGradient colors={['#F9FAFB', '#F3F4F6']} style={styles.container}>
            <Header
                title={getStepTitle()}
                onBack={handleBack}
                onCancel={handleCancel}
                canGoBack={currentStep > 1}
            />

            <ProgressIndicator currentStep={currentStep} totalSteps={3} />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {currentStep === Step.PhotosAndLocation && (
                    <Step1PhotosLocation data={reportData} updateData={updateData} />
                )}
                {currentStep === Step.AnalysisAndDescription && (
                    <Step2Description data={reportData} updateData={updateData} />
                )}
                {currentStep === Step.Review && (
                    <Step3Review data={reportData} onEditStep={handleEditStep} />
                )}
            </ScrollView>

            <StepButton
                currentStep={currentStep}
                onPress={currentStep === 3 ? handleSubmit : handleNext}
                label={
                    currentStep === 3
                        ? isSubmitting
                            ? 'Enviando...'
                            : 'Enviar Denúncia'
                        : 'Continuar'
                }
                disabled={isSubmitting}
            />

            <CancelModal
                visible={showCancelModal}
                onCancel={() => setShowCancelModal(false)}
                onConfirm={confirmCancel}
            />

            <AlertModal
                visible={showAlertModal}
                type={alertConfig.type}
                title={alertConfig.title}
                message={alertConfig.message}
                onConfirm={() => setShowAlertModal(false)}
            />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
});

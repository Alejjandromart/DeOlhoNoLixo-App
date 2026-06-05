import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useAuth } from '../../context/AuthContext';
import { useDenuncias } from '../../context/DenunciaContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

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
    photosBase64?: string[];
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
    const { adicionarDenuncia } = useDenuncias();

    const [currentStep, setCurrentStep] = useState<number>(Step.PhotosAndLocation);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const submittingRef = useRef(false);
    const [alertConfig, setAlertConfig] = useState({
        type: 'warning' as 'success' | 'warning' | 'error' | 'info',
        title: '',
        message: '',
    });
    const [reportData, setReportData] = useState<ReportData>({
        id: Math.random().toString(36).substring(7),
        photos: [],
        photosBase64: [],
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
        if (submittingRef.current) return;
        
        let sucesso = false;
        try {
            submittingRef.current = true;
            setIsSubmitting(true);
            let nomeUsuario = user?.displayName ?? user?.email?.split('@')[0] ?? 'Usuário';
            let avatar = null;

            if (user) {
                try {
                    const docRef = doc(db, 'users', user.uid);
                    const snap = await getDoc(docRef);
                    if (snap.exists()) {
                        nomeUsuario = snap.data().displayName || snap.data().nome || nomeUsuario;
                        avatar = snap.data().photoBase64 || null;
                    }
                } catch (e) {
                    console.error('Erro ao buscar dados do usuário na denúncia IA:', e);
                }
            }
            
            await adicionarDenuncia({
                usuario: { 
                    nome: nomeUsuario,
                    avatar: avatar || undefined
                },
                localizacao: reportData.location,
                latitude: reportData.coordinates?.lat,
                longitude: reportData.coordinates?.lng,
                descricao: reportData.description,
                tipos: reportData.aiAnalysis?.tags ?? [reportData.category],
                categoria: reportData.category,
                imagensLocais: reportData.photos,
                imagensBase64: reportData.photosBase64,
            });
            sucesso = true;
            setCurrentStep(Step.Success);
        } catch (e) {
            showAlert('error', 'Erro', 'Não foi possível enviar a denúncia. Tente novamente.');
            console.error(e);
        } finally {
            setIsSubmitting(false);
            if (!sucesso) {
                submittingRef.current = false;
            }
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
        return <SuccessScreen onBackToHome={() => navigation.goBack()} reportData={reportData} />;
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
                    <Step2Description 
                        data={reportData} 
                        updateData={updateData} 
                        onGoBackToStep1={() => setCurrentStep(Step.PhotosAndLocation)}
                    />
                )}
                {currentStep === Step.Review && (
                    <Step3Review data={reportData} onEditStep={handleEditStep} />
                )}
            </ScrollView>

            <StepButton
                currentStep={currentStep}
                onPress={currentStep === 3 ? handleSubmit : handleNext}
                label={currentStep === 3 ? 'Enviar Denúncia' : 'Continuar'}
                loading={isSubmitting}
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

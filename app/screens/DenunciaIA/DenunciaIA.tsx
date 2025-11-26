import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useAuth } from '../../context/AuthContext';

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

    const [currentStep, setCurrentStep] = useState<number>(Step.PhotosAndLocation);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);
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

    const handleSubmit = () => {
        console.log('Submitting report:', reportData);
        setCurrentStep(Step.Success);
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
                label={currentStep === 3 ? 'Enviar Denúncia' : 'Continuar'}
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

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Constants from 'expo-constants';
import { ReportData } from '../DenunciaIA';
import AnalyzingState from './AnalyzingState';
import AlertModal from './AlertModal';

const BACKEND_URL = (Constants.expoConfig?.extra?.backendUrl as string) ?? 'https://deolho-ia.onrender.com';
const BACKEND_API_KEY = (Constants.expoConfig?.extra?.backendApiKey as string) ?? '';

interface Props {
  data: ReportData;
  updateData: (data: Partial<ReportData>) => void;
  onGoBackToStep1?: () => void;
}

export default function Step2Description({ data, updateData, onGoBackToStep1 }: Props) {
  const [isAnalyzing, setIsAnalyzing] = useState(data.description.length === 0);
  const [error, setError] = useState<string | null>(null);
  
  // AlertModal State
  const [showLocalAlert, setShowLocalAlert] = useState(false);
  const [localAlertConfig, setLocalAlertConfig] = useState({
    type: 'warning' as 'success' | 'warning' | 'error' | 'info',
    title: '',
    message: '',
    confirmText: 'OK',
    onConfirm: () => {},
    showCancel: false,
    cancelText: 'Cancelar',
    onCancel: () => {},
  });

  useEffect(() => {
    if (!isAnalyzing) return;
    analisarImagens();
  }, []);

  const analisarImagens = async () => {
    try {
      const payload = {
        images: data.photosBase64 || [],
        latitude: data.coordinates?.lat || null,
        longitude: data.coordinates?.lng || null,
      };

      const response = await fetch(`${BACKEND_URL}/analyze-base64`, {
        method: 'POST',
        headers: { 
          'X-API-Key': BACKEND_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMsg = 'Erro na análise da IA.';
        try {
          const errBody = await response.json();
          if (errBody && errBody.detail) {
            errorMsg = errBody.detail;
          }
        } catch {}
        throw new Error(errorMsg);
      }

      const result = await response.json();

      updateData({
        description: result.suggestedDescription ?? '',
        category: result.suggestedCategory ?? 'Ambiental',
        aiAnalysis: {
          severity: result.severity ?? 'Médio',
          tags: result.objectsDetected ?? [],
        },
      });
    } catch (e: any) {
      console.error('Erro na análise da IA:', e);
      
      const isInvalidImage = e.message && (
        e.message.includes('não parece conter') || 
        e.message.includes('lixo ou poluição')
      );

      if (isInvalidImage) {
        setLocalAlertConfig({
          type: 'warning',
          title: 'Imagem Inválida',
          message: e.message,
          confirmText: 'Tirar outra foto',
          onConfirm: () => {
            if (onGoBackToStep1) {
              onGoBackToStep1();
            }
          },
          showCancel: false,
          cancelText: 'Cancelar',
          onCancel: () => {},
        });
        setShowLocalAlert(true);
      } else {
        setLocalAlertConfig({
          type: 'error',
          title: 'Falha na Análise',
          message: e.message || 'Não foi possível analisar as imagens.',
          confirmText: 'Tirar outra foto',
          onConfirm: () => {
            if (onGoBackToStep1) {
              onGoBackToStep1();
            }
          },
          showCancel: true,
          cancelText: 'Digitar manualmente',
          onCancel: () => {
            setError(e.message || 'Não foi possível analisar as imagens. Escreva a descrição manualmente.');
            updateData({ description: '' });
          },
        });
        setShowLocalAlert(true);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzing) {
    return <AnalyzingState onComplete={() => {}} />;
  }

  return (
    <View style={styles.container}>
      {error && (
        <View style={styles.errorCard}>
          <Ionicons name="warning-outline" size={18} color="#DC2626" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Descrição</Text>
          {!error && (
            <View style={styles.aiBadge}>
              <Ionicons name="sparkles" size={12} color="#8B5CF6" />
              <Text style={styles.aiBadgeText}>Sugestão da IA</Text>
            </View>
          )}
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
            maxLength={500}
          />
          <View style={styles.charCounter}>
            <Text style={styles.charCounterText}>{data.description.length}/500</Text>
          </View>
        </View>

        {data.aiAnalysis && data.aiAnalysis.tags && data.aiAnalysis.tags.length > 0 && (
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

      <View style={styles.infoCard}>
        <View style={styles.infoIconContainer}>
          <Ionicons name="create-outline" size={18} color="#059669" />
        </View>
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>Revise o texto</Text>
          <Text style={styles.infoText}>
            {error
              ? 'Escreva uma descrição detalhada do problema encontrado.'
              : 'A inteligência artificial gerou este texto com base nas imagens. Sinta-se à vontade para editar.'}
          </Text>
        </View>
      </View>

      <AlertModal
        visible={showLocalAlert}
        type={localAlertConfig.type}
        title={localAlertConfig.title}
        message={localAlertConfig.message}
        confirmText={localAlertConfig.confirmText}
        onConfirm={() => {
          setShowLocalAlert(false);
          localAlertConfig.onConfirm();
        }}
        showCancel={localAlertConfig.showCancel}
        cancelText={localAlertConfig.cancelText}
        onCancel={() => {
          setShowLocalAlert(false);
          localAlertConfig.onCancel();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
  errorCard: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FEF2F2', padding: 12, borderRadius: 12,
    borderWidth: 1, borderColor: '#FECACA',
  },
  errorText: { flex: 1, fontSize: 13, color: '#DC2626' },
  card: {
    backgroundColor: '#FFFFFF', padding: 20, borderRadius: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 2, elevation: 2,
    borderWidth: 1, borderColor: '#F3F4F6',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  aiBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#F5F3FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12,
  },
  aiBadgeText: { fontSize: 12, fontWeight: '600', color: '#8B5CF6' },
  textAreaContainer: { position: 'relative' },
  textArea: {
    backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB',
    borderRadius: 16, padding: 16, fontSize: 14, color: '#1F2937', minHeight: 160,
  },
  charCounter: {
    position: 'absolute', bottom: 12, right: 12,
    backgroundColor: 'rgba(255,255,255,0.8)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
  },
  charCounterText: { fontSize: 12, color: '#9CA3AF' },
  tagsContainer: { marginTop: 16 },
  tagsLabel: { fontSize: 10, fontWeight: '700', color: '#9CA3AF', letterSpacing: 0.5, marginBottom: 8 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 8, borderWidth: 1, borderColor: '#D1FAE5', elevation: 1,
  },
  tagText: { fontSize: 12, fontWeight: '600', color: '#059669' },
  infoCard: {
    flexDirection: 'row', backgroundColor: '#ECFDF5', padding: 16,
    borderRadius: 16, borderWidth: 1, borderColor: '#D1FAE5', gap: 12,
  },
  infoIconContainer: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF',
    justifyContent: 'center', alignItems: 'center', elevation: 1,
  },
  infoContent: { flex: 1 },
  infoTitle: { fontSize: 14, fontWeight: '600', color: '#065F46', marginBottom: 4 },
  infoText: { fontSize: 12, color: '#059669', lineHeight: 18 },
});

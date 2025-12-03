import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FiltrosDenuncia } from '../../context/DenunciaContext';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filtros: FiltrosDenuncia) => void;
  filtrosAtuais?: FiltrosDenuncia;
}

const STATUS_OPTIONS = [
  { label: 'Pendente', value: 'pendente' },
  { label: 'Em Andamento', value: 'em andamento' },
  { label: 'Em Análise', value: 'em análise' },
  { label: 'Resolvido', value: 'resolvido' },
];

const TIPO_OPTIONS = [
  { label: 'Doméstico', value: 'doméstico' },
  { label: 'Plástico', value: 'plástico' },
  { label: 'Orgânico', value: 'orgânico' },
  { label: 'Entulho', value: 'entulho' },
  { label: 'Eletrônico', value: 'eletrônico' },
  { label: 'Metal', value: 'metal' },
  { label: 'Vidro', value: 'vidro' },
  { label: 'Papel', value: 'papel' },
];

const PERIODO_OPTIONS = [
  { label: 'Últimas 24 horas', dias: 1 },
  { label: 'Última semana', dias: 7 },
  { label: 'Último mês', dias: 30 },
  { label: 'Últimos 3 meses', dias: 90 },
];

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApplyFilters,
  filtrosAtuais = {},
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string[]>(filtrosAtuais.status || []);
  const [selectedTipos, setSelectedTipos] = useState<string[]>(filtrosAtuais.tipos || []);
  const [selectedPeriodo, setSelectedPeriodo] = useState<number | null>(null);

  const toggleStatus = (value: string) => {
    setSelectedStatus(prev =>
      prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
    );
  };

  const toggleTipo = (value: string) => {
    setSelectedTipos(prev =>
      prev.includes(value) ? prev.filter(t => t !== value) : [...prev, value]
    );
  };

  const setPeriodo = (dias: number) => {
    setSelectedPeriodo(dias);
  };

  const handleApply = () => {
    const filtros: FiltrosDenuncia = {};

    if (selectedStatus.length > 0) {
      filtros.status = selectedStatus;
    }

    if (selectedTipos.length > 0) {
      filtros.tipos = selectedTipos;
    }

    if (selectedPeriodo) {
      const dataFim = new Date();
      const dataInicio = new Date();
      dataInicio.setDate(dataInicio.getDate() - selectedPeriodo);
      filtros.dataInicio = dataInicio;
      filtros.dataFim = dataFim;
    }

    onApplyFilters(filtros);
    onClose();
  };

  const handleClear = () => {
    setSelectedStatus([]);
    setSelectedTipos([]);
    setSelectedPeriodo(null);
  };

  const hasFilters = selectedStatus.length > 0 || selectedTipos.length > 0 || selectedPeriodo !== null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={styles.title}>Filtrar Denúncias</Text>
            <TouchableOpacity onPress={handleClear} disabled={!hasFilters}>
              <Text style={[styles.clearText, !hasFilters && styles.clearTextDisabled]}>
                Limpar
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Filtro por Status */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Status</Text>
              <View style={styles.optionsGrid}>
                {STATUS_OPTIONS.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.chip,
                      selectedStatus.includes(option.value) && styles.chipSelected,
                    ]}
                    onPress={() => toggleStatus(option.value)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedStatus.includes(option.value) && styles.chipTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {selectedStatus.includes(option.value) && (
                      <Ionicons name="checkmark-circle" size={16} color="#FFF" style={styles.checkIcon} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Filtro por Tipo de Resíduo */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tipo de Resíduo</Text>
              <View style={styles.optionsGrid}>
                {TIPO_OPTIONS.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.chip,
                      selectedTipos.includes(option.value) && styles.chipSelected,
                    ]}
                    onPress={() => toggleTipo(option.value)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedTipos.includes(option.value) && styles.chipTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {selectedTipos.includes(option.value) && (
                      <Ionicons name="checkmark-circle" size={16} color="#FFF" style={styles.checkIcon} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Filtro por Período */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Período</Text>
              {PERIODO_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option.dias}
                  style={styles.radioOption}
                  onPress={() => setPeriodo(option.dias)}
                >
                  <View style={styles.radioButton}>
                    {selectedPeriodo === option.dias && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                  <Text style={styles.radioText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.applyButton, !hasFilters && styles.applyButtonDisabled]}
              onPress={handleApply}
              disabled={!hasFilters}
            >
              <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  clearText: {
    fontSize: 16,
    color: '#0A7D6F',
    fontWeight: '600',
  },
  clearTextDisabled: {
    color: '#CCC',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  chipSelected: {
    backgroundColor: '#0A7D6F',
    borderColor: '#0A7D6F',
  },
  chipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#FFF',
  },
  checkIcon: {
    marginLeft: 6,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#0A7D6F',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0A7D6F',
  },
  radioText: {
    fontSize: 15,
    color: '#333',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  applyButton: {
    backgroundColor: '#0A7D6F',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonDisabled: {
    backgroundColor: '#CCC',
  },
  applyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FilterModal;

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

interface TermosCondicoesProps {
  visivel: boolean;
  aoFechar: () => void;
}

export default function TermosCondicoes({ visivel, aoFechar }: TermosCondicoesProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visivel}
      animationType="slide"
      transparent={false}
      statusBarTranslucent
      onRequestClose={aoFechar}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.botaoFechar} onPress={aoFechar}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.titulo}>Termos e Condições</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={[styles.conteudo, { paddingBottom: insets.bottom + 32 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.bannerAcademico}>
            <Ionicons name="school-outline" size={22} color="#0A7D6F" />
            <Text style={styles.bannerTexto}>
              Este é um projeto acadêmico da UFAM. Nenhum dado é usado comercialmente.
            </Text>
          </View>

          <Secao
            icone="trash-outline"
            titulo="1. O que é o DeOlhoNoLixo?"
            texto={
              'O DeOlhoNoLixo é um app acadêmico desenvolvido na Universidade Federal do Amazonas (UFAM) para a disciplina de Qualidade de Software.\n\nSua missão é simples: ajudar a comunidade a denunciar descarte irregular de lixo. Não somos o lixeiro, mas podemos chamar um! 🗑️'
            }
          />

          <Secao
            icone="person-outline"
            titulo="2. Seus Dados (quase nada, prometemos)"
            texto={
              'Coletamos apenas:\n• Nome de usuário\n• E-mail (para login)\n• Fotos e localização das denúncias (só quando você enviar)\n\nNão vendemos seus dados. Não sabemos nem o que faríamos com eles. Somos estudantes. 📚'
            }
          />

          <Secao
            icone="camera-outline"
            titulo="3. Conteúdo Enviado"
            texto={
              'Ao enviar uma denúncia, você confirma que:\n• As fotos são de locais públicos\n• O conteúdo é verdadeiro (sem trolagem, por favor 🙏)\n• Não viola a privacidade de terceiros\n\nDenúncias falsas ou ofensivas podem ser removidas sem aviso.'
            }
          />

          <Secao
            icone="globe-outline"
            titulo="4. Visibilidade das Denúncias"
            texto={
              'Suas denúncias ficam visíveis para outros usuários do app. Pense bem antes de postar aquela foto embaraçosa do lixo na casa do vizinho. 👀\n\nOs dados também podem ser usados em apresentações acadêmicas — anonimizados, claro.'
            }
          />

          <Secao
            icone="construct-outline"
            titulo="5. Limitações (aka o app pode buggar)"
            texto={
              'Este app foi feito por estudantes com muito café e poucas horas de sono. Pode haver bugs, lentidões ou comportamentos inesperados.\n\nNão nos responsabilizamos por:\n• Lixo não coletado após a denúncia\n• Notas baixas no semestre\n• Estresse causado pelo uso do app ☕'
            }
          />

          <Secao
            icone="shield-checkmark-outline"
            titulo="6. Segurança"
            texto={
              'Usamos Firebase (Google) para autenticação e armazenamento. Seus dados estão protegidos conforme os padrões da plataforma.\n\nSe encontrar alguma vulnerabilidade, por favor avise a gente antes de virar manchete. 🔐'
            }
          />

          <Secao
            icone="heart-outline"
            titulo="7. Uso Responsável"
            texto={
              'Use o app para o bem: denuncie lixo irregular, ajude sua comunidade e contribua para um Amazonas mais limpo.\n\nNão use para spam, conteúdo ofensivo ou qualquer coisa que sua avó ficaria com vergonha de ver. 👵'
            }
          />

          <Secao
            icone="refresh-outline"
            titulo="8. Atualizações"
            texto={
              'Podemos atualizar estes termos a qualquer momento conforme o projeto evoluir. Você será notificado pelas vias do caos acadêmico habitual (provavelmente não).\n\nÚltima atualização: Junho/2026'
            }
          />

          <View style={styles.rodape}>
            <Text style={styles.rodapeTexto}>
              Feito com 💚 na UFAM — Qualidade de Software 2025/2026
            </Text>
          </View>

          <TouchableOpacity style={styles.botaoEntendi} onPress={aoFechar}>
            <Text style={styles.botaoEntendiTexto}>Entendido! Vamos lá 🚀</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

function Secao({ icone, titulo, texto }: { icone: any; titulo: string; texto: string }) {
  return (
    <View style={styles.secao}>
      <View style={styles.secaoHeader}>
        <View style={styles.secaoIcone}>
          <Ionicons name={icone} size={18} color="#0A7D6F" />
        </View>
        <Text style={styles.secaoTitulo}>{titulo}</Text>
      </View>
      <Text style={styles.secaoTexto}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    justifyContent: 'space-between',
  },
  botaoFechar: { padding: 8 },
  titulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    textAlign: 'center',
  },
  conteudo: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  bannerAcademico: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#0A7D6F',
  },
  bannerTexto: {
    flex: 1,
    fontSize: 13,
    color: '#0A7D6F',
    fontWeight: '600',
    lineHeight: 18,
  },
  secao: {
    marginBottom: 24,
  },
  secaoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  secaoIcone: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secaoTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
  },
  secaoTexto: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
    paddingLeft: 42,
  },
  rodape: {
    paddingVertical: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    marginTop: 8,
    marginBottom: 16,
  },
  rodapeTexto: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
  },
  botaoEntendi: {
    backgroundColor: '#0A7D6F',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 8,
  },
  botaoEntendiTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

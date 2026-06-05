# Task 3: Corrigir Telas Críticas + Limpeza de Código Morto

> **Dependências:** Task 1 (firebase.ts), Task 2 (DenunciaContext com Firestore)
> **Arquitetura:** React Native screens + Firebase Auth `updateProfile` + Firestore `users/`
> **Tech Stack:** TypeScript, firebase/auth, firebase/firestore, React Navigation

---

## 🛠️ Especificação

### 1. Objetivo
Fechar os 3 bugs críticos que impedem o app de funcionar como produto real:
1. **ProfileScreen**: exibe dados hardcoded e botão salvar não faz nada
2. **DenunciaIA.handleSubmit**: vai para tela de sucesso sem salvar nada
3. **RootStack.tsx**: arquivo morto que causa confusão e nunca é usado

Além disso, remover os ~15 `console.log` de debug espalhados no código de produção.

### 2. Modelo de Dados — Coleção `users`

```
users/{uid}
├── displayName: string    (nome de exibição)
├── email: string
├── cidade?: string
├── updatedAt: Timestamp
```

Criado automaticamente no primeiro `signUp` e atualizado pelo ProfileScreen.

### 3. Fluxo ProfileScreen
```
Montar → carregar doc users/{uid} do Firestore
Editar campos → estado local
Pressionar "Salvar" →
  updateProfile(auth.currentUser, { displayName })
  setDoc(doc(db,'users',uid), { displayName, email, cidade, updatedAt })
  Alert de sucesso
```

### 4. Fluxo DenunciaIA Submit
```
Step 3 (Revisão) → pressionar "Enviar Denúncia"
  → DenunciaIA.handleSubmit()
  → chamar adicionarDenuncia(reportData) do DenunciaContext
  → se sucesso → setCurrentStep(Step.Success)
  → se erro → showAlert('error', ...)
```

O `reportData.photos` já contém URIs locais. O `adicionarDenuncia` da Task 2 faz o upload para Storage automaticamente.

### 5. Criação do perfil no Cadastro
Além do `signUp` com Firebase Auth, o `Cadastro.tsx` deve criar o doc `users/{uid}` com os dados do formulário (`nomeCompleto`, `nomeUsuario`). Isso garante que o nome aparece no feed e no perfil.

### 6. Edge Cases
- **Doc `users/{uid}` não existe** (usuários criados antes desta task): `getDoc` retorna `exists() === false` → usar dados do `auth.currentUser` como fallback
- **`updateProfile` e `setDoc` falham**: tratar separadamente, mostrar erro específico
- **Nome vazio no submit**: validar antes de chamar `updateProfile`
- **Navegar para DenunciaEnviada sem salvar**: o `beforeRemove` listener do `RealizarDenuncia` já previne saída acidental — o mesmo padrão deve ser aplicado no DenunciaIA (Task já trata via `showCancelModal`)

### 7. Fora do Escopo
- Não implementar upload de foto de perfil (câmera → Storage) — baixa prioridade para os testes
- Não implementar edição de e-mail (requer reautenticação no Firebase)
- Não implementar deleção de conta

### 8. Critérios de Aceite
- [ ] ProfileScreen exibe nome e e-mail reais do usuário logado
- [ ] Botão "Salvar" persiste dados e exibe Alert de confirmação
- [ ] Fechar app e reabrir mantém dados do perfil
- [ ] DenunciaIA → tela de sucesso → denúncia aparece no feed global
- [ ] `RootStack.tsx` deletado — `git status` não mostra o arquivo
- [ ] Zero `console.log` em AuthContext, AuthNavigator e FeedScreen
- [ ] `npx expo start --clear` sem warnings de console

---

## 📂 Arquivos

### `app/screens/Home/ProfileScreen.tsx` — REESCREVER

```typescript
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  TextInput, ScrollView, KeyboardAvoidingView, Platform,
  ActivityIndicator, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [cidade, setCidade] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  // Carregar dados do Firestore ao montar
  useEffect(() => {
    const carregar = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, 'users', user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setDisplayName(data.displayName ?? user.displayName ?? '');
          setCidade(data.cidade ?? '');
        } else {
          // Usuário sem doc — usar dados do Auth como fallback
          setDisplayName(user.displayName ?? user.email?.split('@')[0] ?? '');
        }
      } catch (e) {
        console.error('Erro ao carregar perfil:', e);
      } finally {
        setCarregando(false);
      }
    };
    carregar();
  }, [user?.uid]);

  const handleSalvar = async () => {
    if (!user) return;
    if (!displayName.trim()) {
      Alert.alert('Atenção', 'O nome não pode estar vazio.');
      return;
    }
    try {
      setSalvando(true);
      // Atualizar Firebase Auth
      await updateProfile(auth.currentUser!, { displayName: displayName.trim() });
      // Atualizar Firestore
      await setDoc(doc(db, 'users', user.uid), {
        displayName: displayName.trim(),
        email: user.email,
        cidade: cidade.trim(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.');
      console.error('Erro ao salvar perfil:', e);
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E8E8E8' }}>
        <ActivityIndicator size="large" color="#076653" />
      </View>
    );
  }

  const iniciais = displayName
    ? displayName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Feather name="arrow-left" size={26} color="#333" />
      </TouchableOpacity>

      <Text style={styles.header}>Perfil</Text>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        <View style={styles.profileCardWrapper}>
          <View style={styles.imageContainer}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{iniciais}</Text>
            </View>
          </View>
          <View style={styles.profileCard}>
            <LinearGradient colors={['#076653', '#0A4338']} style={styles.profileGradient}>
              <Text style={styles.profileName}>{displayName || 'Seu nome'}</Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Nome de exibição</Text>
          <View style={styles.inputContainer}>
            <Feather name="user" size={20} color="#076653" style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="Seu nome" value={displayName}
              onChangeText={setDisplayName} placeholderTextColor="#999" />
          </View>

          <Text style={styles.sectionTitle}>E-mail</Text>
          <View style={[styles.inputContainer, styles.inputDisabled]}>
            <MaterialIcons name="email" size={20} color="#999" style={styles.inputIcon} />
            <TextInput style={[styles.input, { color: '#999' }]} value={user?.email ?? ''} editable={false} />
          </View>

          <Text style={styles.sectionTitle}>Cidade</Text>
          <View style={styles.inputContainer}>
            <Feather name="map-pin" size={20} color="#076653" style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="Sua cidade" value={cidade}
              onChangeText={setCidade} placeholderTextColor="#999" />
          </View>
        </View>

        <TouchableOpacity style={[styles.saveButton, salvando && { opacity: 0.6 }]}
          onPress={handleSalvar} disabled={salvando}>
          {salvando
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.saveButtonText}>Salvar alterações</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8E8E8' },
  backButton: {
    position: 'absolute', top: 50, left: 20, zIndex: 10,
    backgroundColor: 'white', borderRadius: 25, width: 50, height: 50,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15, shadowRadius: 5, elevation: 5,
  },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 55, marginBottom: 20, color: '#333' },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  profileCardWrapper: { alignItems: 'center', marginBottom: 70 },
  imageContainer: { position: 'relative', zIndex: 2, marginBottom: -55 },
  avatarCircle: {
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: '#076653', justifyContent: 'center', alignItems: 'center',
    borderWidth: 4, borderColor: 'white',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5,
  },
  avatarText: { color: 'white', fontSize: 36, fontWeight: '700' },
  profileCard: { width: '100%', borderRadius: 25, overflow: 'hidden', elevation: 8 },
  profileGradient: { alignItems: 'center', paddingTop: 65, paddingBottom: 25, paddingHorizontal: 20 },
  profileName: { color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 2 },
  profileEmail: { color: 'white', fontSize: 14, opacity: 0.8 },
  formContainer: { marginBottom: 2 },
  sectionTitle: { fontSize: 14, color: '#333', marginBottom: 8, marginTop: 5, fontWeight: '500' },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'white',
    borderRadius: 15, paddingHorizontal: 16, marginBottom: 18,
    borderWidth: 1, borderColor: '#E0E0E0', elevation: 2,
  },
  inputDisabled: { backgroundColor: '#F5F5F5' },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, paddingVertical: 16, fontSize: 16, color: '#333' },
  saveButton: {
    backgroundColor: '#A4D65E', borderRadius: 15, paddingVertical: 18,
    alignItems: 'center', marginTop: 15, elevation: 5,
  },
  saveButtonText: { color: 'white', fontSize: 17, fontWeight: 'bold', letterSpacing: 0.5 },
});
```

---

### `app/screens/DenunciaIA/DenunciaIA.tsx` — ALTERAR `handleSubmit`

```diff
+ import { useDenuncias } from '../../context/DenunciaContext';

  export default function DenunciaIA() {
    const navigation = useNavigation();
    const { user } = useAuth();
+   const { adicionarDenuncia } = useDenuncias();
    ...

-   const handleSubmit = () => {
-     console.log('Submitting report:', reportData);
-     setCurrentStep(Step.Success);
-   };

+   const handleSubmit = async () => {
+     try {
+       const nomeUsuario = user?.displayName
+         ?? user?.email?.split('@')[0]
+         ?? 'Usuário';
+       await adicionarDenuncia({
+         usuario: { nome: nomeUsuario },
+         localizacao: reportData.location,
+         latitude: reportData.coordinates?.lat,
+         longitude: reportData.coordinates?.lng,
+         descricao: reportData.description,
+         tipos: reportData.aiAnalysis?.tags ?? [reportData.category],
+         imagensLocais: reportData.photos,
+       });
+       setCurrentStep(Step.Success);
+     } catch (e) {
+       showAlert('error', 'Erro', 'Não foi possível enviar a denúncia. Tente novamente.');
+     }
+   };
```

---

### `app/screens/Auth/Cadastro.tsx` — CRIAR DOC `users/{uid}` NO SIGNUP

Após `signUp` bem-sucedido, adicionar:

```diff
  const { error } = await signUp(dados.email, dados.senha);
  if (!error) {
+   // Criar perfil no Firestore com os dados do formulário
+   const { getAuth } = await import('firebase/auth');
+   const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
+   const { db } = await import('../../lib/firebase');
+   const currentUser = getAuth().currentUser;
+   if (currentUser) {
+     await setDoc(doc(db, 'users', currentUser.uid), {
+       displayName: dados.nomeCompleto.trim(),
+       email: dados.email,
+       cidade: '',
+       updatedAt: serverTimestamp(),
+     });
+     // Também atualiza Firebase Auth displayName
+     const { updateProfile } = await import('firebase/auth');
+     await updateProfile(currentUser, { displayName: dados.nomeCompleto.trim() });
+   }
    sheetRef.current?.dismiss();
  }
```

---

### `app/navigation/AuthNavigator.tsx` — REMOVER CONSOLE.LOGS

Remover todas as chamadas `console.log` e `console.warn` (aproximadamente 10 ocorrências).
Manter apenas `console.error` para erros reais.

---

### `app/context/AuthContext.tsx` — REMOVER CONSOLE.LOGS

Remover `console.log('🔄 Auth provider mounting...')`, `console.log('✅ Fonts loaded...')` e similares.

---

### `app/screens/Home/FeedScreen.tsx` — REMOVER CONSOLE.LOGS

Remover `console.log('🔵 FeedScreen handleAddComment...')` e similares no `handleAddComment`.

---

### [DELETE] `app/navigation/RootStack.tsx`

```bash
# Deletar o arquivo
git rm app/navigation/RootStack.tsx
```

Verificar que não há nenhum `import` deste arquivo em outro lugar:
```bash
grep -r "RootStack" app/
# Deve retornar vazio
```

---

## Comandos

```bash
# Deletar arquivo morto
git rm "app/navigation/RootStack.tsx"

# Verificar imports
grep -r "RootStack" app/

# Testar localmente
npx expo start --clear
```

---

## Commit

```bash
git add -A
git commit -m "fix: ProfileScreen with real Firebase data, DenunciaIA submit persists to Firestore, remove dead code and console.logs"
```

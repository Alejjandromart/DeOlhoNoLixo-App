import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../lib/firebase';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ user: User | null; error: any }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔄 Auth provider mounting...");

    // Configure Google Sign-In
    /* GoogleSignin.configure({
      webClientId: '27306055437-f16dqr5ibt1i3hkjpp8ou6jc9i7adpud.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
      offlineAccess: true,
    }); */

    let hasInitialized = false;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('� Auth state changed - User:', user ? user.email : 'Sem usuário');
      hasInitialized = true;
      setUser(user);
      setLoading(false);
    }, (error) => {
      console.error("❌ Auth state change error:", error);
      hasInitialized = true;
      setLoading(false);
    });

    // Safety timeout to prevent infinite loading
    // Aumentado para 10s para acomodar conexões mais lentas
    const timeout = setTimeout(() => {
      if (!hasInitialized) {
        console.warn("⚠️ Auth loading timed out (10s) - forcing app entry. Verifique sua conexão.");
        setLoading(false);
      }
    }, 10000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('⏳ Iniciando login...');
    const start = Date.now();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log(`✅ Login concluído com sucesso em ${Date.now() - start}ms`);
      return { error: null };
    } catch (error: any) {
      console.log(`⚠️ Falha no login após ${Date.now() - start}ms`);
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    console.log('⏳ Iniciando cadastro...');
    const start = Date.now();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log(`✅ Cadastro concluído com sucesso em ${Date.now() - start}ms`);
      return { user: userCredential.user, error: null };
    } catch (error: any) {
      console.error(`❌ Erro no cadastro após ${Date.now() - start}ms:`, error);
      return { user: null, error };
    }
  };

  const signInWithGoogle = async () => {
    /* try {
      console.log("🚀 Iniciando Google Sign-In...");
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // Get the users ID token
      const response = await GoogleSignin.signIn();
      console.log("📦 Resposta do Google:", JSON.stringify(response, null, 2));

      const idToken = response.data?.idToken;

      if (!idToken) {
        console.error("❌ ID Token não encontrado na resposta:", response);
        throw new Error('No ID token found');
      }

      console.log("✅ ID Token recebido, autenticando no Firebase...");

      // Create a Google credential with the token
      const googleCredential = GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      await signInWithCredential(auth, googleCredential);

      return { error: null };
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      return { error };
    } */
    return { error: new Error('Google Sign-In temporarily disabled') };
  };

  const signOut = async () => {
    /* try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.error("Error signing out of Google:", error);
    } */
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

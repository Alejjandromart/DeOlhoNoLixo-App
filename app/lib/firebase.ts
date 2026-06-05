import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence, Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase com base no seu app Web
const firebaseConfig = {
    apiKey: "AIzaSyAeUucu8shrYWtGqBzu5ZdizwxWkvBpkQ4",
    authDomain: "deolhonolixo-app.firebaseapp.com",
    projectId: "deolhonolixo-app",
    storageBucket: "deolhonolixo-app.firebasestorage.app",
    messagingSenderId: "397630128881",
    appId: "1:397630128881:web:09a87d25e1619ccdaf9f50"
};

// Initialize Firebase (Evitar re-inicialização em hot reload do Metro bundler)
console.log('🔥 Initializing Firebase...');
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
console.log('✅ Firebase app initialized');

// Initialize Auth
let auth: Auth;
try {
    console.log('🔐 Initializing Firebase Auth with AsyncStorage persistence...');
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });
    console.log('✅ Firebase Auth initialized with AsyncStorage persistence');
} catch (error) {
    // Já inicializado (hot reload)
    console.error('❌ Error initializing auth with persistence, falling back to getAuth:', error);
    auth = getAuth(app);
    console.log('✅ Firebase Auth initialized with getAuth');
}

// Initialize Firestore
export const db = getFirestore(app);

export { auth };
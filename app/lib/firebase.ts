import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
// @ts-ignore
import { getAuth, initializeAuth, getReactNativePersistence, Auth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCxEmH_N1qy2QrSypdAqgSeRu7V-vJH-Mk",
    authDomain: "deolho-app.firebaseapp.com",
    projectId: "deolho-app",
    storageBucket: "deolho-app.appspot.com",
    messagingSenderId: undefined,
    appId: undefined
};

// Initialize Firebase
console.log('🔥 Initializing Firebase...');
const app = initializeApp(firebaseConfig);
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
    console.error('❌ Error initializing auth with persistence, falling back to getAuth:', error);
    auth = getAuth(app);
    console.log('✅ Firebase Auth initialized with getAuth');
}

export { auth };
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { USE_FIREBASE } from '../config/firebaseEnabled';

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY ?? 'AIzaSyCxEmH_N1qy2QrSypdAqgSeRu7V-vJH-Mk',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN ?? 'deolho-app.firebaseapp.com',
    projectId: process.env.FIREBASE_PROJECT_ID ?? 'deolho-app',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET ?? 'deolho-app.firebasestorage.app',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID ?? '27306055437',
    appId: process.env.FIREBASE_APP_ID ?? '1:27306055437:android:e07ac09545764adbed0244'
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (USE_FIREBASE) {
    console.log('🔥 Initializing Firebase...');
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase app initialized');

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

    db = getFirestore(app);
    storage = getStorage(app);
    console.log('✅ Firestore and Storage initialized');
} else {
    console.log('ℹ️ Firebase disabled (USE_FIREBASE = false)');
}

export { auth, db, storage };
export default app;
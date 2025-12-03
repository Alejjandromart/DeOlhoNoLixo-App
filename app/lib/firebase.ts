import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, getApps, getApp } from 'firebase/app';
// @ts-ignore
import { getAuth, initializeAuth, getReactNativePersistence, Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration from environment variables
console.log('📌 Loading Firebase config from environment variables...');
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY?.trim(),
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim(),
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID?.trim(),
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim(),
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim(),
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID?.trim(),
};

// Debug: Log config values (without sensitive data)
console.log('🔍 Firebase Config:', {
    apiKey: firebaseConfig.apiKey ? `✓ Loaded (${firebaseConfig.apiKey.substring(0, 6)}...)` : '✗ MISSING',
    authDomain: firebaseConfig.authDomain || '✗ MISSING',
    projectId: firebaseConfig.projectId || '✗ MISSING',
    storageBucket: firebaseConfig.storageBucket || '✗ MISSING',
    messagingSenderId: firebaseConfig.messagingSenderId || '✗ MISSING',
    appId: firebaseConfig.appId || '✗ MISSING',
});

// Initialize Firebase - Check if app already exists to prevent duplicate-app error
console.log('🔥 Initializing Firebase...');
let app;
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase app initialized');
} else {
    app = getApp();
    console.log('✅ Firebase app already exists, using existing instance');
}

// Initialize Firestore and Storage
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Auth with AsyncStorage persistence for React Native
let auth: Auth;
try {
    console.log('🔐 Initializing Firebase Auth with AsyncStorage persistence...');
    try {
        // Prefer initializeAuth so we can provide React Native AsyncStorage persistence
        auth = initializeAuth(app, {
            persistence: getReactNativePersistence(AsyncStorage)
        });
        console.log('✅ Firebase Auth initialized with AsyncStorage persistence');
    } catch (innerError) {
        // initializeAuth may fail if Auth was already initialized or not supported in the environment
        console.warn('⚠️ initializeAuth failed, falling back to getAuth:', innerError);
        auth = getAuth(app);
        console.log('✅ Firebase Auth initialized with getAuth');
    }
} catch (error) {
    console.error('❌ Error initializing auth:', error);
    auth = getAuth(app);
}

export { auth, db, storage };
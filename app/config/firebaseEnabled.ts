/**
 * Flag para habilitar/desabilitar Firebase no app
 * Defina como false para usar apenas Context local e BackendRedis
 * Defina como true para usar Firebase Firestore + Storage + Auth
 */
export const USE_FIREBASE = true; // Desabilitado por padrão, usando Supabase + BackendRedis

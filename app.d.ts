declare namespace NodeJS {
  interface ProcessEnv {
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
  }
}

// Opcional, mas recomendado para o `expo-constants`
namespace App {
    interface Extra {
      supabaseUrl: string;
      supabaseAnonKey: string;
      eas?: {
        projectId?: string;
      };
    }
}
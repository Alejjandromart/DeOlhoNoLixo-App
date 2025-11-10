declare namespace NodeJS {
  interface ProcessEnv {
  // ...existing code...
  }
}

// Opcional, mas recomendado para o `expo-constants`
namespace App {
    interface Extra {
  // ...existing code...
      eas?: {
        projectId?: string;
      };
    }
}
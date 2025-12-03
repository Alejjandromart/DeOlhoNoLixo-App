import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Envia uma imagem dada sua URI local para o Firebase Storage e retorna a URL pública
 * @param uri string - URI local (ex: result.uri do ImagePicker)
 * @returns Promise<string> - URL pública da imagem no Firebase Storage
 */
export async function enviarFoto(uri: string): Promise<string> {
    if (!storage) {
        throw new Error('Firebase Storage não está inicializado. Verifique se USE_FIREBASE está habilitado.');
    }

    const response = await fetch(uri);
    const blob = await response.blob();

    const fileName = `denuncias/${Date.now()}.jpg`;
    const storageRef = ref(storage, fileName);

    await uploadBytes(storageRef, blob);

    const url = await getDownloadURL(storageRef);
    return url;
}

import { db } from './firebase';
import {
    collection,
    addDoc,
    getDocs,
    Timestamp,
    query,
    orderBy,
    onSnapshot,
    DocumentData,
    updateDoc,
    doc,
    increment,
    arrayUnion,
    arrayRemove,
} from 'firebase/firestore';

export type DenunciaFirebase = {
    categoria?: string;
    descricao?: string;
    fotoURL?: string | string[];
    tipos?: string[];
    latitude?: number;
    longitude?: number;
    localizacao?: string;
    status?: string;
    usuarioID?: string;
    usuarioEmail?: string;
    usuarioNome?: string;
    usuarioAvatar?: string | null;
    curtidas?: number;
    curtidasUsers?: string[]; // Lista de IDs dos usuários que curtiram
    avaliacaoIA?: {
        probabilidade: number;
        tipo: string;
    } | null;
    created_at?: Timestamp | null;
};

/**
 * Cria uma nova denúncia no Firestore
 * @param dados - Dados da denúncia
 * @returns Promise<string> - ID do documento criado
 */
export async function criarDenuncia(dados: DenunciaFirebase): Promise<string> {
    if (!db) {
        throw new Error('Firestore não está inicializado. Verifique se USE_FIREBASE está habilitado.');
    }

    try {
        const docRef = await addDoc(collection(db, 'denuncias'), {
            ...dados,
            status: dados.status ?? 'Pendente',
            curtidas: dados.curtidas ?? 0,
            created_at: Timestamp.now(),
        });

        console.log('✅ Denúncia criada no Firestore com ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('❌ Erro criando denúncia no Firestore:', error);
        throw error;
    }
}

/**
 * Busca denúncias do Firestore imediatamente (sem listener)
 * @returns Promise<Array> - Lista de denúncias
 */
export async function buscarDenuncias(): Promise<(DocumentData & { id: string })[]> {
    if (!db) {
        throw new Error('Firestore não está inicializado. Verifique se USE_FIREBASE está habilitado.');
    }

    try {
        const q = query(collection(db, 'denuncias'), orderBy('created_at', 'desc'));
        const snapshot = await getDocs(q);
        const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(`⚡ ${lista.length} denúncias carregadas do Firestore (eager load)`);
        return lista;
    } catch (error) {
        console.error('❌ Erro ao buscar denúncias:', error);
        return [];
    }
}

/**
 * Escuta denúncias em tempo real do Firestore
 * @param callback - Função chamada quando há mudanças nas denúncias
 * @returns Function - Função para cancelar a escuta
 */
export function ouvirDenuncias(callback: (lista: (DocumentData & { id: string })[]) => void) {
    if (!db) {
        throw new Error('Firestore não está inicializado. Verifique se USE_FIREBASE está habilitado.');
    }

    const q = query(collection(db, 'denuncias'), orderBy('created_at', 'desc'));

    const unsub = onSnapshot(q, snapshot => {
        const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(lista);
    });

    return unsub;
}

/**
 * Incrementa o contador de curtidas de uma denúncia e adiciona o usuário à lista
 * @param denunciaId - ID da denúncia
 * @param userId - ID do usuário que curtiu
 * @returns Promise<void>
 */
export async function curtirDenuncia(denunciaId: string, userId?: string): Promise<void> {
    if (!db) {
        throw new Error('Firestore não está inicializado. Verifique se USE_FIREBASE está habilitado.');
    }

    try {
        const denunciaRef = doc(db, 'denuncias', denunciaId);
        const updateData: any = {
            curtidas: increment(1)
        };

        if (userId) {
            updateData.curtidasUsers = arrayUnion(userId);
        }

        await updateDoc(denunciaRef, updateData);
        console.log('✅ Denúncia curtida com sucesso:', denunciaId);
    } catch (error) {
        console.error('❌ Erro ao curtir denúncia:', error);
        throw error;
    }
}

/**
 * Decrementa o contador de curtidas de uma denúncia e remove o usuário da lista
 * @param denunciaId - ID da denúncia
 * @param userId - ID do usuário que descurtiu
 * @returns Promise<void>
 */
export async function descurtirDenuncia(denunciaId: string, userId?: string): Promise<void> {
    if (!db) {
        throw new Error('Firestore não está inicializado. Verifique se USE_FIREBASE está habilitado.');
    }

    try {
        const denunciaRef = doc(db, 'denuncias', denunciaId);
        const updateData: any = {
            curtidas: increment(-1)
        };

        if (userId) {
            updateData.curtidasUsers = arrayRemove(userId);
        }

        await updateDoc(denunciaRef, updateData);
        console.log('✅ Denúncia descurtida com sucesso:', denunciaId);
    } catch (error) {
        console.error('❌ Erro ao descurtir denúncia:', error);
        throw error;
    }
}

/**
 * Adiciona um comentário a uma denúncia
 * @param denunciaId - ID da denúncia
 * @param comentario - Dados do comentário
 * @returns Promise<void>
 */
export async function adicionarComentario(
    denunciaId: string,
    comentario: {
        texto: string;
        userId: string;
        userName: string;
        userAvatar?: string | null;
    }
): Promise<void> {
    if (!db) {
        throw new Error('Firestore não está inicializado.');
    }

    try {
        const denunciaRef = doc(db, 'denuncias', denunciaId);
        
        const novoComentario = {
            id: Date.now().toString(),
            texto: comentario.texto,
            userId: comentario.userId,
            usuario: {
                nome: comentario.userName,
                avatar: comentario.userAvatar || null,
            },
            timestamp: Timestamp.now(),
            tempoAtras: 'Agora',
        };

        await updateDoc(denunciaRef, {
            comentarios: arrayUnion(novoComentario)
        });

        console.log('✅ Comentário adicionado com sucesso:', denunciaId);
    } catch (error) {
        console.error('❌ Erro ao adicionar comentário:', error);
        throw error;
    }
}

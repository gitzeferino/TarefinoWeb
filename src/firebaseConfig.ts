import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Cole aqui as SUAS chaves reais do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAmGtx5xsFR45_XYAzqOMft-u6T6xGsbyk",
    authDomain: "tarefas-8af66.firebaseapp.com",
    projectId: "tarefas-8af66",
    storageBucket: "tarefas-8af66.firebasestorage.app",
    messagingSenderId: "99212146324",
    appId: "1:99212146324:web:b7b57c2de3cd03168ea681"
};

// Inicializa o Firebase apenas com o que precisamos (sem o Analytics)
const app = initializeApp(firebaseConfig);

// Exporta a base de dados
export const db = getFirestore(app);
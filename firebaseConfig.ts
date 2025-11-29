import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// SUBSTITUA COM SUAS CREDENCIAIS DO FIREBASE CONSOLE
// (Configurações do Projeto -> Geral -> Seus aplicativos -> SDK setup and configuration)
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI", 
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
// We use a try-catch to prevent the app from crashing entirely if config is missing during dev
let app;
let auth;

try {
    // Check if config is dummy
    if (firebaseConfig.apiKey === "SUA_API_KEY_AQUI") {
        console.warn("Firebase Config não configurada. A autenticação não funcionará até que você edite o arquivo firebaseConfig.ts");
    }
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
} catch (error) {
    console.error("Erro ao inicializar Firebase", error);
}

export { auth };
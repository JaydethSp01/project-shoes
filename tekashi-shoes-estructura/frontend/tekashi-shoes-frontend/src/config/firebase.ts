import { initializeApp } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// 🔹 Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCYP_q7-sXQRJWj49SqZ-IpjywNUnHvtz0",
  authDomain: "tekashi-shoes-ecommerce.firebaseapp.com",
  projectId: "tekashi-shoes-ecommerce",
  storageBucket: "tekashi-shoes-ecommerce.firebasestorage.app",
  messagingSenderId: "165339423320",
  appId: "1:165339423320:web:c00b0e19bc6b0236da202d",
};

// 🔹 Inicializar Firebase
const app = initializeApp(firebaseConfig);

// 🔹 Inicializar servicios
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// 🔹 Configurar proveedores de autenticación de forma más simple
export const googleProvider = new GoogleAuthProvider();
// Configuración mínima para evitar errores
googleProvider.addScope("email");

export const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope("email");

export const microsoftProvider = new OAuthProvider("microsoft.com");
microsoftProvider.addScope("email");

// 🔹 Configurar persistencia en localStorage
setPersistence(auth, browserLocalPersistence)
  .then(() =>
    console.log("✅ Persistencia de sesión configurada en localStorage")
  )
  .catch((error) =>
    console.error("⚠️ Error configurando persistencia:", error)
  );

// 🔹 Función para escuchar cambios en la autenticación
export const listenAuthState = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Conectar a emuladores en desarrollo
if (
  import.meta.env.DEV &&
  import.meta.env.VITE_USE_FIREBASE_EMULATOR === "true"
) {
  try {
    connectAuthEmulator(auth, "http://localhost:9099");
    connectFirestoreEmulator(db, "localhost", 8080);
    connectStorageEmulator(storage, "localhost", 9199);
    console.log("🔥 Conectado a emuladores de Firebase");
  } catch (error) {
    console.log("⚠️ Los emuladores de Firebase ya están conectados");
  }
}

export default app;

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
  apiKey: "AIzaSyCmCGkyXuYn3WyMlMrLGXesHPZ1PkwFhTI",
  authDomain: "tekashi-shoes-ecommerce.firebaseapp.com",
  projectId: "tekashi-shoes-ecommerce",
  storageBucket: "tekashi-shoes-ecommerce.firebasestorage.app",
  messagingSenderId: "39965371808",
  appId: "1:39965371808:web:21dfe587edbbb2863088c5",
  measurementId: "G-9ND1YRVZT7",
};

// 🔹 Inicializar Firebase
const app = initializeApp(firebaseConfig);

// 🔹 Inicializar servicios
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// 🔹 Configurar proveedores de autenticación
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("email");
googleProvider.addScope("profile");

export const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope("email");
facebookProvider.addScope("public_profile");

export const microsoftProvider = new OAuthProvider("microsoft.com");
microsoftProvider.addScope("email");
microsoftProvider.addScope("profile");
microsoftProvider.addScope("openid");

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

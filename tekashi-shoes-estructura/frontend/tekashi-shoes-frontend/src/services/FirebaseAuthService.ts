import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  OAuthProvider,
  TwitterAuthProvider,
  sendEmailVerification,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "../config/firebase";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  phoneNumber: string | null;
  sessionId?: string;
}

export interface AuthError {
  code: string;
  message: string;
}

class FirebaseAuthService {
  private auth = auth;
  private readonly SESSION_ID_KEY = "tekashi_session_id";

  // Proveedores de autenticación social
  private googleProvider: GoogleAuthProvider;
  private facebookProvider: FacebookAuthProvider;
  private microsoftProvider: OAuthProvider;

  constructor() {
    // Inicializar proveedores de autenticación social
    this.googleProvider = new GoogleAuthProvider();
    this.googleProvider.addScope("email");
    this.googleProvider.addScope("profile");

    this.facebookProvider = new FacebookAuthProvider();
    this.facebookProvider.addScope("email");

    this.microsoftProvider = new OAuthProvider("microsoft.com");
    this.microsoftProvider.addScope("email");
    this.microsoftProvider.addScope("profile");
  }

  // Generar ID de sesión único
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Guardar ID de sesión en localStorage
  private saveSessionId(sessionId: string): void {
    localStorage.setItem(this.SESSION_ID_KEY, sessionId);
  }

  // Obtener ID de sesión del localStorage
  private getSessionId(): string | null {
    return localStorage.getItem(this.SESSION_ID_KEY);
  }

  // Limpiar ID de sesión del localStorage
  private clearSessionId(): void {
    localStorage.removeItem(this.SESSION_ID_KEY);
  }

  // Iniciar sesión con email y contraseña
  async signInWithEmail(email: string, password: string): Promise<UserProfile> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return this.mapUserToProfile(userCredential.user);
    } catch (error: any) {
      throw this.mapFirebaseError(error);
    }
  }

  // Registrar usuario con email y contraseña
  async signUpWithEmail(
    email: string,
    password: string,
    displayName?: string
  ): Promise<UserProfile> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      // Actualizar perfil si se proporciona nombre
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }

      // Enviar email de verificación
      await sendEmailVerification(userCredential.user);

      return this.mapUserToProfile(userCredential.user);
    } catch (error: any) {
      throw this.mapFirebaseError(error);
    }
  }

  // Iniciar sesión con Google
  async signInWithGoogle(): Promise<UserProfile> {
    try {
      const result = await signInWithPopup(this.auth, this.googleProvider);
      return this.mapUserToProfile(result.user);
    } catch (error: any) {
      throw this.mapFirebaseError(error);
    }
  }

  // Iniciar sesión con Facebook
  async signInWithFacebook(): Promise<UserProfile> {
    try {
      const result = await signInWithPopup(this.auth, this.facebookProvider);
      return this.mapUserToProfile(result.user);
    } catch (error: any) {
      throw this.mapFirebaseError(error);
    }
  }

  // Iniciar sesión con Microsoft
  async signInWithMicrosoft(): Promise<UserProfile> {
    try {
      const result = await signInWithPopup(this.auth, this.microsoftProvider);
      return this.mapUserToProfile(result.user);
    } catch (error: any) {
      throw this.mapFirebaseError(error);
    }
  }

  // Iniciar sesión con Twitter
  async signInWithTwitter(): Promise<UserProfile> {
    try {
      const provider = new TwitterAuthProvider();

      const result = await signInWithPopup(this.auth, provider);
      return this.mapUserToProfile(result.user);
    } catch (error: any) {
      throw this.mapFirebaseError(error);
    }
  }

  // Cerrar sesión
  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
      this.clearSessionId(); // Limpiar ID de sesión al cerrar sesión
    } catch (error: any) {
      throw this.mapFirebaseError(error);
    }
  }

  // Obtener usuario actual
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  // Obtener perfil del usuario actual
  getCurrentUserProfile(): UserProfile | null {
    const user = this.getCurrentUser();
    return user ? this.mapUserToProfile(user) : null;
  }

  // Escuchar cambios en el estado de autenticación
  onAuthStateChanged(callback: (user: UserProfile | null) => void): () => void {
    return onAuthStateChanged(this.auth, (user) => {
      callback(user ? this.mapUserToProfile(user) : null);
    });
  }

  // Actualizar perfil del usuario
  async updateUserProfile(updates: {
    displayName?: string;
    photoURL?: string;
  }): Promise<void> {
    try {
      const user = this.getCurrentUser();
      if (!user) {
        throw new Error("No hay usuario autenticado");
      }

      await updateProfile(user, updates);
    } catch (error: any) {
      throw this.mapFirebaseError(error);
    }
  }

  // Cambiar contraseña
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      const user = this.getCurrentUser();
      if (!user || !user.email) {
        throw new Error("No hay usuario autenticado");
      }

      // Reautenticar usuario
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Cambiar contraseña
      await updatePassword(user, newPassword);
    } catch (error: any) {
      throw this.mapFirebaseError(error);
    }
  }

  // Enviar email de restablecimiento de contraseña
  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error: any) {
      throw this.mapFirebaseError(error);
    }
  }

  // Enviar email de verificación
  async sendEmailVerification(): Promise<void> {
    try {
      const user = this.getCurrentUser();
      if (!user) {
        throw new Error("No hay usuario autenticado");
      }

      await sendEmailVerification(user);
    } catch (error: any) {
      throw this.mapFirebaseError(error);
    }
  }

  // Obtener token de ID para autenticación con backend
  async getIdToken(forceRefresh: boolean = false): Promise<string> {
    try {
      const user = this.getCurrentUser();
      if (!user) {
        throw new Error("No hay usuario autenticado");
      }

      return await user.getIdToken(forceRefresh);
    } catch (error: any) {
      throw this.mapFirebaseError(error);
    }
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Verificar si el email está verificado
  isEmailVerified(): boolean {
    const user = this.getCurrentUser();
    return user ? user.emailVerified : false;
  }

  // Mapear usuario de Firebase a perfil de usuario
  private mapUserToProfile(user: User): UserProfile {
    // Generar o obtener ID de sesión existente
    let sessionId = this.getSessionId();
    if (!sessionId) {
      sessionId = this.generateSessionId();
      this.saveSessionId(sessionId);
    }

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      phoneNumber: user.phoneNumber,
      sessionId: sessionId,
    };
  }

  // Mapear errores de Firebase a errores personalizados
  private mapFirebaseError(error: any): AuthError {
    const errorMessages: { [key: string]: string } = {
      "auth/user-not-found": "Usuario no encontrado",
      "auth/wrong-password": "Contraseña incorrecta",
      "auth/email-already-in-use": "El email ya está en uso",
      "auth/weak-password": "La contraseña es muy débil",
      "auth/invalid-email": "Email inválido",
      "auth/user-disabled": "Usuario deshabilitado",
      "auth/too-many-requests":
        "Demasiados intentos fallidos. Intenta más tarde",
      "auth/operation-not-allowed": "Operación no permitida",
      "auth/requires-recent-login": "Se requiere un inicio de sesión reciente",
      "auth/credential-already-in-use": "Esta credencial ya está en uso",
      "auth/invalid-credential": "Credencial inválida",
      "auth/account-exists-with-different-credential":
        "Ya existe una cuenta con este email pero con diferente método de autenticación",
      "auth/popup-closed-by-user":
        "Ventana de autenticación cerrada por el usuario",
      "auth/popup-blocked": "Ventana emergente bloqueada por el navegador",
      "auth/cancelled-popup-request":
        "Solicitud de ventana emergente cancelada",
      "auth/network-request-failed": "Error de conexión de red",
      "auth/timeout": "Tiempo de espera agotado",
    };

    return {
      code: error.code || "unknown",
      message:
        errorMessages[error.code] || error.message || "Error desconocido",
    };
  }
}

// Instancia singleton del servicio
export const firebaseAuthService = new FirebaseAuthService();
export default firebaseAuthService;


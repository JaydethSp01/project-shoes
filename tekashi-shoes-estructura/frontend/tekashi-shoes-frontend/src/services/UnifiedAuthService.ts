import { firebaseAuthService, UserProfile } from "./FirebaseAuthService";
import { authService, User } from "./AuthService";

export interface UnifiedUser {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  avatar?: string;
  phone?: string;
  address?: string;
  isFirebaseUser: boolean;
  isBackendUser: boolean;
  firebaseProfile?: UserProfile;
  backendProfile?: User;
}

class UnifiedAuthService {
  private currentUser: UnifiedUser | null = null;
  private listeners: Array<(user: UnifiedUser | null) => void> = [];

  constructor() {
    // No inicializar automáticamente, se hará desde el AuthProvider
  }

  private getBackendUrl(): string {
    return import.meta.env.VITE_API_BASE_URL || "http://localhost:10000";
  }

  async initialize(): Promise<void> {
    await this.initializeAuth();
  }

  async getAuthToken(): Promise<string | null> {
    console.log("🔍 Obteniendo token de autenticación...");
    console.log("👤 Usuario actual:", this.currentUser);

    // Primero intentar obtener token de Firebase directamente
    try {
      const firebaseToken = await firebaseAuthService.getIdToken();
      if (firebaseToken) {
        console.log(
          "✅ Token de Firebase obtenido:",
          firebaseToken.substring(0, 20) + "..."
        );
        return firebaseToken;
      }
    } catch (error) {
      console.warn("❌ No se pudo obtener token de Firebase:", error);
    }

    // Intentar obtener token del backend directamente
    const backendToken = localStorage.getItem("tekashi_backend_token");
    if (backendToken) {
      console.log(
        "✅ Token del backend obtenido:",
        backendToken.substring(0, 20) + "..."
      );
      return backendToken;
    }

    // Verificar si hay token de Firebase en el usuario actual
    if (this.currentUser?.isFirebaseUser) {
      try {
        const firebaseToken = await firebaseAuthService.getIdToken();
        if (firebaseToken) {
          console.log(
            "✅ Token de Firebase del usuario actual:",
            firebaseToken.substring(0, 20) + "..."
          );
          return firebaseToken;
        }
      } catch (error) {
        console.warn(
          "❌ No se pudo obtener token de Firebase del usuario:",
          error
        );
      }
    }

    // Verificar si hay token del backend en el usuario actual
    if (this.currentUser?.isBackendUser) {
      const backendToken = localStorage.getItem("tekashi_backend_token");
      if (backendToken) {
        console.log(
          "✅ Token del backend del usuario actual:",
          backendToken.substring(0, 20) + "..."
        );
        return backendToken;
      }
    }

    console.log("❌ No se pudo obtener ningún token");
    return null;
  }

  private async initializeAuth() {
    try {
      // Verificar si hay usuario de Firebase
      const firebaseUser = firebaseAuthService.getCurrentUserProfile();
      if (firebaseUser) {
        await this.handleFirebaseUser(firebaseUser);
        return;
      }

      // Verificar si hay usuario del backend
      const backendUser = authService.getCurrentUser();
      if (backendUser) {
        await this.handleBackendUser(backendUser);
        return;
      }

      // No hay usuario autenticado
      this.currentUser = null;
      this.notifyListeners();
    } catch (error) {
      console.error("❌ Error en initializeAuth:", error);
      this.currentUser = null;
      this.notifyListeners();
    }
  }

  private async handleFirebaseUser(
    firebaseProfile: UserProfile
  ): Promise<void> {
    try {
      // Intentar sincronizar con el backend
      const backendUser = await this.syncFirebaseWithBackend(firebaseProfile);

      this.currentUser = {
        id: firebaseProfile.uid,
        email: firebaseProfile.email || "",
        name: firebaseProfile.displayName || "Usuario",
        role: (backendUser?.role || "user").toLowerCase() as "user" | "admin",
        avatar: firebaseProfile.photoURL || undefined,
        isFirebaseUser: true,
        isBackendUser: !!backendUser,
        firebaseProfile,
        backendProfile: backendUser || undefined,
      };
    } catch {
      // Si no se puede sincronizar, usar solo Firebase
      this.currentUser = {
        id: firebaseProfile.uid,
        email: firebaseProfile.email || "",
        name: firebaseProfile.displayName || "Usuario",
        role: "user",
        avatar: firebaseProfile.photoURL || undefined,
        isFirebaseUser: true,
        isBackendUser: false,
        firebaseProfile,
      };
    }

    this.notifyListeners();
  }

  private async handleBackendUser(backendProfile: User): Promise<void> {
    this.currentUser = {
      id: backendProfile.id.toString(),
      email: backendProfile.email,
      name: backendProfile.name || backendProfile.nombre || "Usuario",
      role: (
        backendProfile.role ||
        backendProfile.rol ||
        "user"
      ).toLowerCase() as "user" | "admin",
      phone: backendProfile.phone || backendProfile.telefono,
      address: backendProfile.address || backendProfile.direccion,
      isFirebaseUser: false,
      isBackendUser: true,
      backendProfile,
    };

    this.notifyListeners();
  }

  private async syncFirebaseWithBackend(
    firebaseProfile: UserProfile
  ): Promise<User | null> {
    try {
      // Intentar obtener token de Firebase para autenticación con backend
      const firebaseToken = await firebaseAuthService.getIdToken();

      // Sincronizar usuario con el backend
      const response = await fetch(
        `${this.getBackendUrl()}/api/usuarios/sync-firebase`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${firebaseToken}`,
          },
          body: JSON.stringify({
            firebaseUid: firebaseProfile.uid,
            email: firebaseProfile.email,
            displayName:
              firebaseProfile.displayName ||
              (firebaseProfile.email
                ? firebaseProfile.email.split("@")[0]
                : "Usuario"),
            photoURL: firebaseProfile.photoURL || null,
          }),
        }
      );

      if (response.ok) {
        const userData = await response.json();
        return userData.data;
      } else {
        console.warn(
          "No se pudo sincronizar con el backend, usando solo Firebase"
        );
        return null;
      }
    } catch (error) {
      console.warn("No se pudo sincronizar con el backend:", error);
      return null;
    }
  }

  // Métodos de autenticación
  async signInWithEmail(email: string, password: string): Promise<UnifiedUser> {
    try {
      // Usar backend para login normal
      const backendUser = await authService.login({ email, password });
      await this.handleBackendUser(backendUser);
      return this.currentUser!;
    } catch (backendError) {
      console.error("❌ Error en autenticación backend:", backendError);
      throw new Error("Credenciales inválidas");
    }
  }

  async signUpWithEmail(
    email: string,
    password: string,
    name: string,
    role: "user" | "admin" = "user"
  ): Promise<UnifiedUser> {
    try {
      // Usar backend para registro normal
      const backendUser = await authService.register({
        name,
        email,
        password,
        role,
      });
      await this.handleBackendUser(backendUser);
      return this.currentUser!;
    } catch (backendError) {
      console.error("❌ Error en registro backend:", backendError);
      throw new Error("Error en el registro");
    }
  }

  async signInWithGoogle(): Promise<UnifiedUser> {
    try {
      const firebaseProfile = await firebaseAuthService.signInWithGoogle();
      await this.handleFirebaseUser(firebaseProfile);
      return this.currentUser!;
    } catch (error) {
      throw new Error("Error al iniciar sesión con Google");
    }
  }

  async signInWithFacebook(): Promise<UnifiedUser> {
    try {
      const firebaseProfile = await firebaseAuthService.signInWithFacebook();
      await this.handleFirebaseUser(firebaseProfile);
      return this.currentUser!;
    } catch (error) {
      throw new Error("Error al iniciar sesión con Facebook");
    }
  }

  async signInWithMicrosoft(): Promise<UnifiedUser> {
    try {
      const firebaseProfile = await firebaseAuthService.signInWithMicrosoft();
      await this.handleFirebaseUser(firebaseProfile);
      return this.currentUser!;
    } catch (error) {
      throw new Error("Error al iniciar sesión con Microsoft");
    }
  }

  async signOut(): Promise<void> {
    try {
      // Cerrar sesión en ambos servicios
      if (this.currentUser?.isFirebaseUser) {
        await firebaseAuthService.signOut();
      }
      if (this.currentUser?.isBackendUser) {
        await authService.logout();
      }
    } catch (error) {
      console.warn("Error al cerrar sesión:", error);
    } finally {
      this.currentUser = null;
      this.notifyListeners();
    }
  }

  // Getters
  getCurrentUser(): UnifiedUser | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === "admin";
  }

  isUser(): boolean {
    return this.currentUser?.role === "user";
  }

  // Suscripción a cambios
  subscribe(listener: (user: UnifiedUser | null) => void): () => void {
    this.listeners.push(listener);

    // Llamar inmediatamente con el usuario actual
    listener(this.currentUser);

    // Retornar función de unsubscribe
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.currentUser));
  }

  // Métodos de actualización de perfil
  async updateProfile(updates: {
    name?: string;
    phone?: string;
    address?: string;
  }): Promise<UnifiedUser> {
    if (!this.currentUser) {
      throw new Error("Usuario no autenticado");
    }

    try {
      if (this.currentUser.isBackendUser) {
        const updatedBackendUser = await authService.updateUserProfile(updates);
        await this.handleBackendUser(updatedBackendUser);
      }

      if (this.currentUser.isFirebaseUser) {
        await firebaseAuthService.updateUserProfile({
          displayName: updates.name,
        });
      }

      return this.currentUser;
    } catch (error) {
      throw new Error("Error al actualizar el perfil");
    }
  }
}

export const unifiedAuthService = new UnifiedAuthService();
export default unifiedAuthService;

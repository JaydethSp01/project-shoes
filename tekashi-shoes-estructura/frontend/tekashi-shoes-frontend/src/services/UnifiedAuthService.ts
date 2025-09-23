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
    this.initializeAuth();
  }

  private async initializeAuth() {
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
        role: backendUser?.role || "user",
        avatar: firebaseProfile.photoURL || undefined,
        isFirebaseUser: true,
        isBackendUser: !!backendUser,
        firebaseProfile,
        backendProfile: backendUser,
      };
    } catch (error) {
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
      role: backendProfile.role || backendProfile.rol || "user",
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

      // Aquí podrías hacer una llamada al backend para sincronizar el usuario
      // Por ahora, retornamos null para usar solo Firebase
      return null;
    } catch (error) {
      console.warn("No se pudo sincronizar con el backend:", error);
      return null;
    }
  }

  // Métodos de autenticación
  async signInWithEmail(email: string, password: string): Promise<UnifiedUser> {
    try {
      // Intentar login con backend primero
      const backendUser = await authService.login({ email, password });
      await this.handleBackendUser(backendUser);
      return this.currentUser!;
    } catch (error) {
      // Si falla el backend, intentar con Firebase
      try {
        const firebaseProfile = await firebaseAuthService.signInWithEmail(
          email,
          password
        );
        await this.handleFirebaseUser(firebaseProfile);
        return this.currentUser!;
      } catch (firebaseError) {
        throw new Error("Credenciales inválidas");
      }
    }
  }

  async signUpWithEmail(
    email: string,
    password: string,
    name: string,
    role: "user" | "admin" = "user"
  ): Promise<UnifiedUser> {
    try {
      // Intentar registro con backend primero
      const backendUser = await authService.register({
        name,
        email,
        password,
        role,
      });
      await this.handleBackendUser(backendUser);
      return this.currentUser!;
    } catch (error) {
      // Si falla el backend, intentar con Firebase
      try {
        const firebaseProfile = await firebaseAuthService.signUpWithEmail(
          email,
          password,
          name
        );
        await this.handleFirebaseUser(firebaseProfile);
        return this.currentUser!;
      } catch (firebaseError) {
        throw new Error("Error en el registro");
      }
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

  // Obtener token para autenticación con backend
  async getAuthToken(): Promise<string | null> {
    if (this.currentUser?.isFirebaseUser) {
      try {
        return await firebaseAuthService.getIdToken();
      } catch (error) {
        console.warn("No se pudo obtener token de Firebase");
      }
    }

    if (this.currentUser?.isBackendUser) {
      return localStorage.getItem("tekashi_backend_token");
    }

    return null;
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

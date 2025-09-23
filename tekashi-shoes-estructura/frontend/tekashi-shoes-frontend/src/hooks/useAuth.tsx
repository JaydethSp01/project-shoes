import {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from "react";
import {
  UnifiedUser,
  unifiedAuthService,
} from "../services/UnifiedAuthService";

export interface AuthError {
  code: string;
  message: string;
}

interface AuthContextType {
  user: UnifiedUser | null;
  loading: boolean;
  error: AuthError | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    name: string,
    role?: "user" | "admin"
  ) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithMicrosoft: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: {
    name?: string;
    phone?: string;
    address?: string;
  }) => Promise<void>;
  clearError: () => void;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }

  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UnifiedUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | undefined;

    const initializeAuth = async () => {
      try {
        setLoading(true);

        // Inicializar el servicio de autenticación
        await unifiedAuthService.initialize();

        // Suscribirse a cambios de autenticación
        unsubscribe = unifiedAuthService.subscribe((user) => {
          console.log("🎯 useAuth recibió usuario:", user);
          if (isMounted) {
            setUser(user);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error("Error inicializando autenticación:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
      if (unsubscribe && typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  const handleError = (error: any) => {
    console.error("Auth error:", error);
    setError({
      code: error.code || "UNKNOWN_ERROR",
      message: error.message || "Error desconocido",
    });
  };

  const clearError = () => {
    setError(null);
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      await unifiedAuthService.signInWithEmail(email, password);
      // El estado se actualizará automáticamente a través de la suscripción
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    role: "user" | "admin" = "user"
  ) => {
    try {
      setError(null);
      setLoading(true);
      await unifiedAuthService.signUpWithEmail(email, password, name, role);
      // El estado se actualizará automáticamente a través de la suscripción
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      await unifiedAuthService.signInWithGoogle();
      // El estado se actualizará automáticamente a través de la suscripción
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithFacebook = async () => {
    try {
      setError(null);
      setLoading(true);
      await unifiedAuthService.signInWithFacebook();
      // El estado se actualizará automáticamente a través de la suscripción
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithMicrosoft = async () => {
    try {
      setError(null);
      setLoading(true);
      await unifiedAuthService.signInWithMicrosoft();
      // El estado se actualizará automáticamente a través de la suscripción
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      setLoading(true);
      await unifiedAuthService.signOut();
      // El estado se actualizará automáticamente a través de la suscripción
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: {
    name?: string;
    phone?: string;
    address?: string;
  }) => {
    try {
      setError(null);
      const updatedUser = await unifiedAuthService.updateProfile(updates);
      setUser(updatedUser);
    } catch (error) {
      handleError(error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithFacebook,
    signInWithMicrosoft,
    signOut,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook para verificar si el usuario está autenticado
export const useAuthState = () => {
  const { user, loading } = useAuth();
  return {
    isAuthenticated: !!user,
    user,
    loading,
  };
};

// Hook para verificar roles de usuario
export const useUserRole = () => {
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";
  const isClient = user?.role === "user";

  return {
    isAdmin,
    isClient,
    role: user?.role || "user",
  };
};
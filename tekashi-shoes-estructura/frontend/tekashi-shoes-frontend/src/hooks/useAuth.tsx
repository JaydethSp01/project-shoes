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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    const unsubscribe = unifiedAuthService.subscribe((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleError = (error: any) => {
    console.error("Auth error:", error);
    setError(error);
  };

  const clearError = () => {
    setError(null);
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const user = await unifiedAuthService.signInWithEmail(email, password);
      setUser(user);
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
      const user = await unifiedAuthService.signUpWithEmail(
        email,
        password,
        name,
        role
      );
      setUser(user);
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
      const user = await unifiedAuthService.signInWithGoogle();
      setUser(user);
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
      const user = await unifiedAuthService.signInWithFacebook();
      setUser(user);
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
      const user = await unifiedAuthService.signInWithMicrosoft();
      setUser(user);
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
      setUser(null);
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

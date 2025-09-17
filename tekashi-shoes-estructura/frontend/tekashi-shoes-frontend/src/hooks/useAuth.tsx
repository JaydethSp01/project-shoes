import {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from "react";
import {
  UserProfile,
  AuthError,
  firebaseAuthService,
} from "../services/FirebaseAuthService";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: AuthError | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithTwitter: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: {
    displayName?: string;
    photoURL?: string;
  }) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  sendEmailVerification: () => Promise<void>;
  getIdToken: (forceRefresh?: boolean) => Promise<string>;
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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    const unsubscribe = firebaseAuthService.onAuthStateChanged((user) => {
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
      const userProfile = await firebaseAuthService.signInWithEmail(
        email,
        password
      );
      setUser(userProfile);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    displayName?: string
  ) => {
    try {
      setError(null);
      setLoading(true);
      const userProfile = await firebaseAuthService.signUpWithEmail(
        email,
        password,
        displayName
      );
      setUser(userProfile);
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
      const userProfile = await firebaseAuthService.signInWithGoogle();
      setUser(userProfile);
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
      const userProfile = await firebaseAuthService.signInWithFacebook();
      setUser(userProfile);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithTwitter = async () => {
    try {
      setError(null);
      setLoading(true);
      const userProfile = await firebaseAuthService.signInWithTwitter();
      setUser(userProfile);
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
      await firebaseAuthService.signOut();
      setUser(null);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: {
    displayName?: string;
    photoURL?: string;
  }) => {
    try {
      setError(null);
      await firebaseAuthService.updateUserProfile(updates);
      // Actualizar el estado local del usuario
      const currentUser = firebaseAuthService.getCurrentUserProfile();
      if (currentUser) {
        setUser(currentUser);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      setError(null);
      await firebaseAuthService.changePassword(currentPassword, newPassword);
    } catch (error) {
      handleError(error);
    }
  };

  const sendPasswordResetEmail = async (email: string) => {
    try {
      setError(null);
      await firebaseAuthService.sendPasswordResetEmail(email);
    } catch (error) {
      handleError(error);
    }
  };

  const sendEmailVerification = async () => {
    try {
      setError(null);
      await firebaseAuthService.sendEmailVerification();
    } catch (error) {
      handleError(error);
    }
  };

  const getIdToken = async (forceRefresh: boolean = false) => {
    try {
      setError(null);
      return await firebaseAuthService.getIdToken(forceRefresh);
    } catch (error) {
      handleError(error);
      throw error;
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
    signInWithTwitter,
    signOut,
    updateProfile,
    changePassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    getIdToken,
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

  const isAdmin =
    user?.email?.includes("admin") ||
    user?.displayName?.toLowerCase().includes("admin");
  const isClient = !isAdmin;

  return {
    isAdmin,
    isClient,
    role: isAdmin ? "admin" : "client",
  };
};

// Hook para verificar si el email está verificado
export const useEmailVerification = () => {
  const { user } = useAuth();

  return {
    isEmailVerified: user?.emailVerified || false,
    needsVerification: user && !user.emailVerified,
  };
};

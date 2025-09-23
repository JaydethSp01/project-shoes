import React, { createContext, useContext, ReactNode } from "react";
import { useModernAlert } from "../hooks/useModernAlert";
import AlertContainer from "../components/AlertContainer";

interface AlertContextType {
  showAlert: (
    type: "success" | "error" | "warning" | "info",
    options: any
  ) => string;
  hideAlert: (id: string) => void;
  hideAllAlerts: () => void;
  showSuccess: (options: any) => string;
  showError: (options: any) => string;
  showWarning: (options: any) => string;
  showInfo: (options: any) => string;
  showAuthError: (error: any, context?: string) => string;
  showAuthSuccess: (message: string, context?: string) => string;
  showNetworkError: () => string;
  showValidationError: (field: string, message: string) => string;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const alertHook = useModernAlert();

  return (
    <AlertContext.Provider value={alertHook}>
      {children}
      <AlertContainer alerts={alertHook.alerts} onClose={alertHook.hideAlert} />
    </AlertContext.Provider>
  );
};

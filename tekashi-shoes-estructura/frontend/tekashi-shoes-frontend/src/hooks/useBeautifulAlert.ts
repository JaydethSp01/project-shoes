import { useState } from "react";

export interface AlertState {
  isOpen: boolean;
  type: "success" | "error" | "warning" | "info" | "confirm";
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const useBeautifulAlert = () => {
  const [alertState, setAlertState] = useState<AlertState>({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  const showAlert = (
    type: "success" | "error" | "warning" | "info",
    title: string,
    message: string
  ) => {
    setAlertState({
      isOpen: true,
      type,
      title,
      message,
    });
  };

  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText: string = "Confirmar",
    cancelText: string = "Cancelar"
  ) => {
    setAlertState({
      isOpen: true,
      type: "confirm",
      title,
      message,
      onConfirm,
      confirmText,
      cancelText,
    });
  };

  const hideAlert = () => {
    setAlertState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  // Métodos de conveniencia
  const showSuccess = (title: string, message: string) => {
    showAlert("success", title, message);
  };

  const showError = (title: string, message: string) => {
    showAlert("error", title, message);
  };

  const showWarning = (title: string, message: string) => {
    showAlert("warning", title, message);
  };

  const showInfo = (title: string, message: string) => {
    showAlert("info", title, message);
  };

  return {
    alertState,
    showAlert,
    showConfirm,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};


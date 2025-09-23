import { useState, useCallback } from "react";
import { AlertType } from "../components/ModernAlert";

export interface AlertOptions {
  title: string;
  message: string;
  duration?: number;
  showCloseButton?: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: "primary" | "secondary" | "danger";
  }>;
  details?: string;
  showCopyButton?: boolean;
  showRetryButton?: boolean;
  onRetry?: () => void;
}

export interface AlertState extends AlertOptions {
  type: AlertType;
  isOpen: boolean;
  id: string;
}

export const useModernAlert = () => {
  const [alerts, setAlerts] = useState<AlertState[]>([]);

  const showAlert = useCallback((type: AlertType, options: AlertOptions) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newAlert: AlertState = {
      ...options,
      type,
      isOpen: true,
      id,
    };

    setAlerts((prev) => [...prev, newAlert]);
    return id;
  }, []);

  const hideAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const hideAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  // Convenience methods
  const showSuccess = useCallback(
    (options: AlertOptions) => {
      return showAlert("success", options);
    },
    [showAlert]
  );

  const showError = useCallback(
    (options: AlertOptions) => {
      return showAlert("error", options);
    },
    [showAlert]
  );

  const showWarning = useCallback(
    (options: AlertOptions) => {
      return showAlert("warning", options);
    },
    [showAlert]
  );

  const showInfo = useCallback(
    (options: AlertOptions) => {
      return showAlert("info", options);
    },
    [showAlert]
  );

  // Auth-specific error handlers
  const showAuthError = useCallback(
    (error: any, context: string = "autenticación") => {
      let title = "Error de Autenticación";
      let message = "Ha ocurrido un error durante la autenticación.";
      let details = "";
      let showRetryButton = false;
      let onRetry: (() => void) | undefined;

      // Firebase Auth errors
      if (error?.code) {
        switch (error.code) {
          case "auth/user-not-found":
            title = "Usuario no encontrado";
            message = "No existe una cuenta con este correo electrónico.";
            break;
          case "auth/wrong-password":
            title = "Contraseña incorrecta";
            message = "La contraseña ingresada no es correcta.";
            break;
          case "auth/invalid-email":
            title = "Correo inválido";
            message = "El formato del correo electrónico no es válido.";
            break;
          case "auth/user-disabled":
            title = "Cuenta deshabilitada";
            message = "Esta cuenta ha sido deshabilitada por un administrador.";
            break;
          case "auth/too-many-requests":
            title = "Demasiados intentos";
            message =
              "Has realizado demasiados intentos. Intenta de nuevo más tarde.";
            showRetryButton = true;
            onRetry = () => {
              // Retry logic can be implemented here
              setTimeout(() => {
                hideAllAlerts();
              }, 2000);
            };
            break;
          case "auth/network-request-failed":
            title = "Error de conexión";
            message =
              "No se pudo conectar con el servidor. Verifica tu conexión a internet.";
            showRetryButton = true;
            break;
          case "auth/email-already-in-use":
            title = "Correo ya registrado";
            message = "Ya existe una cuenta con este correo electrónico.";
            break;
          case "auth/weak-password":
            title = "Contraseña débil";
            message = "La contraseña debe tener al menos 6 caracteres.";
            break;
          case "auth/invalid-credential":
            title = "Credenciales inválidas";
            message = "El correo o la contraseña son incorrectos.";
            break;
          default:
            title = "Error de Firebase";
            message = error.message || "Ha ocurrido un error inesperado.";
        }
        details = `Código: ${error.code}\nMensaje: ${error.message}`;
      }
      // Backend API errors
      else if (error?.response?.status) {
        switch (error.response.status) {
          case 401:
            title = "No autorizado";
            message = "Las credenciales proporcionadas no son válidas.";
            break;
          case 403:
            title = "Acceso denegado";
            message = "No tienes permisos para realizar esta acción.";
            break;
          case 404:
            title = "Usuario no encontrado";
            message = "No se encontró una cuenta con estos datos.";
            break;
          case 409:
            title = "Conflicto";
            message = "Ya existe una cuenta con este correo electrónico.";
            break;
          case 422:
            title = "Datos inválidos";
            message = "Los datos proporcionados no son válidos.";
            break;
          case 500:
            title = "Error del servidor";
            message = "Ha ocurrido un error interno del servidor.";
            showRetryButton = true;
            break;
          default:
            title = "Error del servidor";
            message = "Ha ocurrido un error inesperado.";
        }
        details = `Status: ${error.response.status}\nMensaje: ${
          error.response.data?.message || error.message
        }`;
      }
      // Generic errors
      else if (error?.message) {
        message = error.message;
        details = `Error: ${error.message}`;
      }

      return showError({
        title,
        message,
        details,
        showRetryButton,
        onRetry,
        showCopyButton: true,
        duration: 8000,
      });
    },
    [showError, hideAllAlerts]
  );

  const showAuthSuccess = useCallback(
    (message: string, context: string = "autenticación") => {
      return showSuccess({
        title: "¡Éxito!",
        message,
        duration: 4000,
      });
    },
    [showSuccess]
  );

  const showNetworkError = useCallback(() => {
    return showError({
      title: "Error de conexión",
      message:
        "No se pudo conectar con el servidor. Verifica tu conexión a internet.",
      showRetryButton: true,
      duration: 0, // Don't auto-close network errors
    });
  }, [showError]);

  const showValidationError = useCallback(
    (field: string, message: string) => {
      return showWarning({
        title: "Datos inválidos",
        message: `Error en ${field}: ${message}`,
        duration: 5000,
      });
    },
    [showWarning]
  );

  return {
    alerts,
    showAlert,
    hideAlert,
    hideAllAlerts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showAuthError,
    showAuthSuccess,
    showNetworkError,
    showValidationError,
  };
};

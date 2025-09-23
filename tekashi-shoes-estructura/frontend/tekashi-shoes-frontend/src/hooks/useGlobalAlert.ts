import { useState, useCallback } from "react";
import { Alert } from "../components/GlobalAlert";

export const useGlobalAlert = () => {
  const [alert, setAlert] = useState<Alert | null>(null);

  const showAlert = useCallback(
    (
      type: Alert["type"],
      title: string,
      message: string,
      duration?: number
    ) => {
      const newAlert: Alert = {
        id: Date.now().toString(),
        type,
        title,
        message,
        duration,
      };
      setAlert(newAlert);
    },
    []
  );

  const showSuccess = useCallback(
    (title: string, message: string, duration?: number) => {
      showAlert("success", title, message, duration);
    },
    [showAlert]
  );

  const showError = useCallback(
    (title: string, message: string, duration?: number) => {
      showAlert("error", title, message, duration);
    },
    [showAlert]
  );

  const showWarning = useCallback(
    (title: string, message: string, duration?: number) => {
      showAlert("warning", title, message, duration);
    },
    [showAlert]
  );

  const showInfo = useCallback(
    (title: string, message: string, duration?: number) => {
      showAlert("info", title, message, duration);
    },
    [showAlert]
  );

  const hideAlert = useCallback(() => {
    setAlert(null);
  }, []);

  return {
    alert,
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideAlert,
  };
};







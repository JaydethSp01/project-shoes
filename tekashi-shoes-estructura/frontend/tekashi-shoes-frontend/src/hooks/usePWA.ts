import { useState, useEffect } from "react";

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  isUpdateAvailable: boolean;
  installPrompt: any;
}

export const usePWA = () => {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOnline: navigator.onLine,
    isUpdateAvailable: false,
    installPrompt: null,
  });

  useEffect(() => {
    // Detectar si la app está instalada
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;
      const isInApp = (window.navigator as any).standalone === true;
      setPwaState((prev) => ({
        ...prev,
        isInstalled: isStandalone || isInApp,
      }));
    };

    // Detectar estado de conexión
    const handleOnline = () =>
      setPwaState((prev) => ({ ...prev, isOnline: true }));
    const handleOffline = () =>
      setPwaState((prev) => ({ ...prev, isOnline: false }));

    // Detectar prompt de instalación
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPwaState((prev) => ({
        ...prev,
        isInstallable: true,
        installPrompt: e,
      }));
    };

    // Detectar cuando se instala
    const handleAppInstalled = () => {
      setPwaState((prev) => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
        installPrompt: null,
      }));
    };

    // Verificar actualizaciones del Service Worker
    const checkForUpdates = async () => {
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          registration.addEventListener("updatefound", () => {
            setPwaState((prev) => ({ ...prev, isUpdateAvailable: true }));
          });
        }
      }
    };

    // Event listeners
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Verificaciones iniciales
    checkIfInstalled();
    checkForUpdates();

    // Cleanup
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Función para instalar la app
  const installApp = async () => {
    if (pwaState.installPrompt) {
      const result = await (pwaState.installPrompt as any).prompt();
      const choice = await (pwaState.installPrompt as any).userChoice;

      if (choice.outcome === "accepted") {
        console.log("✅ Usuario aceptó la instalación");
      } else {
        console.log("❌ Usuario rechazó la instalación");
      }

      setPwaState((prev) => ({
        ...prev,
        installPrompt: null,
        isInstallable: false,
      }));

      return choice.outcome === "accepted";
    }
    return false;
  };

  // Función para actualizar la app
  const updateApp = () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
          window.location.reload();
        }
      });
    }
  };

  return {
    ...pwaState,
    installApp,
    updateApp,
  };
};

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./styles/Futuristic2025.css";
import "./styles/MobileOptimized.css"; // Mobile optimized styles
import "./styles/MobileResponsive.css";
import "./styles/FilterColors.css"; // Mobile responsiveness improvements
import "./styles/ModalFix.css"; // Modal overlap and positioning fixes
// import "./styles/PWAStatus.css"; // PWA status styles - Comentado para quitar banner molesto
import "./styles/Chatbot.css";
import "./styles/ModernAlert.css"; // Modern alert styles
import "./styles/ErrorBoundary.css"; // Error boundary styles
import "./config/i18n"; // Importar configuración de i18n
import Home from "./pages/Home";
// import PWAStatus from "./components/PWAStatus"; // Comentado para quitar banner molesto
import { AlertProvider } from "./contexts/AlertContext";
import { AuthProvider } from "./hooks/useAuth";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AlertProvider>
          <Home />
          {/* <PWAStatus /> Comentado para quitar banner molesto */}
        </AlertProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

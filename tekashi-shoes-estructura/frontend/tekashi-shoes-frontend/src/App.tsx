import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./styles/Futuristic2025.css";
import "./styles/MobileOptimized.css"; // Mobile optimized styles
import "./styles/PWAStatus.css"; // PWA status styles
import "./styles/Chatbot.css";
import "./config/i18n"; // Importar configuración de i18n
import Home from "./pages/Home";
import PWAStatus from "./components/PWAStatus";

function App() {
  return (
    <>
      <Home />
      <PWAStatus />
    </>
  );
}

export default App;

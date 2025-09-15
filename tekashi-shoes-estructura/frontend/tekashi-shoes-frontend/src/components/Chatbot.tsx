import React, { useState, useRef, useEffect } from "react";
import {
  FaRobot,
  FaUser,
  FaPaperPlane,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";
import { Product } from "../modelos/productTypes";
import { chatbotService, ChatMessage } from "../services/ChatbotService";
import { notificationService } from "../services/NotificationService";

interface ChatbotProps {
  products: Product[];
  isOpen: boolean;
  onToggle: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: '¡Hola! 👋 Soy tu asistente personal de compras en Tekashi Shoes.\n\n🎯 **Te ayudo a encontrar el zapato perfecto para ti**\n\n**¿Por dónde empezamos? Elige una opción:**\n\n1️⃣ **🏷️ Buscar por marca** - "nike", "adidas", "puma"\n2️⃣ **👟 Ver por tipo** - "tenis", "zapatillas", "botas"\n3️⃣ **💰 Ver ofertas** - "descuentos", "promociones"\n4️⃣ **📏 Ayuda con tallas** - "talla 42", "medidas"\n5️⃣ **🛒 Ver carrito** - "carrito", "compras"\n6️⃣ **📞 Contactar soporte** - "soporte", "ayuda"\n\n**💡 Ejemplos de búsqueda:**\n• "nike negro" - Zapatos Nike en negro\n• "tenis baratos" - Tenis económicos\n• "talla 42" - Ayuda con tallas\n• "ofertas" - Ver promociones\n\n**🔄 Tip:** Puedes combinar palabras como "nike negro barato" para mejores resultados',
      isUser: false,
      timestamp: new Date(),
      type: "text",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      // Generar respuesta usando el servicio
      const response = await chatbotService.generateResponse(inputText);

      // Simular tiempo de escritura
      setTimeout(() => {
        setMessages((prev) => [...prev, response]);
        setIsTyping(false);

        // Notificar búsqueda si es relevante
        if (inputText.length > 3 && !inputText.toLowerCase().includes("hola")) {
          notificationService.searchNotification(
            inputText,
            response.text.includes("Encontramos")
              ? parseInt(response.text.match(/(\d+)/)?.[1] || "0")
              : 0
          );
        }
      }, 1000 + Math.random() * 2000);
    } catch (error) {
      console.error("Error generando respuesta:", error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        text: "Lo siento, hubo un error al procesar tu consulta. Por favor, inténtalo de nuevo.",
        isUser: false,
        timestamp: new Date(),
        type: "text",
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.isUser;

    return (
      <div
        key={message.id}
        className={`message ${isUser ? "user-message" : "bot-message"}`}
      >
        <div className="message-avatar">
          {isUser ? <FaUser /> : <FaRobot />}
        </div>
        <div className="message-content">
          <div className="message-text">
            {message.type === "list" || message.type === "stats" ? (
              <div className="formatted-message">
                {message.text.split("\n").map((line, index) => {
                  if (line.startsWith("•")) {
                    return (
                      <div key={index} className="list-item">
                        {line}
                      </div>
                    );
                  } else if (line.startsWith("**") && line.endsWith("**")) {
                    return (
                      <div key={index} className="section-title">
                        {line.replace(/\*\*/g, "")}
                      </div>
                    );
                  } else if (line.trim() === "") {
                    return <br key={index} />;
                  } else {
                    return (
                      <div key={index} className="message-line">
                        {line}
                      </div>
                    );
                  }
                })}
              </div>
            ) : (
              <div className="message-line">{message.text}</div>
            )}
          </div>
          <div className="message-time">{formatTime(message.timestamp)}</div>
        </div>
      </div>
    );
  };

  if (!isOpen) {
    return (
      <button
        className="chatbot-toggle-btn"
        onClick={onToggle}
        title="Abrir asistente virtual"
      >
        <FaRobot />
        <span className="chatbot-pulse"></span>
      </button>
    );
  }

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="chatbot-title">
          <FaRobot className="chatbot-icon" />
          <div>
            <h4>Asistente Virtual</h4>
            <span className="chatbot-status">En línea</span>
          </div>
        </div>
        <button className="chatbot-close-btn" onClick={onToggle}>
          <FaTimes />
        </button>
      </div>

      <div className="chatbot-messages">
        {messages.map(renderMessage)}
        {isTyping && (
          <div className="message bot-message">
            <div className="message-avatar">
              <FaRobot />
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <FaSpinner className="spinning" />
                <span>Escribiendo...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input">
        <div className="input-container">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu consulta..."
            disabled={isTyping}
            className="chatbot-input-field"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="chatbot-send-btn"
          >
            <FaPaperPlane />
          </button>
        </div>
        <div className="chatbot-suggestions">
          <span>💡 Prueba:</span>
          <button onClick={() => setInputText("nike negro")}>nike negro</button>
          <button onClick={() => setInputText("tenis baratos")}>
            tenis baratos
          </button>
          <button onClick={() => setInputText("ofertas")}>ofertas</button>
          <button onClick={() => setInputText("talla 42")}>talla 42</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

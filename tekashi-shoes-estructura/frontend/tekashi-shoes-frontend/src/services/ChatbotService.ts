import { ConexionApiBackend } from "./ConexionApiBackend";
import { Product, TipoProducto } from "../modelos/productTypes";

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: "text" | "product" | "list" | "stats";
  data?: any;
}

class ChatbotService {
  private products: Product[] = [];
  private tiposProducto: TipoProducto[] = [];
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      this.products = await ConexionApiBackend.obtenerProductos();
      this.tiposProducto = await ConexionApiBackend.obtenerTiposProducto();
      this.isInitialized = true;
    } catch (error) {
      console.error("Error inicializando chatbot:", error);
    }
  }

  async generateResponse(userMessage: string): Promise<ChatMessage> {
    await this.initialize();

    const message = userMessage.toLowerCase().trim();

    // Respuestas de saludo
    if (this.isGreeting(message)) {
      return this.createMessage(
        `¡Hola! 👋 Soy el asistente de Tekashi Shoes. Estoy aquí para ayudarte a encontrar los zapatos perfectos. ¿En qué puedo ayudarte?`,
        false
      );
    }

    // Búsqueda por tipo de producto
    if (this.isTypeSearch(message)) {
      return this.handleTypeSearch(message);
    }

    // Búsqueda por precio
    if (this.isPriceSearch(message)) {
      return this.handlePriceSearch(message);
    }

    // Búsqueda por color
    if (this.isColorSearch(message)) {
      return this.handleColorSearch(message);
    }

    // Búsqueda por marca
    if (this.isBrandSearch(message)) {
      return this.handleBrandSearch(message);
    }

    // Información de stock
    if (this.isStockQuery(message)) {
      return this.handleStockQuery();
    }

    // Productos populares
    if (this.isPopularQuery(message)) {
      return this.handlePopularProducts();
    }

    // Estadísticas de la tienda
    if (this.isStatsQuery(message)) {
      return this.handleStatsQuery();
    }

    // Búsqueda general
    if (this.isGeneralSearch(message)) {
      return this.handleGeneralSearch(message);
    }

    // Ayuda
    if (this.isHelpQuery(message)) {
      return this.handleHelpQuery();
    }

    // Respuesta por defecto
    return this.createMessage(
      `No estoy seguro de entender tu consulta. Puedes preguntarme sobre:
      
🔍 **Tipos de zapatos**: "tenis", "zapatillas", "tacones", "botas"
💰 **Precios**: "baratos", "económicos", "premium", "entre $100000 y $200000"
🎨 **Colores**: "negro", "blanco", "azul", etc.
🏷️ **Marcas**: "Nike", "Adidas", "Jordan", etc.
📊 **Stock**: "disponibles", "agotados", "inventario"
⭐ **Populares**: "más vendidos", "recomendados"

¿En qué más puedo ayudarte?`,
      false
    );
  }

  private isGreeting(message: string): boolean {
    const greetings = [
      "hola",
      "hi",
      "hello",
      "buenos días",
      "buenas tardes",
      "buenas noches",
      "saludos",
    ];
    return greetings.some((greeting) => message.includes(greeting));
  }

  private isTypeSearch(message: string): boolean {
    const types = [
      "tenis",
      "zapatillas",
      "tacones",
      "botas",
      "mocasines",
      "sneakers",
      "running",
      "basketball",
      "casual",
      "formal",
    ];
    return types.some((type) => message.includes(type));
  }

  private isPriceSearch(message: string): boolean {
    const priceKeywords = [
      "barato",
      "económico",
      "precio",
      "costo",
      "premium",
      "caro",
      "descuento",
      "oferta",
    ];
    return (
      priceKeywords.some((keyword) => message.includes(keyword)) ||
      /\$/.test(message)
    );
  }

  private isColorSearch(message: string): boolean {
    const colors = [
      "negro",
      "blanco",
      "azul",
      "rojo",
      "verde",
      "amarillo",
      "rosa",
      "gris",
      "marrón",
      "dorado",
      "plateado",
    ];
    return colors.some((color) => message.includes(color));
  }

  private isBrandSearch(message: string): boolean {
    const brands = [
      "nike",
      "adidas",
      "jordan",
      "puma",
      "converse",
      "vans",
      "new balance",
      "reebok",
      "gucci",
      "balenciaga",
    ];
    return brands.some((brand) => message.includes(brand));
  }

  private isStockQuery(message: string): boolean {
    const stockKeywords = [
      "stock",
      "disponible",
      "agotado",
      "inventario",
      "cantidad",
      "unidades",
    ];
    return stockKeywords.some((keyword) => message.includes(keyword));
  }

  private isPopularQuery(message: string): boolean {
    const popularKeywords = [
      "popular",
      "vendido",
      "recomendado",
      "mejor",
      "destacado",
      "favorito",
    ];
    return popularKeywords.some((keyword) => message.includes(keyword));
  }

  private isStatsQuery(message: string): boolean {
    const statsKeywords = [
      "estadística",
      "estadísticas",
      "total",
      "cuántos",
      "información",
      "datos",
    ];
    return statsKeywords.some((keyword) => message.includes(keyword));
  }

  private isGeneralSearch(message: string): boolean {
    return message.length > 3 && !this.isGreeting(message);
  }

  private isHelpQuery(message: string): boolean {
    const helpKeywords = ["ayuda", "help", "comandos", "qué puedo", "cómo"];
    return helpKeywords.some((keyword) => message.includes(keyword));
  }

  private handleTypeSearch(message: string): ChatMessage {
    const matchingTypes = this.tiposProducto.filter((tipo) =>
      message.includes(tipo.nombre.toLowerCase())
    );

    if (matchingTypes.length > 0) {
      const tipo = matchingTypes[0];
      const products = this.products.filter(
        (p) => p.tipoProductoId === tipo.idTipoProducto
      );

      if (products.length > 0) {
        const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
        const avgPrice =
          products.reduce((sum, p) => sum + p.precio, 0) / products.length;
        const brands = [...new Set(products.map((p) => p.marca))];

        return this.createMessage(
          `👟 **${tipo.nombre}** - Encontramos ${products.length} productos:
          
📊 **Estadísticas:**
• Total en stock: ${totalStock} unidades
• Precio promedio: $${avgPrice.toLocaleString()}
• Marcas disponibles: ${brands.join(", ")}

🏆 **Productos destacados:**
${products
  .slice(0, 3)
  .map(
    (p) =>
      `• ${p.marca} - $${p.precio.toLocaleString()} (${p.stock} disponibles)`
  )
  .join("\n")}

¿Te interesa algún producto específico?`,
          false,
          "stats"
        );
      }
    }

    return this.createMessage(
      `No encontré productos de ese tipo específico. Tenemos disponibles:
      
${this.tiposProducto.map((tipo) => `• ${tipo.nombre}`).join("\n")}

¿Cuál te interesa?`,
      false
    );
  }

  private handlePriceSearch(message: string): ChatMessage {
    let filteredProducts = [...this.products];

    if (message.includes("barato") || message.includes("económico")) {
      filteredProducts = this.products.filter((p) => p.precio < 300000);
    } else if (message.includes("premium") || message.includes("caro")) {
      filteredProducts = this.products.filter((p) => p.precio > 500000);
    } else if (/\$/.test(message)) {
      const priceMatch = message.match(/\$?(\d+)/);
      if (priceMatch) {
        const price = parseInt(priceMatch[1]);
        filteredProducts = this.products.filter((p) => p.precio <= price);
      }
    }

    if (filteredProducts.length > 0) {
      const avgPrice =
        filteredProducts.reduce((sum, p) => sum + p.precio, 0) /
        filteredProducts.length;
      const minPrice = Math.min(...filteredProducts.map((p) => p.precio));
      const maxPrice = Math.max(...filteredProducts.map((p) => p.precio));

      return this.createMessage(
        `💰 **Productos por precio** - Encontramos ${
          filteredProducts.length
        } opciones:
        
📊 **Rango de precios:**
• Precio mínimo: $${minPrice.toLocaleString()}
• Precio máximo: $${maxPrice.toLocaleString()}
• Precio promedio: $${avgPrice.toLocaleString()}

🏆 **Mejores opciones:**
${filteredProducts
  .slice(0, 5)
  .map((p) => `• ${p.marca} - $${p.precio.toLocaleString()} (${p.color})`)
  .join("\n")}

¿Te interesa algún producto específico?`,
        false,
        "list"
      );
    }

    return this.createMessage(
      `No encontré productos en ese rango de precio. Nuestros precios van desde $${Math.min(
        ...this.products.map((p) => p.precio)
      ).toLocaleString()} hasta $${Math.max(
        ...this.products.map((p) => p.precio)
      ).toLocaleString()}.`,
      false
    );
  }

  private handleColorSearch(message: string): ChatMessage {
    const colors = [
      "negro",
      "blanco",
      "azul",
      "rojo",
      "verde",
      "amarillo",
      "rosa",
      "gris",
      "marrón",
      "dorado",
      "plateado",
    ];
    const matchingColor = colors.find((color) => message.includes(color));

    if (matchingColor) {
      const products = this.products.filter((p) =>
        p.color.toLowerCase().includes(matchingColor)
      );

      if (products.length > 0) {
        return this.createMessage(
          `🎨 **Productos en color ${matchingColor}** - Encontramos ${
            products.length
          } opciones:
          
${products
  .slice(0, 5)
  .map(
    (p) =>
      `• ${p.marca} - $${p.precio.toLocaleString()} (${p.stock} disponibles)`
  )
  .join("\n")}

¿Te interesa algún producto específico?`,
          false,
          "list"
        );
      }
    }

    return this.createMessage(
      `Colores disponibles: ${[
        ...new Set(this.products.map((p) => p.color)),
      ].join(", ")}`,
      false
    );
  }

  private handleBrandSearch(message: string): ChatMessage {
    const brands = [
      "nike",
      "adidas",
      "jordan",
      "puma",
      "converse",
      "vans",
      "new balance",
      "reebok",
      "gucci",
      "balenciaga",
    ];
    const matchingBrand = brands.find((brand) => message.includes(brand));

    if (matchingBrand) {
      const products = this.products.filter((p) =>
        p.marca.toLowerCase().includes(matchingBrand)
      );

      if (products.length > 0) {
        const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
        const avgPrice =
          products.reduce((sum, p) => sum + p.precio, 0) / products.length;

        return this.createMessage(
          `🏷️ **${matchingBrand.toUpperCase()}** - Encontramos ${
            products.length
          } productos:
          
📊 **Estadísticas:**
• Total en stock: ${totalStock} unidades
• Precio promedio: $${avgPrice.toLocaleString()}

🏆 **Productos disponibles:**
${products
  .slice(0, 5)
  .map((p) => `• ${p.marca} - $${p.precio.toLocaleString()} (${p.color})`)
  .join("\n")}

¿Te interesa algún producto específico?`,
          false,
          "list"
        );
      }
    }

    return this.createMessage(
      `Marcas disponibles: ${[
        ...new Set(this.products.map((p) => p.marca)),
      ].join(", ")}`,
      false
    );
  }

  private handleStockQuery(): ChatMessage {
    const totalProducts = this.products.length;
    const totalStock = this.products.reduce((sum, p) => sum + p.stock, 0);
    const outOfStock = this.products.filter((p) => p.stock === 0).length;
    const lowStock = this.products.filter(
      (p) => p.stock > 0 && p.stock <= 5
    ).length;

    return this.createMessage(
      `📊 **Estado del inventario:**
      
• Total de productos: ${totalProducts}
• Total en stock: ${totalStock} unidades
• Productos agotados: ${outOfStock}
• Stock bajo (≤5 unidades): ${lowStock}

${
  lowStock > 0
    ? `⚠️ **Atención:** ${lowStock} productos tienen stock limitado`
    : "✅ **Todo en stock**"
}`,
      false,
      "stats"
    );
  }

  private handlePopularProducts(): ChatMessage {
    // Simular productos populares basados en stock y precio
    const popularProducts = this.products
      .filter((p) => p.stock > 0)
      .sort(
        (a, b) =>
          (b.stock * 1000000) / b.precio - (a.stock * 1000000) / a.precio
      )
      .slice(0, 5);

    return this.createMessage(
      `⭐ **Productos más populares:**
      
${popularProducts
  .map(
    (p, index) =>
      `${index + 1}. ${p.marca} - $${p.precio.toLocaleString()} (${
        p.stock
      } disponibles)`
  )
  .join("\n")}

Estos productos tienen la mejor relación calidad-precio y disponibilidad.`,
      false,
      "list"
    );
  }

  private handleStatsQuery(): ChatMessage {
    const totalProducts = this.products.length;
    const totalStock = this.products.reduce((sum, p) => sum + p.stock, 0);
    const avgPrice =
      this.products.reduce((sum, p) => sum + p.precio, 0) /
      this.products.length;
    const brands = [...new Set(this.products.map((p) => p.marca))];
    const types = [...new Set(this.products.map((p) => p.tipoProductoId))];

    return this.createMessage(
      `📈 **Estadísticas de Tekashi Shoes:**
      
• **Productos totales:** ${totalProducts}
• **Stock total:** ${totalStock} unidades
• **Precio promedio:** $${avgPrice.toLocaleString()}
• **Marcas disponibles:** ${brands.length} (${brands.slice(0, 5).join(", ")}${
        brands.length > 5 ? "..." : ""
      })
• **Categorías:** ${types.length} tipos diferentes

¡Somos tu tienda de confianza para calzado premium! 👟`,
      false,
      "stats"
    );
  }

  private handleGeneralSearch(message: string): ChatMessage {
    const searchTerms = message.split(" ").filter((term) => term.length > 2);
    const matchingProducts = this.products.filter((p) =>
      searchTerms.some(
        (term) =>
          p.marca.toLowerCase().includes(term) ||
          p.color.toLowerCase().includes(term)
      )
    );

    if (matchingProducts.length > 0) {
      return this.createMessage(
        `🔍 **Resultados para "${message}":**
        
Encontramos ${matchingProducts.length} productos relacionados:

${matchingProducts
  .slice(0, 5)
  .map((p) => `• ${p.marca} - $${p.precio.toLocaleString()} (${p.color})`)
  .join("\n")}

¿Te interesa algún producto específico?`,
        false,
        "list"
      );
    }

    return this.createMessage(
      `No encontré productos relacionados con "${message}". 

Puedes probar con:
• Nombres de marcas (Nike, Adidas, etc.)
• Colores (negro, blanco, azul, etc.)
• Tipos de zapatos (tenis, zapatillas, etc.)`,
      false
    );
  }

  private handleHelpQuery(): ChatMessage {
    return this.createMessage(
      `🤖 **Comandos disponibles:**

🔍 **Búsquedas:**
• "tenis" - Ver productos de tenis
• "Nike" - Ver productos de Nike
• "negro" - Ver productos negros
• "baratos" - Ver productos económicos

📊 **Información:**
• "stock" - Ver estado del inventario
• "populares" - Ver productos más vendidos
• "estadísticas" - Ver datos de la tienda

💰 **Precios:**
• "entre $100000 y $200000" - Filtrar por precio
• "premium" - Ver productos de alta gama
• "económicos" - Ver productos baratos

¿En qué más puedo ayudarte?`,
      false
    );
  }

  private createMessage(
    text: string,
    isUser: boolean,
    type: "text" | "product" | "list" | "stats" = "text",
    data?: any
  ): ChatMessage {
    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text,
      isUser,
      timestamp: new Date(),
      type,
      data,
    };
  }
}

export const chatbotService = new ChatbotService();

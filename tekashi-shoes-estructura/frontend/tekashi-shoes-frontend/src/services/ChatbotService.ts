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

    // Manejar opciones numéricas
    if (this.isNumericOption(message)) {
      return this.handleNumericOption(message);
    }

    // Respuestas de saludo
    if (this.isGreeting(message)) {
      return this.createMessage(
        `¡Hola! 👋 Soy tu asistente personal de compras en Tekashi Shoes.\n\n🎯 **Te ayudo a encontrar el zapato perfecto para ti**\n\n**¿Por dónde empezamos? Elige una opción:**`,
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

    // Búsqueda inteligente (combina marca, tipo, color, etc.)
    if (this.isIntelligentSearch(message)) {
      return this.handleIntelligentSearch(message);
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

  // Nuevas funciones para manejar opciones numéricas
  private isNumericOption(message: string): boolean {
    const numericPattern = /^[1-6]$/;
    return numericPattern.test(message.trim());
  }

  private async handleNumericOption(message: string): Promise<ChatMessage> {
    const option = parseInt(message.trim());

    switch (option) {
      case 1:
        return this.createMessage(
          `🔍 **Búsqueda por Marca**\n\nEscribe el nombre de la marca que te interesa:\n\n**Marcas disponibles:**\n${this.getAvailableBrands()}\n\n**Ejemplos:**\n• "nike" - Ver zapatos Nike\n• "adidas" - Ver zapatos Adidas\n• "puma" - Ver zapatos Puma\n\n¿Qué marca te interesa?`,
          false
        );

      case 2:
        return this.createMessage(
          `👟 **Búsqueda por Tipo**\n\nEscribe el tipo de zapato que buscas:\n\n**Tipos disponibles:**\n${this.getAvailableTypes()}\n\n**Ejemplos:**\n• "zapatillas deportivas"\n• "botas"\n• "sandalias"\n• "zapatos formales"\n\n¿Qué tipo de zapato necesitas?`,
          false
        );

      case 3:
        return this.createMessage(
          `💰 **Ofertas Especiales**\n\n¡Aquí tienes nuestras mejores ofertas!\n\n${this.getSpecialOffers()}\n\n¿Te interesa alguna de estas ofertas?`,
          false
        );

      case 4:
        return this.createMessage(
          `📏 **Guía de Tallas**\n\n**¿Cómo elegir tu talla correcta?**\n\n1️⃣ **Mide tu pie:** Coloca tu pie en una hoja de papel y marca la punta y el talón\n2️⃣ **Mide la distancia:** Usa una regla para medir en centímetros\n3️⃣ **Consulta la tabla:**\n\n**Tabla de Tallas:**\n• 38 = 24.5 cm\n• 39 = 25.5 cm\n• 40 = 26.0 cm\n• 41 = 27.0 cm\n• 42 = 27.5 cm\n• 43 = 28.5 cm\n• 44 = 29.0 cm\n\n**💡 Consejo:** Si estás entre dos tallas, elige la más grande.\n\n¿Qué talla necesitas?`,
          false
        );

      case 5:
        return this.createMessage(
          `🛒 **Tu Carrito de Compras**\n\nPara revisar tu carrito, necesitas:\n\n1️⃣ **Iniciar sesión** si no lo has hecho\n2️⃣ **Hacer clic en el icono del carrito** en la parte superior\n3️⃣ **Ver tus productos** y proceder al pago\n\n**¿Necesitas ayuda con:**\n• Agregar productos al carrito\n• Cambiar cantidades\n• Proceder al pago\n• Códigos de descuento\n\n¿En qué más puedo ayudarte con tu carrito?`,
          false
        );

      case 6:
        return this.createMessage(
          `📞 **Soporte al Cliente**\n\n**¿Cómo podemos ayudarte?**\n\n**📧 Email:** soporte@tekashishoes.com\n**📱 Teléfono:** +57 300 123 4567\n**💬 WhatsApp:** +57 300 123 4567\n**🕒 Horario:** Lunes a Viernes 8:00 AM - 6:00 PM\n\n**Preguntas frecuentes:**\n• Cambios y devoluciones\n• Problemas con pedidos\n• Información de envío\n• Garantías\n\n**¿Qué tipo de ayuda necesitas?**`,
          false
        );

      default:
        return this.createMessage(
          `❌ Opción no válida. Por favor escribe un número del 1 al 6.`,
          false
        );
    }
  }

  private getAvailableBrands(): string {
    const brands = [...new Set(this.products.map((p) => p.marca))];
    return brands
      .slice(0, 10)
      .map((brand) => `• ${brand}`)
      .join("\n");
  }

  private getAvailableTypes(): string {
    return this.tiposProducto
      .slice(0, 10)
      .map((tipo) => `• ${tipo.nombre}`)
      .join("\n");
  }

  private getSpecialOffers(): string {
    const offers = [
      "🔥 **Nike Air Max 270** - 30% OFF - Antes: $450,000 - Ahora: $315,000",
      "🔥 **Adidas Ultraboost 22** - 25% OFF - Antes: $380,000 - Ahora: $285,000",
      "🔥 **Puma RS-X** - 20% OFF - Antes: $320,000 - Ahora: $256,000",
      "🔥 **New Balance 990** - 15% OFF - Antes: $400,000 - Ahora: $340,000",
    ];
    return offers.join("\n\n");
  }

  // Nueva función para búsqueda inteligente
  private isIntelligentSearch(message: string): boolean {
    const words = message.toLowerCase().split(" ");
    const hasBrand = words.some((word) =>
      ["nike", "adidas", "puma", "new balance", "converse", "vans"].includes(
        word
      )
    );
    const hasType = words.some((word) =>
      [
        "tenis",
        "zapatillas",
        "deportivos",
        "casuales",
        "formales",
        "botas",
      ].includes(word)
    );
    const hasColor = words.some((word) =>
      [
        "negro",
        "blanco",
        "azul",
        "rojo",
        "verde",
        "gris",
        "negros",
        "blancos",
        "azules",
        "rojos",
      ].includes(word)
    );
    const hasPrice = words.some((word) =>
      [
        "barato",
        "baratos",
        "económico",
        "económicos",
        "caro",
        "caros",
        "oferta",
        "ofertas",
      ].includes(word)
    );

    return hasBrand || hasType || hasColor || hasPrice;
  }

  private handleIntelligentSearch(message: string): ChatMessage {
    const words = message.toLowerCase().split(" ");

    // Extraer criterios de búsqueda
    const brand = words.find((word) =>
      ["nike", "adidas", "puma", "new balance", "converse", "vans"].includes(
        word
      )
    );
    const type = words.find((word) =>
      [
        "tenis",
        "zapatillas",
        "deportivos",
        "casuales",
        "formales",
        "botas",
      ].includes(word)
    );
    const color = words.find((word) =>
      [
        "negro",
        "blanco",
        "azul",
        "rojo",
        "verde",
        "gris",
        "negros",
        "blancos",
        "azules",
        "rojos",
      ].includes(word)
    );
    const price = words.find((word) =>
      [
        "barato",
        "baratos",
        "económico",
        "económicos",
        "caro",
        "caros",
        "oferta",
        "ofertas",
      ].includes(word)
    );

    // Filtrar productos según criterios
    let filteredProducts = this.products;

    if (brand) {
      filteredProducts = filteredProducts.filter((p) =>
        p.marca.toLowerCase().includes(brand)
      );
    }

    if (type) {
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.tipoProductoId?.toString().toLowerCase().includes(type) ||
          p.descripcion.toLowerCase().includes(type)
      );
    }

    if (color) {
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.descripcion.toLowerCase().includes(color) ||
          p.color.toLowerCase().includes(color)
      );
    }

    if (price) {
      if (
        [
          "barato",
          "baratos",
          "económico",
          "económicos",
          "oferta",
          "ofertas",
        ].includes(price)
      ) {
        filteredProducts = filteredProducts.filter((p) => p.precio < 200000);
      } else if (["caro", "caros"].includes(price)) {
        filteredProducts = filteredProducts.filter((p) => p.precio > 300000);
      }
    }

    if (filteredProducts.length === 0) {
      return this.createMessage(
        `😔 No encontré productos que coincidan con tu búsqueda "${message}".\n\n**💡 Sugerencias:**\n• Prueba con términos más generales\n• Usa los botones de acción rápida\n• Pregúntame por marcas específicas`,
        false
      );
    }

    // Mostrar resultados
    const results = filteredProducts.slice(0, 5);
    const resultText = results
      .map(
        (product, index) =>
          `${index + 1}. **${product.nombre}** - ${
            product.marca
          }\n   💰 $${product.precio.toLocaleString()}\n   📝 ${product.descripcion.substring(
            0,
            100
          )}...`
      )
      .join("\n\n");

    return this.createMessage(
      `🎯 **Encontré ${filteredProducts.length} productos** que coinciden con tu búsqueda:\n\n${resultText}\n\n**💡 Tip:** Haz clic en cualquier producto para ver más detalles y agregarlo al carrito.`,
      false
    );
  }
}

export const chatbotService = new ChatbotService();

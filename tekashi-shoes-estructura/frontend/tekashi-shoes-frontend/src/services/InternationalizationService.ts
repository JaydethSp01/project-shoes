// Internationalization Service - Tekashi Shoes
// Maneja la localización de datos del backend

interface LocalizationConfig {
  locale: string;
  currency: string;
  dateFormat: string;
  numberFormat: string;
}

class InternationalizationService {
  private config: LocalizationConfig = {
    locale: 'es-CO',
    currency: 'COP',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'es-CO'
  };

  // Formatear moneda
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat(this.config.numberFormat, {
      style: 'currency',
      currency: this.config.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Formatear números
  formatNumber(number: number): string {
    return new Intl.NumberFormat(this.config.numberFormat).format(number);
  }

  // Formatear fechas
  formatDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(this.config.locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(dateObj);
  }

  // Formatear fecha y hora
  formatDateTime(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(this.config.locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  }

  // Formatear fechas relativas (hace X tiempo)
  formatRelativeDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Hace un momento';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `Hace ${days} día${days > 1 ? 's' : ''}`;
    } else {
      return this.formatDate(dateObj);
    }
  }

  // Localizar estados de pedidos
  localizeOrderStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'pending': 'Pendiente',
      'processing': 'Procesando',
      'shipped': 'Enviado',
      'delivered': 'Entregado',
      'cancelled': 'Cancelado',
      'refunded': 'Reembolsado',
      'active': 'Activo',
      'inactive': 'Inactivo',
      'completed': 'Completado',
      'failed': 'Fallido'
    };

    return statusMap[status.toLowerCase()] || status;
  }

  // Localizar estados de productos
  localizeProductStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'active': 'Disponible',
      'inactive': 'No disponible',
      'out_of_stock': 'Agotado',
      'limited': 'Stock limitado',
      'new': 'Nuevo',
      'sale': 'En oferta',
      'featured': 'Destacado'
    };

    return statusMap[status.toLowerCase()] || status;
  }

  // Localizar tipos de productos
  localizeProductType(type: string): string {
    const typeMap: Record<string, string> = {
      'sneakers': 'Zapatillas',
      'running': 'Running',
      'basketball': 'Baloncesto',
      'casual': 'Casual',
      'formal': 'Formal',
      'sports': 'Deportivo',
      'lifestyle': 'Estilo de vida',
      'athletic': 'Atlético',
      'streetwear': 'Streetwear',
      'luxury': 'Lujo'
    };

    return typeMap[type.toLowerCase()] || type;
  }

  // Localizar colores
  localizeColor(color: string): string {
    const colorMap: Record<string, string> = {
      'black': 'Negro',
      'white': 'Blanco',
      'red': 'Rojo',
      'blue': 'Azul',
      'green': 'Verde',
      'yellow': 'Amarillo',
      'orange': 'Naranja',
      'purple': 'Morado',
      'pink': 'Rosa',
      'brown': 'Marrón',
      'gray': 'Gris',
      'grey': 'Gris',
      'silver': 'Plateado',
      'gold': 'Dorado',
      'navy': 'Azul marino',
      'beige': 'Beige',
      'tan': 'Marrón claro',
      'crimson': 'Carmesí',
      'maroon': 'Granate',
      'olive': 'Oliva',
      'lime': 'Lima',
      'cyan': 'Cian',
      'magenta': 'Magenta',
      'turquoise': 'Turquesa'
    };

    return colorMap[color.toLowerCase()] || color;
  }

  // Localizar tamaños
  localizeSize(size: string): string {
    const sizeMap: Record<string, string> = {
      'xs': 'Extra Pequeño',
      's': 'Pequeño',
      'm': 'Mediano',
      'l': 'Grande',
      'xl': 'Extra Grande',
      'xxl': 'Extra Extra Grande',
      'xxxl': 'Extra Extra Extra Grande'
    };

    return sizeMap[size.toLowerCase()] || size;
  }

  // Localizar marcas
  localizeBrand(brand: string): string {
    const brandMap: Record<string, string> = {
      'nike': 'Nike',
      'adidas': 'Adidas',
      'puma': 'Puma',
      'converse': 'Converse',
      'jordan': 'Jordan',
      'vans': 'Vans',
      'new balance': 'New Balance',
      'reebok': 'Reebok',
      'gucci': 'Gucci',
      'balenciaga': 'Balenciaga',
      'louis vuitton': 'Louis Vuitton',
      'dior': 'Dior',
      'off-white': 'Off-White',
      'yeezy': 'Yeezy'
    };

    return brandMap[brand.toLowerCase()] || brand;
  }

  // Localizar mensajes de notificaciones
  localizeNotificationMessage(type: string, data?: any): string {
    const messageMap: Record<string, string> = {
      'order_placed': 'Tu pedido ha sido realizado exitosamente',
      'order_shipped': 'Tu pedido ha sido enviado',
      'order_delivered': 'Tu pedido ha sido entregado',
      'payment_success': 'Tu pago ha sido procesado correctamente',
      'payment_failed': 'Hubo un problema con tu pago',
      'stock_low': 'Quedan pocas unidades de este producto',
      'price_drop': 'El precio de este producto ha bajado',
      'new_arrival': 'Tenemos nuevos productos disponibles',
      'wishlist_reminder': 'Recuerda revisar tu lista de deseos',
      'cart_reminder': 'Tienes productos en tu carrito esperando'
    };

    let message = messageMap[type.toLowerCase()] || 'Nueva notificación';

    // Personalizar mensaje con datos específicos
    if (data) {
      if (data.orderId) {
        message += ` (Pedido #${data.orderId})`;
      }
      if (data.productName) {
        message += ` - ${data.productName}`;
      }
      if (data.discount) {
        message += ` - ${data.discount}% de descuento`;
      }
    }

    return message;
  }

  // Formatear direcciones
  formatAddress(address: any): string {
    if (!address) return 'No especificada';

    const parts = [];
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.postalCode) parts.push(address.postalCode);
    if (address.country) parts.push(address.country);

    return parts.join(', ');
  }

  // Formatear información de contacto
  formatPhone(phone: string): string {
    if (!phone) return 'No especificado';
    
    // Formato colombiano: +57 300 123 4567
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+57 ${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`;
    }
    return phone;
  }

  // Configurar localización
  setLocale(locale: string, currency?: string): void {
    this.config.locale = locale;
    if (currency) {
      this.config.currency = currency;
    }
  }

  // Obtener configuración actual
  getConfig(): LocalizationConfig {
    return { ...this.config };
  }

  // Validar si un valor está vacío o indefinido
  isEmpty(value: any): boolean {
    return value === null || value === undefined || value === '' || 
           (Array.isArray(value) && value.length === 0) ||
           (typeof value === 'object' && Object.keys(value).length === 0);
  }

  // Obtener valor por defecto si está vacío
  getDefaultValue(value: any, defaultValue: string = 'No especificado'): string {
    return this.isEmpty(value) ? defaultValue : String(value);
  }
}

// Exportar instancia singleton
export const internationalizationService = new InternationalizationService();
export default internationalizationService;


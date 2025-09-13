# 🚀 Tekashi Shoes - E-commerce Moderno

## 📋 Descripción del Proyecto

**Tekashi Shoes** es una aplicación e-commerce moderna y completa para la venta de calzado, desarrollada con las mejores prácticas de desarrollo web. El proyecto incluye un backend robusto en Java, un frontend moderno en React con TypeScript, y una base de datos MySQL optimizada.

## ✨ Características Principales

### 🤖 **Chatbot con IA Inteligente**
- Asistente virtual que responde preguntas sobre productos
- Búsqueda inteligente por tipo, precio, color y popularidad
- Sugerencias automáticas y respuestas contextuales
- Interfaz moderna con animaciones y efectos visuales

### 🛒 **Sistema de Carrito de Compras Completo**
- Agregar/eliminar productos con validación de stock
- Gestión de cantidades con controles intuitivos
- Cálculo automático de totales y subtotales
- Proceso de checkout simulado
- Notificaciones de éxito y error

### 🔍 **Búsqueda Avanzada y Filtros**
- Búsqueda en tiempo real por marca y color
- Filtros múltiples: tipo, precio, color, disponibilidad
- Ordenamiento por nombre, precio, stock
- Interfaz expandible con contador de filtros activos
- Filtros rápidos en sidebar

### ⭐ **Sistema de Reviews y Ratings**
- Calificaciones de 1-5 estrellas interactivas
- Comentarios de usuarios con sistema de utilidad
- Estadísticas de ratings con distribución visual
- Formulario de reseñas con validación
- Badges de verificación para usuarios

### 🔐 **Sistema de Autenticación**
- Login/Logout con estados de sesión
- Registro de usuarios con validación de email
- Roles de usuario (Admin/Cliente)
- Gestión de perfiles y datos personales
- Protección de rutas y funcionalidades

### 🎨 **UI/UX Moderna y Responsive**
- Diseño moderno con gradientes y sombras
- Grid de productos con cards interactivas
- Animaciones suaves y transiciones
- Diseño responsive para móviles y tablets
- Iconografía moderna con React Icons

## 🛠️ Tecnologías Utilizadas

### **Frontend**
- ⚛️ **React 18** con TypeScript
- 🎨 **CSS Moderno** con variables y flexbox/grid
- 🎯 **React Icons** para iconografía
- 🍭 **SweetAlert2** para notificaciones
- 📱 **Bootstrap 5** para responsive design
- 🚀 **Vite** para desarrollo rápido

### **Backend**
- ☕ **Java 17** con Maven
- 🗄️ **MySQL 8.0** con relaciones optimizadas
- 🔌 **JDBC** para conexiones de base de datos
- 📡 **HTTP Server** nativo de Java
- 🔒 **Validaciones** de seguridad

### **Base de Datos**
- 🗄️ **MySQL** con 12 tablas
- 📈 **Vistas de estadísticas** para analytics
- 🔍 **Índices optimizados** para rendimiento
- 🔗 **Relaciones FK** para integridad
- 📊 **Datos de ejemplo** para testing

## 📁 Estructura del Proyecto

```
tekashi-shoes-estructura/
├── backend/
│   └── tekashi-backend/
│       ├── src/main/java/co/edu/TekashiShoes/
│       │   ├── backend/           # Punto de entrada
│       │   ├── Controladores/     # Controladores HTTP
│       │   ├── dominio/           # Entidades del dominio
│       │   ├── repositorios/      # Acceso a datos
│       │   ├── servicios/         # Interfaces de servicios
│       │   └── servicioImp/       # Implementaciones
│       └── pom.xml               # Configuración Maven
├── frontend/
│   └── tekashi-shoes-frontend/
│       ├── src/
│       │   ├── components/        # Componentes React
│       │   ├── pages/            # Páginas principales
│       │   ├── hooks/            # Custom hooks
│       │   ├── services/         # Servicios API
│       │   ├── modelos/          # Tipos TypeScript
│       │   └── styles/           # Estilos CSS
│       └── package.json          # Configuración npm
└── BD-MYSQL/
    ├── tekashi_shoes_bd fullv.sql    # Base de datos principal
    └── nuevas_tablas.sql             # Tablas adicionales
```

## 🚀 Instalación y Configuración

### **Prerrequisitos**
- Java 17 o superior
- Node.js 16 o superior
- MySQL 8.0 o superior
- Maven 3.6 o superior

### **1. Configuración de la Base de Datos**

```bash
# Crear la base de datos
sudo mysql -u root -p < setup_database.sql

# Importar datos iniciales
sudo mysql -u root -p tekashi_shoes_bd < "tekashi-shoes-estructura/BD-MYSQL/tekashi_shoes_bd fullv.sql"

# Importar nuevas tablas
sudo mysql tekashi_shoes_bd < "tekashi-shoes-estructura/BD-MYSQL/nuevas_tablas.sql"
```

### **2. Configuración del Backend**

```bash
cd tekashi-shoes-estructura/backend/tekashi-backend

# Compilar el proyecto
mvn clean compile

# Ejecutar el servidor
mvn exec:java
```

El backend estará disponible en: `http://localhost:8080`

### **3. Configuración del Frontend**

```bash
cd tekashi-shoes-estructura/frontend/tekashi-shoes-frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

## 📊 Base de Datos

### **Tablas Principales**
- `producto` - Información de productos
- `tipo_producto` - Categorías de productos
- `imagen` - Imágenes de productos (Base64)
- `usuario` - Usuarios del sistema
- `review` - Reseñas y calificaciones
- `carrito` - Carrito de compras
- `favoritos` - Productos favoritos
- `pedido` - Órdenes de compra
- `detalle_pedido` - Detalles de órdenes
- `notificacion` - Notificaciones del sistema

### **Vistas de Estadísticas**
- `vista_estadisticas_productos` - Estadísticas de productos
- `vista_estadisticas_usuarios` - Estadísticas de usuarios

## 🎯 Funcionalidades Implementadas

### **Para Usuarios**
- ✅ Navegación por productos con filtros
- ✅ Búsqueda avanzada en tiempo real
- ✅ Carrito de compras interactivo
- ✅ Sistema de favoritos
- ✅ Reviews y calificaciones
- ✅ Chatbot de asistencia
- ✅ Autenticación de usuarios

### **Para Administradores**
- ✅ Gestión completa de productos
- ✅ Subida de imágenes
- ✅ Control de stock
- ✅ Dashboard de estadísticas
- ✅ Gestión de usuarios
- ✅ Moderación de reviews

## 🔧 API Endpoints

### **Productos**
- `GET /producto` - Listar todos los productos
- `GET /producto/{id}` - Obtener producto por ID
- `POST /producto` - Crear nuevo producto
- `PUT /producto/{id}` - Actualizar producto
- `DELETE /producto/{id}` - Eliminar producto

### **Tipos de Producto**
- `GET /tipo_producto` - Listar tipos de producto

### **Imágenes**
- `GET /imagenes` - Listar todas las imágenes
- `GET /imagenes/{id}` - Obtener imagen por ID
- `POST /imagenes` - Subir nueva imagen
- `DELETE /imagenes/{id}` - Eliminar imagen

## 🎨 Características de Diseño

### **Colores Principales**
- **Primario**: #667eea (Azul)
- **Secundario**: #764ba2 (Púrpura)
- **Éxito**: #4ecdc4 (Verde)
- **Advertencia**: #ffe66d (Amarillo)
- **Peligro**: #ff6b6b (Rojo)

### **Tipografía**
- **Fuente Principal**: Inter, -apple-system, BlinkMacSystemFont
- **Pesos**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### **Componentes**
- Cards de productos con hover effects
- Botones con gradientes y animaciones
- Modales responsivos
- Formularios con validación visual
- Notificaciones toast

## 📱 Responsive Design

La aplicación está completamente optimizada para:
- 📱 **Móviles** (320px - 768px)
- 📱 **Tablets** (768px - 1024px)
- 💻 **Desktop** (1024px+)

## 🚀 Despliegue

### **Backend**
```bash
# Compilar para producción
mvn clean package

# Ejecutar JAR
java -jar target/tekashi-backend-1.0.jar
```

### **Frontend**
```bash
# Construir para producción
npm run build

# Los archivos estarán en dist/
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Desarrollador Principal** - [Tu Nombre]
- **Asistente IA** - Claude Sonnet 4

## 🙏 Agradecimientos

- React Team por el excelente framework
- Bootstrap Team por los componentes CSS
- React Icons por la iconografía
- SweetAlert2 por las notificaciones
- MySQL Team por la base de datos

---

## 🎉 ¡Proyecto Completado!

**Tekashi Shoes** es ahora una aplicación e-commerce moderna y completa, lista para competir con las mejores plataformas del mercado. ¡Disfruta explorando todas las funcionalidades implementadas!

### 🌐 **Acceso a la Aplicación**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **Base de Datos**: MySQL en localhost:3306

### 📞 **Soporte**
Si tienes alguna pregunta o necesitas ayuda, no dudes en contactar al equipo de desarrollo.

---

*Desarrollado con ❤️ y las mejores prácticas de desarrollo web moderno.*


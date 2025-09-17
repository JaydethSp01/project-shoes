# Tekashi Shoes - Plataforma de E-commerce Completa

## 🚀 Características Implementadas

### ✅ **Funcionalidades Principales**
- **E-commerce completo** con catálogo de productos
- **Autenticación social** (Google, Facebook, Microsoft)
- **Internacionalización** (Español/Inglés) con selector visible
- **Mapas interactivos** con geolocalización para direcciones
- **Carrito de compras** funcional
- **Sistema de pedidos** completo
- **Panel de administración** avanzado
- **Dashboard de usuario** con estadísticas

### 🎨 **Diseño y UX**
- **Interfaz moderna** con gradientes y animaciones
- **Responsive design** para móviles y desktop
- **Dark mode** compatible
- **Cards de productos** con diseño profesional
- **Navegación intuitiva** y accesible

### 🔧 **Tecnologías**
- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + MongoDB
- **Autenticación**: Firebase Auth
- **Mapas**: Leaflet (gratuito)
- **Estilos**: CSS moderno con variables CSS
- **Base de datos**: MongoDB con 20 productos reales

## 📦 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd project-shoes
```

### 2. Configurar el Backend
```bash
cd tekashi-shoes-estructura/backend
npm install
cp env.example .env
# Configurar variables de entorno en .env
npm start
```

### 3. Configurar el Frontend
```bash
cd tekashi-shoes-estructura/frontend/tekashi-shoes-frontend
npm install
npm run dev
```

### 4. Configurar MongoDB
```bash
# Usar Docker (recomendado)
docker run -d --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password123 mongo:latest

# O instalar MongoDB localmente
```

## 🌐 URLs de Acceso

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **Health Check**: http://localhost:8080/api/health

## 🎯 Funcionalidades Destacadas

### 🌍 **Internacionalización**
- Selector de idioma visible en el header
- Soporte para Español e Inglés
- Persistencia de preferencia en localStorage
- Recarga automática al cambiar idioma

### 🗺️ **Mapas Interactivos**
- Integración con Leaflet (gratuito)
- Búsqueda de direcciones con Nominatim
- Geolocalización automática del usuario
- Selección por clic en el mapa
- Coordenadas guardadas en la base de datos

### 🔐 **Autenticación Social**
- **Google**: Configurado con Firebase
- **Facebook**: Configurado con Firebase
- **Microsoft**: Configurado con Firebase
- Botones modernos con iconos y gradientes

### 👟 **Catálogo de Productos**
- **20 productos reales** de marcas reconocidas:
  - Nike, Adidas, Jordan, Puma, Converse
  - Vans, New Balance, Reebok, Balenciaga, Off-White
- **5 tipos de producto**: Sneakers, Running, Basketball, Casual, Formal
- **Datos completos**: precios, stock, tallas, colores, ofertas

## 🛠️ Estructura del Proyecto

```
tekashi-shoes-estructura/
├── backend/
│   ├── models/          # Modelos de MongoDB
│   ├── routes/          # Rutas de la API
│   ├── middleware/      # Middleware de autenticación
│   ├── scripts/         # Scripts de población de datos
│   └── server.js        # Servidor principal
├── frontend/
│   └── tekashi-shoes-frontend/
│       ├── src/
│       │   ├── components/  # Componentes React
│       │   ├── services/    # Servicios de API
│       │   ├── hooks/       # Hooks personalizados
│       │   ├── styles/      # Estilos CSS
│       │   └── pages/       # Páginas principales
│       └── package.json
└── README.md
```

## 🔧 Configuración de Variables de Entorno

### Backend (.env)
```env
MONGODB_URI=mongodb://admin:password123@localhost:27017/tekashi_shoes?authSource=admin
PORT=8080
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Firebase (configurado en frontend)
- Proyecto: login-a8833
- Configuración en `src/config/firebase.ts`

## 🚀 Comandos Útiles

### Backend
```bash
npm start          # Iniciar servidor
npm run dev        # Modo desarrollo
npm run populate   # Poblar base de datos
```

### Frontend
```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run preview    # Preview del build
```

## 📱 Características Responsive

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: 480px, 768px, 1024px
- **Touch Friendly**: Botones y elementos táctiles
- **Performance**: Carga rápida en dispositivos móviles

## 🎨 Personalización

### Colores Principales
- **Primary**: #667eea (Azul)
- **Secondary**: #764ba2 (Púrpura)
- **Success**: #4ecdc4 (Verde)
- **Warning**: #ff6b6b (Rojo)

### Variables CSS
```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --success-color: #4ecdc4;
  --warning-color: #ff6b6b;
}
```

## 🔒 Seguridad

- **CORS configurado** para desarrollo
- **Rate limiting** implementado
- **Autenticación JWT** con Firebase
- **Validación de datos** con Joi
- **Sanitización** de inputs

## 📊 Base de Datos

### Productos Incluidos
- Nike Air Max 270, Air Force 1, React Element 55
- Adidas Ultraboost 22, Stan Smith, NMD R1
- Jordan Air Jordan 1 & 4 Retro
- Puma RS-X Reinvention, Suede Classic
- Converse Chuck Taylor All Star, Chuck 70
- Vans Old Skool, Sk8-Hi
- New Balance 574, 990v5
- Reebok Classic Leather, Club C 85
- Balenciaga Triple S
- Off-White x Nike Air Presto

## 🎯 Próximas Mejoras

- [ ] Sistema de reviews y calificaciones
- [ ] Notificaciones push
- [ ] Chat en vivo
- [ ] Sistema de cupones
- [ ] Integración con pasarelas de pago
- [ ] App móvil nativa

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto, contactar al equipo de desarrollo.

---

**¡Proyecto completamente funcional y listo para usar!** 🎉

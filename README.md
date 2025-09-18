# 👟 Tekashi Shoes - E-commerce Platform

## 📋 Descripción General

**Tekashi Shoes** es una plataforma de e-commerce moderna y completa para la venta de zapatos, desarrollada con tecnologías web actuales. La aplicación ofrece una experiencia de usuario fluida con funcionalidades avanzadas como internacionalización, geolocalización, autenticación social y un panel de administración robusto.

## 🚀 Características Principales

### ✨ Frontend (React.js + TypeScript)
- **Interfaz Moderna**: Diseño responsivo con Bootstrap 5 y CSS personalizado
- **Internacionalización**: Soporte para 4 idiomas (Español, Inglés, Francés, Portugués)
- **Geolocalización**: Mapas interactivos con Leaflet para ubicación y tiendas cercanas
- **Autenticación Social**: Login con Google, Facebook y Microsoft
- **Carrito de Compras**: Gestión completa con persistencia local
- **Panel de Administración**: CRUD completo para productos y usuarios
- **Búsqueda Avanzada**: Filtros múltiples y búsqueda en tiempo real
- **Sistema de Notificaciones**: Alertas y notificaciones en tiempo real

### ⚙️ Backend (Node.js + Express)
- **API REST**: Endpoints completos con documentación
- **Autenticación Firebase**: Integración completa con Firebase Admin SDK
- **Base de Datos MongoDB**: Modelos optimizados con índices
- **Seguridad**: Rate limiting, CORS, validación de datos con Joi
- **Subida de Archivos**: Gestión de imágenes con Multer
- **Logging**: Sistema de logs con Morgan

### 🗄️ Base de Datos (MongoDB)
- **Modelos Completos**: Producto, Usuario, Pedido, Favorito, Wishlist
- **Relaciones**: Referencias entre colecciones
- **Índices Optimizados**: Para consultas rápidas
- **Validaciones**: A nivel de esquema y aplicación

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router DOM** - Enrutamiento
- **React i18next** - Internacionalización
- **Leaflet** - Mapas interactivos
- **Bootstrap 5** - Framework CSS
- **Firebase** - Autenticación y servicios
- **SweetAlert2** - Alertas y modales

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **Firebase Admin SDK** - Autenticación
- **Joi** - Validación de datos
- **Multer** - Subida de archivos
- **Helmet** - Seguridad HTTP
- **CORS** - Cross-origin resource sharing

### DevOps
- **Docker** - Contenedores
- **Docker Compose** - Orquestación
- **Railway** - Deploy del backend
- **Vercel** - Deploy del frontend

## 📁 Estructura del Proyecto

```
tekashi-shoes/
├── tekashi-shoes-estructura/
│   ├── backend/                 # API REST (Node.js)
│   │   ├── config/             # Configuración de BD
│   │   ├── middleware/         # Middlewares de auth y error
│   │   ├── models/             # Modelos de MongoDB
│   │   ├── routes/             # Rutas de la API
│   │   ├── scripts/            # Scripts de inicialización
│   │   └── server.js           # Servidor principal
│   └── frontend/               # Aplicación React
│       └── tekashi-shoes-frontend/
│           ├── src/
│           │   ├── components/ # Componentes React
│           │   ├── config/     # Configuración Firebase e i18n
│           │   ├── hooks/      # Custom hooks
│           │   ├── pages/      # Páginas principales
│           │   ├── services/   # Servicios de API
│           │   └── styles/     # Estilos CSS
│           └── public/         # Archivos estáticos
├── setup_database.sql          # Script de inicialización BD
├── docker-compose.yml          # Configuración Docker
└── README.md                   # Este archivo
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- MongoDB 5+
- Git

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/tekashi-shoes.git
cd tekashi-shoes
```

### 2. Configurar Backend
```bash
cd tekashi-shoes-estructura/backend
npm install
cp env.example .env
# Configurar variables de entorno en .env
npm run dev
```

### 3. Configurar Frontend
```bash
cd tekashi-shoes-estructura/frontend/tekashi-shoes-frontend
npm install
cp env.example .env
# Configurar variables de entorno en .env
npm run dev
```

### 4. Configurar Base de Datos
```bash
# Inicializar MongoDB con datos de prueba
cd tekashi-shoes-estructura/backend
npm run seed
```

## 🔧 Variables de Entorno

### Backend (.env)
```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017/tekashi_shoes
FIREBASE_PROJECT_ID=tu-proyecto-firebase
FIREBASE_PRIVATE_KEY=tu-clave-privada
FIREBASE_CLIENT_EMAIL=tu-email-cliente
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8080/api
VITE_FIREBASE_API_KEY=tu-api-key
VITE_FIREBASE_AUTH_DOMAIN=tu-dominio.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
```

## 📱 Funcionalidades Detalladas

### 🛍️ E-commerce Core
- **Catálogo de Productos**: Visualización con filtros y paginación
- **Búsqueda Avanzada**: Por texto, categoría, marca, precio
- **Carrito de Compras**: Gestión completa con persistencia
- **Proceso de Checkout**: Formulario completo de compra
- **Gestión de Favoritos**: Lista de productos favoritos
- **Wishlist**: Listas de deseos personalizables

### 👤 Gestión de Usuarios
- **Registro/Login**: Con email y redes sociales
- **Perfil de Usuario**: Edición de datos personales
- **Historial de Compras**: Seguimiento de pedidos
- **Dashboard Personal**: Resumen de actividad

### 🔐 Autenticación y Seguridad
- **Firebase Auth**: Autenticación robusta
- **Login Social**: Google, Facebook, Microsoft
- **Roles de Usuario**: Cliente y Administrador
- **Protección de Rutas**: Middleware de autorización
- **Validación de Datos**: Con Joi en backend

### 🌍 Internacionalización
- **4 Idiomas**: Español, Inglés, Francés, Portugués
- **Selector de Idioma**: Cambio dinámico
- **Formato Regional**: Fechas y números localizados
- **Persistencia**: Preferencia guardada en localStorage

### 📍 Geolocalización
- **Detección Automática**: Ubicación del usuario
- **Mapas Interactivos**: Con Leaflet
- **Tiendas Cercanas**: Búsqueda por proximidad
- **Cálculo de Envío**: Por ubicación geográfica

### 🛠️ Panel de Administración
- **Gestión de Productos**: CRUD completo
- **Gestión de Usuarios**: Lista y edición
- **Estadísticas**: Dashboard con métricas
- **Gestión de Pedidos**: Seguimiento completo
- **Configuración**: Parámetros del sistema

## 🎨 Diseño y UX

### Responsive Design
- **Mobile First**: Optimizado para móviles
- **Breakpoints**: 320px, 768px, 1024px+
- **Componentes Táctiles**: Botones y controles optimizados
- **Navegación Móvil**: Menú hamburguesa

### Temas y Estilos
- **Diseño Moderno**: Inspirado en 2025
- **Paleta de Colores**: Azules y grises profesionales
- **Tipografía**: Fuentes legibles y escalables
- **Animaciones**: Transiciones suaves
- **Iconografía**: FontAwesome y React Icons

## 🧪 Testing y Calidad

### Frontend
- **TypeScript**: Tipado estático
- **ESLint**: Linting de código
- **Componentes Reutilizables**: Arquitectura modular
- **Hooks Personalizados**: Lógica reutilizable

### Backend
- **Validación de Datos**: Con Joi
- **Manejo de Errores**: Centralizado
- **Logging**: Sistema completo de logs
- **Rate Limiting**: Protección contra spam

## 🚀 Deploy y Producción

### Backend (Railway)
```bash
# Deploy automático desde GitHub
# Configurar variables de entorno en Railway
# MongoDB Atlas para producción
```

### Frontend (Vercel)
```bash
# Deploy automático desde GitHub
# Configurar variables de entorno en Vercel
# Build optimizado para producción
```

### Docker
```bash
# Ejecutar con Docker Compose
docker-compose up -d
```

## 📊 Métricas y KPIs

### Técnicas
- **Tiempo de Carga**: < 3 segundos
- **Disponibilidad**: > 99.5%
- **Tiempo de Respuesta API**: < 200ms
- **Cobertura de Tests**: > 80%

### Negocio
- **Conversión**: > 2%
- **Valor Promedio Carrito**: $150,000 COP
- **Satisfacción Usuario**: > 4.5/5
- **Tiempo de Compra**: < 12 minutos

## 🤝 Contribución

### Flujo de Trabajo
1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

### Estándares de Código
- **ESLint**: Configuración estándar
- **Prettier**: Formateo automático
- **Conventional Commits**: Mensajes descriptivos
- **TypeScript**: Tipado estricto

## 📚 Documentación Adicional

- **API Documentation**: [Swagger/Postman Collection]
- **Guía de Despliegue**: [Deployment Guide]
- **Arquitectura del Sistema**: [System Architecture]
- **Guía de Contribución**: [Contributing Guide]

## 🐛 Reportar Bugs

Para reportar bugs o solicitar funcionalidades:
1. Verificar que no existe un issue similar
2. Crear nuevo issue con etiqueta apropiada
3. Incluir pasos para reproducir
4. Adjuntar capturas de pantalla si es necesario

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo de Desarrollo

- **Desarrollador Principal**: [Tu Nombre]
- **Arquitecto de Software**: [Nombre]
- **Diseñador UX/UI**: [Nombre]
- **DevOps Engineer**: [Nombre]

## 📞 Contacto

- **Email**: contacto@tekashishoes.com
- **Website**: https://tekashishoes.com
- **GitHub**: https://github.com/tu-usuario/tekashi-shoes

---

## 🎯 Roadmap Futuro

### Próximas Funcionalidades
- [ ] **PWA**: Aplicación web progresiva
- [ ] **Notificaciones Push**: Alertas en tiempo real
- [ ] **Chat en Vivo**: Soporte al cliente
- [ ] **Recomendaciones IA**: Productos sugeridos
- [ ] **Programa de Fidelidad**: Puntos y recompensas
- [ ] **Integración ERP**: Gestión de inventario
- [ ] **Analytics Avanzado**: Métricas detalladas
- [ ] **Multi-tenant**: Soporte para múltiples tiendas

### Mejoras Técnicas
- [ ] **Microservicios**: Arquitectura distribuida
- [ ] **GraphQL**: API más eficiente
- [ ] **Redis**: Cache distribuido
- [ ] **Elasticsearch**: Búsqueda avanzada
- [ ] **Kubernetes**: Orquestación de contenedores
- [ ] **CI/CD**: Pipeline automatizado
- [ ] **Monitoring**: Observabilidad completa

---

**Desarrollado con ❤️ por el equipo de Tekashi Shoes**

*Última actualización: Diciembre 2024*
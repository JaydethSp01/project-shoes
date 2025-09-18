# 🛠️ Guía de Desarrollo - Tekashi Shoes

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- MongoDB 5+
- Git

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/tekashi-shoes.git
cd tekashi-shoes

# Instalar dependencias
npm run install:all

# Configurar variables de entorno
cp tekashi-shoes-estructura/backend/env.example tekashi-shoes-estructura/backend/.env
cp tekashi-shoes-estructura/frontend/tekashi-shoes-frontend/env.example tekashi-shoes-estructura/frontend/tekashi-shoes-frontend/.env

# Inicializar base de datos
npm run seed

# Ejecutar en modo desarrollo
npm run dev
```

## 📁 Estructura del Proyecto

```
tekashi-shoes/
├── tekashi-shoes-estructura/
│   ├── backend/                 # API REST (Node.js + Express)
│   │   ├── config/             # Configuración de base de datos
│   │   ├── middleware/         # Middlewares de autenticación y errores
│   │   ├── models/             # Modelos de MongoDB (Mongoose)
│   │   ├── routes/             # Rutas de la API
│   │   ├── scripts/            # Scripts de inicialización y seed
│   │   └── server.js           # Servidor principal
│   └── frontend/               # Aplicación React
│       └── tekashi-shoes-frontend/
│           ├── src/
│           │   ├── components/ # Componentes React reutilizables
│           │   ├── config/     # Configuración Firebase e i18n
│           │   ├── hooks/      # Custom hooks
│           │   ├── pages/      # Páginas principales
│           │   ├── services/   # Servicios de API
│           │   └── styles/     # Estilos CSS
│           └── public/         # Archivos estáticos
├── docker-compose.yml          # Configuración Docker
├── package.json               # Scripts del proyecto principal
└── README.md                  # Documentación principal
```

## 🔧 Scripts Disponibles

### Desarrollo

```bash
npm run dev                    # Ejecutar frontend y backend en modo desarrollo
npm run dev:backend           # Solo backend
npm run dev:frontend          # Solo frontend
```

### Producción

```bash
npm run build                 # Construir ambos proyectos
npm run start                 # Ejecutar en modo producción
```

### Docker

```bash
npm run docker:up             # Levantar con Docker Compose
npm run docker:down           # Detener contenedores
npm run docker:build          # Construir imágenes
```

### Utilidades

```bash
npm run seed                  # Poblar base de datos con datos de prueba
npm run clean                 # Limpiar node_modules
npm run lint                  # Linter para ambos proyectos
```

## 🌐 URLs de Desarrollo

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **API Health**: http://localhost:8080/api/health
- **MongoDB**: mongodb://localhost:27017

## 🔑 Variables de Entorno

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

## 🗄️ Base de Datos

### Modelos Principales

- **Producto**: Información de zapatos
- **Usuario**: Datos de usuarios y administradores
- **Pedido**: Órdenes de compra
- **Favorito**: Productos favoritos de usuarios
- **Wishlist**: Listas de deseos
- **TipoProducto**: Categorías de productos

### Scripts de Base de Datos

```bash
# Poblar con datos de prueba
npm run seed

# Scripts individuales
cd tekashi-shoes-estructura/backend
npm run seed                    # Datos de prueba
node scripts/init-mongo.js     # Inicializar BD
```

## 🎨 Frontend (React + TypeScript)

### Tecnologías

- **React 18** con TypeScript
- **Vite** como build tool
- **React Router DOM** para enrutamiento
- **React i18next** para internacionalización
- **Leaflet** para mapas
- **Bootstrap 5** para estilos
- **Firebase** para autenticación

### Estructura de Componentes

```
src/
├── components/           # Componentes reutilizables
│   ├── AdminPanel.tsx   # Panel de administración
│   ├── ShoppingCart.tsx # Carrito de compras
│   ├── LoginModal.tsx   # Modal de login
│   └── ...
├── pages/               # Páginas principales
│   └── Home.tsx         # Página principal
├── hooks/               # Custom hooks
├── services/            # Servicios de API
└── styles/              # Estilos CSS
```

### Comandos de Desarrollo

```bash
cd tekashi-shoes-estructura/frontend/tekashi-shoes-frontend
npm run dev              # Servidor de desarrollo
npm run build            # Build de producción
npm run preview          # Preview del build
npm run lint             # Linter
```

## ⚙️ Backend (Node.js + Express)

### Tecnologías

- **Node.js** con Express
- **MongoDB** con Mongoose
- **Firebase Admin SDK** para autenticación
- **Joi** para validación
- **Multer** para subida de archivos
- **Helmet** para seguridad

### Estructura de la API

```
backend/
├── routes/              # Rutas de la API
│   ├── productoRoutes.js    # CRUD de productos
│   ├── usuarioRoutes.js     # Gestión de usuarios
│   ├── pedidoRoutes.js      # Órdenes de compra
│   └── ...
├── models/              # Modelos de MongoDB
├── middleware/          # Middlewares
└── config/             # Configuración
```

### Endpoints Principales

- `GET /api/producto` - Listar productos
- `POST /api/producto` - Crear producto
- `GET /api/usuarios` - Listar usuarios
- `POST /api/pedidos` - Crear pedido
- `GET /api/health` - Health check

### Comandos de Desarrollo

```bash
cd tekashi-shoes-estructura/backend
npm run dev              # Servidor de desarrollo
npm start                # Servidor de producción
npm run seed             # Poblar BD
npm run lint             # Linter
```

## 🐳 Docker

### Desarrollo con Docker

```bash
# Levantar todos los servicios
npm run docker:up

# Ver logs
docker-compose logs -f

# Detener servicios
npm run docker:down
```

### Servicios Docker

- **MongoDB**: Puerto 27017
- **Backend**: Puerto 8080
- **Frontend**: Puerto 80

## 🧪 Testing

### Frontend

```bash
cd tekashi-shoes-estructura/frontend/tekashi-shoes-frontend
npm test                 # Ejecutar tests
```

### Backend

```bash
cd tekashi-shoes-estructura/backend
npm test                 # Ejecutar tests
npm run test:watch       # Tests en modo watch
```

## 📊 Debugging

### Frontend

- Usar React DevTools
- Console del navegador
- Network tab para API calls

### Backend

- Logs en consola
- Postman para testing de API
- MongoDB Compass para BD

## 🚀 Deploy

### Backend (Railway)

1. Conectar repositorio GitHub
2. Configurar variables de entorno
3. Deploy automático

### Frontend (Vercel)

1. Conectar repositorio GitHub
2. Configurar variables de entorno
3. Deploy automático

## 🔍 Troubleshooting

### Problemas Comunes

**Error de conexión a MongoDB:**

```bash
# Verificar que MongoDB esté corriendo
sudo systemctl status mongod
# O con Docker
docker ps | grep mongo
```

**Error de Firebase:**

- Verificar variables de entorno
- Verificar configuración de Firebase
- Verificar permisos del proyecto

**Error de CORS:**

- Verificar configuración en backend
- Verificar URL de API en frontend

**Error de build:**

```bash
# Limpiar y reinstalar
npm run clean
npm run install:all
```

## 📚 Recursos Adicionales

- [Documentación React](https://reactjs.org/docs)
- [Documentación Express](https://expressjs.com/)
- [Documentación MongoDB](https://docs.mongodb.com/)
- [Documentación Firebase](https://firebase.google.com/docs)
- [Documentación Docker](https://docs.docker.com/)

## 🤝 Contribución

1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

---

**Desarrollado con ❤️ por el equipo de Tekashi Shoes**

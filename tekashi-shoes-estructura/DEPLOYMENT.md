# Guía de Despliegue - Tekashi Shoes

## 🚀 Despliegue Rápido

### Opción 1: Despliegue Automático (Recomendado)

1. **Conectar con Railway (Backend)**:

   - Ve a [railway.app](https://railway.app)
   - Conecta tu repositorio de GitHub
   - Selecciona la carpeta `backend`
   - Railway detectará automáticamente que es un proyecto Node.js

2. **Conectar con Vercel (Frontend)**:

   - Ve a [vercel.com](https://vercel.com)
   - Conecta tu repositorio de GitHub
   - Selecciona la carpeta `frontend/tekashi-shoes-frontend`
   - Vercel detectará automáticamente que es un proyecto Vite/React

3. **Configurar Variables de Entorno**:
   - En Railway: Agrega las variables del backend
   - En Vercel: Agrega las variables del frontend

### Opción 2: Despliegue Local con Docker

```bash
# Clonar el repositorio
git clone <repository-url>
cd tekashi-shoes-estructura

# Ejecutar con Docker Compose
docker-compose up -d

# Acceder a la aplicación
# Frontend: http://localhost
# Backend API: http://localhost:8080
```

## 🔧 Variables de Entorno

### Backend (Railway)

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/tekashi_shoes
JWT_SECRET=tu-jwt-secret-super-seguro
FIREBASE_PROJECT_ID=tu-firebase-project-id
FIREBASE_PRIVATE_KEY=tu-firebase-private-key
FIREBASE_CLIENT_EMAIL=tu-firebase-client-email
```

### Frontend (Vercel)

```env
VITE_API_BASE_URL=https://tu-backend.railway.app/api
VITE_FIREBASE_API_KEY=tu-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=tu-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-firebase-project-id
VITE_FIREBASE_STORAGE_BUCKET=tu-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
VITE_FIREBASE_APP_ID=tu-app-id
```

## 📋 Checklist de Despliegue

### Backend (Railway)

- [ ] Conectar repositorio GitHub
- [ ] Configurar variables de entorno
- [ ] Conectar MongoDB Atlas
- [ ] Configurar Firebase Admin SDK
- [ ] Verificar que el despliegue sea exitoso

### Frontend (Vercel)

- [ ] Conectar repositorio GitHub
- [ ] Configurar variables de entorno
- [ ] Configurar Firebase Client SDK
- [ ] Verificar que el build sea exitoso
- [ ] Verificar que la aplicación funcione

### Base de Datos (MongoDB Atlas)

- [ ] Crear cluster en MongoDB Atlas
- [ ] Configurar acceso de red
- [ ] Crear usuario de base de datos
- [ ] Obtener cadena de conexión
- [ ] Configurar en Railway

### Autenticación (Firebase)

- [ ] Crear proyecto en Firebase Console
- [ ] Habilitar Authentication
- [ ] Configurar Email/Password
- [ ] Obtener configuración del proyecto
- [ ] Configurar en Railway y Vercel

## 🔍 Verificación

### Health Checks

- Backend: `GET https://tu-backend.railway.app/api/health`
- Frontend: `GET https://tu-frontend.vercel.app`

### Funcionalidades a Verificar

- [ ] Registro de usuarios
- [ ] Inicio de sesión
- [ ] Visualización de productos
- [ ] Carrito de compras
- [ ] Panel de administración
- [ ] Geolocalización
- [ ] Internacionalización

## 🚨 Troubleshooting

### Problemas Comunes

1. **Error de CORS**: Verificar que `VITE_API_BASE_URL` esté configurado correctamente
2. **Error de Firebase**: Verificar que todas las variables de Firebase estén configuradas
3. **Error de MongoDB**: Verificar que la cadena de conexión sea correcta
4. **Error de Build**: Verificar que todas las dependencias estén instaladas

## 📞 Soporte

Si tienes problemas con el despliegue:

1. Revisa los logs en Railway/Vercel
2. Verifica las variables de entorno
3. Consulta la documentación de Railway/Vercel
4. Revisa el estado de los servicios

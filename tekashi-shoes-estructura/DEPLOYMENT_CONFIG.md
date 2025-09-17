# Configuración de Despliegue

## Variables de Entorno Requeridas

### Backend (Railway)

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://jsimarrapolo:<db_password>@taskcluster.hixyz.mongodb.net/?retryWrites=true&w=majority&appName=TaskCluster
JWT_SECRET=tu-jwt-secret-super-seguro
FIREBASE_PROJECT_ID=login-a8833
FIREBASE_PRIVATE_KEY=tu-firebase-private-key
FIREBASE_CLIENT_EMAIL=tu-firebase-client-email
```

### Frontend (Vercel)

```env
VITE_API_BASE_URL=https://tu-backend.railway.app/api
VITE_FIREBASE_API_KEY=AIzaSyCmCGkyXuYn3WyMlMrLGXesHPZ1PkwFhTI
VITE_FIREBASE_AUTH_DOMAIN=login-a8833.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=login-a8833
VITE_FIREBASE_STORAGE_BUCKET=login-a8833.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=39965371808
VITE_FIREBASE_APP_ID=1:39965371808:web:21dfe587edbbb2863088c5
```

## Comandos de Despliegue

### Docker (Local)

```bash
docker-compose up -d
```

### Railway (Backend)

```bash
cd backend
railway login
railway deploy
```

### Vercel (Frontend)

```bash
cd frontend/tekashi-shoes-frontend
npm run build
vercel deploy
```

## Health Checks

- Backend: `GET /api/health`
- Frontend: `GET /health`

## Monitoreo

- Railway Dashboard para backend
- Vercel Dashboard para frontend
- MongoDB Atlas para base de datos

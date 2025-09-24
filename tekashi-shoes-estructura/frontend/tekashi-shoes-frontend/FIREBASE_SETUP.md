# 🔥 Configuración de Firebase para tekashi-shoes-ecommerce

## ❌ Error Actual

```
Firebase: Error (auth/unauthorized-domain)
```

## ✅ Solución

### 1. Ir a la Consola de Firebase

- URL: https://console.firebase.google.com/project/tekashi-shoes-ecommerce/overview

### 2. Configurar Dominios Autorizados

1. Ve a **Authentication** → **Settings** → **Authorized domains**
2. Agrega estos dominios:
   - `tekashi-shoes-ecommerce.web.app`
   - `tekashi-shoes-ecommerce.firebaseapp.com`
   - `localhost` (para desarrollo)

### 3. Configurar Proveedores de Autenticación

#### Google Sign-In:

1. Ve a **Authentication** → **Sign-in method**
2. Habilita **Google**
3. Agrega el dominio: `tekashi-shoes-ecommerce.web.app`

#### Facebook Sign-In:

1. Ve a **Authentication** → **Sign-in method**
2. Habilita **Facebook**
3. Agrega el dominio: `tekashi-shoes-ecommerce.web.app`

#### Microsoft Sign-In:

1. Ve a **Authentication** → **Sign-in method**
2. Habilita **Microsoft**
3. Agrega el dominio: `tekashi-shoes-ecommerce.web.app`

### 4. Configuración Actual del Proyecto

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCmCGkyXuYn3WyMlMrLGXesHPZ1PkwFhTI",
  authDomain: "tekashi-shoes-ecommerce.firebaseapp.com",
  projectId: "tekashi-shoes-ecommerce",
  storageBucket: "tekashi-shoes-ecommerce.firebasestorage.app",
  messagingSenderId: "39965371808",
  appId: "1:39965371808:web:21dfe587edbbb2863088c5",
  measurementId: "G-9ND1YRVZT7",
};
```

### 5. Verificar Configuración

Después de agregar los dominios, el error debería desaparecer y el login con Google funcionará correctamente.

## 🚀 URL de la Aplicación

https://tekashi-shoes-ecommerce.web.app

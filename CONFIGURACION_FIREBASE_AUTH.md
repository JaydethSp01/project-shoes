# Configuración de Autenticación Firebase

## Pasos para habilitar los proveedores de autenticación

### 1. Acceder a Firebase Console
- Ve a: https://console.firebase.google.com/
- Selecciona tu proyecto: **login-a8833**

### 2. Habilitar proveedores de autenticación
1. En el menú lateral, ve a **Authentication**
2. Haz clic en **Sign-in method**
3. Habilita los siguientes proveedores:

#### Google
- Haz clic en **Google**
- Activa el toggle **Enable**
- Configura el **Project support email** (tu email)
- Haz clic en **Save**

#### Facebook
- Haz clic en **Facebook**
- Activa el toggle **Enable**
- Necesitarás:
  - **App ID** de Facebook Developer Console
  - **App Secret** de Facebook Developer Console
- Haz clic en **Save**

#### Microsoft
- Haz clic en **Microsoft**
- Activa el toggle **Enable**
- Necesitarás configurar en Azure AD:
  - **Client ID** (Application ID)
  - **Client Secret**
- Haz clic en **Save**

### 3. Configurar dominios autorizados
1. En **Authentication** > **Settings**
2. En la sección **Authorized domains**
3. Asegúrate de que estén incluidos:
   - `localhost` (para desarrollo)
   - `localhost:5173` (para Vite dev server)
   - Tu dominio de producción (cuando lo tengas)

### 4. Configuración adicional para Microsoft

#### En Azure AD (portal.azure.com):
1. Ve a **Azure Active Directory** > **App registrations**
2. Crea una nueva aplicación o usa una existente
3. Configura:
   - **Redirect URIs**: 
     - `https://login-a8833.firebaseapp.com/__/auth/handler`
     - `http://localhost:5173/__/auth/handler` (para desarrollo)
   - **API permissions**: 
     - Microsoft Graph > User.Read
     - Microsoft Graph > email
     - Microsoft Graph > profile
   - **Authentication** > **Implicit grant and hybrid flows**:
     - ✅ Access tokens
     - ✅ ID tokens

### 5. Verificar configuración
Una vez configurado, puedes probar la autenticación:

1. Inicia el servidor de desarrollo: `npm run dev`
2. Ve a `http://localhost:5173`
3. Haz clic en "Iniciar Sesión"
4. Prueba los botones de Google, Facebook y Microsoft

### 6. Solución de problemas comunes

#### Error: "operation-not-allowed"
- El proveedor no está habilitado en Firebase Console
- Ve a Authentication > Sign-in method y habilita el proveedor

#### Error: "unauthorized-domain"
- El dominio no está en la lista de dominios autorizados
- Ve a Authentication > Settings > Authorized domains

#### Error: "popup-closed-by-user"
- El usuario cerró la ventana de popup
- Esto es normal, no es un error del sistema

#### Error: "Cross-Origin-Opener-Policy"
- Ya está solucionado con la configuración de Vite
- El servidor de desarrollo ahora incluye los headers correctos

### 7. URLs importantes
- **Firebase Console**: https://console.firebase.google.com/project/login-a8833
- **Azure AD Portal**: https://portal.azure.com
- **Facebook Developer Console**: https://developers.facebook.com

### 8. Variables de entorno (opcional)
Si quieres usar variables de entorno para la configuración:

```env
VITE_FIREBASE_API_KEY=AIzaSyCmCGkyXuYn3WyMlMrLGXesHPZ1PkwFhTI
VITE_FIREBASE_AUTH_DOMAIN=login-a8833.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=login-a8833
VITE_FIREBASE_STORAGE_BUCKET=login-a8833.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=39965371808
VITE_FIREBASE_APP_ID=1:39965371808:web:21dfe587edbbb2863088c5
```

## Estado actual
✅ **Google Auth**: Configurado y listo para usar
✅ **Facebook Auth**: Configurado, necesita App ID y Secret
✅ **Microsoft Auth**: Configurado, necesita Client ID y Secret
✅ **CORS Policy**: Solucionado
✅ **Dominios autorizados**: Incluye localhost:5173

# Tekashi Shoes Backend

Backend para la plataforma de e-commerce Tekashi Shoes desarrollado con Node.js, Express y MongoDB.

## 🚀 Características

- **API RESTful** completa con todos los endpoints necesarios
- **Autenticación con Firebase** para manejo seguro de usuarios
- **Base de datos MongoDB** con Mongoose ODM
- **Internacionalización (i18n)** soportada en todos los modelos
- **Geolocalización** integrada para usuarios
- **Sistema de notificaciones** avanzado
- **Gestión de favoritos y wishlists**
- **Panel de administración** completo
- **Validación de datos** con Joi
- **Manejo de archivos** con Multer
- **Seguridad** con Helmet, CORS y rate limiting

## 📋 Requisitos

- Node.js >= 18.0.0
- MongoDB >= 4.4
- Cuenta de Firebase para autenticación

## 🛠️ Instalación

1. **Clonar el repositorio**

   ```bash
   git clone <repository-url>
   cd tekashi-shoes-estructura/backend
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   ```bash
   cp env.example .env
   ```

   Editar el archivo `.env` con tus configuraciones:

   ```env
   MONGODB_URI=mongodb://localhost:27017/tekashi_shoes
   PORT=8080
   NODE_ENV=development

   # Firebase Configuration
   FIREBASE_PROJECT_ID=tu-proyecto-firebase
   FIREBASE_PRIVATE_KEY_ID=tu-private-key-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com

   JWT_SECRET=tu-super-secret-jwt-key
   FRONTEND_URL=http://localhost:5173
   ```

4. **Iniciar MongoDB**

   ```bash
   # Con Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest

   # O iniciar servicio local de MongoDB
   sudo systemctl start mongod
   ```

5. **Sembrar datos de ejemplo (opcional)**

   ```bash
   npm run seed
   ```

6. **Iniciar el servidor**

   ```bash
   # Desarrollo
   npm run dev

   # Producción
   npm start
   ```

## 📚 API Endpoints

### Productos

- `GET /api/producto` - Listar productos
- `GET /api/producto/:id` - Obtener producto por ID
- `GET /api/producto/tipo/:tipoProductoId` - Productos por tipo
- `GET /api/producto/buscar/:texto` - Búsqueda de productos
- `GET /api/producto/destacados` - Productos destacados
- `GET /api/producto/ofertas` - Productos en oferta
- `POST /api/producto` - Crear producto (Admin)
- `PUT /api/producto/:id` - Actualizar producto (Admin)
- `DELETE /api/producto/:id` - Eliminar producto (Admin)

### Tipos de Producto

- `GET /api/tipo_producto` - Listar tipos de producto
- `GET /api/tipo_producto/activos` - Tipos activos
- `GET /api/tipo_producto/:id` - Obtener tipo por ID
- `POST /api/tipo_producto` - Crear tipo (Admin)
- `PUT /api/tipo_producto/:id` - Actualizar tipo (Admin)
- `DELETE /api/tipo_producto/:id` - Eliminar tipo (Admin)

### Usuarios

- `GET /api/usuarios` - Listar usuarios (Admin)
- `GET /api/usuarios/:id` - Obtener usuario por ID
- `GET /api/usuarios/perfil/mi-perfil` - Perfil del usuario autenticado
- `POST /api/usuarios` - Crear usuario (Admin)
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario (Admin)

### Favoritos

- `GET /api/favoritos` - Favoritos del usuario
- `POST /api/favoritos` - Agregar a favoritos
- `DELETE /api/favoritos/:productoId` - Remover de favoritos
- `GET /api/favoritos/ofertas` - Productos en favoritos con ofertas

### Wishlists

- `GET /api/wishlists` - Wishlists del usuario
- `POST /api/wishlists` - Crear wishlist
- `GET /api/wishlists/publica/:codigo` - Wishlist pública
- `POST /api/wishlists/:id/productos` - Agregar producto a wishlist
- `DELETE /api/wishlists/:id/productos/:productoId` - Remover producto

### Notificaciones

- `GET /api/notificaciones` - Notificaciones del usuario
- `GET /api/notificaciones/no-leidas` - Notificaciones no leídas
- `POST /api/notificaciones` - Crear notificación
- `PUT /api/notificaciones/:id/leer` - Marcar como leída
- `PUT /api/notificaciones/leer-todas` - Marcar todas como leídas

### Imágenes

- `GET /api/imagenes` - Listar imágenes
- `GET /api/imagenes/tipo-producto/:tipoProductoId` - Imágenes por tipo
- `POST /api/imagenes/upload` - Subir imagen (Admin)
- `PUT /api/imagenes/:id` - Actualizar imagen (Admin)
- `DELETE /api/imagenes/:id` - Eliminar imagen (Admin)

### Administración

- `GET /api/admin/dashboard` - Dashboard de administración
- `GET /api/admin/usuarios` - Gestión de usuarios
- `GET /api/admin/productos` - Gestión de productos
- `GET /api/admin/estadisticas` - Estadísticas del sistema
- `POST /api/admin/create-user` - Crear usuario
- `POST /api/admin/backup` - Crear respaldo
- `POST /api/admin/optimize` - Optimizar base de datos

## 🔐 Autenticación

El sistema utiliza Firebase Authentication. Para autenticarse, incluye el token en el header:

```javascript
headers: {
  'Authorization': `Bearer ${firebaseToken}`,
  'Content-Type': 'application/json'
}
```

## 🌍 Internacionalización

El sistema soporta múltiples idiomas:

- Español (es) - Por defecto
- Inglés (en)
- Francés (fr)
- Portugués (pt)

Los modelos incluyen campos de traducción para nombres, descripciones y metadatos.

## 📱 Geolocalización

Los usuarios pueden configurar su ubicación con:

- Latitud y longitud
- Dirección completa
- Ciudad y país

## 🗄️ Estructura de la Base de Datos

### Colecciones principales:

- **usuarios** - Información de usuarios
- **productos** - Catálogo de productos
- **tiposproducto** - Categorías de productos
- **imagenes** - Imágenes de productos
- **favoritos** - Productos favoritos de usuarios
- **wishlists** - Listas de deseos
- **notificaciones** - Sistema de notificaciones

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests con coverage
npm run test:coverage
```

## 📦 Scripts Disponibles

```bash
npm start          # Iniciar en producción
npm run dev        # Iniciar en desarrollo con nodemon
npm run seed       # Sembrar datos de ejemplo
npm test           # Ejecutar tests
npm run lint       # Verificar código con ESLint
```

## 🚀 Despliegue

### Variables de entorno para producción:

```env
NODE_ENV=production
MONGODB_URI=mongodb://tu-servidor:27017/tekashi_shoes_prod
PORT=8080
FRONTEND_URL=https://tu-dominio.com
```

### Con Docker:

```bash
docker build -t tekashi-shoes-backend .
docker run -p 8080:8080 --env-file .env tekashi-shoes-backend
```

## 📝 Logs

Los logs se guardan en:

- Desarrollo: Consola
- Producción: Archivo `logs/app.log`

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico, contacta a:

- Email: soporte@tekashishoes.com
- Documentación: [Wiki del proyecto](link-to-wiki)

## 🔄 Changelog

### v1.0.0

- Implementación inicial del backend
- Autenticación con Firebase
- API RESTful completa
- Sistema de notificaciones
- Panel de administración
- Internacionalización
- Geolocalización

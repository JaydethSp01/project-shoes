const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

// Inicializar Firebase Admin si no está inicializado
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        clientId: process.env.FIREBASE_CLIENT_ID,
        authUri: process.env.FIREBASE_AUTH_URI,
        tokenUri: process.env.FIREBASE_TOKEN_URI,
        authProviderX509CertUrl:
          process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        clientX509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL,
      }),
    });
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);
  }
}

// Middleware para verificar autenticación con Firebase
const verificarFirebaseAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Token de autorización requerido",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verificar token con Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Buscar o crear usuario en la base de datos
    let usuario = await Usuario.findOne({ firebaseUid: decodedToken.uid });

    if (!usuario) {
      // Crear usuario si no existe
      usuario = new Usuario({
        firebaseUid: decodedToken.uid,
        email: decodedToken.email,
        nombre: decodedToken.name || decodedToken.email.split("@")[0],
        rol: "CLIENTE",
        activo: true,
      });
      await usuario.save();
    }

    req.usuario = usuario;
    req.firebaseUser = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying Firebase token:", error);
    return res.status(401).json({
      success: false,
      error: "Token inválido o expirado",
    });
  }
};

// Middleware para verificar autenticación con JWT (fallback)
const verificarJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Token de autorización requerido",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await Usuario.findById(decoded.id);

    if (!usuario || !usuario.activo) {
      return res.status(401).json({
        success: false,
        error: "Usuario no encontrado o inactivo",
      });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    console.error("Error verifying JWT:", error);
    return res.status(401).json({
      success: false,
      error: "Token inválido o expirado",
    });
  }
};

// Middleware para verificar roles de administrador
const verificarAdmin = (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({
      success: false,
      error: "Usuario no autenticado",
    });
  }

  if (req.usuario.rol !== "ADMIN") {
    return res.status(403).json({
      success: false,
      error: "Acceso denegado. Se requieren permisos de administrador",
    });
  }

  next();
};

// Middleware para verificar si el usuario es propietario del recurso
const verificarPropietario = (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({
      success: false,
      error: "Usuario no autenticado",
    });
  }

  const resourceUserId = req.params.usuarioId || req.body.usuarioId;

  if (
    req.usuario.rol === "ADMIN" ||
    req.usuario._id.toString() === resourceUserId
  ) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: "Acceso denegado. No tienes permisos para acceder a este recurso",
    });
  }
};

// Middleware opcional de autenticación (no falla si no hay token)
const autenticacionOpcional = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];

      try {
        // Intentar con Firebase primero
        const decodedToken = await admin.auth().verifyIdToken(token);
        let usuario = await Usuario.findOne({ firebaseUid: decodedToken.uid });

        if (usuario) {
          req.usuario = usuario;
          req.firebaseUser = decodedToken;
        }
      } catch (firebaseError) {
        try {
          // Fallback a JWT
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const usuario = await Usuario.findById(decoded.id);

          if (usuario && usuario.activo) {
            req.usuario = usuario;
          }
        } catch (jwtError) {
          // Ignorar errores de token en autenticación opcional
        }
      }
    }

    next();
  } catch (error) {
    // En autenticación opcional, continuar sin usuario
    next();
  }
};

// Middleware para validar datos de entrada
const validarDatos = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        error: "Datos de entrada inválidos",
        detalles: error.details.map((detail) => detail.message),
      });
    }

    next();
  };
};

// Middleware para verificar límites de rate limiting personalizados
const rateLimitPersonalizado = (opciones = {}) => {
  const { windowMs = 15 * 60 * 1000, max = 100, keyGenerator } = opciones;
  const requests = new Map();

  return (req, res, next) => {
    const key = keyGenerator ? keyGenerator(req) : req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Limpiar requests antiguos
    if (requests.has(key)) {
      const userRequests = requests
        .get(key)
        .filter((time) => time > windowStart);
      requests.set(key, userRequests);
    } else {
      requests.set(key, []);
    }

    const userRequests = requests.get(key);

    if (userRequests.length >= max) {
      return res.status(429).json({
        success: false,
        error: "Demasiadas solicitudes. Intenta de nuevo más tarde.",
      });
    }

    userRequests.push(now);
    next();
  };
};

module.exports = {
  verificarFirebaseAuth,
  verificarJWT,
  verificarAdmin,
  verificarPropietario,
  autenticacionOpcional,
  validarDatos,
  rateLimitPersonalizado,
};

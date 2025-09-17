const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Import routes
const productoRoutes = require("./routes/productoRoutes");
const tipoProductoRoutes = require("./routes/tipoProductoRoutes");
const imagenRoutes = require("./routes/imagenRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const favoritoRoutes = require("./routes/favoritoRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const notificacionRoutes = require("./routes/notificacionRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Import middleware
const errorHandler = require("./middleware/errorHandler");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 8080;

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Servir archivos estáticos
app.use("/uploads", express.static("uploads"));

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// MongoDB connection
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/tekashi_shoes",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  });

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// API Routes
app.use("/api/producto", productoRoutes);
app.use("/api/tipo_producto", tipoProductoRoutes);
app.use("/api/imagenes", imagenRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/favoritos", favoritoRoutes);
app.use("/api/wishlists", wishlistRoutes);
app.use("/api/notificaciones", notificacionRoutes);
app.use("/api/admin", adminRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Tekashi Shoes API",
    version: "1.0.0",
    endpoints: {
      productos: "/api/producto",
      tiposProducto: "/api/tipo_producto",
      imagenes: "/api/imagenes",
      usuarios: "/api/usuarios",
      favoritos: "/api/favoritos",
      wishlists: "/api/wishlists",
      notificaciones: "/api/notificaciones",
      admin: "/api/admin",
    },
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    message: `The requested endpoint ${req.originalUrl} does not exist`,
  });
});

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed.");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed.");
    process.exit(0);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
});

module.exports = app;

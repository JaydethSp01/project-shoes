package co.edu.TekashiShoes.Controladores;

import co.edu.TekashiShoes.modelos.Usuario;
import co.edu.TekashiShoes.servicios.UsuarioServicio;
import co.edu.TekashiShoes.servicioImp.UsuarioServicioImp;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.sun.net.httpserver.HttpExchange;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.sql.SQLException;
import java.util.List;

public class UsuarioControlador extends BaseControlador {
    private final UsuarioServicio usuarioServicio;

    public UsuarioControlador() {
        this.usuarioServicio = new UsuarioServicioImp();
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();
        
        System.out.println("UsuarioControlador - Method: " + method + ", Path: " + path);

        // Manejar CORS
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type, Authorization");

        if ("OPTIONS".equals(method)) {
            exchange.sendResponseHeaders(200, 0);
            exchange.getResponseBody().close();
            return;
        }

        try {
            switch (method) {
                case "GET":
                    manejarGet(path, exchange);
                    break;
                case "POST":
                    manejarPost(path, exchange);
                    break;
                case "PUT":
                    manejarPut(path, exchange);
                    break;
                case "DELETE":
                    manejarDelete(path, exchange);
                    break;
                default:
                    enviarError(exchange, "Método no soportado", 405);
            }
        } catch (SQLException e) {
            System.err.println("Error en UsuarioControlador: " + e.getMessage());
            enviarError(exchange, "Error en la base de datos: " + e.getMessage(), 500);
        } catch (Exception e) {
            System.err.println("Error inesperado en UsuarioControlador: " + e.getMessage());
            enviarError(exchange, "Error interno del servidor", 500);
        }
    }

    private void manejarGet(String path, HttpExchange exchange) throws IOException, SQLException {
        System.out.println("UsuarioControlador GET - Path: " + path);

        if (path.equals("/usuarios")) {
            // Obtener todos los usuarios
            List<Usuario> usuarios = usuarioServicio.listarTodos();
            String json = gson.toJson(usuarios);
            enviarRespuesta(exchange, json);
        } else if (path.startsWith("/usuarios/")) {
            String idStr = path.substring("/usuarios/".length());
            try {
                int id = Integer.parseInt(idStr);
                Usuario usuario = usuarioServicio.buscarPorId(id);
                if (usuario != null) {
                    String json = gson.toJson(usuario);
                    enviarRespuesta(exchange, json);
                } else {
                    enviarError(exchange, "Usuario no encontrado", 404);
                }
            } catch (NumberFormatException e) {
                enviarError(exchange, "ID de usuario inválido", 400);
            }
        } else if (path.equals("/usuarios/estadisticas")) {
            // Obtener estadísticas de usuarios
            JsonObject stats = new JsonObject();
            stats.addProperty("totalUsuarios", usuarioServicio.contarUsuarios());
            stats.addProperty("usuariosActivos", usuarioServicio.contarUsuariosActivos());
            stats.addProperty("nuevosUsuariosMes", usuarioServicio.contarNuevosUsuariosMes());
            enviarRespuesta(exchange, gson.toJson(stats));
        } else {
            enviarError(exchange, "Endpoint no encontrado", 404);
        }
    }

    private void manejarPost(String path, HttpExchange exchange) throws IOException, SQLException {
        System.out.println("UsuarioControlador POST - Path: " + path);

        String body = leerCuerpo(exchange);
        System.out.println("UsuarioControlador POST - Body: " + body);

        if (path.equals("/usuarios")) {
            // Crear nuevo usuario
            Usuario nuevoUsuario = gson.fromJson(body, Usuario.class);
            if (nuevoUsuario != null) {
                Usuario usuarioCreado = usuarioServicio.crear(nuevoUsuario);
                if (usuarioCreado != null) {
                    String json = gson.toJson(usuarioCreado);
                    enviarRespuesta(exchange, json);
                } else {
                    enviarError(exchange, "Error al crear el usuario", 500);
                }
            } else {
                enviarError(exchange, "Datos de usuario inválidos", 400);
            }
        } else if (path.equals("/usuarios/login")) {
            // Login de usuario
            JsonObject loginData = JsonParser.parseString(body).getAsJsonObject();
            String email = loginData.get("email").getAsString();
            String password = loginData.get("password").getAsString();

            Usuario usuario = usuarioServicio.buscarPorEmail(email);
            if (usuario != null && usuario.getPassword().equals(password)) {
                // Actualizar último login (comentado temporalmente - columna no existe)
                // usuarioServicio.actualizarUltimoLogin(usuario.getId());
                
                // Crear respuesta de login
                JsonObject response = new JsonObject();
                response.addProperty("success", true);
                response.addProperty("message", "Login exitoso");
                response.add("usuario", gson.toJsonTree(usuario));
                enviarRespuesta(exchange, gson.toJson(response));
            } else {
                JsonObject response = new JsonObject();
                response.addProperty("success", false);
                response.addProperty("message", "Email o contraseña incorrectos");
                enviarRespuesta(exchange, gson.toJson(response));
            }
        } else if (path.equals("/usuarios/registro")) {
            // Registro de usuario
            JsonObject registroData = JsonParser.parseString(body).getAsJsonObject();
            
            // Verificar si el email ya existe
            String email = registroData.get("email").getAsString();
            if (usuarioServicio.existeEmail(email)) {
                JsonObject response = new JsonObject();
                response.addProperty("success", false);
                response.addProperty("message", "El email ya está registrado");
                enviarRespuesta(exchange, gson.toJson(response));
                return;
            }

            Usuario nuevoUsuario = new Usuario();
            nuevoUsuario.setNombre(registroData.get("nombre").getAsString());
            nuevoUsuario.setEmail(email);
            nuevoUsuario.setPassword(registroData.get("password").getAsString());
            nuevoUsuario.setTelefono(registroData.has("telefono") ? registroData.get("telefono").getAsString() : "");
            nuevoUsuario.setDireccion(registroData.has("direccion") ? registroData.get("direccion").getAsString() : "");
            String rol = registroData.has("rol") ? registroData.get("rol").getAsString() : "CLIENTE";
            // Convertir 'user' a 'CLIENTE' y 'admin' a 'ADMIN'
            if ("user".equals(rol)) {
                rol = "CLIENTE";
            } else if ("admin".equals(rol)) {
                rol = "ADMIN";
            }
            nuevoUsuario.setRol(rol);

            Usuario usuarioCreado = usuarioServicio.crear(nuevoUsuario);
            if (usuarioCreado != null) {
                JsonObject response = new JsonObject();
                response.addProperty("success", true);
                response.addProperty("message", "Usuario registrado exitosamente");
                response.add("usuario", gson.toJsonTree(usuarioCreado));
                enviarRespuesta(exchange, gson.toJson(response));
            } else {
                JsonObject response = new JsonObject();
                response.addProperty("success", false);
                response.addProperty("message", "Error al crear el usuario");
                enviarRespuesta(exchange, gson.toJson(response));
            }
        } else {
            enviarError(exchange, "Endpoint no encontrado", 404);
        }
    }

    private void manejarPut(String path, HttpExchange exchange) throws IOException, SQLException {
        System.out.println("UsuarioControlador PUT - Path: " + path);

        String body = leerCuerpo(exchange);
        System.out.println("UsuarioControlador PUT - Body: " + body);

        if (path.startsWith("/usuarios/")) {
            String idStr = path.substring("/usuarios/".length());
            try {
                int id = Integer.parseInt(idStr);
                Usuario usuarioActualizado = gson.fromJson(body, Usuario.class);
                if (usuarioActualizado != null) {
                    usuarioActualizado.setId(id);
                    Usuario usuario = usuarioServicio.actualizar(usuarioActualizado);
                    if (usuario != null) {
                        String json = gson.toJson(usuario);
                        enviarRespuesta(exchange, json);
                    } else {
                        enviarError(exchange, "Error al actualizar el usuario", 500);
                    }
                } else {
                    enviarError(exchange, "Datos de usuario inválidos", 400);
                }
            } catch (NumberFormatException e) {
                enviarError(exchange, "ID de usuario inválido", 400);
            }
        } else {
            enviarError(exchange, "Endpoint no encontrado", 404);
        }
    }

    private void manejarDelete(String path, HttpExchange exchange) throws IOException, SQLException {
        System.out.println("UsuarioControlador DELETE - Path: " + path);

        if (path.startsWith("/usuarios/")) {
            String idStr = path.substring("/usuarios/".length());
            try {
                int id = Integer.parseInt(idStr);
                boolean eliminado = usuarioServicio.eliminar(id);
                if (eliminado) {
                    JsonObject response = new JsonObject();
                    response.addProperty("success", true);
                    response.addProperty("message", "Usuario eliminado exitosamente");
                    enviarRespuesta(exchange, gson.toJson(response));
                } else {
                    enviarError(exchange, "Error al eliminar el usuario", 500);
                }
            } catch (NumberFormatException e) {
                enviarError(exchange, "ID de usuario inválido", 400);
            }
        } else {
            enviarError(exchange, "Endpoint no encontrado", 404);
        }
    }

    private String leerCuerpo(HttpExchange exchange) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(exchange.getRequestBody()))) {
            StringBuilder body = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                body.append(line);
            }
            return body.toString();
        }
    }

    private void enviarRespuesta(HttpExchange exchange, String response) throws IOException {
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.sendResponseHeaders(200, response.getBytes().length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(response.getBytes());
        }
    }

    private void enviarError(HttpExchange exchange, String mensaje, int codigo) throws IOException {
        JsonObject error = new JsonObject();
        error.addProperty("error", true);
        error.addProperty("message", mensaje);
        error.addProperty("code", codigo);
        
        String response = gson.toJson(error);
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.sendResponseHeaders(codigo, response.getBytes().length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(response.getBytes());
        }
    }
}
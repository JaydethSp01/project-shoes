package co.edu.TekashiShoes.Controladores;

import co.edu.TekashiShoes.modelos.Notificacion;
import co.edu.TekashiShoes.servicios.NotificacionServicio;
import co.edu.TekashiShoes.servicioImp.NotificacionServicioImp;
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

public class NotificacionControlador extends BaseControlador {
    private final NotificacionServicio notificacionServicio;

    public NotificacionControlador() {
        this.notificacionServicio = new NotificacionServicioImp();
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();
        
        System.out.println("NotificacionControlador - Method: " + method + ", Path: " + path);

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
            System.err.println("Error en NotificacionControlador: " + e.getMessage());
            enviarError(exchange, "Error en la base de datos: " + e.getMessage(), 500);
        } catch (Exception e) {
            System.err.println("Error inesperado en NotificacionControlador: " + e.getMessage());
            enviarError(exchange, "Error interno del servidor", 500);
        }
    }

    private void manejarGet(String path, HttpExchange exchange) throws IOException, SQLException {
        System.out.println("NotificacionControlador GET - Path: " + path);

        if (path.equals("/notificaciones")) {
            // Obtener todas las notificaciones
            List<Notificacion> notificaciones = notificacionServicio.listarTodos();
            String json = gson.toJson(notificaciones);
            enviarRespuesta(exchange, json);
        } else if (path.startsWith("/notificaciones/usuario/")) {
            String usuarioIdStr = path.substring("/notificaciones/usuario/".length());
            try {
                int usuarioId = Integer.parseInt(usuarioIdStr);
                List<Notificacion> notificaciones = notificacionServicio.listarPorUsuario(usuarioId);
                String json = gson.toJson(notificaciones);
                enviarRespuesta(exchange, json);
            } catch (NumberFormatException e) {
                enviarError(exchange, "ID de usuario inválido", 400);
            }
        } else if (path.startsWith("/notificaciones/no-leidas/")) {
            String usuarioIdStr = path.substring("/notificaciones/no-leidas/".length());
            try {
                int usuarioId = Integer.parseInt(usuarioIdStr);
                List<Notificacion> notificaciones = notificacionServicio.listarNoLeidas(usuarioId);
                String json = gson.toJson(notificaciones);
                enviarRespuesta(exchange, json);
            } catch (NumberFormatException e) {
                enviarError(exchange, "ID de usuario inválido", 400);
            }
        } else if (path.startsWith("/notificaciones/")) {
            String idStr = path.substring("/notificaciones/".length());
            try {
                int id = Integer.parseInt(idStr);
                Notificacion notificacion = notificacionServicio.buscarPorId(id);
                if (notificacion != null) {
                    String json = gson.toJson(notificacion);
                    enviarRespuesta(exchange, json);
                } else {
                    enviarError(exchange, "Notificación no encontrada", 404);
                }
            } catch (NumberFormatException e) {
                enviarError(exchange, "ID de notificación inválido", 400);
            }
        } else {
            enviarError(exchange, "Endpoint no encontrado", 404);
        }
    }

    private void manejarPost(String path, HttpExchange exchange) throws IOException, SQLException {
        System.out.println("NotificacionControlador POST - Path: " + path);

        String body = leerCuerpo(exchange);
        System.out.println("NotificacionControlador POST - Body: " + body);

        if (path.equals("/notificaciones")) {
            // Crear nueva notificación
            JsonObject notificacionData = JsonParser.parseString(body).getAsJsonObject();
            
            Notificacion notificacion = new Notificacion();
            notificacion.setUsuarioId(notificacionData.get("usuarioId").getAsInt());
            notificacion.setTitulo(notificacionData.get("titulo").getAsString());
            notificacion.setMensaje(notificacionData.get("mensaje").getAsString());
            notificacion.setTipo(notificacionData.has("tipo") ? notificacionData.get("tipo").getAsString() : "info");
            notificacion.setUrlAccion(notificacionData.has("urlAccion") ? notificacionData.get("urlAccion").getAsString() : null);

            Notificacion notificacionCreada = notificacionServicio.crear(notificacion);
            if (notificacionCreada != null) {
                JsonObject response = new JsonObject();
                response.addProperty("success", true);
                response.addProperty("message", "Notificación creada exitosamente");
                response.add("notificacion", gson.toJsonTree(notificacionCreada));
                enviarRespuesta(exchange, gson.toJson(response));
            } else {
                JsonObject response = new JsonObject();
                response.addProperty("success", false);
                response.addProperty("message", "Error al crear la notificación");
                enviarRespuesta(exchange, gson.toJson(response));
            }
        } else {
            enviarError(exchange, "Endpoint no encontrado", 404);
        }
    }

    private void manejarPut(String path, HttpExchange exchange) throws IOException, SQLException {
        System.out.println("NotificacionControlador PUT - Path: " + path);

        String body = leerCuerpo(exchange);
        System.out.println("NotificacionControlador PUT - Body: " + body);

        if (path.startsWith("/notificaciones/") && path.endsWith("/marcar-leida")) {
            // Marcar notificación como leída
            String idStr = path.substring("/notificaciones/".length(), path.length() - "/marcar-leida".length());
            try {
                int id = Integer.parseInt(idStr);
                boolean marcada = notificacionServicio.marcarComoLeida(id);
                
                if (marcada) {
                    JsonObject response = new JsonObject();
                    response.addProperty("success", true);
                    response.addProperty("message", "Notificación marcada como leída");
                    enviarRespuesta(exchange, gson.toJson(response));
                } else {
                    JsonObject response = new JsonObject();
                    response.addProperty("success", false);
                    response.addProperty("message", "Error al marcar la notificación como leída");
                    enviarRespuesta(exchange, gson.toJson(response));
                }
            } catch (NumberFormatException e) {
                enviarError(exchange, "ID de notificación inválido", 400);
            }
        } else if (path.startsWith("/notificaciones/") && path.endsWith("/marcar-todas-leidas")) {
            // Marcar todas las notificaciones como leídas
            String usuarioIdStr = path.substring("/notificaciones/".length(), path.length() - "/marcar-todas-leidas".length());
            try {
                int usuarioId = Integer.parseInt(usuarioIdStr);
                boolean marcadas = notificacionServicio.marcarTodasComoLeidas(usuarioId);
                
                if (marcadas) {
                    JsonObject response = new JsonObject();
                    response.addProperty("success", true);
                    response.addProperty("message", "Todas las notificaciones marcadas como leídas");
                    enviarRespuesta(exchange, gson.toJson(response));
                } else {
                    JsonObject response = new JsonObject();
                    response.addProperty("success", false);
                    response.addProperty("message", "Error al marcar las notificaciones como leídas");
                    enviarRespuesta(exchange, gson.toJson(response));
                }
            } catch (NumberFormatException e) {
                enviarError(exchange, "ID de usuario inválido", 400);
            }
        } else if (path.startsWith("/notificaciones/")) {
            // Actualizar notificación
            String idStr = path.substring("/notificaciones/".length());
            try {
                int id = Integer.parseInt(idStr);
                JsonObject notificacionData = JsonParser.parseString(body).getAsJsonObject();
                
                Notificacion notificacion = new Notificacion();
                notificacion.setId(id);
                notificacion.setTitulo(notificacionData.get("titulo").getAsString());
                notificacion.setMensaje(notificacionData.get("mensaje").getAsString());
                notificacion.setTipo(notificacionData.has("tipo") ? notificacionData.get("tipo").getAsString() : "info");
                notificacion.setLeida(notificacionData.has("leida") ? notificacionData.get("leida").getAsBoolean() : false);
                notificacion.setUrlAccion(notificacionData.has("urlAccion") ? notificacionData.get("urlAccion").getAsString() : null);

                Notificacion notificacionActualizada = notificacionServicio.actualizar(notificacion);
                if (notificacionActualizada != null) {
                    JsonObject response = new JsonObject();
                    response.addProperty("success", true);
                    response.addProperty("message", "Notificación actualizada exitosamente");
                    response.add("notificacion", gson.toJsonTree(notificacionActualizada));
                    enviarRespuesta(exchange, gson.toJson(response));
                } else {
                    JsonObject response = new JsonObject();
                    response.addProperty("success", false);
                    response.addProperty("message", "Error al actualizar la notificación");
                    enviarRespuesta(exchange, gson.toJson(response));
                }
            } catch (NumberFormatException e) {
                enviarError(exchange, "ID de notificación inválido", 400);
            }
        } else {
            enviarError(exchange, "Endpoint no encontrado", 404);
        }
    }

    private void manejarDelete(String path, HttpExchange exchange) throws IOException, SQLException {
        System.out.println("NotificacionControlador DELETE - Path: " + path);

        if (path.startsWith("/notificaciones/")) {
            String idStr = path.substring("/notificaciones/".length());
            try {
                int id = Integer.parseInt(idStr);
                boolean eliminado = notificacionServicio.eliminar(id);
                
                if (eliminado) {
                    JsonObject response = new JsonObject();
                    response.addProperty("success", true);
                    response.addProperty("message", "Notificación eliminada exitosamente");
                    enviarRespuesta(exchange, gson.toJson(response));
                } else {
                    JsonObject response = new JsonObject();
                    response.addProperty("success", false);
                    response.addProperty("message", "Error al eliminar la notificación");
                    enviarRespuesta(exchange, gson.toJson(response));
                }
            } catch (NumberFormatException e) {
                enviarError(exchange, "ID de notificación inválido", 400);
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


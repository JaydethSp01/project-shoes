package co.edu.TekashiShoes.Controladores;

import co.edu.TekashiShoes.modelos.Wishlist;
import co.edu.TekashiShoes.servicios.WishlistServicio;
import co.edu.TekashiShoes.servicioImp.WishlistServicioImp;
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

public class WishlistControlador extends BaseControlador {
    private final WishlistServicio wishlistServicio;

    public WishlistControlador() {
        this.wishlistServicio = new WishlistServicioImp();
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();
        
        System.out.println("WishlistControlador - Method: " + method + ", Path: " + path);

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
            System.err.println("Error en WishlistControlador: " + e.getMessage());
            enviarError(exchange, "Error en la base de datos: " + e.getMessage(), 500);
        } catch (Exception e) {
            System.err.println("Error inesperado en WishlistControlador: " + e.getMessage());
            enviarError(exchange, "Error interno del servidor", 500);
        }
    }

    private void manejarGet(String path, HttpExchange exchange) throws IOException, SQLException {
        System.out.println("WishlistControlador GET - Path: " + path);

        if (path.equals("/wishlists")) {
            // Obtener todas las wishlists
            List<Wishlist> wishlists = wishlistServicio.listarTodos();
            String json = gson.toJson(wishlists);
            enviarRespuesta(exchange, json);
        } else if (path.startsWith("/wishlists/usuario/")) {
            String usuarioIdStr = path.substring("/wishlists/usuario/".length());
            try {
                int usuarioId = Integer.parseInt(usuarioIdStr);
                List<Wishlist> wishlists = wishlistServicio.listarPorUsuario(usuarioId);
                String json = gson.toJson(wishlists);
                enviarRespuesta(exchange, json);
            } catch (NumberFormatException e) {
                enviarError(exchange, "ID de usuario inválido", 400);
            }
        } else if (path.startsWith("/wishlists/")) {
            String idStr = path.substring("/wishlists/".length());
            try {
                int id = Integer.parseInt(idStr);
                Wishlist wishlist = wishlistServicio.buscarPorId(id);
                if (wishlist != null) {
                    String json = gson.toJson(wishlist);
                    enviarRespuesta(exchange, json);
                } else {
                    enviarError(exchange, "Wishlist no encontrada", 404);
                }
            } catch (NumberFormatException e) {
                enviarError(exchange, "ID de wishlist inválido", 400);
            }
        } else {
            enviarError(exchange, "Endpoint no encontrado", 404);
        }
    }

    private void manejarPost(String path, HttpExchange exchange) throws IOException, SQLException {
        System.out.println("WishlistControlador POST - Path: " + path);

        String body = leerCuerpo(exchange);
        System.out.println("WishlistControlador POST - Body: " + body);

        if (path.equals("/wishlists")) {
            // Crear nueva wishlist
            JsonObject wishlistData = JsonParser.parseString(body).getAsJsonObject();
            
            Wishlist wishlist = new Wishlist();
            wishlist.setUsuarioId(wishlistData.get("usuarioId").getAsInt());
            wishlist.setNombre(wishlistData.get("nombre").getAsString());
            wishlist.setDescripcion(wishlistData.has("descripcion") ? wishlistData.get("descripcion").getAsString() : "");

            Wishlist wishlistCreada = wishlistServicio.crear(wishlist);
            if (wishlistCreada != null) {
                JsonObject response = new JsonObject();
                response.addProperty("success", true);
                response.addProperty("message", "Wishlist creada exitosamente");
                response.add("wishlist", gson.toJsonTree(wishlistCreada));
                enviarRespuesta(exchange, gson.toJson(response));
            } else {
                JsonObject response = new JsonObject();
                response.addProperty("success", false);
                response.addProperty("message", "Error al crear la wishlist");
                enviarRespuesta(exchange, gson.toJson(response));
            }
        } else if (path.startsWith("/wishlists/") && path.endsWith("/productos")) {
            // Agregar producto a wishlist
            String[] pathParts = path.split("/");
            if (pathParts.length >= 3) {
                try {
                    int wishlistId = Integer.parseInt(pathParts[2]);
                    JsonObject productoData = JsonParser.parseString(body).getAsJsonObject();
                    int productoId = productoData.get("productoId").getAsInt();

                    boolean agregado = wishlistServicio.agregarProducto(wishlistId, productoId);
                    if (agregado) {
                        JsonObject response = new JsonObject();
                        response.addProperty("success", true);
                        response.addProperty("message", "Producto agregado a la wishlist");
                        enviarRespuesta(exchange, gson.toJson(response));
                    } else {
                        JsonObject response = new JsonObject();
                        response.addProperty("success", false);
                        response.addProperty("message", "Error al agregar producto a la wishlist");
                        enviarRespuesta(exchange, gson.toJson(response));
                    }
                } catch (NumberFormatException e) {
                    enviarError(exchange, "ID de wishlist inválido", 400);
                }
            }
        } else {
            enviarError(exchange, "Endpoint no encontrado", 404);
        }
    }

    private void manejarPut(String path, HttpExchange exchange) throws IOException, SQLException {
        System.out.println("WishlistControlador PUT - Path: " + path);

        String body = leerCuerpo(exchange);
        System.out.println("WishlistControlador PUT - Body: " + body);

        if (path.startsWith("/wishlists/")) {
            String idStr = path.substring("/wishlists/".length());
            try {
                int id = Integer.parseInt(idStr);
                JsonObject wishlistData = JsonParser.parseString(body).getAsJsonObject();
                
                Wishlist wishlist = new Wishlist();
                wishlist.setId(id);
                wishlist.setNombre(wishlistData.get("nombre").getAsString());
                wishlist.setDescripcion(wishlistData.has("descripcion") ? wishlistData.get("descripcion").getAsString() : "");

                Wishlist wishlistActualizada = wishlistServicio.actualizar(wishlist);
                if (wishlistActualizada != null) {
                    JsonObject response = new JsonObject();
                    response.addProperty("success", true);
                    response.addProperty("message", "Wishlist actualizada exitosamente");
                    response.add("wishlist", gson.toJsonTree(wishlistActualizada));
                    enviarRespuesta(exchange, gson.toJson(response));
                } else {
                    JsonObject response = new JsonObject();
                    response.addProperty("success", false);
                    response.addProperty("message", "Error al actualizar la wishlist");
                    enviarRespuesta(exchange, gson.toJson(response));
                }
            } catch (NumberFormatException e) {
                enviarError(exchange, "ID de wishlist inválido", 400);
            }
        } else {
            enviarError(exchange, "Endpoint no encontrado", 404);
        }
    }

    private void manejarDelete(String path, HttpExchange exchange) throws IOException, SQLException {
        System.out.println("WishlistControlador DELETE - Path: " + path);

        if (path.startsWith("/wishlists/")) {
            String[] pathParts = path.split("/");
            if (pathParts.length >= 3) {
                try {
                    int wishlistId = Integer.parseInt(pathParts[2]);
                    
                    if (pathParts.length >= 5 && pathParts[3].equals("productos")) {
                        // Remover producto de wishlist
                        int productoId = Integer.parseInt(pathParts[4]);
                        boolean removido = wishlistServicio.removerProducto(wishlistId, productoId);
                        
                        if (removido) {
                            JsonObject response = new JsonObject();
                            response.addProperty("success", true);
                            response.addProperty("message", "Producto removido de la wishlist");
                            enviarRespuesta(exchange, gson.toJson(response));
                        } else {
                            JsonObject response = new JsonObject();
                            response.addProperty("success", false);
                            response.addProperty("message", "Error al remover producto de la wishlist");
                            enviarRespuesta(exchange, gson.toJson(response));
                        }
                    } else {
                        // Eliminar wishlist completa
                        boolean eliminado = wishlistServicio.eliminar(wishlistId);
                        if (eliminado) {
                            JsonObject response = new JsonObject();
                            response.addProperty("success", true);
                            response.addProperty("message", "Wishlist eliminada exitosamente");
                            enviarRespuesta(exchange, gson.toJson(response));
                        } else {
                            JsonObject response = new JsonObject();
                            response.addProperty("success", false);
                            response.addProperty("message", "Error al eliminar la wishlist");
                            enviarRespuesta(exchange, gson.toJson(response));
                        }
                    }
                } catch (NumberFormatException e) {
                    enviarError(exchange, "IDs inválidos", 400);
                }
            } else {
                enviarError(exchange, "Formato de URL inválido", 400);
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

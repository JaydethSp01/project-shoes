package co.edu.TekashiShoes.Controladores;

import co.edu.TekashiShoes.modelos.Favorito;
import co.edu.TekashiShoes.servicios.FavoritoServicio;
import co.edu.TekashiShoes.servicioImp.FavoritoServicioImp;
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

public class FavoritoControlador extends BaseControlador {
    private final FavoritoServicio favoritoServicio;

    public FavoritoControlador() {
        this.favoritoServicio = new FavoritoServicioImp();
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();
        
        System.out.println("FavoritoControlador - Method: " + method + ", Path: " + path);

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
                case "DELETE":
                    manejarDelete(path, exchange);
                    break;
                default:
                    enviarError(exchange, "Método no soportado", 405);
            }
        } catch (SQLException e) {
            System.err.println("Error en FavoritoControlador: " + e.getMessage());
            enviarError(exchange, "Error en la base de datos: " + e.getMessage(), 500);
        } catch (Exception e) {
            System.err.println("Error inesperado en FavoritoControlador: " + e.getMessage());
            enviarError(exchange, "Error interno del servidor", 500);
        }
    }

    private void manejarGet(String path, HttpExchange exchange) throws IOException, SQLException {
        System.out.println("FavoritoControlador GET - Path: " + path);

        if (path.startsWith("/favoritos/usuario/")) {
            String usuarioIdStr = path.substring("/favoritos/usuario/".length());
            try {
                int usuarioId = Integer.parseInt(usuarioIdStr);
                List<Favorito> favoritos = favoritoServicio.listarPorUsuario(usuarioId);
                String json = gson.toJson(favoritos);
                enviarRespuesta(exchange, json);
            } catch (NumberFormatException e) {
                enviarError(exchange, "ID de usuario inválido", 400);
            }
        } else if (path.startsWith("/favoritos/producto/")) {
            String productoIdStr = path.substring("/favoritos/producto/".length());
            try {
                int productoId = Integer.parseInt(productoIdStr);
                List<Favorito> favoritos = favoritoServicio.listarPorProducto(productoId);
                String json = gson.toJson(favoritos);
                enviarRespuesta(exchange, json);
            } catch (NumberFormatException e) {
                enviarError(exchange, "ID de producto inválido", 400);
            }
        } else if (path.equals("/favoritos")) {
            List<Favorito> favoritos = favoritoServicio.listarTodos();
            String json = gson.toJson(favoritos);
            enviarRespuesta(exchange, json);
        } else {
            enviarError(exchange, "Endpoint no encontrado", 404);
        }
    }

    private void manejarPost(String path, HttpExchange exchange) throws IOException, SQLException {
        System.out.println("FavoritoControlador POST - Path: " + path);

        String body = leerCuerpo(exchange);
        System.out.println("FavoritoControlador POST - Body: " + body);

        if (path.equals("/favoritos")) {
            // Agregar a favoritos
            JsonObject favoritoData = JsonParser.parseString(body).getAsJsonObject();
            int usuarioId = favoritoData.get("usuarioId").getAsInt();
            int productoId = favoritoData.get("productoId").getAsInt();

            Favorito favorito = new Favorito();
            favorito.setUsuarioId(usuarioId);
            favorito.setProductoId(productoId);

            Favorito favoritoCreado = favoritoServicio.crear(favorito);
            if (favoritoCreado != null) {
                JsonObject response = new JsonObject();
                response.addProperty("success", true);
                response.addProperty("message", "Producto agregado a favoritos");
                response.add("favorito", gson.toJsonTree(favoritoCreado));
                enviarRespuesta(exchange, gson.toJson(response));
            } else {
                JsonObject response = new JsonObject();
                response.addProperty("success", false);
                response.addProperty("message", "Error al agregar a favoritos");
                enviarRespuesta(exchange, gson.toJson(response));
            }
        } else {
            enviarError(exchange, "Endpoint no encontrado", 404);
        }
    }

    private void manejarDelete(String path, HttpExchange exchange) throws IOException, SQLException {
        System.out.println("FavoritoControlador DELETE - Path: " + path);

        if (path.startsWith("/favoritos/")) {
            String[] pathParts = path.split("/");
            if (pathParts.length >= 4) {
                try {
                    int usuarioId = Integer.parseInt(pathParts[2]);
                    int productoId = Integer.parseInt(pathParts[3]);
                    
                    boolean eliminado = favoritoServicio.eliminar(usuarioId, productoId);
                    if (eliminado) {
                        JsonObject response = new JsonObject();
                        response.addProperty("success", true);
                        response.addProperty("message", "Producto eliminado de favoritos");
                        enviarRespuesta(exchange, gson.toJson(response));
                    } else {
                        JsonObject response = new JsonObject();
                        response.addProperty("success", false);
                        response.addProperty("message", "Error al eliminar de favoritos");
                        enviarRespuesta(exchange, gson.toJson(response));
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
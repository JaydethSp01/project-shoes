package co.edu.TekashiShoes.Controladores;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import co.edu.TekashiShoes.servicioImp.ProductoServiceImp;
import co.edu.TekashiShoes.servicioImp.TipoProductoServicioImp;
import co.edu.TekashiShoes.servicioImp.ImagenServicioImp;
import co.edu.TekashiShoes.repositorios.ProductoRepositorio;
import co.edu.TekashiShoes.dominio.Producto;
import co.edu.TekashiShoes.dominio.TipoProducto;
import co.edu.TekashiShoes.dominio.Imagen;
import co.edu.TekashiShoes.controladores.AdminController;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import java.util.Collections;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.sql.SQLException;
import java.util.List;
import java.util.stream.Collectors;

public class ServidorHttp {
    public static void main(String[] args) throws IOException {
        HttpServer servidor = HttpServer.create(new InetSocketAddress(8080), 0);

        // Crear controladores para productos, tipos de productos, imágenes, usuarios, favoritos, wishlists, notificaciones y admin
        ProductoControlador productoControlador = new ProductoControlador();
        TipoProductoControlador tipoProductoControlador = new TipoProductoControlador();
        ImagenControlador imagenControlador = new ImagenControlador();
        UsuarioControlador usuarioControlador = new UsuarioControlador();
        FavoritoControlador favoritoControlador = new FavoritoControlador();
        WishlistControlador wishlistControlador = new WishlistControlador();
        NotificacionControlador notificacionControlador = new NotificacionControlador();
        AdminControlador adminControlador = new AdminControlador();

        // Rutas de la API
        servidor.createContext("/producto", productoControlador);
        servidor.createContext("/tipo_producto", tipoProductoControlador);
        servidor.createContext("/imagenes", imagenControlador);
        servidor.createContext("/usuarios", usuarioControlador);
        servidor.createContext("/favoritos", favoritoControlador);
        servidor.createContext("/wishlists", wishlistControlador);
        servidor.createContext("/notificaciones", notificacionControlador);
        servidor.createContext("/admin", adminControlador);

        // Iniciar servidor
        servidor.setExecutor(null);
        servidor.start();
        System.out.println("Servidor iniciado en http://localhost:8080");
    }
}

// Controlador base con lógica compartida
abstract class BaseControlador implements HttpHandler {
    protected Gson gson = new Gson();

    protected void manejarOptions(HttpExchange intercambio) throws IOException {
        intercambio.getResponseHeaders().add("Access-Control-Allow-Origin", "http://localhost:5173");
        intercambio.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        intercambio.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type, Authorization");
        intercambio.getResponseHeaders().add("Access-Control-Max-Age", "86400");
        intercambio.sendResponseHeaders(204, -1);
    }

    protected void enviarRespuesta(HttpExchange intercambio, int codigo, String mensaje) throws IOException {
        intercambio.getResponseHeaders().add("Access-Control-Allow-Origin", "http://localhost:5173");
        intercambio.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        intercambio.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type, Authorization");
        intercambio.getResponseHeaders().add("Content-Type", "application/json");
        
        if (mensaje == null || mensaje.isEmpty()) {
            intercambio.sendResponseHeaders(codigo, -1);
        } else {
            intercambio.sendResponseHeaders(codigo, mensaje.getBytes().length);
            try (OutputStream os = intercambio.getResponseBody()) {
                os.write(mensaje.getBytes());
            }
        }
    }

    protected void enviarError(HttpExchange intercambio, int codigo, String mensaje) throws IOException {
        intercambio.getResponseHeaders().add("Access-Control-Allow-Origin", "http://localhost:5173");
        intercambio.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        intercambio.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type, Authorization");
        intercambio.getResponseHeaders().add("Content-Type", "application/json");
        intercambio.sendResponseHeaders(codigo, mensaje.getBytes().length);
        try (OutputStream os = intercambio.getResponseBody()) {
            os.write(mensaje.getBytes());
        }
    }
}


// Controlador de Productos
class ProductoControlador extends BaseControlador {
    private ProductoServiceImp productoServicio;
    private Gson gson;

    public ProductoControlador() {
        try {
            ProductoRepositorio productoRepositorio = new ProductoRepositorio();
            productoServicio = new ProductoServiceImp(productoRepositorio);
            gson = new Gson();
        } catch (SQLException e) {
            e.printStackTrace(); // Log SQL exceptions during initialization
        }
    }

    @Override
    public void handle(HttpExchange intercambio) throws IOException {
        String metodo = intercambio.getRequestMethod();
        String path = intercambio.getRequestURI().getPath();

        // Manejar la solicitud de preflight (OPTIONS)
        if (metodo.equals("OPTIONS")) {
            manejarOptions(intercambio);
            return;
        }

        if (metodo.equals("GET") && path.contains("/productoId")) {
            manejarGetProductoPorId(intercambio);
        } else if (metodo.equals("GET") && (path.contains("tipoProductoId") || intercambio.getRequestURI().getQuery() != null && intercambio.getRequestURI().getQuery().contains("tipoProductoId"))) {
            manejarGetProductosPorTipo(intercambio);
        } else {
            switch (metodo) {
                case "GET":
                    manejarGet(intercambio);
                    break;
                case "POST":
                    manejarPost(intercambio);
                    break;
                case "PUT":
                    manejarPut(intercambio);
                    break;
                case "DELETE":
                    manejarDelete(intercambio);
                    break;
                default:
                    enviarError(intercambio, 405, "Método no permitido");
            }
        }
    }

    

    private void manejarGet(HttpExchange intercambio) throws IOException {
        try {
            List<Producto> productos = productoServicio.listarProductos();
            String respuestaJson = gson.toJson(productos);
            intercambio.getResponseHeaders().add("Content-Type", "application/json");
            enviarRespuesta(intercambio, 200, respuestaJson);
        } catch (SQLException e) {
            e.printStackTrace();
            enviarError(intercambio, 500, "Error interno del servidor: " + e.getMessage());
        }
    }

    private void manejarGetProductoPorId(HttpExchange intercambio) throws IOException {
        String query = intercambio.getRequestURI().getQuery();
        String[] params = query.split("=");

        if (params.length == 2 && params[0].equals("productoId")) {
            int productoId = Integer.parseInt(params[1]);
            try {
                Producto producto = productoServicio.obtenerProductoPorId(productoId);
                if (producto != null) {
                    String respuestaJson = gson.toJson(producto);
                    intercambio.getResponseHeaders().add("Content-Type", "application/json");
                    enviarRespuesta(intercambio, 200, respuestaJson);
                } else {
                    enviarError(intercambio, 404, "Producto no encontrado");
                }
            } catch (SQLException e) {
                e.printStackTrace();
                enviarError(intercambio, 500, "Error interno del servidor: " + e.getMessage());
            }
        } else {
            enviarError(intercambio, 400, "Solicitud mal formada");
        }
    }

    private void manejarGetProductosPorTipo(HttpExchange intercambio) throws IOException {
        String query = intercambio.getRequestURI().getQuery();
        System.out.println("Query recibida: " + query); // Debug
        
        if (query != null && query.contains("tipoProductoId=")) {
            String[] params = query.split("=");
            System.out.println("Params: " + java.util.Arrays.toString(params)); // Debug
            
            if (params.length >= 2) {
                try {
                    int tipoProductoId = Integer.parseInt(params[1]);
                    System.out.println("Filtrando por tipoProductoId: " + tipoProductoId); // Debug
                    
                    List<Producto> productos = productoServicio.listarProductosPorTipo(tipoProductoId);
                    System.out.println("Productos encontrados: " + productos.size()); // Debug
                    
                    String respuestaJson = gson.toJson(productos);
                    intercambio.getResponseHeaders().add("Content-Type", "application/json");
                    enviarRespuesta(intercambio, 200, respuestaJson);
                } catch (NumberFormatException e) {
                    enviarError(intercambio, 400, "ID de tipo de producto inválido");
                } catch (SQLException e) {
                    e.printStackTrace();
                    enviarError(intercambio, 500, "Error interno del servidor: " + e.getMessage());
                }
            } else {
                enviarError(intercambio, 400, "Parámetro tipoProductoId requerido");
            }
        } else {
            enviarError(intercambio, 400, "Parámetro tipoProductoId requerido");
        }
    }

    private void manejarPost(HttpExchange intercambio) throws IOException {
        InputStream is = intercambio.getRequestBody();
        String cuerpo = new BufferedReader(new InputStreamReader(is)).lines().collect(Collectors.joining("\n"));
        is.close();

        try {
            Producto producto = gson.fromJson(cuerpo, Producto.class);
            productoServicio.agregarProducto(producto);
            String jsonResponse = gson.toJson(Collections.singletonMap("message", "Producto creado"));
            enviarRespuesta(intercambio, 201, jsonResponse);
        } catch (SQLException e) {
            e.printStackTrace();
            enviarError(intercambio, 500, "Error interno del servidor: " + e.getMessage());
        }
    }

    private void manejarPut(HttpExchange intercambio) throws IOException {
        String idStr = intercambio.getRequestURI().getPath().split("/")[2];
        int id = Integer.parseInt(idStr);

        InputStream is = intercambio.getRequestBody();
        String cuerpo = new BufferedReader(new InputStreamReader(is)).lines().collect(Collectors.joining("\n"));
        is.close();

        try {
            Producto producto = gson.fromJson(cuerpo, Producto.class);
            productoServicio.actualizarProducto(id, producto);
            String jsonResponse = gson.toJson(Collections.singletonMap("message", "Producto actualizado"));
            enviarRespuesta(intercambio, 200, jsonResponse);
        } catch (SQLException e) {
            e.printStackTrace();
            enviarError(intercambio, 500, "Error interno del servidor: " + e.getMessage());
        }
    }

    private void manejarDelete(HttpExchange intercambio) throws IOException {
        String idStr = intercambio.getRequestURI().getPath().split("/")[2];
        int id = Integer.parseInt(idStr);

        try {
            productoServicio.eliminarProducto(id);
            String jsonResponse = gson.toJson(Collections.singletonMap("message", "Producto eliminado"));
            enviarRespuesta(intercambio, 204, jsonResponse);
        } catch (SQLException e) {
            e.printStackTrace();
            enviarError(intercambio, 500, "Error interno del servidor: " + e.getMessage());
        }
    }
}

// Controlador para funcionalidades de administración
class AdminControlador extends BaseControlador {
    private AdminController adminController;
    private Gson gson;

    public AdminControlador() {
        this.adminController = new AdminController();
        this.gson = new Gson();
    }

    @Override
    public void handle(HttpExchange intercambio) throws IOException {
        String method = intercambio.getRequestMethod();
        String path = intercambio.getRequestURI().getPath();

        if ("OPTIONS".equals(method)) {
            manejarOptions(intercambio);
            return;
        }

        try {
            switch (method) {
                case "GET":
                    manejarGet(intercambio, path);
                    break;
                case "POST":
                    manejarPost(intercambio, path);
                    break;
                case "DELETE":
                    manejarDelete(intercambio, path);
                    break;
                default:
                    enviarError(intercambio, 405, "Método no permitido");
            }
        } catch (Exception e) {
            e.printStackTrace();
            enviarError(intercambio, 500, "Error interno del servidor: " + e.getMessage());
        }
    }

    private void manejarGet(HttpExchange intercambio, String path) throws IOException {
        if (path.equals("/admin/notifications")) {
            String response = adminController.obtenerNotificacionesAdmin();
            enviarRespuesta(intercambio, 200, response);
        } else if (path.equals("/admin/stats")) {
            String response = adminController.verEstadisticasBaseDatos();
            enviarRespuesta(intercambio, 200, response);
        } else if (path.equals("/admin/system-info")) {
            String response = adminController.obtenerInformacionSistema();
            enviarRespuesta(intercambio, 200, response);
        } else if (path.equals("/admin/logs")) {
            String response = adminController.verLogs();
            enviarRespuesta(intercambio, 200, response);
        } else if (path.equals("/admin/users")) {
            String response = adminController.obtenerListaUsuarios();
            enviarRespuesta(intercambio, 200, response);
        } else if (path.equals("/admin/products")) {
            String response = adminController.obtenerListaProductos();
            enviarRespuesta(intercambio, 200, response);
        } else {
            enviarError(intercambio, 404, "Endpoint no encontrado");
        }
    }

    private void manejarPost(HttpExchange intercambio, String path) throws IOException {
        String requestBody = new BufferedReader(new InputStreamReader(intercambio.getRequestBody()))
                .lines().collect(Collectors.joining("\n"));

        if (path.equals("/admin/backup")) {
            String response = adminController.respaldarBaseDatos();
            enviarRespuesta(intercambio, 200, response);
        } else if (path.equals("/admin/optimize")) {
            String response = adminController.optimizarBaseDatos();
            enviarRespuesta(intercambio, 200, response);
        } else if (path.equals("/admin/create-user")) {
            // Parsear JSON del request body
            JsonObject json = gson.fromJson(requestBody, JsonObject.class);
            String nombre = json.get("nombre").getAsString();
            String email = json.get("email").getAsString();
            String password = json.get("password").getAsString();
            String role = json.get("role").getAsString();
            
            String response = adminController.crearUsuario(nombre, email, password, role);
            enviarRespuesta(intercambio, 200, response);
        } else if (path.equals("/admin/delete-user")) {
            JsonObject json = gson.fromJson(requestBody, JsonObject.class);
            int userId = json.get("userId").getAsInt();
            
            String response = adminController.eliminarUsuario(userId);
            enviarRespuesta(intercambio, 200, response);
        } else if (path.equals("/admin/update-role")) {
            JsonObject json = gson.fromJson(requestBody, JsonObject.class);
            int userId = json.get("userId").getAsInt();
            String newRole = json.get("newRole").getAsString();
            
            String response = adminController.gestionarRoles(userId, newRole);
            enviarRespuesta(intercambio, 200, response);
        } else if (path.equals("/admin/import-products")) {
            String response = adminController.importarProductos(requestBody);
            enviarRespuesta(intercambio, 200, response);
        } else if (path.equals("/admin/export-catalog")) {
            String response = adminController.exportarCatalogo();
            enviarRespuesta(intercambio, 200, response);
        } else if (path.equals("/admin/mark-notification-read")) {
            JsonObject json = gson.fromJson(requestBody, JsonObject.class);
            int activityId = json.get("activityId").getAsInt();
            
            String response = adminController.marcarNotificacionLeida(activityId);
            enviarRespuesta(intercambio, 200, response);
        } else if (path.equals("/admin/mark-all-notifications-read")) {
            String response = adminController.marcarTodasNotificacionesLeidas();
            enviarRespuesta(intercambio, 200, response);
        } else if (path.equals("/admin/delete-product")) {
            JsonObject json = gson.fromJson(requestBody, JsonObject.class);
            int productId = json.get("productId").getAsInt();
            
            String response = adminController.eliminarProducto(productId);
            enviarRespuesta(intercambio, 200, response);
        } else {
            enviarError(intercambio, 404, "Endpoint no encontrado");
        }
    }

    private void manejarDelete(HttpExchange intercambio, String path) throws IOException {
        String[] pathParts = path.split("/");
        if (pathParts.length >= 4 && pathParts[2].equals("user")) {
            int userId = Integer.parseInt(pathParts[3]);
            String response = adminController.eliminarUsuario(userId);
            enviarRespuesta(intercambio, 200, response);
        } else if (pathParts.length >= 4 && pathParts[2].equals("product")) {
            int productId = Integer.parseInt(pathParts[3]);
            String response = adminController.eliminarProducto(productId);
            enviarRespuesta(intercambio, 200, response);
        } else {
            enviarError(intercambio, 404, "Endpoint no encontrado");
        }
    }
}

// Controlador de TipoProducto
class TipoProductoControlador extends BaseControlador {
    private TipoProductoServicioImp tipoProductoServicio;
    private Gson gson;

    public TipoProductoControlador() {
        try {
            ProductoRepositorio tipoProductoRepositorio = new ProductoRepositorio();
            tipoProductoServicio = new TipoProductoServicioImp(tipoProductoRepositorio);
            gson = new Gson();
        } catch (SQLException e) {
            e.printStackTrace(); // Log SQL exceptions during initialization
        }
    }

    @Override
    public void handle(HttpExchange intercambio) throws IOException {
        String metodo = intercambio.getRequestMethod();

        // Manejar la solicitud de preflight (OPTIONS)
        if (metodo.equals("OPTIONS")) {
            manejarOptions(intercambio);
            return;
        }

        switch (metodo) {
            case "GET":
                manejarGet(intercambio);
                break;
            default:
                enviarError(intercambio, 405, "Método no permitido");
        }
    }

    private void manejarGet(HttpExchange intercambio) throws IOException {
        try {
            List<TipoProducto> tiposProducto = tipoProductoServicio.listarTiposProducto();
            String respuestaJson = gson.toJson(tiposProducto);
            intercambio.getResponseHeaders().add("Content-Type", "application/json");
            enviarRespuesta(intercambio, 200, respuestaJson);
        } catch (SQLException e) {
            e.printStackTrace(); // Log exception details
            enviarError(intercambio, 500, "Error interno del servidor: " + e.getMessage());
        }
    }

    
}

// Controlador de Imagenes
class ImagenControlador extends BaseControlador {
    private ImagenServicioImp imagenServicio;
    private Gson gson;

    public ImagenControlador() {
        try {
            ProductoRepositorio imagenRepositorio = new ProductoRepositorio();
            imagenServicio = new ImagenServicioImp(imagenRepositorio);
            gson = new Gson();
        } catch (SQLException e) {
            e.printStackTrace(); // Log SQL exceptions during initialization
        }
    }

    @Override
    public void handle(HttpExchange intercambio) throws IOException {
        String metodo = intercambio.getRequestMethod();

        // Manejar la solicitud de preflight (OPTIONS)
        if (metodo.equals("OPTIONS")) {
            manejarOptions(intercambio);
            return;
        }

        switch (metodo) {
            case "GET":
                manejarGet(intercambio);
                break;
            case "POST":
                manejarPost(intercambio);
                break;
            case "DELETE":
                manejarDelete(intercambio);
                break;
            default:
                enviarError(intercambio, 405, "Método no permitido");
        }
    }

    

      private void manejarGet(HttpExchange intercambio) throws IOException {
    try {
        String uri = intercambio.getRequestURI().toString();
        String[] partes = uri.split("/"); // Ajusta el delimitador según tu estructura de URL
        
        if (partes.length == 3 && partes[2].matches("\\d+")) { // Si hay un ID en la URL
            int imagenId = Integer.parseInt(partes[2]);
            Imagen imagen = imagenServicio.obtenerImagen(imagenId);
            if (imagen != null) {
                String respuestaJson = gson.toJson(imagen);
                intercambio.getResponseHeaders().add("Content-Type", "application/json");
                enviarRespuesta(intercambio, 200, respuestaJson);
            } else {
                enviarError(intercambio, 404, "Imagen no encontrada");
            }
        } else if (uri.contains("porTipoProducto")) {
            // Manejar solicitud de imagen por tipo de producto
            String query = intercambio.getRequestURI().getQuery();
            if (query != null && query.contains("tipoProductoId=")) {
                String[] params = query.split("=");
                if (params.length == 2) {
                    int tipoProductoId = Integer.parseInt(params[1]);
                    Imagen imagen = imagenServicio.obtenerImagenPorTipoProducto(tipoProductoId);
                    if (imagen != null) {
                        String respuestaJson = gson.toJson(imagen);
                        intercambio.getResponseHeaders().add("Content-Type", "application/json");
                        enviarRespuesta(intercambio, 200, respuestaJson);
                    } else {
                        enviarError(intercambio, 404, "Imagen no encontrada para este tipo de producto");
                    }
                } else {
                    enviarError(intercambio, 400, "Solicitud mal formada");
                }
            } else {
                enviarError(intercambio, 400, "Parámetro tipoProductoId requerido");
            }
        } else {
            // Listar todas las imágenes (implementar si es necesario)
            enviarError(intercambio, 404, "Endpoint no implementado");
        }
    } catch (SQLException e) {
        e.printStackTrace(); // Log exception details
        enviarError(intercambio, 500, "Error interno del servidor: " + e.getMessage());
    } catch (NumberFormatException e) {
        enviarError(intercambio, 400, "ID de imagen inválido");
    }
}

   private void manejarPost(HttpExchange intercambio) throws IOException {
    InputStream is = intercambio.getRequestBody();
    String cuerpo = new BufferedReader(new InputStreamReader(is)).lines().collect(Collectors.joining("\n"));
    is.close();

    try {
        Imagen imagen = gson.fromJson(cuerpo, Imagen.class);
        
        // Llama al método que ahora retorna el ID de la imagen
        int imagenId = imagenServicio.agregarImagen(imagen);
        
        // Envía el ID como respuesta
        enviarRespuesta(intercambio, 201, String.valueOf(imagenId));
        
    } catch (SQLException e) {
        e.printStackTrace(); // Log exception details
        enviarError(intercambio, 500, "Error interno del servidor: " + e.getMessage());
    }
}



    private void manejarDelete(HttpExchange intercambio) throws IOException {
        String idStr = intercambio.getRequestURI().getPath().split("/")[2];
        int id = Integer.parseInt(idStr);

        try {
            imagenServicio.eliminarImagen(id);
            String jsonResponse = gson.toJson(Collections.singletonMap("message", "Imagen eliminada"));
            enviarRespuesta(intercambio, 204, jsonResponse);
        } catch (SQLException e) {
            e.printStackTrace();
            enviarError(intercambio, 500, "Error interno del servidor: " + e.getMessage());
        }
    }

}

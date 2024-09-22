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
import com.google.gson.Gson;
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

        // Crear controladores para productos, tipos de productos e imágenes
        ProductoControlador productoControlador = new ProductoControlador();
        TipoProductoControlador tipoProductoControlador = new TipoProductoControlador();
        ImagenControlador imagenControlador = new ImagenControlador();

        // Rutas de la API
        servidor.createContext("/producto", productoControlador);
        servidor.createContext("/tipo_producto", tipoProductoControlador);
        servidor.createContext("/imagenes", imagenControlador);

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
        intercambio.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        intercambio.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");
        enviarRespuesta(intercambio, 204, "");
    }

    protected void enviarRespuesta(HttpExchange intercambio, int codigo, String mensaje) throws IOException {
        intercambio.getResponseHeaders().add("Access-Control-Allow-Origin", "http://localhost:5173");
        intercambio.sendResponseHeaders(codigo, mensaje.getBytes().length);
        try (OutputStream os = intercambio.getResponseBody()) {
            os.write(mensaje.getBytes());
        }
    }

    protected void enviarError(HttpExchange intercambio, int codigo, String mensaje) throws IOException {
        intercambio.getResponseHeaders().add("Access-Control-Allow-Origin", "http://localhost:5173");
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
        } 
    } catch (SQLException e) {
        e.printStackTrace(); // Log exception details
        enviarError(intercambio, 500, "Error interno del servidor: " + e.getMessage());
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

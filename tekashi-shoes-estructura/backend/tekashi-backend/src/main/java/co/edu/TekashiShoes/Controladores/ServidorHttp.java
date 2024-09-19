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

// Controlador de Productos
class ProductoControlador implements HttpHandler {
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

    private void manejarGet(HttpExchange intercambio) throws IOException {
        try {
            List<Producto> productos = productoServicio.listarProductos();
            String respuestaJson = gson.toJson(productos);
            intercambio.getResponseHeaders().add("Content-Type", "application/json");
            enviarRespuesta(intercambio, 200, respuestaJson);
        } catch (SQLException e) {
            enviarError(intercambio, 500, "Error interno del servidor: " + e.getMessage());
        }
    }

    private void manejarPost(HttpExchange intercambio) throws IOException {
        InputStream is = intercambio.getRequestBody();
        String cuerpo = new BufferedReader(new InputStreamReader(is)).lines().collect(Collectors.joining("\n"));
        is.close();

        try {
            Producto producto = gson.fromJson(cuerpo, Producto.class);
            productoServicio.agregarProducto(producto);
            enviarRespuesta(intercambio, 201, "Producto creado");
        } catch (SQLException e) {
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
            enviarRespuesta(intercambio, 200, "Producto actualizado");
        } catch (SQLException e) {
            enviarError(intercambio, 500, "Error interno del servidor: " + e.getMessage());
        }
    }

    private void manejarDelete(HttpExchange intercambio) throws IOException {
        String idStr = intercambio.getRequestURI().getPath().split("/")[2];
        int id = Integer.parseInt(idStr);

        try {
            productoServicio.eliminarProducto(id);
            enviarRespuesta(intercambio, 204, "Producto eliminado");
        } catch (SQLException e) {
            enviarError(intercambio, 500, "Error interno del servidor: " + e.getMessage());
        }
    }

    private void enviarRespuesta(HttpExchange intercambio, int codigo, String mensaje) throws IOException {
        intercambio.sendResponseHeaders(codigo, mensaje.getBytes().length);
        OutputStream os = intercambio.getResponseBody();
        os.write(mensaje.getBytes());
        os.close();
    }

    private void enviarError(HttpExchange intercambio, int codigo, String mensaje) throws IOException {
        intercambio.sendResponseHeaders(codigo, mensaje.getBytes().length);
        OutputStream os = intercambio.getResponseBody();
        os.write(mensaje.getBytes());
        os.close();
    }
}

// Controlador de TipoProducto
class TipoProductoControlador implements HttpHandler {
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

    private void manejarGet(HttpExchange intercambio) throws IOException {
        try {
            List<TipoProducto> tiposProducto = tipoProductoServicio.listarTiposProducto();
            String respuestaJson = gson.toJson(tiposProducto);
            intercambio.getResponseHeaders().add("Content-Type", "application/json");
            enviarRespuesta(intercambio, 200, respuestaJson);
        } catch (SQLException e) {
            enviarError(intercambio, 500, "Error interno del servidor: " + e.getMessage());
        }
    }

    private void manejarPost(HttpExchange intercambio) throws IOException {
        InputStream is = intercambio.getRequestBody();
        String cuerpo = new BufferedReader(new InputStreamReader(is)).lines().collect(Collectors.joining("\n"));
        is.close();

        try {
            TipoProducto tipoProducto = gson.fromJson(cuerpo, TipoProducto.class);
            tipoProductoServicio.agregarTipoProducto(tipoProducto);
            enviarRespuesta(intercambio, 201, "Tipo de producto creado");
        } catch (SQLException e) {
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
            TipoProducto tipoProducto = gson.fromJson(cuerpo, TipoProducto.class);
            tipoProductoServicio.actualizarTipoProducto(id, tipoProducto);
            enviarRespuesta(intercambio, 200, "Tipo de producto actualizado");
        } catch (SQLException e) {
            enviarError(intercambio, 500, "Error interno del servidor: " + e.getMessage());
        }
    }

    private void manejarDelete(HttpExchange intercambio) throws IOException {
        String idStr = intercambio.getRequestURI().getPath().split("/")[2];
        int id = Integer.parseInt(idStr);

        try {
            tipoProductoServicio.eliminarTipoProducto(id);
            enviarRespuesta(intercambio, 204, "Tipo de producto eliminado");
        } catch (SQLException e) {
            enviarError(intercambio, 500, "Error interno del servidor: " + e.getMessage());
        }
    }

    private void enviarRespuesta(HttpExchange intercambio, int codigo, String mensaje) throws IOException {
        intercambio.sendResponseHeaders(codigo, mensaje.getBytes().length);
        OutputStream os = intercambio.getResponseBody();
        os.write(mensaje.getBytes());
        os.close();
    }

    private void enviarError(HttpExchange intercambio, int codigo, String mensaje) throws IOException {
        intercambio.sendResponseHeaders(codigo, mensaje.getBytes().length);
        OutputStream os = intercambio.getResponseBody();
        os.write(mensaje.getBytes());
        os.close();
    }
}

// Controlador de Imágenes
class ImagenControlador implements HttpHandler {
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
            List<Imagen> imagenes = imagenServicio.listarImagenes();
            String respuestaJson = gson.toJson(imagenes);
            intercambio.getResponseHeaders().add("Content-Type", "application/json");
            enviarRespuesta(intercambio, 200, respuestaJson);
        } catch (SQLException e) {
            enviarError(intercambio, 500, "Error interno del servidor: " + e.getMessage());
        }
    }

    private void manejarPost(HttpExchange intercambio) throws IOException {
        InputStream is = intercambio.getRequestBody();
        String cuerpo = new BufferedReader(new InputStreamReader(is)).lines().collect(Collectors.joining("\n"));
        is.close();

        try {
            Imagen imagen = gson.fromJson(cuerpo, Imagen.class);
            imagenServicio.agregarImagen(imagen);
            enviarRespuesta(intercambio, 201, "Imagen creada");
        } catch (SQLException e) {
            enviarError(intercambio, 500, "Error interno del servidor: " + e.getMessage());
        }
    }

    private void manejarDelete(HttpExchange intercambio) throws IOException {
        String idStr = intercambio.getRequestURI().getPath().split("/")[2];
        int id = Integer.parseInt(idStr);

        try {
            imagenServicio.eliminarImagen(id);
            enviarRespuesta(intercambio, 204, "Imagen eliminada");
        } catch (SQLException e) {
            enviarError(intercambio, 500, "Error interno del servidor: " + e.getMessage());
        }
    }

    private void enviarRespuesta(HttpExchange intercambio, int codigo, String mensaje) throws IOException {
        intercambio.sendResponseHeaders(codigo, mensaje.getBytes().length);
        OutputStream os = intercambio.getResponseBody();
        os.write(mensaje.getBytes());
        os.close();
    }

    private void enviarError(HttpExchange intercambio, int codigo, String mensaje) throws IOException {
        intercambio.sendResponseHeaders(codigo, mensaje.getBytes().length);
        OutputStream os = intercambio.getResponseBody();
        os.write(mensaje.getBytes());
        os.close();
    }
}

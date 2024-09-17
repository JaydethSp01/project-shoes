package co.edu.TekashiShoes.Controladores;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import co.edu.TekashiShoes.servicioImp.ProductoServiceImp;
import co.edu.TekashiShoes.repositorios.ProductoRepositorio;
import co.edu.TekashiShoes.dominio.Producto;
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
    public static void main(String[] args) throws IOException, SQLException {
        HttpServer servidor = HttpServer.create(new InetSocketAddress(8080), 0);

        // Crear el controlador de productos
        ProductoControlador productoControlador = new ProductoControlador();

        // Rutas de la API
        servidor.createContext("/productos", productoControlador);

        // Iniciar servidor
        servidor.setExecutor(null);
        servidor.start();
        System.out.println("Servidor iniciado en http://localhost:8080");
    }
}


class ProductoControlador implements HttpHandler {
    private ProductoServiceImp productoServicio;
    private Gson gson;

    public ProductoControlador() throws SQLException {
        ProductoRepositorio productoRepositorio = new ProductoRepositorio();
        productoServicio = new ProductoServiceImp(productoRepositorio);
        gson = new Gson();
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
                intercambio.sendResponseHeaders(405, -1); // Método no permitido
        }
    }

    private void manejarGet(HttpExchange intercambio) throws IOException {
        try {
            List<Producto> productos = productoServicio.listarProductos();
            String respuestaJson = gson.toJson(productos);
            intercambio.getResponseHeaders().add("Content-Type", "application/json");
            intercambio.sendResponseHeaders(200, respuestaJson.getBytes().length);
            OutputStream os = intercambio.getResponseBody();
            os.write(respuestaJson.getBytes());
            os.close();
        } catch (SQLException e) {
            intercambio.sendResponseHeaders(500, -1); // Error interno del servidor
            System.err.println("Error al listar productos: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void manejarPost(HttpExchange intercambio) throws IOException {
        InputStream is = intercambio.getRequestBody();
        String cuerpo = new BufferedReader(new InputStreamReader(is)).lines().collect(Collectors.joining("\n"));
        is.close();

        try {
            Producto producto = gson.fromJson(cuerpo, Producto.class);
            productoServicio.agregarProducto(producto);
            intercambio.sendResponseHeaders(201, -1); // Creado
        } catch (SQLException e) {
            intercambio.sendResponseHeaders(500, -1); // Error interno del servidor
            System.err.println("Error al agregar producto: " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            intercambio.sendResponseHeaders(400, -1); // Solicitud incorrecta
            System.err.println("Error al procesar la solicitud POST: " + e.getMessage());
            e.printStackTrace();
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
            intercambio.sendResponseHeaders(200, -1); // OK
        } catch (SQLException e) {
            intercambio.sendResponseHeaders(500, -1); // Error interno del servidor
            System.err.println("Error al actualizar producto: " + e.getMessage());
            e.printStackTrace();
        } catch (NumberFormatException e) {
            intercambio.sendResponseHeaders(400, -1); // Solicitud incorrecta
            System.err.println("Error en el formato del ID: " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            intercambio.sendResponseHeaders(400, -1); // Solicitud incorrecta
            System.err.println("Error al procesar la solicitud PUT: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void manejarDelete(HttpExchange intercambio) throws IOException {
        String idStr = intercambio.getRequestURI().getPath().split("/")[2];
        int id = Integer.parseInt(idStr);

        try {
            productoServicio.eliminarProducto(id);
            intercambio.sendResponseHeaders(204, -1); // Sin contenido
        } catch (SQLException e) {
            intercambio.sendResponseHeaders(500, -1); // Error interno del servidor
            System.err.println("Error al eliminar producto: " + e.getMessage());
            e.printStackTrace();
        } catch (NumberFormatException e) {
            intercambio.sendResponseHeaders(400, -1); // Solicitud incorrecta
            System.err.println("Error en el formato del ID: " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            intercambio.sendResponseHeaders(400, -1); // Solicitud incorrecta
            System.err.println("Error al procesar la solicitud DELETE: " + e.getMessage());
            e.printStackTrace();
        }
    }
}

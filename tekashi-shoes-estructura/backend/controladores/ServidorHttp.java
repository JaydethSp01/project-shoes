package controladores;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import serviciosImp.ProductoServicioImp;
import repositorios.ProductoRepositorio;
import modelos.Producto;
import com.google.gson.Gson;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.sql.SQLException;
import java.util.List;

public class ServidorHttp {
    public static void main(String[] args) throws IOException, SQLException {
        HttpServer servidor = HttpServer.create(new InetSocketAddress(8080), 0);

        // Rutas de la API
        servidor.createContext("/productos", new ProductoControlador());

        // Iniciar servidor
        servidor.setExecutor(null);
        servidor.start();
        System.out.println("Servidor iniciado en http://localhost:8080");
    }
}

class ProductoControlador implements HttpHandler {
    private ProductoServicioImp productoServicio;
    private Gson gson;

    public ProductoControlador() throws SQLException {
        ProductoRepositorio productoRepositorio = new ProductoRepositorio();
        productoServicio = new ProductoServicioImp(productoRepositorio);
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
            e.printStackTrace();
        }
    }

    private void manejarPost(HttpExchange intercambio) throws IOException {
        // Implementación para crear un producto
    }

    private void manejarPut(HttpExchange intercambio) throws IOException {
        // Implementación para actualizar un producto
    }

    private void manejarDelete(HttpExchange intercambio) throws IOException {
        // Implementación para eliminar un producto
    }
}

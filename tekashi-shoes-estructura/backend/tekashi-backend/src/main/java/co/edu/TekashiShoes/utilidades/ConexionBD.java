package co.edu.TekashiShoes.utilidades;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConexionBD {
    private static final String URL = "jdbc:mysql://localhost:3306/tekashi_shoes_bd";
    private static final String USERNAME = "root";
    private static final String PASSWORD = "";
    
    // Cargar el driver de MySQL
    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("Error cargando el driver de MySQL: " + e.getMessage());
        }
    }
    
    /**
     * Obtiene una conexión a la base de datos
     * @return Connection objeto de conexión
     * @throws SQLException si hay error al conectar
     */
    public static Connection obtenerConexion() throws SQLException {
        return DriverManager.getConnection(URL, USERNAME, PASSWORD);
    }
    
    /**
     * Verifica si la conexión a la base de datos está disponible
     * @return true si la conexión es exitosa, false en caso contrario
     */
    public static boolean verificarConexion() {
        try (Connection conn = obtenerConexion()) {
            return conn != null && !conn.isClosed();
        } catch (SQLException e) {
            System.err.println("Error verificando conexión: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Cierra una conexión de manera segura
     * @param conn la conexión a cerrar
     */
    public static void cerrarConexion(Connection conn) {
        if (conn != null) {
            try {
                conn.close();
            } catch (SQLException e) {
                System.err.println("Error cerrando conexión: " + e.getMessage());
            }
        }
    }
}

package co.edu.TekashiShoes.servicios;

import co.edu.TekashiShoes.modelos.Usuario;

import java.sql.SQLException;
import java.util.List;

public interface UsuarioServicio {
    Usuario crear(Usuario usuario) throws SQLException;
    Usuario buscarPorId(int id) throws SQLException;
    Usuario buscarPorEmail(String email) throws SQLException;
    List<Usuario> listarTodos() throws SQLException;
    Usuario actualizar(Usuario usuario) throws SQLException;
    boolean eliminar(int id) throws SQLException;
    boolean existeEmail(String email) throws SQLException;
    int contarUsuarios() throws SQLException;
    int contarUsuariosActivos() throws SQLException;
    int contarNuevosUsuariosMes() throws SQLException;
    boolean actualizarUltimoLogin(int id) throws SQLException;
    boolean agregarPuntosFidelidad(int id, int puntos) throws SQLException;
    boolean actualizarNivelUsuario(int id, String nivel) throws SQLException;
}

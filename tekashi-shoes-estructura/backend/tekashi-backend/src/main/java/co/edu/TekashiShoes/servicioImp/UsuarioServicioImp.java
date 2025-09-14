package co.edu.TekashiShoes.servicioImp;

import co.edu.TekashiShoes.modelos.Usuario;
import co.edu.TekashiShoes.repositorios.UsuarioRepositorio;
import co.edu.TekashiShoes.servicios.UsuarioServicio;

import java.sql.SQLException;
import java.util.List;

public class UsuarioServicioImp implements UsuarioServicio {
    private final UsuarioRepositorio repositorio;

    public UsuarioServicioImp() {
        this.repositorio = new UsuarioRepositorio();
    }

    @Override
    public Usuario crear(Usuario usuario) throws SQLException {
        return repositorio.crear(usuario);
    }

    @Override
    public Usuario buscarPorId(int id) throws SQLException {
        return repositorio.buscarPorId(id);
    }

    @Override
    public Usuario buscarPorEmail(String email) throws SQLException {
        return repositorio.buscarPorEmail(email);
    }

    @Override
    public List<Usuario> listarTodos() throws SQLException {
        return repositorio.listarTodos();
    }

    @Override
    public Usuario actualizar(Usuario usuario) throws SQLException {
        return repositorio.actualizar(usuario);
    }

    @Override
    public boolean eliminar(int id) throws SQLException {
        return repositorio.eliminar(id);
    }

    @Override
    public boolean existeEmail(String email) throws SQLException {
        return repositorio.existeEmail(email);
    }

    @Override
    public int contarUsuarios() throws SQLException {
        return repositorio.contarUsuarios();
    }

    @Override
    public int contarUsuariosActivos() throws SQLException {
        return repositorio.contarUsuariosActivos();
    }

    @Override
    public int contarNuevosUsuariosMes() throws SQLException {
        return repositorio.contarNuevosUsuariosMes();
    }

    @Override
    public boolean actualizarUltimoLogin(int id) throws SQLException {
        return repositorio.actualizarUltimoLogin(id);
    }

    @Override
    public boolean agregarPuntosFidelidad(int id, int puntos) throws SQLException {
        return repositorio.agregarPuntosFidelidad(id, puntos);
    }

    @Override
    public boolean actualizarNivelUsuario(int id, String nivel) throws SQLException {
        return repositorio.actualizarNivelUsuario(id, nivel);
    }
}

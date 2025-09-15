package co.edu.TekashiShoes.servicioImp;

import co.edu.TekashiShoes.modelos.Notificacion;
import co.edu.TekashiShoes.repositorios.NotificacionRepositorio;
import co.edu.TekashiShoes.servicios.NotificacionServicio;

import java.sql.SQLException;
import java.util.List;

public class NotificacionServicioImp implements NotificacionServicio {
    private final NotificacionRepositorio repositorio;

    public NotificacionServicioImp() {
        this.repositorio = new NotificacionRepositorio();
    }

    @Override
    public Notificacion crear(Notificacion notificacion) throws SQLException {
        return repositorio.crear(notificacion);
    }

    @Override
    public Notificacion buscarPorId(int id) throws SQLException {
        return repositorio.buscarPorId(id);
    }

    @Override
    public List<Notificacion> listarTodos() throws SQLException {
        return repositorio.listarTodos();
    }

    @Override
    public List<Notificacion> listarPorUsuario(int usuarioId) throws SQLException {
        return repositorio.listarPorUsuario(usuarioId);
    }

    @Override
    public List<Notificacion> listarNoLeidas(int usuarioId) throws SQLException {
        return repositorio.listarNoLeidas(usuarioId);
    }

    @Override
    public Notificacion actualizar(Notificacion notificacion) throws SQLException {
        return repositorio.actualizar(notificacion);
    }

    @Override
    public boolean marcarComoLeida(int id) throws SQLException {
        return repositorio.marcarComoLeida(id);
    }

    @Override
    public boolean marcarTodasComoLeidas(int usuarioId) throws SQLException {
        return repositorio.marcarTodasComoLeidas(usuarioId);
    }

    @Override
    public boolean eliminar(int id) throws SQLException {
        return repositorio.eliminar(id);
    }

    @Override
    public int contarNoLeidas(int usuarioId) throws SQLException {
        return repositorio.contarNoLeidas(usuarioId);
    }
}


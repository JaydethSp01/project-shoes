package co.edu.TekashiShoes.servicios;

import co.edu.TekashiShoes.modelos.Notificacion;

import java.sql.SQLException;
import java.util.List;

public interface NotificacionServicio {
    Notificacion crear(Notificacion notificacion) throws SQLException;
    Notificacion buscarPorId(int id) throws SQLException;
    List<Notificacion> listarTodos() throws SQLException;
    List<Notificacion> listarPorUsuario(int usuarioId) throws SQLException;
    List<Notificacion> listarNoLeidas(int usuarioId) throws SQLException;
    Notificacion actualizar(Notificacion notificacion) throws SQLException;
    boolean marcarComoLeida(int id) throws SQLException;
    boolean marcarTodasComoLeidas(int usuarioId) throws SQLException;
    boolean eliminar(int id) throws SQLException;
    int contarNoLeidas(int usuarioId) throws SQLException;
}


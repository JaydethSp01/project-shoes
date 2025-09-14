package co.edu.TekashiShoes.servicios;

import co.edu.TekashiShoes.modelos.Wishlist;

import java.sql.SQLException;
import java.util.List;

public interface WishlistServicio {
    Wishlist crear(Wishlist wishlist) throws SQLException;
    Wishlist buscarPorId(int id) throws SQLException;
    List<Wishlist> listarTodos() throws SQLException;
    List<Wishlist> listarPorUsuario(int usuarioId) throws SQLException;
    Wishlist actualizar(Wishlist wishlist) throws SQLException;
    boolean eliminar(int id) throws SQLException;
    boolean agregarProducto(int wishlistId, int productoId) throws SQLException;
    boolean removerProducto(int wishlistId, int productoId) throws SQLException;
    int contarProductos(int wishlistId) throws SQLException;
    boolean existeProductoEnWishlist(int wishlistId, int productoId) throws SQLException;
}

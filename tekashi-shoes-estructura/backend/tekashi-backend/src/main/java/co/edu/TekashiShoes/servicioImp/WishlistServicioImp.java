package co.edu.TekashiShoes.servicioImp;

import co.edu.TekashiShoes.modelos.Wishlist;
import co.edu.TekashiShoes.repositorios.WishlistRepositorio;
import co.edu.TekashiShoes.servicios.WishlistServicio;

import java.sql.SQLException;
import java.util.List;

public class WishlistServicioImp implements WishlistServicio {
    private final WishlistRepositorio repositorio;

    public WishlistServicioImp() {
        this.repositorio = new WishlistRepositorio();
    }

    @Override
    public Wishlist crear(Wishlist wishlist) throws SQLException {
        return repositorio.crear(wishlist);
    }

    @Override
    public Wishlist buscarPorId(int id) throws SQLException {
        return repositorio.buscarPorId(id);
    }

    @Override
    public List<Wishlist> listarTodos() throws SQLException {
        return repositorio.listarTodos();
    }

    @Override
    public List<Wishlist> listarPorUsuario(int usuarioId) throws SQLException {
        return repositorio.listarPorUsuario(usuarioId);
    }

    @Override
    public Wishlist actualizar(Wishlist wishlist) throws SQLException {
        return repositorio.actualizar(wishlist);
    }

    @Override
    public boolean eliminar(int id) throws SQLException {
        return repositorio.eliminar(id);
    }

    @Override
    public boolean agregarProducto(int wishlistId, int productoId) throws SQLException {
        return repositorio.agregarProducto(wishlistId, productoId);
    }

    @Override
    public boolean removerProducto(int wishlistId, int productoId) throws SQLException {
        return repositorio.removerProducto(wishlistId, productoId);
    }

    @Override
    public int contarProductos(int wishlistId) throws SQLException {
        return repositorio.contarProductos(wishlistId);
    }

    @Override
    public boolean existeProductoEnWishlist(int wishlistId, int productoId) throws SQLException {
        return repositorio.existeProductoEnWishlist(wishlistId, productoId);
    }
}

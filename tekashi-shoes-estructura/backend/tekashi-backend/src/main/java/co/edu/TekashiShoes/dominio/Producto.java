package co.edu.TekashiShoes.dominio;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Representa un producto en el sistema.
 */
@Entity
@Table(name = "producto") // Nombre de la tabla en la base de datos
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_PRODUCTO")
    private int idProducto;

    @Column(name = "TIPO_PRODUCTO")
    private int tipoProducto; // FK a tipo_producto

    @Column(name = "MARCA")
    private String marca;

    @Column(name = "COLOR")
    private String color;

    @Column(name = "PRECIO")
    private double precio;

    @Column(name = "STOCK")
    private int stock;

    @Column(name = "ID_IMAGEN")
    private int idImagen; // Relacionado con imágenes

    // Constructor sin argumentos
    public Producto() {
    }

    // Constructor con todos los parámetros
    public Producto(int idProducto, int tipoProducto, String marca, String color, double precio, int stock, int idImagen) {
        this.idProducto = idProducto;
        this.tipoProducto = tipoProducto;
        this.marca = marca;
        this.color = color;
        this.precio = precio;
        this.stock = stock;
        this.idImagen = idImagen;
    }

    // Getters y Setters
    public int getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(int idProducto) {
        this.idProducto = idProducto;
    }

    public int getTipoProducto() {
        return tipoProducto;
    }

    public void setTipoProducto(int tipoProducto) {
        this.tipoProducto = tipoProducto;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public double getPrecio() {
        return precio;
    }

    public void setPrecio(double precio) {
        this.precio = precio;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public int getIdImagen() {
        return idImagen;
    }

    public void setIdImagen(int idImagen) {
        this.idImagen = idImagen;
    }
}

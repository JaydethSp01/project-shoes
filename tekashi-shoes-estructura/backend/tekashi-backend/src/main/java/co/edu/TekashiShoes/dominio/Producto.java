package co.edu.TekashiShoes.dominio;

public class Producto {
    private int idProducto;
    private int tipoProductoId;
    private String marca;
    private String color;
    private double precio;
    private int stock;
    private int imagenId;

    public Producto(int idProducto, int tipoProductoId, String marca, String color, double precio, int stock, int imagenId) {
        this.idProducto = idProducto;
        this.tipoProductoId = tipoProductoId;
        this.marca = marca;
        this.color = color;
        this.precio = precio;
        this.stock = stock;
        this.imagenId = imagenId;
    }

    // Getters y Setters

    public int getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(int idProducto) {
        this.idProducto = idProducto;
    }

    public int getTipoProductoId() {
        return tipoProductoId;
    }

    public void setTipoProductoId(int tipoProductoId) {
        this.tipoProductoId = tipoProductoId;
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

    public int getImagenId() {
        return imagenId;
    }

    public void setImagenId(int imagenId) {
        this.imagenId = imagenId;
    }
}



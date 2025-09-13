package co.edu.TekashiShoes.dominio;

public class Review {
    private int idReview;
    private int idProducto;
    private int idUsuario;
    private int rating;
    private String comentario;
    private String fecha;
    private boolean verificado;
    private int util;
    private int noUtil;

    // Constructores
    public Review() {}

    public Review(int idReview, int idProducto, int idUsuario, int rating, 
                  String comentario, String fecha, boolean verificado, int util, int noUtil) {
        this.idReview = idReview;
        this.idProducto = idProducto;
        this.idUsuario = idUsuario;
        this.rating = rating;
        this.comentario = comentario;
        this.fecha = fecha;
        this.verificado = verificado;
        this.util = util;
        this.noUtil = noUtil;
    }

    // Getters y Setters
    public int getIdReview() {
        return idReview;
    }

    public void setIdReview(int idReview) {
        this.idReview = idReview;
    }

    public int getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(int idProducto) {
        this.idProducto = idProducto;
    }

    public int getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(int idUsuario) {
        this.idUsuario = idUsuario;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public boolean isVerificado() {
        return verificado;
    }

    public void setVerificado(boolean verificado) {
        this.verificado = verificado;
    }

    public int getUtil() {
        return util;
    }

    public void setUtil(int util) {
        this.util = util;
    }

    public int getNoUtil() {
        return noUtil;
    }

    public void setNoUtil(int noUtil) {
        this.noUtil = noUtil;
    }

    @Override
    public String toString() {
        return "Review{" +
                "idReview=" + idReview +
                ", idProducto=" + idProducto +
                ", idUsuario=" + idUsuario +
                ", rating=" + rating +
                ", comentario='" + comentario + '\'' +
                ", fecha='" + fecha + '\'' +
                ", verificado=" + verificado +
                ", util=" + util +
                ", noUtil=" + noUtil +
                '}';
    }
}


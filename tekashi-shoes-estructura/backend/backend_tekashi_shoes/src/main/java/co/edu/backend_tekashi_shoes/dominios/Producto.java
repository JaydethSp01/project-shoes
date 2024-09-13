package co.edu.backend_tekashi_shoes.dominios;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "producto")
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ID_PRODUCTO;
    private String TIPO_PRODUCTO;
    private String MARCA;
    private String COLOR;
    private Double PRECIO;
    private int STOCK;
    private int ID_IMAGEN;

    //Getters y setters
    public int getID_PRODUCTO() {
        return ID_PRODUCTO;
    }
    public void setID_PRODUCTO(int iD_PRODUCTO) {
        ID_PRODUCTO = iD_PRODUCTO;
    }
    public String getTIPO_PRODUCTO() {
        return TIPO_PRODUCTO;
    }
    public void setTIPO_PRODUCTO(String tIPO_PRODUCTO) {
        TIPO_PRODUCTO = tIPO_PRODUCTO;
    }
    public String getMARCA() {
        return MARCA;
    }
    public void setMARCA(String mARCA) {
        MARCA = mARCA;
    }
    public String getCOLOR() {
        return COLOR;
    }
    public void setCOLOR(String cOLOR) {
        COLOR = cOLOR;
    }
    public Double getPRECIO() {
        return PRECIO;
    }
    public void setPRECIO(Double pRECIO) {
        PRECIO = pRECIO;
    }
    public int getSTOCK() {
        return STOCK;
    }
    public void setSTOCK(int sTOCK) {
        STOCK = sTOCK;
    }
    public int getID_IMAGEN() {
        return ID_IMAGEN;
    }
    public void setID_IMAGEN(int iD_IMAGEN) {
        ID_IMAGEN = iD_IMAGEN;
    }

    
}

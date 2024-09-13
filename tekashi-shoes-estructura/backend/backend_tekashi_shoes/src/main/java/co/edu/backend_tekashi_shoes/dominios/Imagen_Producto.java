package co.edu.backend_tekashi_shoes.dominios;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "imagen_producto")
public class Imagen_Producto {
    private int ID_IMAGEN;
    private String IMAGEN;

    //Getters y setters
    public int getID_IMAGEN() {
        return ID_IMAGEN;
    }
    public void setID_IMAGEN(int iD_IMAGEN) {
        ID_IMAGEN = iD_IMAGEN;
    }
    public String getIMAGEN() {
        return IMAGEN;
    }
    public void setIMAGEN(String iMAGEN) {
        IMAGEN = iMAGEN;
    }

    
    
}

package com.rarcos.gesmerca.dto;

import jakarta.validation.constraints.NotNull;

public class PriceEstimatedDto {

    @NotNull(message = "La estimación debe tener un id de producto")
    private String idProduct;
    @NotNull(message = "La estimación debe tener una cantidad de producto")
    private String quantity;

    public PriceEstimatedDto() {
    }

    public PriceEstimatedDto(@NotNull(message = "La estimación debe tener un id de producto") String idProduct,
            @NotNull(message = "La estimación debe tener una cantidad de producto") String quantity) {
        this.idProduct = idProduct;
        this.quantity = quantity;
    }

    public String getIdProduct() {
        return idProduct;
    }

    public void setIdProduct(String idProduct) {
        this.idProduct = idProduct;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

}

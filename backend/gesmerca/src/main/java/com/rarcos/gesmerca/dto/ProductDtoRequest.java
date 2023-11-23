package com.rarcos.gesmerca.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class ProductDtoRequest {
    @NotNull(message = "El producto debe tener un id")
    private Long id;
    @NotNull(message = "El producto debe tener un nombre")
    private String name;
    private String description;
    private Long supplier;
    private String image;
    @Min(value = 0, message = "El precio del producto debe ser mayor a 0")
    private Float price;
    @Min(value = -1, message = "El stock del producto no debe ser negativo")
    private int stock;

    public ProductDtoRequest() {
    }

    public ProductDtoRequest(@NotNull(message = "El producto debe tener un id") Long id,
            @NotNull(message = "El producto debe tener un nombre") String name, String description, Long supplier,
            String image, @Min(value = 0, message = "El precio del producto debe ser mayor a 0") Float price,
            @Min(value = -1, message = "El stock del producto no debe ser negativo") int stock) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.supplier = supplier;
        this.image = image;
        this.price = price;
        this.stock = stock;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getSupplier() {
        return supplier;
    }

    public void setSupplier(Long supplier) {
        this.supplier = supplier;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Float getPrice() {
        return price;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

}
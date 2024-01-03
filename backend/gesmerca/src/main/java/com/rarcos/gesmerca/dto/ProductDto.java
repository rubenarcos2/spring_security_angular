package com.rarcos.gesmerca.dto;

import java.time.ZonedDateTime;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class ProductDto {
    @NotNull(message = "El producto debe tener un id")
    private Long id;
    @NotNull(message = "El producto debe tener un nombre")
    private String name;
    private String description;
    private Long supplier;
    private String supplierName;
    private String image;
    private String thumbail_32x32;
    private String thumbail_64x64;
    private String thumbail_128x128;
    @Min(value = 0, message = "El precio del producto debe ser mayor a 0")
    private Float price;
    private Float priceMin;
    private Float priceMax;
    private Float priceAvg;
    @Min(value = -1, message = "El stock del producto no debe ser negativo")
    private int stock;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;

    public ProductDto() {
    }

    public ProductDto(@NotNull(message = "El producto debe tener un id") Long id,
            @NotNull(message = "El producto debe tener un nombre") String name, String description, Long supplier,
            String supplierName, String image, String thumbail_32x32, String thumbail_64x64, String thumbail_128x128,
            @Min(value = 0, message = "El precio del producto debe ser mayor a 0") Float price, Float priceMin,
            Float priceMax, Float priceAvg,
            @Min(value = -1, message = "El stock del producto no debe ser negativo") int stock, ZonedDateTime createdAt,
            ZonedDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.supplier = supplier;
        this.supplierName = supplierName;
        this.image = image;
        this.thumbail_32x32 = thumbail_32x32;
        this.thumbail_64x64 = thumbail_64x64;
        this.thumbail_128x128 = thumbail_128x128;
        this.price = price;
        this.priceMin = priceMin;
        this.priceMax = priceMax;
        this.priceAvg = priceAvg;
        this.stock = stock;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getThumbail_32x32() {
        return thumbail_32x32;
    }

    public void setThumbail_32x32(String thumbail_32x32) {
        this.thumbail_32x32 = thumbail_32x32;
    }

    public String getThumbail_64x64() {
        return thumbail_64x64;
    }

    public void setThumbail_64x64(String thumbail_64x64) {
        this.thumbail_64x64 = thumbail_64x64;
    }

    public String getThumbail_128x128() {
        return thumbail_128x128;
    }

    public void setThumbail_128x128(String thumbail_128x128) {
        this.thumbail_128x128 = thumbail_128x128;
    }

    public Float getPrice() {
        return price;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public Float getPriceMin() {
        return priceMin;
    }

    public void setPriceMin(Float priceMin) {
        this.priceMin = priceMin;
    }

    public Float getPriceMax() {
        return priceMax;
    }

    public void setPriceMax(Float priceMax) {
        this.priceMax = priceMax;
    }

    public Float getPriceAvg() {
        return priceAvg;
    }

    public void setPriceAvg(Float priceAvg) {
        this.priceAvg = priceAvg;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public ZonedDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public ZonedDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(ZonedDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

}

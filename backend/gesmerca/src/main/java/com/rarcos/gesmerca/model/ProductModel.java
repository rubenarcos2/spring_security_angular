package com.rarcos.gesmerca.model;

import java.time.ZonedDateTime;

import org.springframework.hateoas.RepresentationModel;

/**
 * The CustomerModel class extends the Hateoas Representation Model and is
 * required if we want to convert the Customer
 * Entity to a pagination format
 */

public class ProductModel extends RepresentationModel<ProductModel> {
    private Long id;
    private String name;
    private String description;
    private Long supplier;
    private String image;
    private String thumbail_64x64;
    private String thumbail_128x128;
    private float price;
    private int stock;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;

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

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
        this.price = price;
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

package com.rarcos.gesmerca.entity;

import java.time.ZonedDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private Long supplier;
    private String image;
    private String thumbail_64x64;
    private String thumbail_128x128;
    private float price;
    private int stock;
    @Column(updatable = false)
    @CreationTimestamp
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSSSS'Z'")
    private ZonedDateTime createdAt;
    @UpdateTimestamp
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSSSS'Z'")
    private ZonedDateTime updatedAt;

    public Product() {
    }

    public Product(String name, String description, Long supplier, String image,
            String thumbail_64x64, String thumbail_128x128, float price, int stock, ZonedDateTime createdAt,
            ZonedDateTime updatedAt) {
        this.name = name;
        this.description = description;
        this.supplier = supplier;
        this.image = image;
        this.thumbail_64x64 = thumbail_64x64;
        this.thumbail_128x128 = thumbail_128x128;
        this.price = price;
        this.stock = stock;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
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

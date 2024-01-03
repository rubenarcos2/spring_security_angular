package com.rarcos.gesmerca.entity;

import java.time.ZonedDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "supplier")
    private Supplier supplier;
    private String image;
    private String thumbail_32x32;
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

    public Product(String name, String description, Supplier supplier, String image, String thumbail_32x32,
            String thumbail_64x64, String thumbail_128x128, float price, int stock, ZonedDateTime createdAt,
            ZonedDateTime updatedAt) {
        this.name = name;
        this.description = description;
        this.supplier = supplier;
        this.image = image;
        this.thumbail_32x32 = thumbail_32x32;
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
        return supplier.getId();
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
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

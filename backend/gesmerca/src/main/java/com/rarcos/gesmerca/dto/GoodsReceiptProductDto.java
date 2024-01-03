package com.rarcos.gesmerca.dto;

import java.time.ZonedDateTime;

import jakarta.validation.constraints.NotNull;

public class GoodsReceiptProductDto {
    @NotNull(message = "El producto del albarán debe tener un id")
    private Long id;
    private Long idGoodsReceipt;
    private Long idProduct;
    private String nameProduct;
    private Integer quantity;
    private Float price;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;

    public GoodsReceiptProductDto() {
    }

    public GoodsReceiptProductDto(@NotNull(message = "El producto del albarán debe tener un id") Long id,
            Long idGoodsReceipt, Long idProduct, String nameProduct, Integer quantity, Float price,
            ZonedDateTime createdAt, ZonedDateTime updatedAt) {
        this.id = id;
        this.idGoodsReceipt = idGoodsReceipt;
        this.idProduct = idProduct;
        this.nameProduct = nameProduct;
        this.quantity = quantity;
        this.price = price;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdGoodsReceipt() {
        return idGoodsReceipt;
    }

    public void setIdGoodsReceipt(Long idGoodsReceipt) {
        this.idGoodsReceipt = idGoodsReceipt;
    }

    public Long getIdProduct() {
        return idProduct;
    }

    public void setIdProduct(Long idProduct) {
        this.idProduct = idProduct;
    }

    public String getNameProduct() {
        return nameProduct;
    }

    public void setNameProduct(String nameProduct) {
        this.nameProduct = nameProduct;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Float getPrice() {
        return price;
    }

    public void setPrice(Float price) {
        this.price = price;
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

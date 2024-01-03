package com.rarcos.gesmerca.dto;

import java.time.ZonedDateTime;

import jakarta.validation.constraints.NotNull;

public class GoodsReceiptProductDtoRequest {
    @NotNull(message = "El producto del albarán debe tener un id")
    private Long id;
    private Long idGoodsReceipt;
    private Long idProduct;
    private int quantity;
    private Float price;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;

    public GoodsReceiptProductDtoRequest() {
    }

    public GoodsReceiptProductDtoRequest(@NotNull(message = "El producto del albarán debe tener un id") Long id,
            Long goodsReceipt, Long product, int quantity, Float price, ZonedDateTime createdAt,
            ZonedDateTime updatedAt) {
        this.id = id;
        this.idGoodsReceipt = goodsReceipt;
        this.idProduct = product;
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

    public void setIdGoodsReceipt(Long goodsReceipt) {
        this.idGoodsReceipt = goodsReceipt;
    }

    public Long getIdProduct() {
        return idProduct;
    }

    public void setIdProduct(Long product) {
        this.idProduct = product;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
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

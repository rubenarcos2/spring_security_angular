package com.rarcos.gesmerca.entity;

import java.time.ZonedDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class GoodsReceiptProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "idgoodsreceipt")
    private GoodsReceipt goodsReceipt;
    @ManyToOne
    @JoinColumn(name = "idproduct")
    private Product product;
    private Integer quantity;
    private Float price;
    @Column(updatable = false)
    @CreationTimestamp
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSSSS'Z'")
    private ZonedDateTime createdAt;
    @UpdateTimestamp
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSSSS'Z'")
    private ZonedDateTime updatedAt;

    public GoodsReceiptProduct() {
    }

    public GoodsReceiptProduct(GoodsReceipt goodsReceipt, Product product, Integer quantity, Float price,
            ZonedDateTime createdAt, ZonedDateTime updatedAt) {
        this.goodsReceipt = goodsReceipt;
        this.product = product;
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

    public GoodsReceipt getGoodsReceipt() {
        return goodsReceipt;
    }

    public void setGoodsReceipt(GoodsReceipt goodsReceipt) {
        this.goodsReceipt = goodsReceipt;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product p1roduct) {
        this.product = p1roduct;
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

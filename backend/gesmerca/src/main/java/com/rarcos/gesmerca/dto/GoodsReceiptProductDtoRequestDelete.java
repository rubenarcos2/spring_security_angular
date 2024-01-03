package com.rarcos.gesmerca.dto;

public class GoodsReceiptProductDtoRequestDelete {
    private Long idGoodsReceiptProduct;
    private int quantity;

    public GoodsReceiptProductDtoRequestDelete() {
    }

    public GoodsReceiptProductDtoRequestDelete(Long idGoodsReceiptProduct, int quantity) {
        this.idGoodsReceiptProduct = idGoodsReceiptProduct;
        this.quantity = quantity;
    }

    public Long getIdGoodsReceiptProduct() {
        return idGoodsReceiptProduct;
    }

    public void setIdGoodsReceiptProduct(Long idGoodsReceiptProduct) {
        this.idGoodsReceiptProduct = idGoodsReceiptProduct;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

}

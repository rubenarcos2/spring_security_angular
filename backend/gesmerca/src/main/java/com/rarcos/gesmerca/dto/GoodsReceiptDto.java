package com.rarcos.gesmerca.dto;

import java.time.ZonedDateTime;
import jakarta.validation.constraints.NotNull;

public class GoodsReceiptDto {
    @NotNull(message = "El albarán debe tener un id")
    private Long id;
    private Long idSupplier;
    private String supplierName;
    private Long idUser;
    private String userName;
    private String date;
    private String time;
    @NotNull(message = "El albarán debe tener un número de documento")
    private String docnum;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;

    public GoodsReceiptDto() {
    }

    public GoodsReceiptDto(@NotNull(message = "El albarán debe tener un id") Long id, Long idSupplier,
            String supplierName, Long idUser, String userName, String date, String time,
            @NotNull(message = "El albarán debe tener un número de documento") String docnum, ZonedDateTime createdAt,
            ZonedDateTime updatedAt) {
        this.id = id;
        this.idSupplier = idSupplier;
        this.supplierName = supplierName;
        this.idUser = idUser;
        this.userName = userName;
        this.date = date;
        this.time = time;
        this.docnum = docnum;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdSupplier() {
        return idSupplier;
    }

    public void setIdSupplier(Long idSupplier) {
        this.idSupplier = idSupplier;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public Long getIdUser() {
        return idUser;
    }

    public void setIdUser(Long idUser) {
        this.idUser = idUser;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getDocnum() {
        return docnum;
    }

    public void setDocnum(String docNum) {
        this.docnum = docNum;
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

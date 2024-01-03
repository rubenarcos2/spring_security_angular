package com.rarcos.gesmerca.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

import jakarta.validation.constraints.NotNull;

public class GoodsReceiptDtoRequest {
    @NotNull(message = "El albarán debe tener un id")
    private Long id;
    private Long idSupplier;
    private String supplierName;
    private Long idUser;
    private String userName;
    private LocalDate date;
    private LocalTime time;
    @NotNull(message = "El albarán debe tener un número de documento")
    private String docnum;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;

    public GoodsReceiptDtoRequest() {
    }

    public GoodsReceiptDtoRequest(@NotNull(message = "El albarán debe tener un id") Long id, Long idSupplier,
            String supplierName, Long idUser, String userName, String date, String time,
            @NotNull(message = "El albarán debe tener un número de documento") String docnum, ZonedDateTime createdAt,
            ZonedDateTime updatedAt) {
        System.out.println(date + ", " + time);
        this.id = id;
        this.idSupplier = idSupplier;
        this.supplierName = supplierName;
        this.idUser = idUser;
        this.userName = userName;
        setDate(date);
        setTime(time);
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

    public LocalDate getDate() {
        return date;
    }

    public void setDate(String date) {
        try {
            this.date = LocalDate.parse(date);
        } catch (Exception e) {
            System.out.println(e);
        }
    }

    public LocalTime getTime() {
        return time;
    }

    public void setTime(String time) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");
            this.time = LocalTime.parse(time, formatter);
        } catch (Exception e) {
            System.out.println(e);
        }
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

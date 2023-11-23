package com.rarcos.gesmerca.dto;

import java.time.ZonedDateTime;

import jakarta.validation.constraints.NotNull;

public class SupplierDto {

    @NotNull(message = "El producto debe tener un CIF/NIF")
    private String cifNif;
    @NotNull(message = "El producto debe tener un nombre")
    private String name;
    @NotNull(message = "El producto debe tener una dirección")
    private String address;
    @NotNull(message = "El producto debe tener una ciudad")
    private String city;
    @NotNull(message = "El producto debe tener un teléfono")
    private String phone;
    private String email;
    private String web;
    private String notes;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;

    public SupplierDto(@NotNull(message = "El producto debe tener un CIF/NIF") String cif_nif,
            @NotNull(message = "El producto debe tener un nombre") String name,
            @NotNull(message = "El producto debe tener una dirección") String address,
            @NotNull(message = "El producto debe tener una ciudad") String city,
            @NotNull(message = "El producto debe tener un teléfono") String phone, String email, String web,
            String notes, ZonedDateTime createdAt, ZonedDateTime updatedAt) {
        this.cifNif = cif_nif;
        this.name = name;
        this.address = address;
        this.city = city;
        this.phone = phone;
        this.email = email;
        this.web = web;
        this.notes = notes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getCifNif() {
        return cifNif;
    }

    public void setCifNif(String cif_nif) {
        this.cifNif = cif_nif;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getWeb() {
        return web;
    }

    public void setWeb(String web) {
        this.web = web;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
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

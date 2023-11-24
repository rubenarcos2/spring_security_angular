package com.rarcos.gesmerca.dto;

import jakarta.validation.constraints.NotNull;

public class SupplierDtoRequest {

    @NotNull(message = "El producto debe tener un id")
    private Long id;
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

    public SupplierDtoRequest(@NotNull(message = "El producto debe tener un id") Long id,
            @NotNull(message = "El producto debe tener un CIF/NIF") String cifNif,
            @NotNull(message = "El producto debe tener un nombre") String name,
            @NotNull(message = "El producto debe tener una dirección") String address,
            @NotNull(message = "El producto debe tener una ciudad") String city,
            @NotNull(message = "El producto debe tener un teléfono") String phone, String email, String web,
            String notes) {
        this.id = id;
        this.cifNif = cifNif;
        this.name = name;
        this.address = address;
        this.city = city;
        this.phone = phone;
        this.email = email;
        this.web = web;
        this.notes = notes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCifNif() {
        return cifNif;
    }

    public void setCifNif(String cifNif) {
        this.cifNif = cifNif;
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

}

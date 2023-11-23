package com.rarcos.gesmerca.model;

import java.time.ZonedDateTime;

import org.springframework.hateoas.RepresentationModel;

/**
 * The CustomerModel class extends the Hateoas Representation Model and is
 * required if we want to convert the Customer
 * Entity to a pagination format
 */

public class SupplierModel extends RepresentationModel<SupplierModel> {
    private Long id;
    private String cifNif;
    private String name;
    private String address;
    private String city;
    private String phone;
    private String email;
    private String web;
    private String notes;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

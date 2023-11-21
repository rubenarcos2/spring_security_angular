package com.rarcos.gesmerca.dto;

import jakarta.validation.constraints.NotNull;

public class ConfigDto {

    @NotNull(message = "La configuración debe tener un nombre")
    private String name;
    private String value;
    private String title;
    private String description;
    private String domain;
    
    public ConfigDto() {
    }

    public ConfigDto(String name, String value, String title, String description, String domain) {
        this.name = name;
        this.value = value;
        this.title = title;
        this.description = description;
        this.domain = domain;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }
}

package com.rarcos.gesmerca.dto;

public class UserConfigDto {

    private Long id;
    private String name;
    private String value;
    private String title;
    private String description;
    private String domain;
    private Long userId;

    public UserConfigDto() {
    }

    public UserConfigDto(Long id, String name, String value, String title, String description, String domain,
            Long userId) {
        this.id = id;
        this.name = name;
        this.value = value;
        this.title = title;
        this.description = description;
        this.domain = domain;
        this.userId = userId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

}

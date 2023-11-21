package com.rarcos.gesmerca.security.dto;

import java.util.HashSet;
import java.util.Set;

import com.rarcos.gesmerca.security.entity.Role;
import com.rarcos.gesmerca.security.enums.RoleName;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class NewUser {
    @NotBlank(message = "Nombre obligatorio")
    private String name;
    @NotBlank(message = "Usuario obligatorio")
    private String userName;
    @Email(message = "Email inválido")
    private String email;
    @NotBlank
    private String password;
    private Set<Role> roles = new HashSet<>();

    public NewUser() {
        roles.add(new Role(RoleName.User));
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<Role> getRoles() {
        return roles;
    }

}

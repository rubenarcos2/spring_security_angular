package com.rarcos.gesmerca.security.dto;

import java.util.HashSet;
import java.util.Set;

import com.rarcos.gesmerca.security.entity.Role;
import com.rarcos.gesmerca.security.entity.Permission;

public class ProfileUser {
    private User user;
    private Set<Role> roles = new HashSet<>();
    private Set<Permission> permissions = new HashSet<>();

    public ProfileUser(User user, Set<Role> roles, Set<Permission> permissions) {
        this.user = user;
        this.roles = roles;
        this.permissions = permissions;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public Set<Permission> getPermissions() {
        return permissions;
    }

    public void setPermissions(Set<Permission> permissions) {
        this.permissions = permissions;
    }

}

package com.rarcos.gesmerca.security.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rarcos.gesmerca.security.entity.Permission;

public interface PermissionRepository extends JpaRepository<Permission, Long> {
    Optional<Permission> findByPermissionName(String permissionName);
}

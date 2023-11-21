package com.rarcos.gesmerca.security.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

import com.rarcos.gesmerca.security.entity.Permission;
import com.rarcos.gesmerca.security.repository.PermissionRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class PermissionService {

    @Autowired
    PermissionRepository permissionRepository;

    public Optional<Permission> getByPermissionName(String permissionName) {
        return permissionRepository.findByPermissionName(permissionName);
    }

    public void save(Permission permission) {
        permissionRepository.save(permission);
    }
}

package com.rarcos.gesmerca.security.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
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

    public Optional<Permission> getOne(Long id) {
        return permissionRepository.findById(id);
    }

    public List<Permission> getAll() {
        return permissionRepository.findAll();
    }

    public boolean existsById(Long id) {
        return permissionRepository.existsById(id);
    }

    public void save(Permission permission) {
        permissionRepository.save(permission);
    }
}

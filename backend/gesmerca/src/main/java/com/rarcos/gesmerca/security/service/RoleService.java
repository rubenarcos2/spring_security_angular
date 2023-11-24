package com.rarcos.gesmerca.security.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import com.rarcos.gesmerca.security.entity.Role;
import com.rarcos.gesmerca.security.enums.RoleName;
import com.rarcos.gesmerca.security.repository.RoleRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class RoleService {

    @Autowired
    RoleRepository roleRepository;

    public Optional<Role> getByRoleName(RoleName roleName) {
        return roleRepository.findByRoleName(roleName);
    }

    public Optional<Role> getOne(Long id) {
        return roleRepository.findById(id);
    }

    public List<Role> getAll() {
        return roleRepository.findAll();
    }

    public boolean existsById(Long id) {
        return roleRepository.existsById(id);
    }

    public boolean existsByName(String name) {
        return roleRepository.existsByRoleName(name);
    }

    public void save(Role rol) {
        roleRepository.save(rol);
    }
}

package com.rarcos.gesmerca.security.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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

    public void save(Role rol) {
        roleRepository.save(rol);
    }
}

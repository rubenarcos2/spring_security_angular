package com.rarcos.gesmerca.security.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rarcos.gesmerca.security.entity.Role;
import com.rarcos.gesmerca.security.enums.RoleName;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByRoleName(RoleName roleName);
}

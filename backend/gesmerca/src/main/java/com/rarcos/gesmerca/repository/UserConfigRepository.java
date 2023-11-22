package com.rarcos.gesmerca.repository;

import com.rarcos.gesmerca.entity.UserConfig;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserConfigRepository extends JpaRepository<UserConfig, Long> {
    Optional<UserConfig> findById(Long id);

    boolean existsById(Long id);

    List<UserConfig> findByName(String name);

    boolean existsByName(String name);
}
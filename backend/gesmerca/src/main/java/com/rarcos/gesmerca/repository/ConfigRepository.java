package com.rarcos.gesmerca.repository;

import com.rarcos.gesmerca.entity.Config;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConfigRepository extends JpaRepository<Config, Long> {
    Optional<Config> findById(Long id);

    boolean existsById(Long id);

    List<Config> findByName(String name);

    boolean existsByName(String name);
}
package com.rarcos.gesmerca.repository;

import com.rarcos.gesmerca.entity.Config;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ConfigRepository extends JpaRepository<Config, Integer>{
    List<Config> findByName(String name);
    boolean existsByName(String name);
}
package com.rarcos.gesmerca.repository;

import com.rarcos.gesmerca.entity.Supplier;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    List<Supplier> findByName(String name);

    boolean existsByName(String name);

    List<Supplier> findByCifNif(String cifNif);

    boolean existsByCifNif(String cifNif);
}
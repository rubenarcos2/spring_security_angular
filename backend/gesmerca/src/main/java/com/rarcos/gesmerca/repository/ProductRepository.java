package com.rarcos.gesmerca.repository;

import com.rarcos.gesmerca.entity.Product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByName(String name);

    boolean existsByName(String name);
}
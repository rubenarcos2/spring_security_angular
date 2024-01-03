package com.rarcos.gesmerca.repository;

import com.rarcos.gesmerca.entity.Product;
import com.rarcos.gesmerca.entity.Supplier;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByName(String name);

    Page<Product> findBySupplier(Supplier supplier, Pageable pageable);

    boolean existsByName(String name);
}
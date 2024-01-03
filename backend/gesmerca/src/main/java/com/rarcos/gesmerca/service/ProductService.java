package com.rarcos.gesmerca.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.rarcos.gesmerca.entity.Product;
import com.rarcos.gesmerca.entity.Supplier;
import com.rarcos.gesmerca.repository.ProductRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ProductService {

    @Autowired
    ProductRepository productRepository;

    public List<Product> list() {
        return productRepository.findAll();
    }

    public Page<Product> listPaginated(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    public Page<Product> listPaginatedBySupplier(Supplier supplier, Pageable pageable) {
        return productRepository.findBySupplier(supplier, pageable);
    }

    public Optional<Product> getOne(Long id) {
        return productRepository.findById(id);
    }

    public List<Product> getOneByName(String name) {
        return productRepository.findByName(name);
    }

    public void save(Product product) {
        productRepository.save(product);
    }

    public void delete(Long id) {
        productRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return productRepository.existsById(id);
    }

    public boolean existsByName(String name) {
        return productRepository.existsByName(name);
    }
}

package com.rarcos.gesmerca.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.rarcos.gesmerca.entity.Supplier;
import com.rarcos.gesmerca.repository.SupplierRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class SupplierService {

    @Autowired
    SupplierRepository supplierRepository;

    public List<Supplier> list() {
        return supplierRepository.findAll();
    }

    public Page<Supplier> listPaginated(Pageable pageable) {
        return supplierRepository.findAll(pageable);
    }

    public Optional<Supplier> getOne(Long id) {
        return supplierRepository.findById(id);
    }

    public List<Supplier> getOneByName(String name) {
        return supplierRepository.findByName(name);
    }

    public void save(Supplier product) {
        supplierRepository.save(product);
    }

    public void delete(Long id) {
        supplierRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return supplierRepository.existsById(id);
    }

    public boolean existsByName(String name) {
        return supplierRepository.existsByName(name);
    }

    public boolean existsByCifNif(String cif_nif) {
        return supplierRepository.existsByCifNif(cif_nif);
    }
}

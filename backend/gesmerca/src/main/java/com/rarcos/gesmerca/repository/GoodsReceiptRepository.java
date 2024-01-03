package com.rarcos.gesmerca.repository;

import com.rarcos.gesmerca.entity.GoodsReceipt;
import com.rarcos.gesmerca.entity.Supplier;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface GoodsReceiptRepository extends JpaRepository<GoodsReceipt, Long> {
    Optional<GoodsReceipt> findById(Long id);

    boolean existsById(Long id);

    List<GoodsReceipt> findByDocnum(String name);

    Page<GoodsReceipt> findBySupplier(Supplier supplier, Pageable pageable);

    boolean existsByDocnum(String docnum);

    boolean existsByDocnumAndSupplier(String docnum, Supplier idSupplier);
}
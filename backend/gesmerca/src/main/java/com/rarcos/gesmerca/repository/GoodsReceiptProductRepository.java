package com.rarcos.gesmerca.repository;

import com.rarcos.gesmerca.entity.GoodsReceipt;
import com.rarcos.gesmerca.entity.GoodsReceiptProduct;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GoodsReceiptProductRepository extends JpaRepository<GoodsReceiptProduct, Long> {
    Optional<GoodsReceiptProduct> findById(Long id);

    List<GoodsReceiptProduct> findByGoodsReceipt(GoodsReceipt product);

    boolean existsById(Long id);
}
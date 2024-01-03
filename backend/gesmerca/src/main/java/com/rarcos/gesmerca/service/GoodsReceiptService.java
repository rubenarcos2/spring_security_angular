package com.rarcos.gesmerca.service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.rarcos.gesmerca.entity.GoodsReceipt;
import com.rarcos.gesmerca.entity.GoodsReceiptProduct;
import com.rarcos.gesmerca.entity.Supplier;
import com.rarcos.gesmerca.repository.GoodsReceiptProductRepository;
import com.rarcos.gesmerca.repository.GoodsReceiptRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class GoodsReceiptService {

    @Autowired
    GoodsReceiptRepository goodsReceiptRepository;

    @Autowired
    GoodsReceiptProductRepository goodsReceiptProductRepository;

    public List<GoodsReceipt> list() {
        return goodsReceiptRepository.findAll();
    }

    public Page<GoodsReceipt> listPaginated(Pageable pageable) {
        return goodsReceiptRepository.findAll(pageable);
    }

    public Page<GoodsReceipt> listPaginatedBySupplier(Supplier supplier, Pageable pageable) {
        return goodsReceiptRepository.findBySupplier(supplier, pageable);
    }

    public Optional<GoodsReceipt> getOne(Long id) {
        return goodsReceiptRepository.findById(id);
    }

    public List<GoodsReceiptProduct> getGoodsReceiptProduct(GoodsReceipt goodReceipt) {
        return goodsReceiptProductRepository.findByGoodsReceipt(goodReceipt);
    }

    public List<GoodsReceipt> getOneByDocnum(String docnum) {
        return goodsReceiptRepository.findByDocnum(docnum);
    }

    public GoodsReceipt save(GoodsReceipt goodReceipt) {
        return goodsReceiptRepository.save(goodReceipt);
    }

    public void save(GoodsReceiptProduct product) {
        goodsReceiptProductRepository.save(product);
    }

    public void delete(Long id) {
        goodsReceiptRepository.deleteById(id);
    }

    public void deleteGoodsReceiptProduct(Long id) {
        goodsReceiptProductRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return goodsReceiptRepository.existsById(id);
    }

    public boolean existsByDocnum(String docnum) {
        return goodsReceiptRepository.existsByDocnum(docnum);
    }

    public boolean existsByDocnumAndSupplier(String docnum, Supplier supplier) {
        return goodsReceiptRepository.existsByDocnumAndSupplier(docnum, supplier);
    }
}

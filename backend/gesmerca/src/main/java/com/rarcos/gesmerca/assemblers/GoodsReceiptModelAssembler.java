package com.rarcos.gesmerca.assemblers;

import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.stereotype.Component;

import com.rarcos.gesmerca.controller.GoodsReceiptController;
import com.rarcos.gesmerca.entity.GoodsReceipt;
import com.rarcos.gesmerca.model.GoodsReceiptModel;
import com.rarcos.gesmerca.security.service.UserService;
import com.rarcos.gesmerca.service.SupplierService;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import java.time.LocalTime;

import org.springframework.beans.factory.annotation.Autowired;

@Component
public class GoodsReceiptModelAssembler extends RepresentationModelAssemblerSupport<GoodsReceipt, GoodsReceiptModel> {

    @Autowired
    SupplierService supplierService;

    @Autowired
    UserService userService;

    public GoodsReceiptModelAssembler() {
        super(GoodsReceiptController.class, GoodsReceiptModel.class);
    }

    @Override
    public GoodsReceiptModel toModel(GoodsReceipt goodsReceipt) {
        GoodsReceiptModel goodsReceiptModel = instantiateModel(goodsReceipt);

        goodsReceiptModel.add(linkTo(methodOn(GoodsReceiptController.class)
                .getById(goodsReceipt.getId()))
                .withSelfRel());

        goodsReceiptModel.setId(goodsReceipt.getId());
        goodsReceiptModel.setDocnum(goodsReceipt.getDocnum());
        goodsReceiptModel.setIdSupplier(goodsReceipt.getSupplier().getId());
        goodsReceiptModel.setSupplierName(supplierService.getOne(goodsReceipt.getSupplier().getId()).get().getName());
        goodsReceiptModel.setIdUser(goodsReceipt.getUser().getId());
        goodsReceiptModel.setUserName(userService.getById(goodsReceipt.getUser().getId()).get().getName());
        goodsReceiptModel.setDate(goodsReceipt.getDate());
        goodsReceiptModel.setTime(LocalTime.parse(goodsReceipt.getTime()));
        goodsReceiptModel.setCreatedAt(goodsReceipt.getCreatedAt());
        goodsReceiptModel.setUpdatedAt(goodsReceipt.getUpdatedAt());
        return goodsReceiptModel;
    }
}
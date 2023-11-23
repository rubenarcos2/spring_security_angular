package com.rarcos.gesmerca.assemblers;

import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.stereotype.Component;

import com.rarcos.gesmerca.controller.SupplierController;
import com.rarcos.gesmerca.entity.Supplier;
import com.rarcos.gesmerca.model.SupplierModel;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@Component
public class SupplierModelAssembler extends RepresentationModelAssemblerSupport<Supplier, SupplierModel> {

    public SupplierModelAssembler() {
        super(SupplierController.class, SupplierModel.class);
    }

    @Override
    public SupplierModel toModel(Supplier supplier) {
        SupplierModel supplierModel = instantiateModel(supplier);

        supplierModel.add(linkTo(methodOn(SupplierController.class)
                .getById(supplier.getId()))
                .withSelfRel());

        supplierModel.setId(supplier.getId());
        supplierModel.setCifNif(supplier.getCifNif());
        supplierModel.setName(supplier.getName());
        supplierModel.setAddress(supplier.getAddress());
        supplierModel.setCity(supplier.getCity());
        supplierModel.setPhone(supplier.getPhone());
        supplierModel.setEmail(supplier.getEmail());
        supplierModel.setWeb(supplier.getWeb());
        supplierModel.setNotes(supplier.getNotes());
        supplierModel.setCreatedAt(supplier.getCreatedAt());
        supplierModel.setUpdatedAt(supplier.getUpdatedAt());
        return supplierModel;
    }
}
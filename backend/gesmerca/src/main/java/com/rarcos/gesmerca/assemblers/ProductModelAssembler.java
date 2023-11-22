package com.rarcos.gesmerca.assemblers;

import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.stereotype.Component;

import com.rarcos.gesmerca.controller.ProductController;
import com.rarcos.gesmerca.entity.Product;
import com.rarcos.gesmerca.model.ProductModel;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@Component
public class ProductModelAssembler extends RepresentationModelAssemblerSupport<Product, ProductModel> {

    public ProductModelAssembler() {
        super(ProductController.class, ProductModel.class);
    }

    @Override
    public ProductModel toModel(Product product) {
        ProductModel productModel = instantiateModel(product);

        productModel.add(linkTo(methodOn(ProductController.class)
                .getById(product.getId()))
                .withSelfRel());

        productModel.setId(product.getId());
        productModel.setDescription(product.getDescription());
        productModel.setImage(product.getImage());
        productModel.setName(product.getName());
        productModel.setPrice(product.getPrice());
        productModel.setStock(product.getStock());
        productModel.setSupplier(product.getSupplier());
        productModel.setThumbail_32x32(product.getThumbail_32x32());
        productModel.setThumbail_64x64(product.getThumbail_64x64());
        productModel.setThumbail_128x128(product.getThumbail_128x128());
        productModel.setCreatedAt(product.getCreatedAt());
        productModel.setUpdatedAt(product.getUpdatedAt());
        return productModel;
    }
}
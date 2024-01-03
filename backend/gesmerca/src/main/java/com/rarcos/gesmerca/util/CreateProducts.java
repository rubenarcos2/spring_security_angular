package com.rarcos.gesmerca.util;

import com.github.javafaker.Faker;
import com.rarcos.gesmerca.entity.Product;
import com.rarcos.gesmerca.entity.Supplier;
import com.rarcos.gesmerca.service.ProductService;
import com.rarcos.gesmerca.service.SupplierService;

import java.time.ZonedDateTime;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * MUY IMPORTANTE: ESTA CLASE SÓLO SE EJECUTARÁ UNA VEZ PARA CREAR LOS ROLES.
 * UNA VEZ CREADOS SE DEBERÁ ELIMINAR O BIEN COMENTAR EL CÓDIGO
 *
 */

@Component
@Order(4)
public class CreateProducts implements CommandLineRunner {

    @Autowired
    ProductService productService;

    @Autowired
    SupplierService supplierService;

    @Override
    public void run(String... args) throws Exception {
        Faker faker = new Faker(new Locale("es-ES"));
        for (int i = 1; i <= 100; i++) {
            Long idSupplier = new Long(String.valueOf(faker.number().numberBetween(1, 50)));
            Supplier supplier = supplierService.getOne(idSupplier).get();
            Product product = new Product(faker.commerce().productName(),
                    "Descripción del producto " + faker.commerce().productName(), supplier,
                    "https://vps.rarcos.com:10449/storage/assets/img/products/no-image.png",
                    "https://vps.rarcos.com:10449/storage/assets/img/products/no-image_32x32.png",
                    "https://vps.rarcos.com:10449/storage/assets/img/products/no-image_64x64.png",
                    "https://vps.rarcos.com:10449/storage/assets/img/products/no-image_128x128.png",
                    Float.valueOf(faker.commerce().price().replace(',', '.')),
                    0, ZonedDateTime.now(), ZonedDateTime.now());
            productService.save(product);
        }

    }
}

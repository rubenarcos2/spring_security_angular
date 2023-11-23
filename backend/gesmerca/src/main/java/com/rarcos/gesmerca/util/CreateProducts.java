package com.rarcos.gesmerca.util;

import com.rarcos.gesmerca.entity.Product;
import com.rarcos.gesmerca.service.ProductService;

import java.time.ZonedDateTime;

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
@Order(2)
public class CreateProducts implements CommandLineRunner {

    @Autowired
    ProductService productService;

    @Override
    public void run(String... args) throws Exception {
        Product product = new Product("Producto 1", "Descripción del producto 1", Long.valueOf(1),
                "https://vps.rarcos.com:10449/storage/assets/img/products/a93607e8c26b715e4ed44e1c07da7299.png",
                "https://vps.rarcos.com:10449/storage/assets/img/products/a93607e8c26b715e4ed44e1c07da7299_32x32.png",
                "https://vps.rarcos.com:10449/storage/assets/img/products/a93607e8c26b715e4ed44e1c07da7299_64x64.png",
                "https://vps.rarcos.com:10449/storage/assets/img/products/a93607e8c26b715e4ed44e1c07da7299_128x128.png",
                (float) 72.85,
                98, ZonedDateTime.now(), ZonedDateTime.now());
        productService.save(product);
    }
}

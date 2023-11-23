package com.rarcos.gesmerca.util;

import com.rarcos.gesmerca.entity.Product;
import com.rarcos.gesmerca.entity.Supplier;
import com.rarcos.gesmerca.service.ProductService;
import com.rarcos.gesmerca.service.SupplierService;

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
@Order(4)
public class CreateSuppliers implements CommandLineRunner {

    @Autowired
    SupplierService supplierService;

    @Override
    public void run(String... args) throws Exception {
        Supplier supplier = new Supplier("A123456789", "Proveedor 1", "C/ del viento, S/N", "Málaga", "123456789",
                "a@a.com", null, null, ZonedDateTime.now(), ZonedDateTime.now());
        supplierService.save(supplier);
    }
}

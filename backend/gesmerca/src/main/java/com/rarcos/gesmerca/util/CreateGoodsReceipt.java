package com.rarcos.gesmerca.util;

import com.github.javafaker.Faker;
import com.rarcos.gesmerca.entity.GoodsReceipt;
import com.rarcos.gesmerca.entity.Product;
import com.rarcos.gesmerca.entity.Supplier;
import com.rarcos.gesmerca.security.service.UserService;
import com.rarcos.gesmerca.service.GoodsReceiptService;
import com.rarcos.gesmerca.service.ProductService;
import com.rarcos.gesmerca.service.SupplierService;

import java.time.LocalDate;
import java.time.LocalTime;
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
@Order(5)
public class CreateGoodsReceipt implements CommandLineRunner {

    @Autowired
    GoodsReceiptService goodsReceiptService;

    @Autowired
    SupplierService supplierService;

    @Autowired
    UserService userService;

    @Override
    public void run(String... args) throws Exception {
        Faker faker = new Faker(new Locale("es-ES"));
        // for (int i = 1; i <= 100; i++) {
        Long idSupplier = Long.valueOf(1);
        Supplier supplier = supplierService.getOne(idSupplier).get();
        GoodsReceipt goodsReceipt = new GoodsReceipt(supplier, userService.getById(Long.valueOf(1)).get(),
                LocalDate.now(), LocalTime.now(), "A123456789", ZonedDateTime.now(), ZonedDateTime.now());
        goodsReceiptService.save(goodsReceipt);
        // }

    }
}

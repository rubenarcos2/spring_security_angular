package com.rarcos.gesmerca.util;

import com.github.javafaker.Faker;
import com.rarcos.gesmerca.entity.Supplier;
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
@Order(3)
public class CreateSuppliers implements CommandLineRunner {

    @Autowired
    SupplierService supplierService;

    @Override
    public void run(String... args) throws Exception {
        Faker faker = new Faker(new Locale("es-ES"));
        for (int i = 1; i <= 50; i++) {
            Supplier supplier = new Supplier("A" + faker.number().numberBetween(11111111, 99999999),
                    faker.company().name(), faker.address().fullAddress(),
                    faker.address().cityName(), faker.phoneNumber().phoneNumber(),
                    faker.internet().emailAddress(), faker.internet().domainName(), null, ZonedDateTime.now(),
                    ZonedDateTime.now());
            supplierService.save(supplier);
        }

    }
}

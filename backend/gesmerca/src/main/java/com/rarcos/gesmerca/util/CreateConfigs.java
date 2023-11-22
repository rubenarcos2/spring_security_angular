package com.rarcos.gesmerca.util;

import com.rarcos.gesmerca.entity.Config;
import com.rarcos.gesmerca.entity.UserConfig;
import com.rarcos.gesmerca.security.service.UserService;
import com.rarcos.gesmerca.service.ConfigService;
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
public class CreateConfigs implements CommandLineRunner {

    @Autowired
    ConfigService configService;

    @Autowired
    UserService userService;

    @Override
    public void run(String... args) throws Exception {
        Config config = new Config("sharpcontrast", "false", "Alto contraste",
                "Cambia los colores a un contraste más alto", "True/False");
        Config config2 = new Config("tts", "false", "Texto a voz", "Lee en voz alta todos los textos", "True/False");
        configService.save(config);
        configService.save(config2);

        UserConfig userConfig = new UserConfig(userService.getByNombreUsuario("employee").get(), config, "true",
                "Alto contraste para empleados");
        configService.save(userConfig);
    }
}

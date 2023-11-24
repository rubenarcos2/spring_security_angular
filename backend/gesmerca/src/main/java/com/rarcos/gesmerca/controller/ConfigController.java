package com.rarcos.gesmerca.controller;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rarcos.gesmerca.dto.Message;
import com.rarcos.gesmerca.dto.Error;
import com.rarcos.gesmerca.dto.UserConfigDto;
import com.rarcos.gesmerca.dto.ConfigDto;
import com.rarcos.gesmerca.entity.Config;
import com.rarcos.gesmerca.entity.UserConfig;
import com.rarcos.gesmerca.security.entity.User;
import com.rarcos.gesmerca.security.service.UserService;
import com.rarcos.gesmerca.service.ConfigService;

import io.micrometer.common.util.StringUtils;

@RestController
@RequestMapping("/api/config")
@CrossOrigin(origins = "*") // En desarrollo acepta cualquier URL. TODO: cambiar a dominio producción.
public class ConfigController {

    @Autowired
    ConfigService configService;

    @Autowired
    UserService userService;

    @GetMapping
    public ResponseEntity<List<Config>> list() {
        List<Config> list = configService.list();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getById(@PathVariable("id") Long id) {
        if (!configService.existsById(id))
            return new ResponseEntity<>(new Error("No existe un configuración para id dado"), HttpStatus.NOT_FOUND);
        Config Config = configService.getOne(id).get();
        return new ResponseEntity<>(Config, HttpStatus.OK);
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<Object> getByName(@PathVariable("name") String name) {
        if (!configService.existsByName(name))
            return new ResponseEntity<>(new Error("No existe una configuración para el nombre dado"),
                    HttpStatus.NOT_FOUND);
        Config Config = configService.getOneByName(name).get(0);
        return new ResponseEntity<>(Config, HttpStatus.OK);
    }

    @PutMapping("/update")
    public ResponseEntity<?> update(@ModelAttribute ConfigDto configDto) {
        if (StringUtils.isBlank(configDto.getName()))
            return new ResponseEntity<>(new Error("La configuración debe de tener un nombre"),
                    HttpStatus.BAD_REQUEST);

        Config config = configService.getOneByName(configDto.getName()).get(0);
        config.setName(configDto.getName());
        config.setValue(configDto.getValue());
        config.setTitle(configDto.getTitle());
        config.setDescription(configDto.getDescription());
        config.setTitle(configDto.getTitle());
        configService.save(config);
        return new ResponseEntity<>(new Message("La configuración se ha actualizado correctamente"), HttpStatus.OK);
    }

    @PutMapping("/user/update/{id}")
    public ResponseEntity<?> updateUser(@PathVariable("id") Long id, @ModelAttribute ConfigDto configDto) {
        Config config = configService.getOneByName(configDto.getName()).get(0);
        User user = userService.getById(id).get();
        List<UserConfig> listUserConfig = configService.getConfigsOfUserId(id);
        for (UserConfig userConfig : listUserConfig) {
            if (userConfig.getId().equals(config.getId())) {
                userConfig.setConfig(config);
                userConfig.setUser(user);
                userConfig.setValue(configDto.getValue());
                userConfig.setDescription(configDto.getDescription());
                configService.save(userConfig);
            }
        }

        return new ResponseEntity<>(new Message("La configuración se ha actualizado correctamente"), HttpStatus.OK);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<Object> getByUserId(@PathVariable("id") Long id) {
        List<UserConfigDto> userConfigDtosList = new ArrayList<>();
        List<UserConfig> userConfigsList = configService.getConfigsOfUserId(id);
        for (UserConfig userConfig : userConfigsList) {
            UserConfigDto userConfigDto = new UserConfigDto(userConfig.getId(), userConfig.getConfig().getName(),
                    userConfig.getValue(), userConfig.getConfig().getTitle(), userConfig.getDescription(),
                    userConfig.getConfig().getDomain(), userConfig.getUser().getId());
            userConfigDtosList.add(userConfigDto);
        }
        return new ResponseEntity<>(userConfigDtosList, HttpStatus.OK);
    }
}
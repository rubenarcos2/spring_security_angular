package com.rarcos.gesmerca.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rarcos.gesmerca.dto.Message;
import com.rarcos.gesmerca.dto.ConfigDto;
import com.rarcos.gesmerca.entity.Config;
import com.rarcos.gesmerca.service.ConfigService;

import io.micrometer.common.util.StringUtils;

@RestController
@RequestMapping("/api/config")
@CrossOrigin(origins = "*") // En desarrollo acepta cualquier URL. TODO: cambiar a dominio producción.
public class ConfigController {

    @Autowired
    ConfigService configService;

    @GetMapping
    public ResponseEntity<List<Config>> list() {
        List<Config> list = configService.list();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getById(@PathVariable("id") Long id) {
        if (!configService.existsById(id))
            return new ResponseEntity<>(new Message("No existe un configuración para id dado"), HttpStatus.NOT_FOUND);
        Config Config = configService.getOne(id).get();
        return new ResponseEntity<>(Config, HttpStatus.OK);
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<Object> getByName(@PathVariable("name") String name) {
        if (!configService.existsByName(name))
            return new ResponseEntity<>(new Message("No existe una configuración para el nombre dado"),
                    HttpStatus.NOT_FOUND);
        Config Config = configService.getOneByName(name).get(0);
        return new ResponseEntity<>(Config, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable("id") Long id, @RequestBody ConfigDto configDto) {
        if (!configService.existsById(id))
            return new ResponseEntity<>(new Message("No existe una configuración para id dado"), HttpStatus.NOT_FOUND);
        if (configService.existsByName(configDto.getName())
                && configService.getOneByName(configDto.getName()).get(0).getId() != id)
            return new ResponseEntity<>(new Message("El nombre de la configuración ya existe"), HttpStatus.BAD_REQUEST);
        if (StringUtils.isBlank(configDto.getName()))
            return new ResponseEntity<>(new Message("La configuración debe de tener un nombre"),
                    HttpStatus.BAD_REQUEST);

        Config config = configService.getOne(id).get();
        config.setName(configDto.getName());
        config.setValue(configDto.getValue());
        config.setTitle(configDto.getTitle());
        config.setDescription(configDto.getDescription());
        config.setTitle(configDto.getTitle());
        configService.save(config);
        return new ResponseEntity<>(new Message("La configuración se ha actualizado correctamente"), HttpStatus.OK);
    }
}
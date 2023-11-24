package com.rarcos.gesmerca.security.controller;

import java.util.List;
import java.util.Set;

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
import com.rarcos.gesmerca.security.entity.Permission;
import com.rarcos.gesmerca.security.entity.User;
import com.rarcos.gesmerca.security.service.PermissionService;
import com.rarcos.gesmerca.security.service.UserService;

@RestController
@RequestMapping("/api/permission")
@CrossOrigin(origins = "*") // En desarrollo acepta cualquier URL. TODO: cambiar a dominio producción.
public class PermissionController {

    @Autowired
    PermissionService permissionService;

    @Autowired
    UserService userService;

    @GetMapping()
    public ResponseEntity<List<Permission>> list() {
        List<Permission> list = permissionService.getAll();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getById(@PathVariable("id") Long id) {
        if (!permissionService.existsById(id))
            return new ResponseEntity<>(new Error("No existe un permiso para id dado"), HttpStatus.NOT_FOUND);
        Permission permission = permissionService.getOne(id).get();
        return new ResponseEntity<>(permission, HttpStatus.OK);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<Object> getPermissionByUser(@PathVariable("id") Long idUser) {
        Set<Permission> permissions = userService.getById(idUser).get().getPermissions();
        return new ResponseEntity<>(permissions, HttpStatus.OK);
    }

    @PutMapping("/user/{id}")
    public ResponseEntity<Object> updatePermissionByUser(@PathVariable("id") Long userId,
            @RequestBody Set<Permission> permissions) {
        if (!userService.existsByNombreUsuario(userService.getById(userId).get().getUserName()))
            return new ResponseEntity<>(new Error("No existe un usuario para el id dado"), HttpStatus.NOT_FOUND);
        User user = userService.getById(userId).get();
        user.setPermissions(permissions);
        userService.save(user);
        return new ResponseEntity<>(new Message("Se han asignado los permisos al usuario correctamente"),
                HttpStatus.OK);
    }
}
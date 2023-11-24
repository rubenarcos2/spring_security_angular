package com.rarcos.gesmerca.security.controller;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rarcos.gesmerca.dto.Message;
import com.rarcos.gesmerca.security.entity.Role;
import com.rarcos.gesmerca.security.entity.User;
import com.rarcos.gesmerca.security.service.RoleService;
import com.rarcos.gesmerca.security.service.UserService;

@RestController
@RequestMapping("/api/role")
@CrossOrigin(origins = "*") // En desarrollo acepta cualquier URL. TODO: cambiar a dominio producción.
public class RoleController {

    @Autowired
    RoleService rolesService;

    @Autowired
    UserService userService;

    @GetMapping()
    public ResponseEntity<List<Role>> list() {
        List<Role> list = rolesService.getAll();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getById(@PathVariable("id") Long id) {
        if (!rolesService.existsById(id))
            return new ResponseEntity<>(new Error("No existe un producto para id dado"), HttpStatus.NOT_FOUND);
        Role role = rolesService.getOne(id).get();
        return new ResponseEntity<>(role, HttpStatus.OK);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<Object> getRoleByUser(@PathVariable("id") Long idUser) {
        Set<Role> role = userService.getById(idUser).get().getRoles();
        return new ResponseEntity<>(role, HttpStatus.OK);
    }

    @PutMapping("/user/{id}")
    public ResponseEntity<Object> updateRoleByUser(@PathVariable("id") Long userId, @RequestParam Long id) {
        if (!userService.existsByNombreUsuario(userService.getById(userId).get().getUserName()))
            return new ResponseEntity<>(new Error("No existe un usuario para el id dado"), HttpStatus.NOT_FOUND);
        Set<Role> listRole = new HashSet<Role>();
        Role role = rolesService.getOne(id).get();
        listRole.add(role);
        User user = userService.getById(userId).get();
        user.setRoles(listRole);
        userService.save(user);
        return new ResponseEntity<>(new Message("Se ha asignado el rol al usuario correctamente"), HttpStatus.OK);
    }
}
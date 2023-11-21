package com.rarcos.gesmerca.security.controller;

import java.text.ParseException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rarcos.gesmerca.dto.Message;
import com.rarcos.gesmerca.security.dto.JwtDto;
import com.rarcos.gesmerca.security.dto.LoginUser;
import com.rarcos.gesmerca.security.dto.NewUser;
import com.rarcos.gesmerca.security.dto.ProfileUser;
import com.rarcos.gesmerca.security.dto.User;
import com.rarcos.gesmerca.security.jwt.JwtProvider;
import com.rarcos.gesmerca.security.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // En desarrollo acepta cualquier URL. TODO: cambiar a dominio producción.
public class AuthController {

    @Autowired
    UserService userService;

    @Autowired
    JwtProvider jwtProvider;

    @PostMapping("/register")
    public ResponseEntity<Message> nuevo(@Valid @RequestBody NewUser newUser) {
        return ResponseEntity.ok(userService.save(newUser));
    }

    @PostMapping("/login")
    public ResponseEntity<JwtDto> login(@Valid @RequestBody LoginUser loginUsuario) {
        return ResponseEntity.ok(userService.login(loginUsuario));
    }

    @PostMapping("/refresh")
    public ResponseEntity<JwtDto> refresh(@RequestHeader("Authorization") String bearerToken) throws ParseException {
        return ResponseEntity.ok(userService.refresh(bearerToken.split(" ")[1].trim()));
    }

    @GetMapping("/user-profile")
    public ResponseEntity<ProfileUser> profile(@RequestHeader("Authorization") String bearerToken) {
        String userName = jwtProvider.getNombreUsuarioFromToken(bearerToken.split(" ")[1].trim());
        ;
        User user = new User(userService.getByNombreUsuario(userName).get().getId(),
                userService.getByNombreUsuario(userName).get().getName(),
                userService.getByNombreUsuario(userName).get().getUserName(),
                userService.getByNombreUsuario(userName).get().getEmail());
        ProfileUser profileUser = new ProfileUser(user, userService.getByNombreUsuario(userName).get().getRoles(),
                userService.getByNombreUsuario(userName).get().getPermissions());
        return ResponseEntity.ok(profileUser);
    }
}
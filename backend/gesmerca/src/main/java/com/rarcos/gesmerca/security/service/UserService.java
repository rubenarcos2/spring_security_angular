package com.rarcos.gesmerca.security.service;

import java.text.ParseException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.rarcos.gesmerca.dto.Message;
import com.rarcos.gesmerca.exceptions.CustomException;
import com.rarcos.gesmerca.security.dto.JwtDto;
import com.rarcos.gesmerca.security.dto.LoginUser;
import com.rarcos.gesmerca.security.dto.NewUser;
import com.rarcos.gesmerca.security.entity.User;
import com.rarcos.gesmerca.security.jwt.JwtProvider;
import com.rarcos.gesmerca.security.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    RoleService roleService;

    @Autowired
    JwtProvider jwtProvider;

    public Optional<User> getById(Long id) {
        return userRepository.findById(id);
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public Optional<User> getByNombreUsuario(String nombreUsuario) {
        return userRepository.findByUserName(nombreUsuario);
    }

    public Optional<User> getByNombreUsuarioOrEmail(String userNameOrEmail) {
        return userRepository.findByUserNameOrEmail(userNameOrEmail, userNameOrEmail);
    }

    public Optional<User> getByTokenPassword(String tokenPassword) {
        return userRepository.findByTokenPassword(tokenPassword);
    }

    public boolean existsByNombreUsuario(String userName) {
        return userRepository.existsByUserName(userName);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public JwtDto login(LoginUser loginUser) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginUser.getUserName(), loginUser.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtProvider.generateToken(authentication);
        return new JwtDto(jwt);
    }

    public JwtDto refresh(String jwtDto) throws ParseException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Authentication newAuth = new UsernamePasswordAuthenticationToken(auth.getPrincipal(), auth.getCredentials());
        SecurityContextHolder.getContext().setAuthentication(newAuth);
        String token = jwtProvider.refreshToken(newAuth);
        return new JwtDto(token);
    }

    public Message save(NewUser newUser) {
        if (userRepository.existsByUserName(newUser.getUserName()))
            throw new CustomException(HttpStatus.BAD_REQUEST, "ese nombre de usuario ya existe");
        if (userRepository.existsByEmail(newUser.getEmail()))
            throw new CustomException(HttpStatus.BAD_REQUEST, "ese email de usuario ya existe");
        User user = new User(newUser.getName(), newUser.getUserName(),
                newUser.getEmail(),
                passwordEncoder.encode(newUser.getPassword()));
        /*
         * Set<Role> roles = new HashSet<>();
         * if (newUser.getRoles().contains(new Role(RoleName.ROLE_USER)))
         * roles.add(roleService.getByRoleName(RoleName.ROLE_USER).get());
         * if (newUser.getRoles().contains(new Role(RoleName.ROLE_ADMIN)))
         * roles.add(roleService.getByRoleName(RoleName.ROLE_ADMIN).get());
         * if (newUser.getRoles().contains(new Role(RoleName.ROLE_EMPLOYEE)))
         * roles.add(roleService.getByRoleName(RoleName.ROLE_EMPLOYEE).get());
         */
        user.setRoles(newUser.getRoles());
        userRepository.save(user);
        return new Message(user.getUserName() + " ha sido creado");
    }

    public void save(User user) {
        userRepository.save(user);
    }
}

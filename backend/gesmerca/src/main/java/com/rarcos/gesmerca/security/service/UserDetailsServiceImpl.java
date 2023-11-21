package com.rarcos.gesmerca.security.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.rarcos.gesmerca.security.entity.MainUser;
import com.rarcos.gesmerca.security.entity.User;
import com.rarcos.gesmerca.security.repository.UserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String userNameOrEmail) throws UsernameNotFoundException {
        User user = userRepository.findByUserNameOrEmail(userNameOrEmail, userNameOrEmail)
                .orElseThrow(() -> new UsernameNotFoundException("ese usuario no existe"));
        return MainUser.build(user);
    }

}

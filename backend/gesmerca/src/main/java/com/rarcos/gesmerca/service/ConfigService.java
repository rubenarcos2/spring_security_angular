package com.rarcos.gesmerca.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rarcos.gesmerca.entity.Config;
import com.rarcos.gesmerca.entity.UserConfig;
import com.rarcos.gesmerca.repository.ConfigRepository;
import com.rarcos.gesmerca.repository.UserConfigRepository;
import com.rarcos.gesmerca.security.entity.User;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ConfigService {

    @Autowired
    ConfigRepository configRepository;

    @Autowired
    UserConfigRepository userConfigRepository;

    public List<Config> list() {
        return configRepository.findAll();
    }

    public Optional<Config> getOne(Long id) {
        return configRepository.findById(id);
    }

    public List<User> getUsersConfig(Long id) {
        return userConfigRepository.findAll()
                .stream()
                .map(UserConfig::getUser)
                .collect(Collectors.toList());
    }

    public List<UserConfig> getConfigsOfUserId(Long id) {
        return userConfigRepository.findAll()
                .stream()
                .filter(uc -> uc.getUser().getId().equals(id))
                .collect(Collectors.toList());
    }

    public List<Config> getOneByName(String name) {
        return configRepository.findByName(name);
    }

    public void save(Config product) {
        configRepository.save(product);
    }

    public void delete(Long id) {
        configRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return configRepository.existsById(id);
    }

    public boolean existsByName(String name) {
        return configRepository.existsByName(name);
    }
}

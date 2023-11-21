package com.rarcos.gesmerca.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rarcos.gesmerca.entity.Config;
import com.rarcos.gesmerca.repository.ConfigRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ConfigService {
    
    @Autowired
    ConfigRepository configRepository;

    public List<Config> list(){
        return configRepository.findAll();
    }

    public Optional<Config> getOne(int id){
        return configRepository.findById(id);
    }

    public List<Config> getOneByName(String name){
        return configRepository.findByName(name);
    }

    public void save(Config product){
        configRepository.save(product);
    }

    public void delete(int id){
        configRepository.deleteById(id);
    }

    public boolean existsById(int id){
        return configRepository.existsById(id);
    }

    public boolean existsByName(String name){
        return configRepository.existsByName(name);
    }
}

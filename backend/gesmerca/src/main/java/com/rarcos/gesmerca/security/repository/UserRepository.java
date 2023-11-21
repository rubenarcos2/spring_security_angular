package com.rarcos.gesmerca.security.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rarcos.gesmerca.security.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUserName(String userName);

    Optional<User> findByUserNameOrEmail(String userName, String email);

    Optional<User> findByTokenPassword(String tokenPassword);

    boolean existsByUserName(String userName);

    boolean existsByEmail(String email);
}

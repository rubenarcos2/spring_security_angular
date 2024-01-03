package com.rarcos.gesmerca.security.service;

public interface TokenBlacklist {
    void addToBlacklist(String token);

    boolean isBlacklisted(String token);
}
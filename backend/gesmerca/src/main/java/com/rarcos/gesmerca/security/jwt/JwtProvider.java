package com.rarcos.gesmerca.security.jwt;

import com.nimbusds.jwt.JWT;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.JWTParser;
import com.rarcos.gesmerca.security.entity.MainUser;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;

@Component
public class JwtProvider {
    private final static Logger logger = LoggerFactory.getLogger(JwtProvider.class);

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private int expiration;

    public String generateToken(Authentication authentication) {
        MainUser mainUser = (MainUser) authentication.getPrincipal();
        List<String> roles = mainUser.getAuthorities().stream().map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        return Jwts.builder()
                .setSubject(mainUser.getUsername())
                .claim("id", mainUser.getId())
                .claim("name", mainUser.getName())
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + expiration * 180))
                .signWith(getSecret(secret), SignatureAlgorithm.HS512)
                .compact();
    }

    public String getNombreUsuarioFromToken(String token) {
        return Jwts.parserBuilder().setSigningKey(getSecret(secret)).build().parseClaimsJws(token).getBody()
                .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getSecret(secret)).build().parseClaimsJws(token);
            return true;
        } catch (MalformedJwtException e) {
            logger.error("Error token mal formado");
        } catch (UnsupportedJwtException e) {
            logger.error("Error token no soportado");
        } catch (ExpiredJwtException e) {
            logger.error("Error token expirado");
        } catch (IllegalArgumentException e) {
            logger.error("Error token vacío");
        } catch (SignatureException e) {
            logger.error("Error en la firma del token");
        }
        return false;
    }

    public String refreshToken(Authentication authentication) throws ParseException {
        MainUser mainUser = (MainUser) authentication.getPrincipal();
        List<String> roles = mainUser.getAuthorities().stream().map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        return Jwts.builder()
                .setSubject(mainUser.getUsername())
                .claim("id", mainUser.getId())
                .claim("name", mainUser.getName())
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + expiration * 180))
                .signWith(getSecret(secret), SignatureAlgorithm.HS512)
                .compact();
    }

    private SecretKey getSecret(String secret) {
        byte[] secretBytes = Decoders.BASE64URL.decode(secret);
        return Keys.hmacShaKeyFor(secretBytes);
    }
}

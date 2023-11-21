package com.rarcos.gesmerca.exceptions;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.rarcos.gesmerca.dto.Error;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class RestControllerException {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Error> handleException(Exception e) {
        return ResponseEntity.internalServerError()
                .body(new Error(e.getMessage()));
    }

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<Error> handleCustomException(CustomException e) {
        return ResponseEntity.status(e.getStatus())
                .body(new Error(e.getMessage()));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Error> handleBadCredentialsException(BadCredentialsException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new Error(e.getMessage()));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Error> handleAccessDeniedException(AccessDeniedException e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new Error(e.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Error> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        List<String> mensajes = new ArrayList<>();
        e.getBindingResult().getAllErrors().forEach(err -> mensajes.add(err.getDefaultMessage()));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new Error(mensajes.stream().collect(Collectors.joining(","))));
    }

    @ExceptionHandler(value = { MalformedJwtException.class, UnsupportedJwtException.class,
            IllegalArgumentException.class, SignatureException.class })
    public ResponseEntity<Error> jwtException(JwtException e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new Error(e.getMessage()));
    }
}
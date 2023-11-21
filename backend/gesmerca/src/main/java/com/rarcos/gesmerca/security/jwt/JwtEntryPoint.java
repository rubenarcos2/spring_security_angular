package com.rarcos.gesmerca.security.jwt;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rarcos.gesmerca.dto.Error;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtEntryPoint implements AuthenticationEntryPoint {

    private final static Logger logger = LoggerFactory.getLogger(JwtEntryPoint.class);

    @Override
    public void commence(HttpServletRequest req, HttpServletResponse res, AuthenticationException e)
            throws IOException, ServletException {
        logger.error(e.toString());
        Error message = new Error("Acceso no autorizado");
        res.setContentType("application/json");
        res.setStatus(HttpStatus.UNAUTHORIZED.value());
        res.getWriter().write(new ObjectMapper().writeValueAsString(message));
        res.getWriter().flush();
        res.getWriter().close();
    }

}

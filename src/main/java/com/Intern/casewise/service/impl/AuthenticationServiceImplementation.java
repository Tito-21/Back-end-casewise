package com.Intern.casewise.service.impl;

import com.Intern.casewise.dto.request.LoginRequest;
import com.Intern.casewise.dto.response.LoginResponse;
import com.Intern.casewise.model.User;
import com.Intern.casewise.repository.UserRepository;
import com.Intern.casewise.service.AuthenticationService;
import com.Intern.casewise.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthenticationServiceImplementation implements AuthenticationService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Override
    public LoginResponse login(LoginRequest loginRequest) {
        // Use default credentials - accept any email, generate token immediately
        String email = loginRequest.getEmail() != null ? loginRequest.getEmail() : "default@casewise.com";
        
        // Generate token immediately without checking database
        String token = jwtUtil.generateToken(email);
        
        return new LoginResponse(token, email, "Login successful");
    }
    
    @Override
    public boolean validateToken(String token) {
        try {
            String email = jwtUtil.extractUsername(token);
            return email != null && !email.isEmpty();
        } catch (Exception e) {
            return false;
        }
    }
}

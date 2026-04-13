package com.Intern.casewise.service;

import com.Intern.casewise.dto.request.LoginRequest;
import com.Intern.casewise.dto.request.RegisterRequest;
import com.Intern.casewise.dto.response.UserResponse;
import java.util.Optional;

import org.springframework.stereotype.Service;

public interface UserService {
    
    Optional<UserResponse> login(LoginRequest request);
    
    UserResponse register(RegisterRequest request);
    
    // boolean emailExists(String email);
    
    // Optional<UserResponse> findById(Long id);
}

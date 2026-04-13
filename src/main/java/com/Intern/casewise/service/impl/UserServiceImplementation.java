package com.Intern.casewise.service.impl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Intern.casewise.dto.request.LoginRequest;
import com.Intern.casewise.dto.request.RegisterRequest;
import com.Intern.casewise.dto.response.UserResponse;
import com.Intern.casewise.model.User;
import com.Intern.casewise.repository.UserRepository;
import com.Intern.casewise.service.UserService;

@Service
public class UserServiceImplementation implements UserService{
    
private final UserRepository userRepository;
    
    @Autowired
    public UserServiceImplementation(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    @Override
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        
        User savedUser = userRepository.save(user);
        
        return UserResponse.fromEntity(savedUser);
    }

    @Override
    public Optional<UserResponse> login(LoginRequest request) {
        Optional<User> user = userRepository.findByEmail(request.getEmail());
        
        if (user.isPresent() && user.get().getPassword().equals(request.getPassword())) {
            return Optional.of(UserResponse.fromEntity(user.get()));
        }
        
        return Optional.empty();
    }
}
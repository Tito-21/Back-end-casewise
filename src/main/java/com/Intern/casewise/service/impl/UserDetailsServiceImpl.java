package com.Intern.casewise.service.impl;

import com.Intern.casewise.model.User;
import com.Intern.casewise.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Accept any email and create a default user
        String userEmail = email != null ? email : "default@casewise.com";
        
        return org.springframework.security.core.userdetails.User.builder()
                .username(userEmail)
                .password("default") // Default password
                .authorities(new ArrayList<>())
                .build();
    }
}

package com.Intern.casewise.service;

import com.Intern.casewise.dto.request.LoginRequest;
import com.Intern.casewise.dto.response.LoginResponse;

public interface AuthenticationService {
    
    LoginResponse login(LoginRequest loginRequest);
    
    boolean validateToken(String token);
}

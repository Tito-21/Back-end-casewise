package com.Intern.casewise.controller;

import com.Intern.casewise.dto.response.ApiResponse;
import com.Intern.casewise.dto.request.LoginRequest;
import com.Intern.casewise.dto.response.LoginResponse;
import com.Intern.casewise.service.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {
    
    @Autowired
    private AuthenticationService authenticationService;
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            LoginResponse loginResponse = authenticationService.login(loginRequest);
            
            if (loginResponse.getToken() != null) {
                return ResponseEntity.ok(ApiResponse.success("Login successful", loginResponse));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error(loginResponse.getMessage()));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Login failed: " + e.getMessage()));
        }
    }
    
    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<Boolean>> validateToken(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                String token = authorizationHeader.substring(7);
                boolean isValid = authenticationService.validateToken(token);
                return ResponseEntity.ok(ApiResponse.success("Token validation", isValid));
            }
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid authorization header"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Token validation failed: " + e.getMessage()));
        }
    }
}

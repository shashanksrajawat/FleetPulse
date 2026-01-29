package com.fleetmanagement.backend.controller;

import com.fleetmanagement.backend.dto.*;
import com.fleetmanagement.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;



@RestController
@RequestMapping("/api/auth")
public class AuthController {
	
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

// Register Customer or Vehicle Owner
    @PostMapping("/register/user")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        try {
            return ResponseEntity.ok(authService.registerUser(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Register Driver (Handles the extra DriverInfo table)
    @PostMapping("/register/driver")
    public ResponseEntity<?> registerDriver(@RequestBody DriverRegisterRequest request) {
        try {
            return ResponseEntity.ok(authService.registerDriver(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
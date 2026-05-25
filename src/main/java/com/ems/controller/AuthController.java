package com.ems.controller;

import com.ems.dto.AuthDTO.*;
import com.ems.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Handles user registration and login.
 * These endpoints are PUBLIC — no JWT required.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Register and login endpoints")
public class AuthController {

    private final AuthService authService;

    /**
     * POST /api/auth/signup
     * Register a new user. Role defaults to EMPLOYEE.
     */
    @PostMapping("/signup")
    @Operation(summary = "Register a new user",
               description = "Role options: ROLE_ADMIN or ROLE_EMPLOYEE (default)")
    public ResponseEntity<MessageResponse> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    /**
     * POST /api/auth/login
     * Returns a JWT token on successful authentication.
     */
    @PostMapping("/login")
    @Operation(summary = "Login and get JWT token",
               description = "Use the returned token in the Authorization header: Bearer <token>")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}

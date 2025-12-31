package com.visionsoft.plms.controller;

import com.visionsoft.plms.dto.auth.*;
import com.visionsoft.plms.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    // 1. Sign In
    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signIn(@Valid @RequestBody SignInRequest request) {
        AuthResponse response = authService.signIn(request);
        return ResponseEntity.ok(response);
    }
    
    // 2. Sign Up (Create Account)
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signUp(@Valid @RequestBody SignUpRequest request) {
        AuthResponse response = authService.signUp(request);
        return ResponseEntity.ok(response);
    }
    
    // 3. Forgot Password (Send Reset Link/Code)
    @PostMapping("/forgot-password")
    public ResponseEntity<AuthResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        AuthResponse response = authService.forgotPassword(request);
        return ResponseEntity.ok(response);
    }
    
    // 4. Verify Reset Code
    @PostMapping("/verify-reset-code")
    public ResponseEntity<AuthResponse> verifyResetCode(@Valid @RequestBody VerifyResetCodeRequest request) {
        AuthResponse response = authService.verifyResetCode(request);
        return ResponseEntity.ok(response);
    }
    
    // 5. Reset Password
    @PostMapping("/reset-password")
    public ResponseEntity<AuthResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        AuthResponse response = authService.resetPassword(request);
        return ResponseEntity.ok(response);
    }

    // 6. Update Account
    @PutMapping("/update-account/{userId}")
    public ResponseEntity<AuthResponse> updateAccount(
            @PathVariable Long userId,
            @Valid @RequestBody SignUpRequest request) {
        AuthResponse response = authService.updateAccount(userId, request);
        return ResponseEntity.ok(response);
    }
    
    // 7. Delete Account
    @DeleteMapping("/delete-account/{userId}")
    public ResponseEntity<AuthResponse> deleteAccount(@PathVariable Long userId) {
        AuthResponse response = authService.deleteAccount(userId);
        return ResponseEntity.ok(response);
    }
}
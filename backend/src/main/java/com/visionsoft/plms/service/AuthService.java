package com.visionsoft.plms.service;

import com.visionsoft.plms.dto.auth.*;
import com.visionsoft.plms.entity.PasswordResetToken;
import com.visionsoft.plms.entity.User;
import com.visionsoft.plms.repository.PasswordResetTokenRepository;
import com.visionsoft.plms.repository.UserRepository;
import com.visionsoft.plms.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordResetTokenRepository resetTokenRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil; // ✅ YENİ EKLEME
    
    // ✅ GÜNCELLENECEK: Sign In - TOKEN EKLE
    public AuthResponse signIn(SignInRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsernameOrEmail());
        
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(request.getUsernameOrEmail());
        }
        
        if (userOpt.isEmpty()) {
            return new AuthResponse(false, "User not found");
        }
        
        User user = userOpt.get();
        
        // Şifre kontrolü (BCrypt ile)
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new AuthResponse(false, "Invalid password");
        }
        
        // ✅ YENİ: Token oluştur
        String token = jwtUtil.generateToken(user.getId(), user.getUsername());
        
        // ✅ YENİ: Response data hazırla
        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        
        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("username", user.getUsername());
        userData.put("email", user.getEmail());
        data.put("user", userData);
        
        return new AuthResponse(true, "Sign in successful", data);
    }
    
    // Sign Up (DEĞİŞİKLİK YOK)
    @Transactional
    public AuthResponse signUp(SignUpRequest request) {
        // Email kontrolü
        if (userRepository.existsByEmail(request.getEmail())) {
            return new AuthResponse(false, "Email already exists");
        }
        
        // Username kontrolü
        if (userRepository.existsByUsername(request.getUsername())) {
            return new AuthResponse(false, "Username already exists");
        }
        
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        userRepository.save(user);
        
        return new AuthResponse(true, "Account created successfully");
    }
    
    // Forgot Password (DEĞİŞİKLİK YOK)
    @Transactional
    public AuthResponse forgotPassword(ForgotPasswordRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        
        if (userOpt.isEmpty()) {
            return new AuthResponse(false, "Email not found");
        }
        
        User user = userOpt.get();
        
        resetTokenRepository.deleteByEmail(request.getEmail());
        
        String resetCode = generateResetCode();
        
        PasswordResetToken token = new PasswordResetToken();
        token.setUser(user);
        token.setEmail(request.getEmail());
        token.setResetCode(resetCode);
        token.setExpiresAt(LocalDateTime.now().plusMinutes(15));
        token.setIsUsed(false);
        token.setCreatedAt(LocalDateTime.now());
        
        resetTokenRepository.save(token);
        
        try {
            emailService.sendResetCode(request.getEmail(), resetCode);
        } catch (Exception e) {
            return new AuthResponse(false, "Failed to send email. Please try again later.");
        }
        
        return new AuthResponse(true, "Reset code sent to your email");
    }
    
    // Verify Reset Code (DEĞİŞİKLİK YOK)
    public AuthResponse verifyResetCode(VerifyResetCodeRequest request) {
        Optional<PasswordResetToken> tokenOpt = resetTokenRepository
            .findByEmailAndResetCodeAndIsUsedFalseAndExpiresAtAfter(
                request.getEmail(), 
                request.getResetCode(), 
                LocalDateTime.now()
            );
        
        if (tokenOpt.isEmpty()) {
            return new AuthResponse(false, "Invalid or expired reset code");
        }
        
        return new AuthResponse(true, "Reset code verified");
    }
    
    // Reset Password (DEĞİŞİKLİK YOK)
    @Transactional
    public AuthResponse resetPassword(ResetPasswordRequest request) {
        Optional<PasswordResetToken> tokenOpt = resetTokenRepository
            .findByEmailAndResetCodeAndIsUsedFalseAndExpiresAtAfter(
                request.getEmail(), 
                request.getResetCode(), 
                LocalDateTime.now()
            );
        
        if (tokenOpt.isEmpty()) {
            return new AuthResponse(false, "Invalid or expired reset code");
        }
        
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        
        if (userOpt.isEmpty()) {
            return new AuthResponse(false, "User not found");
        }
        
        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt(LocalDateTime.now());
        
        userRepository.save(user);
        
        PasswordResetToken token = tokenOpt.get();
        token.setIsUsed(true);
        resetTokenRepository.save(token);
        
        return new AuthResponse(true, "Password reset successful");
    }
    
    // Update Account (DEĞİŞİKLİK YOK)
    @Transactional
    public AuthResponse updateAccount(Long userId, SignUpRequest request) {
        Optional<User> userOpt = userRepository.findById(userId);
        
        if (userOpt.isEmpty()) {
            return new AuthResponse(false, "User not found");
        }
        
        User user = userOpt.get();
        
        if (!user.getEmail().equals(request.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                return new AuthResponse(false, "Email already exists");
            }
            user.setEmail(request.getEmail());
        }
        
        if (!user.getUsername().equals(request.getUsername())) {
            if (userRepository.existsByUsername(request.getUsername())) {
                return new AuthResponse(false, "Username already exists");
            }
            user.setUsername(request.getUsername());
        }
        
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        
        return new AuthResponse(true, "Account updated successfully", user);
    }
    
    // Delete Account (DEĞİŞİKLİK YOK)
    @Transactional
    public AuthResponse deleteAccount(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        
        if (userOpt.isEmpty()) {
            return new AuthResponse(false, "User not found");
        }
        
        userRepository.deleteById(userId);
        
        return new AuthResponse(true, "Account deleted successfully");
    }
    
    // Helper method (DEĞİŞİKLİK YOK)
    private String generateResetCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }
}
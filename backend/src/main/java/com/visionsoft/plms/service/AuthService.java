package com.visionsoft.plms.service;

import com.visionsoft.plms.dto.auth.*;
import com.visionsoft.plms.entity.PasswordResetToken;
import com.visionsoft.plms.entity.User;
import com.visionsoft.plms.repository.PasswordResetTokenRepository;
import com.visionsoft.plms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordResetTokenRepository resetTokenRepository;
    
    // Sign In
    public AuthResponse signIn(SignInRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsernameOrEmail());
        
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(request.getUsernameOrEmail());
        }
        
        if (userOpt.isEmpty()) {
            return new AuthResponse(false, "User not found");
        }
        
        User user = userOpt.get();
        
        // TODO: Şifre kontrolü (BCrypt ile - sonra ekleyeceğiz)
        if (!user.getPassword().equals(request.getPassword())) {
            return new AuthResponse(false, "Invalid password");
        }
        
        return new AuthResponse(true, "Sign in successful", user);
    }
    
    // Sign Up
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
        // TODO: Şifreyi hash'le (BCrypt ile - sonra ekleyeceğiz)
        user.setPassword(request.getPassword());
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        userRepository.save(user);
        
        return new AuthResponse(true, "Account created successfully");
    }
    
    // Forgot Password - Send Reset Code
    @Transactional
    public AuthResponse forgotPassword(ForgotPasswordRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        
        if (userOpt.isEmpty()) {
            return new AuthResponse(false, "Email not found");
        }
        
        User user = userOpt.get();
        
        // Eski token'ları sil
        resetTokenRepository.deleteByEmail(request.getEmail());
        
        // 6 haneli kod oluştur
        String resetCode = generateResetCode();
        
        // Token oluştur (15 dakika geçerli)
        PasswordResetToken token = new PasswordResetToken();
        token.setUser(user);
        token.setEmail(request.getEmail());
        token.setResetCode(resetCode);
        token.setExpiresAt(LocalDateTime.now().plusMinutes(15));
        token.setIsUsed(false);
        token.setCreatedAt(LocalDateTime.now());
        
        resetTokenRepository.save(token);
        
        // TODO: Email gönder (sonra ekleyeceğiz)
        System.out.println("Reset Code: " + resetCode);
        
        return new AuthResponse(true, "Reset code sent to your email", resetCode);
    }
    
    // Verify Reset Code
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
    
    // Reset Password
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
        // TODO: Şifreyi hash'le (BCrypt ile - sonra ekleyeceğiz)
        user.setPassword(request.getNewPassword());
        user.setUpdatedAt(LocalDateTime.now());
        
        userRepository.save(user);
        
        // Token'ı kullanıldı olarak işaretle
        PasswordResetToken token = tokenOpt.get();
        token.setIsUsed(true);
        resetTokenRepository.save(token);
        
        return new AuthResponse(true, "Password reset successful");
    }
    
    // 6 haneli kod oluştur
    private String generateResetCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }

    // Update Account
    @Transactional
    public AuthResponse updateAccount(Long userId, SignUpRequest request) {
        Optional<User> userOpt = userRepository.findById(userId);
        
        if (userOpt.isEmpty()) {
            return new AuthResponse(false, "User not found");
        }
        
        User user = userOpt.get();
        
        // Email değiştiriliyorsa, başka kullanıcı kullanıyor mu kontrol et
        if (!user.getEmail().equals(request.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                return new AuthResponse(false, "Email already exists");
            }
            user.setEmail(request.getEmail());
        }
        
        // Username değiştiriliyorsa, başka kullanıcı kullanıyor mu kontrol et
        if (!user.getUsername().equals(request.getUsername())) {
            if (userRepository.existsByUsername(request.getUsername())) {
                return new AuthResponse(false, "Username already exists");
            }
            user.setUsername(request.getUsername());
        }
        
        // Password güncelleme (opsiyonel)
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(request.getPassword());
        }
        
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        
        return new AuthResponse(true, "Account updated successfully", user);
    }
    
    // Delete Account
    @Transactional
    public AuthResponse deleteAccount(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        
        if (userOpt.isEmpty()) {
            return new AuthResponse(false, "User not found");
        }
        
        userRepository.deleteById(userId);
        
        return new AuthResponse(true, "Account deleted successfully");
    }
}
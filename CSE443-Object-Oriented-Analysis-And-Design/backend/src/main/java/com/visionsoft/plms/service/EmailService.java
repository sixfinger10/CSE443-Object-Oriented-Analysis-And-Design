package com.visionsoft.plms.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    public void sendResetCode(String toEmail, String resetCode) {
        try {
            System.out.println("=== EMAIL GÖNDERME BAŞLADI ===");
            System.out.println("Alıcı: " + toEmail);
            System.out.println("Kod: " + resetCode);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("visionsoftplms@gmail.com");
            message.setTo(toEmail);
            message.setSubject("Password Reset Code - PLMS");
            message.setText("Your password reset code is: " + resetCode + "\n\nThis code will expire in 15 minutes.\n\nIf you didn't request this, please ignore this email.");
            
            System.out.println("Mail gönderiliyor...");
            mailSender.send(message);
            System.out.println("=== EMAIL BAŞARIYLA GÖNDERİLDİ ===");
            
        } catch (Exception e) {
            System.err.println("=== EMAIL GÖNDERME HATASI ===");
            e.printStackTrace();
            throw new RuntimeException("Email gönderilemedi: " + e.getMessage(), e);
        }
    }
}
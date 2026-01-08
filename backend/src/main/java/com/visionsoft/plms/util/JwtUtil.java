package com.visionsoft.plms.util;

import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.Date;
import java.util.UUID;

/**
 * JWT Token Utility Class
 * Token formatı: userId:username:timestamp:random (Base64 encoded)
 */
@Component
public class JwtUtil {
    
    private static final long EXPIRATION_TIME = 86400000; // 24 saat (milliseconds)
    
    /**
     * Token oluştur (User ID ve Username ile)
     * @param userId Kullanıcı ID
     * @param username Kullanıcı adı
     * @return Base64 encoded token
     */
    public String generateToken(Long userId, String username) {
        String timestamp = String.valueOf(new Date().getTime());
        String random = UUID.randomUUID().toString();
        
        // Format: userId:username:timestamp:random
        String token = userId + ":" + username + ":" + timestamp + ":" + random;
        
        // Base64 encode
        return Base64.getEncoder().encodeToString(token.getBytes());
    }
    
    /**
     * Token'dan User ID çıkar
     * @param token Base64 encoded token
     * @return User ID veya null (hata varsa)
     */
    public Long extractUserId(String token) {
        try {
            String decoded = new String(Base64.getDecoder().decode(token));
            String[] parts = decoded.split(":");
            
            if (parts.length < 4) {
                return null;
            }
            
            return Long.parseLong(parts[0]);
        } catch (Exception e) {
            System.err.println("Token'dan User ID çıkarılamadı: " + e.getMessage());
            return null;
        }
    }
    
    /**
     * Token'dan Username çıkar
     * @param token Base64 encoded token
     * @return Username veya null (hata varsa)
     */
    public String extractUsername(String token) {
        try {
            String decoded = new String(Base64.getDecoder().decode(token));
            String[] parts = decoded.split(":");
            
            if (parts.length < 4) {
                return null;
            }
            
            return parts[1];
        } catch (Exception e) {
            System.err.println("Token'dan Username çıkarılamadı: " + e.getMessage());
            return null;
        }
    }
    
    /**
     * Token'ı doğrula (geçerli mi, süresi dolmamış mı?)
     * @param token Base64 encoded token
     * @return true = geçerli, false = geçersiz
     */
    public boolean validateToken(String token) {
        try {
            String decoded = new String(Base64.getDecoder().decode(token));
            String[] parts = decoded.split(":");
            
            // Format kontrolü
            if (parts.length < 4) {
                return false;
            }
            
            // Timestamp kontrolü
            long timestamp = Long.parseLong(parts[2]);
            long now = new Date().getTime();
            long diff = now - timestamp;
            
            // 24 saatten eski mi?
            if (diff > EXPIRATION_TIME) {
                System.out.println("Token süresi dolmuş. Geçen süre: " + (diff / 1000 / 60) + " dakika");
                return false;
            }
            
            return true;
        } catch (Exception e) {
            System.err.println("Token doğrulama hatası: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Token'dan timestamp çıkar (debug için)
     * @param token Base64 encoded token
     * @return Timestamp veya null
     */
    public Long extractTimestamp(String token) {
        try {
            String decoded = new String(Base64.getDecoder().decode(token));
            String[] parts = decoded.split(":");
            
            if (parts.length < 4) {
                return null;
            }
            
            return Long.parseLong(parts[2]);
        } catch (Exception e) {
            return null;
        }
    }
}
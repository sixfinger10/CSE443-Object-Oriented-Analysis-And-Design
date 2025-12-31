package com.visionsoft.plms.repository;

import com.visionsoft.plms.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    
    Optional<PasswordResetToken> findByEmailAndResetCodeAndIsUsedFalse(String email, String resetCode);
    
    Optional<PasswordResetToken> findByEmailAndResetCodeAndIsUsedFalseAndExpiresAtAfter(
        String email, 
        String resetCode, 
        LocalDateTime currentTime
    );
    
    void deleteByEmail(String email);
    
    void deleteByExpiresAtBefore(LocalDateTime currentTime);
}
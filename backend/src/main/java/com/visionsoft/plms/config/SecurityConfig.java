package com.visionsoft.plms.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // ✅ CORS yapılandırmasını aktif et
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // CSRF'yi kapat
                .csrf(csrf -> csrf.disable())

                // Tüm isteklere izin ver (geliştirme için)
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                );

        return http.build();
    }

    // ✅ CORS yapılandırma bean'i
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // İzin verilen origin'ler (frontend URL'leri)
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173",      // Vite dev server (varsayılan)
                "http://localhost:5174",      // Vite alternatif port
                "http://localhost:3000",      // React Create App (alternatif)
                "http://localhost:4173"       // Vite preview mode
        ));

        // İzin verilen HTTP metodları
        configuration.setAllowedMethods(Arrays.asList(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "PATCH",
                "OPTIONS"
        ));

        // İzin verilen header'lar
        configuration.setAllowedHeaders(Arrays.asList("*"));

        // Credentials (cookies, authorization headers) izni
        configuration.setAllowCredentials(true);

        // Exposed headers (frontend'in erişebileceği response header'ları)
        configuration.setExposedHeaders(Arrays.asList(
                "Authorization",
                "X-User-Id",
                "Content-Type"
        ));

        // Preflight request cache süresi (saniye)
        configuration.setMaxAge(3600L);

        // Yapılandırmayı tüm /api/* endpoint'lerine uygula
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);

        return source;
    }
}
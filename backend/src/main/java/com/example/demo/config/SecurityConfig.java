package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Enable CORS and use the CorsConfigurationSource bean or CorsFilter mapped globally
            .cors(Customizer.withDefaults())
            
            // Disable CSRF temporarily for testing
            .csrf(AbstractHttpConfigurer::disable)
            
            // Configure endpoint authorization
            .authorizeHttpRequests(auth -> auth
                // Permit public routes
                .requestMatchers("/", "/error", "/api/public/**").permitAll()
                // Require authentication for everything else
                .anyRequest().authenticated()
            )
            
            // Enable OAuth 2.0 Login
            .oauth2Login(oauth2 -> oauth2
                // Redirect to frontend dashboard after success
                .defaultSuccessUrl("http://localhost:3000/dashboard", true)
            );

        return http.build();
    }
}

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
            
            // Disable CSRF since we are using tokens or headers for auth in a stateless API
            .csrf(AbstractHttpConfigurer::disable)
            
            // Configure endpoint authorization
            .authorizeHttpRequests(auth -> auth
                // Allow all requests for now, adjust based on your actual auth mechanism
                .anyRequest().permitAll()
            );

        return http.build();
    }
}

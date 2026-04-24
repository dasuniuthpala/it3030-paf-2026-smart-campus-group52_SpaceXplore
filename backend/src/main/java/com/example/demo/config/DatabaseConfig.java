package com.example.demo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class DatabaseConfig {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Bean
    public CommandLineRunner updateSchema() {
        return args -> {
            try {
                System.out.println("Executing manual schema update: Changing avatar_url to TEXT...");
                jdbcTemplate.execute("ALTER TABLE users ALTER COLUMN avatar_url TYPE TEXT;");
                System.out.println("Schema update successful.");
            } catch (Exception e) {
                System.out.println("Schema update note: " + e.getMessage());
                // This might fail if the column is already TEXT or if there are other issues,
                // but it will ensure the column is updated if it was stuck as VARCHAR(255).
            }
        };
    }
}

package com.example.demo.config;

import com.example.demo.model.Resource;
import com.example.demo.model.User;
import com.example.demo.model.Role;
import com.example.demo.repository.ResourceRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.dao.DataAccessException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.Optional;

@Configuration
public class DataSeeder {

    @org.springframework.beans.factory.annotation.Value("${app.admin.email:admin@spacexplore.local}")
    private String adminEmail;

    @org.springframework.beans.factory.annotation.Value("${app.admin.name:Super Admin}")
    private String adminName;

    @Bean
    CommandLineRunner initDatabase(ResourceRepository resourceRepository, 
                                 UserRepository userRepository, 
                                 PasswordEncoder passwordEncoder) {
        return args -> {
            // Seed Super Admin
            Optional<User> existingAdmin = userRepository.findByEmail(adminEmail);
            if (existingAdmin.isEmpty()) {
                User admin = new User();
                String[] nameParts = adminName.split(" ");
                admin.setFirstName(nameParts[0]);
                admin.setLastName(nameParts.length > 1 ? nameParts[1] : "");
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode("admin123")); // Default password
                admin.setRole(Role.SUPER_ADMIN);
                userRepository.save(admin);
                System.out.println("Super Admin created: " + adminEmail);
            } else {
                User admin = existingAdmin.get();
                if (admin.getRole() != Role.SUPER_ADMIN) {
                    admin.setRole(Role.SUPER_ADMIN);
                    userRepository.save(admin);
                    System.out.println("Existing user promoted to Super Admin: " + adminEmail);
                }
            }

            // Seed Resources only when the table is available.
            try {
                if (resourceRepository.count() == 0) {
                    Resource f1205 = new Resource(null, "Smart Class Room F1205", "CLASSROOM", 50, "New Building - F Block", "ACTIVE", "08:00 - 18:00", "https://images.unsplash.com/photo-1544531586-fde5298cdd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
                    Resource f1206 = new Resource(null, "Smart Class Room F1206", "CLASSROOM", 50, "New Building - F Block", "ACTIVE", "08:00 - 18:00", "https://images.unsplash.com/photo-1577416412292-747c6607f055?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
                    Resource g604 = new Resource(null, "Smart Class Room G604", "CLASSROOM", 40, "New Building - G Block", "ACTIVE", "08:00 - 18:00", "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
                    Resource g605 = new Resource(null, "Smart Class Room G605", "CLASSROOM", 40, "New Building - G Block", "OUT_OF_SERVICE", "08:00 - 18:00", "https://images.unsplash.com/photo-1510531704581-5b2870972060?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
                    Resource a405 = new Resource(null, "Meeting Room A405", "ROOM", 15, "Main Building - A Block", "ACTIVE", "09:00 - 17:00", "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
                    Resource a608 = new Resource(null, "Projector Room A608", "ROOM", 20, "Main Building - A Block", "ACTIVE", "09:00 - 17:00", "https://images.unsplash.com/photo-1505409859467-3a796fd5798e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
                    Resource lib1 = new Resource(null, "Library Discussion Room 1", "ROOM", 8, "Main Library", "ACTIVE", "08:00 - 20:00", "https://images.unsplash.com/photo-1568667256549-094345857637?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
                    Resource lib2 = new Resource(null, "Library Quiet Study Zone", "ROOM", 100, "Main Library", "ACTIVE", "08:00 - 20:00", "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
                    Resource lab1 = new Resource(null, "Advanced Network Lab", "LAB", 30, "Computing Block", "ACTIVE", "08:30 - 17:30", "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
                    Resource proj = new Resource(null, "Portable Projector 4K", "EQUIPMENT", 1, "AV Center", "ACTIVE", "08:00 - 16:00", "https://images.unsplash.com/photo-1626242313622-540c49cc8b71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");

                    resourceRepository.saveAll(Arrays.asList(f1205, f1206, g604, g605, a405, a608, lib1, lib2, lab1, proj));
                    System.out.println("Sample resources loaded into the database.");
                }
            } catch (DataAccessException ex) {
                System.out.println("Skipping resource seed because the resources table is not available yet: " + ex.getMessage());
            }
        };
    }
}

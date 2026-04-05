package com.example.demo.config;

import com.example.demo.model.Resource;
import com.example.demo.repository.ResourceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(ResourceRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                // New building smart class rooms
                Resource f1205 = new Resource(null, "Smart Class Room F1205", "CLASSROOM", 50, "New Building - F Block", "ACTIVE", "08:00 - 18:00", "https://images.unsplash.com/photo-1544531586-fde5298cdd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
                Resource f1206 = new Resource(null, "Smart Class Room F1206", "CLASSROOM", 50, "New Building - F Block", "ACTIVE", "08:00 - 18:00", "https://images.unsplash.com/photo-1577416412292-747c6607f055?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
                Resource g604 = new Resource(null, "Smart Class Room G604", "CLASSROOM", 40, "New Building - G Block", "ACTIVE", "08:00 - 18:00", "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
                Resource g605 = new Resource(null, "Smart Class Room G605", "CLASSROOM", 40, "New Building - G Block", "OUT_OF_SERVICE", "08:00 - 18:00", "https://images.unsplash.com/photo-1510531704581-5b2870972060?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");

                // Main building
                Resource a405 = new Resource(null, "Meeting Room A405", "ROOM", 15, "Main Building - A Block", "ACTIVE", "09:00 - 17:00", "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
                Resource a608 = new Resource(null, "Projector Room A608", "ROOM", 20, "Main Building - A Block", "ACTIVE", "09:00 - 17:00", "https://images.unsplash.com/photo-1505409859467-3a796fd5798e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");

                // Library
                Resource lib1 = new Resource(null, "Library Discussion Room 1", "ROOM", 8, "Main Library", "ACTIVE", "08:00 - 20:00", "https://images.unsplash.com/photo-1568667256549-094345857637?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
                Resource lib2 = new Resource(null, "Library Quiet Study Zone", "ROOM", 100, "Main Library", "ACTIVE", "08:00 - 20:00", "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");

                // Others
                Resource lab1 = new Resource(null, "Advanced Network Lab", "LAB", 30, "Computing Block", "ACTIVE", "08:30 - 17:30", "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
                Resource proj = new Resource(null, "Portable Projector 4K", "EQUIPMENT", 1, "AV Center", "ACTIVE", "08:00 - 16:00", "https://images.unsplash.com/photo-1626242313622-540c49cc8b71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");

                repository.saveAll(Arrays.asList(f1205, f1206, g604, g605, a405, a608, lib1, lib2, lab1, proj));
                System.out.println("Sample resources loaded into the database.");
            }
        };
    }
}

package com.example.demo.service;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.ProfileUpdateRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.dto.UserResponse;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserResponse register(RegisterRequest request) {
        System.out.println("Attempting to register: " + request.getEmail());
        
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User with this email already exists");
        }

        // Create new user
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);

        if (request.getEmail().toLowerCase().endsWith("@admin.local")) {
            user.setRole(Role.ADMIN);
        }

        User savedUser = userRepository.save(user);
        System.out.println("User saved successfully with ID: " + savedUser.getId());

        return new UserResponse(
                savedUser.getId(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getEmail(),
                generateToken(savedUser),
                savedUser.getRole(),
                savedUser.getStudentId(),
                savedUser.getAcademicProgram(),
                savedUser.getDegreeProgress(),
                savedUser.getLabCredits(),
                savedUser.getAvatarUrl()
        );
    }

    public UserResponse login(LoginRequest request) {
        System.out.println("Attempting login for: " + request.getEmail());
        
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOptional.get();

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        System.out.println("Login successful for: " + user.getEmail());

        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                generateToken(user),
                user.getRole(),
                user.getStudentId(),
                user.getAcademicProgram(),
                user.getDegreeProgress(),
                user.getLabCredits(),
                user.getAvatarUrl()
        );
    }

    public UserResponse updateProfile(Long userId, ProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getStudentId() != null) user.setStudentId(request.getStudentId());
        if (request.getAcademicProgram() != null) user.setAcademicProgram(request.getAcademicProgram());
        if (request.getDegreeProgress() != null) user.setDegreeProgress(request.getDegreeProgress());
        if (request.getLabCredits() != null) user.setLabCredits(request.getLabCredits());
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());

        User updated = userRepository.save(user);

        return new UserResponse(
                updated.getId(),
                updated.getFirstName(),
                updated.getLastName(),
                updated.getEmail(),
                generateToken(updated),
                updated.getRole(),
                updated.getStudentId(),
                updated.getAcademicProgram(),
                updated.getDegreeProgress(),
                updated.getLabCredits(),
                updated.getAvatarUrl()
        );
    }

    private String generateToken(User user) {
        return "token_" + user.getId() + "_" + System.currentTimeMillis();
    }
}
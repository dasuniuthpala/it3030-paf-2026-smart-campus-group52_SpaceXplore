package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.dto.UserResponse;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            UserResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        try {
            UserResponse response = authService.login(request);

            // Register the authenticated user into Spring's SecurityContext
            // so that subsequent /api/admin/** calls authenticated via session cookie work.
            User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                user.getEmail(),
                null,
                Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
            );

            SecurityContext sc = SecurityContextHolder.getContext();
            sc.setAuthentication(authToken);

            HttpSession session = httpRequest.getSession(true);
            session.setAttribute(
                HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, sc
            );

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(401).build();
        }

        String email = auth.getName();
        return userRepository.findByEmail(email)
                .map(user -> {
                    UserResponse res = new UserResponse();
                    res.setId(user.getId());
                    res.setFirstName(user.getFirstName());
                    res.setLastName(user.getLastName());
                    res.setEmail(user.getEmail());
                    res.setRole(user.getRole());
                    res.setToken("session");
                    res.setStudentId(user.getStudentId());
                    res.setAcademicProgram(user.getAcademicProgram());
                    res.setDegreeProgress(user.getDegreeProgress());
                    res.setLabCredits(user.getLabCredits());
                    res.setAvatarUrl(user.getAvatarUrl());
                    return ResponseEntity.ok(res);
                })
                .orElse(ResponseEntity.status(401).build());
    }

    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@RequestBody com.example.demo.dto.ProfileUpdateRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(401).build();
        }

        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            UserResponse response = authService.updateProfile(user.getId(), request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace(); // Log the actual error
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
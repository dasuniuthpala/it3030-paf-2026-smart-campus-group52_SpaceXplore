package com.example.demo.controller;

import com.example.demo.dto.BookingActionRequest;
import com.example.demo.dto.BookingRequest;
import com.example.demo.dto.BookingResponse;
import com.example.demo.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    private Long getUserIdFromHeader(String header) {
        if (header == null || header.isBlank()) {
            throw new RuntimeException("Missing X-User-Id header");
        }
        try {
            return Long.parseLong(header);
        } catch (NumberFormatException e) {
            throw new RuntimeException("Invalid user id header");
        }
    }

    private void requireAdmin(String roleHeader) {
        if (roleHeader == null || !roleHeader.equalsIgnoreCase("ADMIN")) {
            throw new RuntimeException("Admin role required");
        }
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @RequestHeader("X-User-Id") String userIdHeader,
            @RequestHeader(value = "X-User-Role", required = false) String role,
            @RequestHeader("X-User-Email") String userEmail,
            @RequestBody BookingRequest request
    ) {
        Long userId = getUserIdFromHeader(userIdHeader);
        BookingResponse created = bookingService.createBooking(request, userId, userEmail);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingResponse>> getMyBookings(@RequestHeader("X-User-Id") String userIdHeader) {
        Long userId = getUserIdFromHeader(userIdHeader);
        return ResponseEntity.ok(bookingService.getMyBookings(userId));
    }

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getAllBookings(
            @RequestHeader("X-User-Role") String role,
            @RequestParam(value = "resourceName", required = false) String resourceName,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        requireAdmin(role);
        return ResponseEntity.ok(bookingService.getAllBookings(Optional.ofNullable(resourceName), Optional.ofNullable(status), Optional.ofNullable(date)));
    }

    @GetMapping("/conflicts/list")
    public ResponseEntity<List<BookingResponse>> getConflicts(
            @RequestHeader("X-User-Role") String role
    ) {
        requireAdmin(role);
        return ResponseEntity.ok(bookingService.getConflictingBookings());
    }

    @PutMapping("/{bookingId}/approve")
    public ResponseEntity<BookingResponse> approve(
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Id") String adminUserIdHeader,
            @PathVariable Long bookingId,
            @RequestBody BookingActionRequest action
    ) {
        requireAdmin(role);
        Long adminId = getUserIdFromHeader(adminUserIdHeader);
        return ResponseEntity.ok(bookingService.approveBooking(bookingId, action, adminId));
    }

    @PutMapping("/{bookingId}/reject")
    public ResponseEntity<BookingResponse> reject(
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Id") String adminUserIdHeader,
            @PathVariable Long bookingId,
            @RequestBody BookingActionRequest action
    ) {
        requireAdmin(role);
        Long adminId = getUserIdFromHeader(adminUserIdHeader);
        return ResponseEntity.ok(bookingService.rejectBooking(bookingId, action, adminId));
    }

    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<BookingResponse> cancel(
            @RequestHeader("X-User-Id") String userIdHeader,
            @PathVariable Long bookingId
    ) {
        Long userId = getUserIdFromHeader(userIdHeader);
        return ResponseEntity.ok(bookingService.cancelBooking(bookingId, userId));
    }
}
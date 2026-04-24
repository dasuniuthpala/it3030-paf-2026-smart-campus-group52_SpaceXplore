package com.example.demo.service;

import com.example.demo.dto.BookingActionRequest;
import com.example.demo.repository.BookingRepository;
import com.example.demo.dto.BookingRequest;
import com.example.demo.dto.BookingResponse;
import com.example.demo.model.Booking;
import com.example.demo.model.BookingStatus;
import com.example.demo.model.Notification;
import com.example.demo.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import com.example.demo.repository.UserRepository;
import com.example.demo.model.User;
import com.example.demo.model.Role;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    public BookingResponse createBooking(BookingRequest payload, Long userId, String userEmail) {
        validateBookingPayload(payload);

        if (hasConflict(payload.getResourceName(), payload.getDate(), payload.getStartTime(), payload.getEndTime())) {
            throw new RuntimeException("Time slot conflict for this resource.");
        }

        Booking booking = new Booking();
        booking.setResourceName(payload.getResourceName());
        booking.setDate(payload.getDate());
        booking.setStartTime(payload.getStartTime());
        booking.setEndTime(payload.getEndTime());
        booking.setPurpose(payload.getPurpose());
        booking.setAttendees(payload.getAttendees());
        booking.setRequestedByUserId(userId);
        booking.setRequestedByEmail(userEmail);
        booking.setStatus(BookingStatus.PENDING);

        Booking saved = bookingRepository.save(booking);
        
        // Notify the requester
        Notification userNotif = new Notification();
        userNotif.setUserId(userId);
        userNotif.setTitle("Booking Request Submitted");
        userNotif.setMessage("Your booking request for " + payload.getResourceName() + " on " + payload.getDate() + " has been submitted and is pending approval.");
        notificationRepository.save(userNotif);

        List<User> admins = userRepository.findByRoleIn(List.of(Role.ADMIN, Role.SUPER_ADMIN, Role.MANAGER));
        for (User admin : admins) {
            Notification adminNotif = new Notification();
            adminNotif.setUserId(admin.getId());
            adminNotif.setTitle("New Booking Request");
            adminNotif.setMessage("User " + userEmail + " requested a new booking for " + payload.getResourceName() + " on " + payload.getDate() + ".");
            notificationRepository.save(adminNotif);
        }

        return map(saved);
    }

    private void validateBookingPayload(BookingRequest payload) {
        if (payload.getResourceName() == null || payload.getResourceName().isBlank()) {
            throw new RuntimeException("resourceName is required");
        }
        if (payload.getDate() == null) {
            throw new RuntimeException("date is required");
        }
        if (payload.getStartTime() == null || payload.getEndTime() == null
                || !payload.getEndTime().isAfter(payload.getStartTime())) {
            throw new RuntimeException("startTime and endTime must be valid and endTime must be after startTime.");
        }
        if (payload.getPurpose() == null || payload.getPurpose().isBlank()) {
            throw new RuntimeException("purpose is required");
        }
        if (payload.getAttendees() == null || payload.getAttendees() < 1) {
            throw new RuntimeException("attendees must be at least 1");
        }
    }

    private boolean hasConflict(String resourceName, LocalDate date, LocalTime startTime, LocalTime endTime) {
        List<Booking> existing = bookingRepository.findByResourceNameAndDateAndStatusIn(resourceName, date,
                List.of(BookingStatus.PENDING, BookingStatus.APPROVED));
        return existing.stream().anyMatch(b -> isOverlap(b.getStartTime(), b.getEndTime(), startTime, endTime));
    }

    private boolean hasConflictExcluding(String resourceName, LocalDate date, LocalTime startTime, LocalTime endTime,
            Long excludeBookingId) {
        List<Booking> existing = bookingRepository.findByResourceNameAndDateAndStatusIn(resourceName, date,
                List.of(BookingStatus.PENDING, BookingStatus.APPROVED));
        return existing.stream()
                .filter(b -> !b.getId().equals(excludeBookingId))
                .anyMatch(b -> isOverlap(b.getStartTime(), b.getEndTime(), startTime, endTime));
    }

    private boolean isOverlap(LocalTime existingStart, LocalTime existingEnd, LocalTime newStart, LocalTime newEnd) {
        return newStart.isBefore(existingEnd) && existingStart.isBefore(newEnd);
    }

    public List<BookingResponse> getMyBookings(Long userId) {
        return bookingRepository.findByRequestedByUserId(userId).stream()
                .filter(b -> !b.getStatus().name().equals("CANCELLED"))
                .map(this::map).collect(Collectors.toList());
    }

    public List<BookingResponse> getAllBookings(Optional<String> resourceNameOpt, Optional<String> statusOpt,
            Optional<LocalDate> dateOpt) {
        List<Booking> all = bookingRepository.findAll();

        return all.stream()
                .filter(booking -> !booking.getStatus().name().equals("CANCELLED"))
                .filter(booking -> resourceNameOpt
                        .map(p -> booking.getResourceName().toLowerCase().contains(p.toLowerCase())).orElse(true))
                .filter(booking -> statusOpt.map(s -> booking.getStatus().name().equalsIgnoreCase(s)).orElse(true))
                .filter(booking -> dateOpt.map(d -> booking.getDate().equals(d)).orElse(true))
                .map(this::map)
                .collect(Collectors.toList());
    }

    public BookingResponse approveBooking(Long bookingId, BookingActionRequest action, Long adminUserId) {
        Booking existing = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (existing.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only pending bookings can be approved");
        }

        if (hasConflictExcluding(existing.getResourceName(), existing.getDate(), existing.getStartTime(),
                existing.getEndTime(), bookingId)) {
            throw new RuntimeException("Booking cannot be approved due to conflict with other approved bookings.");
        }

        existing.setStatus(BookingStatus.APPROVED);
        existing.setDecisionReason(action.getReason());
        existing.setReviewedByAdminId(adminUserId);

        Booking saved = bookingRepository.save(existing);

        Notification notif = new Notification();
        notif.setUserId(existing.getRequestedByUserId());
        notif.setTitle("Booking Approved");
        notif.setMessage(
                "Your booking for " + existing.getResourceName() + " on " + existing.getDate() + " has been approved.");
        notificationRepository.save(notif);

        return map(saved);
    }

    public BookingResponse rejectBooking(Long bookingId, BookingActionRequest action, Long adminUserId) {
        Booking existing = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (existing.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only pending bookings can be rejected");
        }

        existing.setStatus(BookingStatus.REJECTED);
        existing.setDecisionReason(action.getReason());
        existing.setReviewedByAdminId(adminUserId);

        Booking saved = bookingRepository.save(existing);

        Notification notif = new Notification();
        notif.setUserId(existing.getRequestedByUserId());
        notif.setTitle("Booking Rejected");
        notif.setMessage("Your booking for " + existing.getResourceName() + " on " + existing.getDate()
                + " was rejected. Reason: " + action.getReason());
        notificationRepository.save(notif);

        return map(saved);
    }

    public BookingResponse cancelBooking(Long bookingId, Long userId) {
        Booking existing = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (existing.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking is already cancelled");
        }

        if (!existing.getRequestedByUserId().equals(userId)) {
            throw new RuntimeException("Only booking owner can cancel");
        }

        existing.setStatus(BookingStatus.CANCELLED);
        existing.setDecisionReason("Cancelled by user");

        Booking saved = bookingRepository.save(existing);
        
        // Notify admins about cancellation
        List<User> admins = userRepository.findByRoleIn(List.of(Role.ADMIN, Role.SUPER_ADMIN, Role.MANAGER));
        for (User admin : admins) {
            Notification adminNotif = new Notification();
            adminNotif.setUserId(admin.getId());
            adminNotif.setTitle("Booking Cancelled");
            adminNotif.setMessage("User ID " + userId + " cancelled their booking for " + existing.getResourceName() + " on " + existing.getDate() + ".");
            notificationRepository.save(adminNotif);
        }

        return map(saved);
    }

    public List<BookingResponse> getConflictingBookings() {
        List<Booking> allBookings = bookingRepository.findAll();

        // Filter out cancelled bookings
        List<Booking> activeBookings = allBookings.stream()
                .filter(b -> !b.getStatus().name().equals("CANCELLED"))
                .collect(Collectors.toList());

        List<BookingResponse> conflicts = new java.util.ArrayList<>();

        // For each booking, check if there are other bookings from different users with
        // the same resource, date, and overlapping times
        for (Booking booking : activeBookings) {
            List<Booking> potentialConflicts = activeBookings.stream()
                    .filter(b -> !b.getId().equals(booking.getId())) // Different booking
                    .filter(b -> !b.getRequestedByUserId().equals(booking.getRequestedByUserId())) // Different user
                    .filter(b -> b.getResourceName().equals(booking.getResourceName())) // Same resource
                    .filter(b -> b.getDate().equals(booking.getDate())) // Same date
                    .filter(b -> isOverlap(b.getStartTime(), b.getEndTime(), booking.getStartTime(),
                            booking.getEndTime())) // Overlapping time
                    .collect(Collectors.toList());

            // If there are conflicts, add this booking to the result (avoid duplicates by
            // checking if it's not already added)
            if (!potentialConflicts.isEmpty() && !conflicts.stream().anyMatch(c -> c.getId().equals(booking.getId()))) {
                conflicts.add(map(booking));
            }
        }

        return conflicts;
    }

    private BookingResponse map(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getResourceName(),
                booking.getDate(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getPurpose(),
                booking.getAttendees(),
                booking.getRequestedByUserId(),
                booking.getRequestedByEmail(),
                booking.getStatus(),
                booking.getDecisionReason(),
                booking.getCreatedAt());
    }
}

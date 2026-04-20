package com.example.demo.service;

import com.example.demo.dto.BookingActionRequest;
import com.example.demo.dto.BookingRequest;
import com.example.demo.dto.BookingResponse;
import com.example.demo.model.Booking;
import com.example.demo.model.BookingStatus;
import com.example.demo.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

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
        return map(saved);
    }

    private void validateBookingPayload(BookingRequest payload) {
        if (payload.getResourceName() == null || payload.getResourceName().isBlank()) {
            throw new RuntimeException("resourceName is required");
        }
        if (payload.getDate() == null) {
            throw new RuntimeException("date is required");
        }
        if (payload.getStartTime() == null || payload.getEndTime() == null || !payload.getEndTime().isAfter(payload.getStartTime())) {
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
        List<Booking> existing = bookingRepository.findByResourceNameAndDateAndStatusIn(resourceName, date, List.of(BookingStatus.PENDING, BookingStatus.APPROVED));
        return existing.stream().anyMatch(b -> isOverlap(b.getStartTime(), b.getEndTime(), startTime, endTime));
    }

    private boolean hasConflictExcluding(String resourceName, LocalDate date, LocalTime startTime, LocalTime endTime, Long excludeBookingId) {
        List<Booking> existing = bookingRepository.findByResourceNameAndDateAndStatusIn(resourceName, date, List.of(BookingStatus.PENDING, BookingStatus.APPROVED));
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

    public List<BookingResponse> getAllBookings(Optional<String> resourceNameOpt, Optional<String> statusOpt, Optional<LocalDate> dateOpt) {
        List<Booking> all = bookingRepository.findAll();

        return all.stream()
                .filter(booking -> !booking.getStatus().name().equals("CANCELLED"))
                .filter(booking -> resourceNameOpt.map(p -> booking.getResourceName().toLowerCase().contains(p.toLowerCase())).orElse(true))
                .filter(booking -> statusOpt.map(s -> booking.getStatus().name().equalsIgnoreCase(s)).orElse(true))
                .filter(booking -> dateOpt.map(d -> booking.getDate().equals(d)).orElse(true))
                .map(this::map)
                .collect(Collectors.toList());
    }

    public BookingResponse approveBooking(Long bookingId, BookingActionRequest action, Long adminUserId) {
        Booking existing = bookingRepository.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking not found"));

        if (existing.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only pending bookings can be approved");
        }

        if (hasConflictExcluding(existing.getResourceName(), existing.getDate(), existing.getStartTime(), existing.getEndTime(), bookingId)) {
            throw new RuntimeException("Booking cannot be approved due to conflict with other approved bookings.");
        }

        existing.setStatus(BookingStatus.APPROVED);
        existing.setDecisionReason(action.getReason());
        existing.setReviewedByAdminId(adminUserId);

        return map(bookingRepository.save(existing));
    }

    public BookingResponse rejectBooking(Long bookingId, BookingActionRequest action, Long adminUserId) {
        Booking existing = bookingRepository.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking not found"));

        if (existing.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only pending bookings can be rejected");
        }

        existing.setStatus(BookingStatus.REJECTED);
        existing.setDecisionReason(action.getReason());
        existing.setReviewedByAdminId(adminUserId);

        return map(bookingRepository.save(existing));
    }

    public BookingResponse cancelBooking(Long bookingId, Long userId) {
        Booking existing = bookingRepository.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking not found"));

        if (existing.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking is already cancelled");
        }

        if (!existing.getRequestedByUserId().equals(userId)) {
            throw new RuntimeException("Only booking owner can cancel");
        }

        existing.setStatus(BookingStatus.CANCELLED);
        existing.setDecisionReason("Cancelled by user");

        return map(bookingRepository.save(existing));
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
                booking.getDecisionReason()
        );
    }
}

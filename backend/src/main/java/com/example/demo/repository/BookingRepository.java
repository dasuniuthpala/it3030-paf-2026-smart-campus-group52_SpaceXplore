package com.example.demo.repository;

import com.example.demo.model.Booking;
import com.example.demo.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByRequestedByUserId(Long userId);
    List<Booking> findByStatus(BookingStatus status);
    List<Booking> findByResourceNameContainingIgnoreCase(String resourceName);
    List<Booking> findByResourceNameAndDateAndStatusIn(String resourceName, LocalDate date, List<BookingStatus> status);
}

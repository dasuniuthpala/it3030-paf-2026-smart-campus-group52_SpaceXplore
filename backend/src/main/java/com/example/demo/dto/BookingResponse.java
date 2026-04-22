package com.example.demo.dto;

import com.example.demo.model.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private Long id;
    private String resourceName;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String purpose;
    private Integer attendees;
    private Long requestedByUserId;
    private String requestedByEmail;
    private BookingStatus status;
    private String decisionReason;
    private Long createdAt;
  
}

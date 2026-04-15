package com.example.demo.repository;

import com.example.demo.model.IncidentTicket;
import com.example.demo.model.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<IncidentTicket, Long> {
    List<IncidentTicket> findByCreatedBy(String createdBy);
    List<IncidentTicket> findByStatus(TicketStatus status);
    List<IncidentTicket> findByAssignedTo(String assignedTo);
}
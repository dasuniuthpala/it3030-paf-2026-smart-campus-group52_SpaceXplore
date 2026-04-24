package com.example.demo.repository;

import com.example.demo.model.TicketAttachment;
import com.example.demo.model.IncidentTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AttachmentRepository extends JpaRepository<TicketAttachment, Long> {
    List<TicketAttachment> findByTicket(IncidentTicket ticket);
}
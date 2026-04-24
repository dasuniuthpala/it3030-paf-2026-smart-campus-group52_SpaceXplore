package com.example.demo.repository;

import com.example.demo.model.TicketComment;
import com.example.demo.model.IncidentTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<TicketComment, Long> {
    List<TicketComment> findByTicketOrderByCreatedAtAsc(IncidentTicket ticket);
    List<TicketComment> findByAuthor(String author);
}
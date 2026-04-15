package com.example.demo.controller;

import com.example.demo.dto.TicketResponseDTO;
import com.example.demo.model.*;
import com.example.demo.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:3000")
public class TicketController {
    
    @Autowired
    private TicketService ticketService;
    
    // Helper method to get current user (temporary solution)
    // In production, replace with your actual authentication
    private String getCurrentUserEmail() {
        // TODO: Replace with actual authentication
        // For now, return a mock user
        return "user@example.com";
    }
    
    private String getCurrentUserName() {
        // TODO: Replace with actual authentication
        return "Test User";
    }
    
    private boolean isAdmin() {
        // TODO: Replace with actual role check
        return false;
    }
    
    // ========== TICKET CRUD ==========
    
    // POST - Create a new ticket (with up to 3 images)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createTicket(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("priority") String priority,
            @RequestParam("category") String category,
            @RequestParam("resourceLocation") String resourceLocation,
            @RequestParam(value = "contactEmail", required = false) String contactEmail,
            @RequestParam(value = "contactPhone", required = false) String contactPhone,
            @RequestParam(value = "files", required = false) List<MultipartFile> files) {
        
        try {
            // Validate priority
            try {
                TicketPriority.valueOf(priority.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid priority. Use: LOW, MEDIUM, HIGH, URGENT"));
            }
            
            IncidentTicket ticket = new IncidentTicket();
            ticket.setTitle(title);
            ticket.setDescription(description);
            ticket.setPriority(TicketPriority.valueOf(priority.toUpperCase()));
            ticket.setCategory(category);
            ticket.setResourceLocation(resourceLocation);
            ticket.setContactEmail(contactEmail);
            ticket.setContactPhone(contactPhone);
            
            String userEmail = getCurrentUserEmail();
            
            IncidentTicket created = ticketService.createTicket(ticket, files, userEmail);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Ticket created successfully");
            response.put("ticketId", created.getId());
            response.put("status", created.getStatus().name());
            
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // GET - Get all tickets (Admin only)
    @GetMapping
    public ResponseEntity<List<TicketResponseDTO>> getAllTickets() {
        List<IncidentTicket> tickets = ticketService.getAllTickets();
        String userEmail = getCurrentUserEmail();
        boolean admin = isAdmin();
        
        List<TicketResponseDTO> responseDTOs = tickets.stream()
                .map(ticket -> ticketService.convertToResponseDTO(ticket, userEmail, admin))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(responseDTOs);
    }
    
    // GET - Get my tickets (logged in user)
    @GetMapping("/my")
    public ResponseEntity<List<TicketResponseDTO>> getMyTickets() {
        String userEmail = getCurrentUserEmail();
        boolean admin = isAdmin();
        
        List<IncidentTicket> tickets = ticketService.getTicketsByUser(userEmail);
        
        List<TicketResponseDTO> responseDTOs = tickets.stream()
                .map(ticket -> ticketService.convertToResponseDTO(ticket, userEmail, admin))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(responseDTOs);
    }
    
    // GET - Get tickets by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<TicketResponseDTO>> getTicketsByStatus(@PathVariable String status) {
        try {
            TicketStatus ticketStatus = TicketStatus.valueOf(status.toUpperCase());
            List<IncidentTicket> tickets = ticketService.getTicketsByStatus(ticketStatus);
            String userEmail = getCurrentUserEmail();
            boolean admin = isAdmin();
            
            List<TicketResponseDTO> responseDTOs = tickets.stream()
                    .map(ticket -> ticketService.convertToResponseDTO(ticket, userEmail, admin))
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(responseDTOs);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // GET - Get tickets assigned to me (technician view)
    @GetMapping("/assigned-to-me")
    public ResponseEntity<List<TicketResponseDTO>> getTicketsAssignedToMe() {
        String userName = getCurrentUserName();
        String userEmail = getCurrentUserEmail();
        boolean admin = isAdmin();
        
        List<IncidentTicket> tickets = ticketService.getTicketsAssignedTo(userName);
        
        List<TicketResponseDTO> responseDTOs = tickets.stream()
                .map(ticket -> ticketService.convertToResponseDTO(ticket, userEmail, admin))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(responseDTOs);
    }
    
    // GET - Get ticket by ID
    @GetMapping("/{id}")
    public ResponseEntity<TicketResponseDTO> getTicketById(@PathVariable Long id) {
        IncidentTicket ticket = ticketService.getTicketById(id);
        if (ticket != null) {
            String userEmail = getCurrentUserEmail();
            boolean admin = isAdmin();
            return ResponseEntity.ok(ticketService.convertToResponseDTO(ticket, userEmail, admin));
        }
        return ResponseEntity.notFound().build();
    }
    
    // ========== STATUS MANAGEMENT ==========
    
    // PUT - Update ticket status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        
        String newStatus = request.get("status");
        String reason = request.get("reason");
        
        // Validate status transition
        IncidentTicket ticket = ticketService.getTicketById(id);
        if (ticket == null) {
            return ResponseEntity.notFound().build();
        }
        
        try {
            TicketStatus status = TicketStatus.valueOf(newStatus.toUpperCase());
            IncidentTicket updated = ticketService.updateStatus(id, newStatus.toUpperCase(), reason);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Status updated to " + newStatus);
            response.put("newStatus", updated.getStatus().name());
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid status"));
        }
    }
    
    // ========== TECHNICIAN MANAGEMENT ==========
    
    // PUT - Assign technician
    @PutMapping("/{id}/assign")
    public ResponseEntity<?> assignTechnician(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        
        String technicianName = request.get("technicianName");
        if (technicianName == null || technicianName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Technician name is required"));
        }
        
        IncidentTicket updated = ticketService.assignTechnician(id, technicianName);
        if (updated != null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Assigned to " + technicianName);
            response.put("assignedTo", updated.getAssignedTo());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }
    
    // PUT - Add resolution notes
    @PutMapping("/{id}/resolution")
    public ResponseEntity<?> addResolutionNotes(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        
        String notes = request.get("notes");
        if (notes == null || notes.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Resolution notes are required"));
        }
        
        IncidentTicket updated = ticketService.addResolutionNotes(id, notes);
        if (updated != null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Resolution notes added");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }
    
    // ========== COMMENT MANAGEMENT ==========
    
    // POST - Add comment to ticket
    @PostMapping("/{id}/comments")
    public ResponseEntity<?> addComment(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        
        String content = request.get("content");
        String authorRole = request.get("authorRole");
        
        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Comment content is required"));
        }
        
        String userName = getCurrentUserName();
        
        TicketComment comment = ticketService.addComment(id, content, userName, authorRole);
        if (comment != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Comment added");
            response.put("comment", comment);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        }
        return ResponseEntity.notFound().build();
    }
    
    // GET - Get comments for a ticket
    @GetMapping("/{id}/comments")
    public ResponseEntity<List<TicketComment>> getComments(@PathVariable Long id) {
        List<TicketComment> comments = ticketService.getCommentsByTicket(id);
        return ResponseEntity.ok(comments);
    }
    
    // PUT - Edit comment (only author)
    @PutMapping("/comments/{commentId}")
    public ResponseEntity<?> editComment(
            @PathVariable Long commentId,
            @RequestBody Map<String, String> request) {
        
        String newContent = request.get("content");
        String userEmail = getCurrentUserEmail();
        
        if (newContent == null || newContent.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Comment content is required"));
        }
        
        TicketComment updated = ticketService.editComment(commentId, newContent, userEmail);
        if (updated != null) {
            return ResponseEntity.ok(Map.of("message", "Comment updated", "comment", updated));
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Cannot edit - not your comment"));
    }
    
    // DELETE - Delete comment (author or admin)
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {
        
        String userEmail = getCurrentUserEmail();
        boolean admin = isAdmin();
        
        boolean deleted = ticketService.deleteComment(commentId, userEmail, admin);
        if (deleted) {
            return ResponseEntity.ok(Map.of("message", "Comment deleted"));
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Cannot delete - not your comment"));
    }
}
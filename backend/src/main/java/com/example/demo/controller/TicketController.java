package com.example.demo.controller;

import com.example.demo.dto.TicketResponseDTO;
import com.example.demo.model.*;
import com.example.demo.service.TicketService;
import jakarta.servlet.http.HttpServletRequest;
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

    private String getCurrentUserEmail(HttpServletRequest request) {
        String email = request.getHeader("X-User-Email");
        return (email != null && !email.isEmpty()) ? email : "unknown@example.com";
    }

    private String getCurrentUserName(HttpServletRequest request) {
        String name = request.getHeader("X-User-Name");
        return (name != null && !name.isEmpty()) ? name : "Unknown User";
    }

    private boolean isAdmin(HttpServletRequest request) {
        String role = request.getHeader("X-User-Role");
        return "ADMIN".equals(role) || "SUPER_ADMIN".equals(role);
    }

    // ========== TICKET CRUD ==========

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createTicket(
            HttpServletRequest request,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("priority") String priority,
            @RequestParam("category") String category,
            @RequestParam("resourceLocation") String resourceLocation,
            @RequestParam(value = "contactEmail", required = false) String contactEmail,
            @RequestParam(value = "contactPhone", required = false) String contactPhone,
            @RequestParam(value = "files", required = false) List<MultipartFile> files) {

        try {
            try {
                TicketPriority.valueOf(priority.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid priority. Use: LOW, MEDIUM, HIGH, URGENT, CRITICAL"));
            }

            IncidentTicket ticket = new IncidentTicket();
            ticket.setTitle(title);
            ticket.setDescription(description);
            ticket.setPriority(TicketPriority.valueOf(priority.toUpperCase()));
            ticket.setCategory(category);
            ticket.setResourceLocation(resourceLocation);
            ticket.setContactEmail(contactEmail);
            ticket.setContactPhone(contactPhone);

            String userEmail = getCurrentUserEmail(request);
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

    @GetMapping
    public ResponseEntity<List<TicketResponseDTO>> getAllTickets(HttpServletRequest request) {
        String userEmail = getCurrentUserEmail(request);
        boolean admin = isAdmin(request);

        List<IncidentTicket> tickets = ticketService.getAllTickets();
        List<TicketResponseDTO> responseDTOs = tickets.stream()
                .map(t -> ticketService.convertToResponseDTO(t, userEmail, admin))
                .collect(Collectors.toList());

        return ResponseEntity.ok(responseDTOs);
    }

    @GetMapping("/my")
    public ResponseEntity<List<TicketResponseDTO>> getMyTickets(HttpServletRequest request) {
        String userEmail = getCurrentUserEmail(request);
        boolean admin = isAdmin(request);

        List<IncidentTicket> tickets = ticketService.getTicketsByUser(userEmail);
        List<TicketResponseDTO> responseDTOs = tickets.stream()
                .map(t -> ticketService.convertToResponseDTO(t, userEmail, admin))
                .collect(Collectors.toList());

        return ResponseEntity.ok(responseDTOs);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<TicketResponseDTO>> getTicketsByStatus(
            HttpServletRequest request,
            @PathVariable String status) {
        try {
            TicketStatus ticketStatus = TicketStatus.valueOf(status.toUpperCase());
            String userEmail = getCurrentUserEmail(request);
            boolean admin = isAdmin(request);

            List<IncidentTicket> tickets = ticketService.getTicketsByStatus(ticketStatus);
            List<TicketResponseDTO> responseDTOs = tickets.stream()
                    .map(t -> ticketService.convertToResponseDTO(t, userEmail, admin))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(responseDTOs);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Returns tickets assigned to this technician AND all OPEN unassigned tickets
    @GetMapping("/assigned-to-me")
    public ResponseEntity<List<TicketResponseDTO>> getTicketsAssignedToMe(HttpServletRequest request) {
        String userName = getCurrentUserName(request);
        String userEmail = getCurrentUserEmail(request);
        boolean admin = isAdmin(request);

        List<IncidentTicket> tickets = ticketService.getTicketsForTechnicianDashboard(userName);
        List<TicketResponseDTO> responseDTOs = tickets.stream()
                .map(t -> ticketService.convertToResponseDTO(t, userEmail, admin))
                .collect(Collectors.toList());

        return ResponseEntity.ok(responseDTOs);
    }

    // Dashboard stats for technician
    @GetMapping("/technician/dashboard")
    public ResponseEntity<Map<String, Long>> getTechnicianDashboardStats(HttpServletRequest request) {
        String userName = getCurrentUserName(request);
        Map<String, Long> stats = ticketService.getDashboardStats(userName);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponseDTO> getTicketById(
            HttpServletRequest request,
            @PathVariable Long id) {
        IncidentTicket ticket = ticketService.getTicketById(id);
        if (ticket != null) {
            String userEmail = getCurrentUserEmail(request);
            boolean admin = isAdmin(request);
            return ResponseEntity.ok(ticketService.convertToResponseDTO(ticket, userEmail, admin));
        }
        return ResponseEntity.notFound().build();
    }

    // ========== STATUS MANAGEMENT ==========

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            HttpServletRequest request,
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        String newStatus = body.get("status");
        String reason = body.get("reason");

        IncidentTicket ticket = ticketService.getTicketById(id);
        if (ticket == null) return ResponseEntity.notFound().build();

        try {
            TicketStatus.valueOf(newStatus.toUpperCase());
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

    @PutMapping("/{id}/assign")
    public ResponseEntity<?> assignTechnician(
            HttpServletRequest request,
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        String technicianName = body.get("technicianName");
        if (technicianName == null || technicianName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Technician name is required"));
        }

        IncidentTicket updated = ticketService.assignTechnician(id, technicianName);
        if (updated != null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Assigned to " + technicianName);
            response.put("assignedTo", updated.getAssignedTo());
            response.put("status", updated.getStatus().name());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/resolution")
    public ResponseEntity<?> addResolutionNotes(
            HttpServletRequest request,
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        String notes = body.get("notes");
        if (notes == null || notes.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Resolution notes are required"));
        }

        IncidentTicket updated = ticketService.addResolutionNotes(id, notes);
        if (updated != null) {
            return ResponseEntity.ok(Map.of("message", "Resolution notes added"));
        }
        return ResponseEntity.notFound().build();
    }

    // ========== COMMENT MANAGEMENT ==========

    @PostMapping("/{id}/comments")
    public ResponseEntity<?> addComment(
            HttpServletRequest request,
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        String content = body.get("content");
        String authorRole = body.get("authorRole");

        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Comment content is required"));
        }

        String userName = getCurrentUserName(request);
        TicketComment comment = ticketService.addComment(id, content, userName, authorRole);
        if (comment != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Comment added");
            response.put("comment", comment);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<TicketComment>> getComments(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getCommentsByTicket(id));
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<?> editComment(
            HttpServletRequest request,
            @PathVariable Long commentId,
            @RequestBody Map<String, String> body) {

        String newContent = body.get("content");
        String userEmail = getCurrentUserEmail(request);

        if (newContent == null || newContent.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Comment content is required"));
        }

        TicketComment updated = ticketService.editComment(commentId, newContent, userEmail);
        if (updated != null) {
            return ResponseEntity.ok(Map.of("message", "Comment updated", "comment", updated));
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Cannot edit - not your comment"));
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<?> deleteComment(
            HttpServletRequest request,
            @PathVariable Long commentId) {

        String userEmail = getCurrentUserEmail(request);
        boolean admin = isAdmin(request);

        boolean deleted = ticketService.deleteComment(commentId, userEmail, admin);
        if (deleted) {
            return ResponseEntity.ok(Map.of("message", "Comment deleted"));
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Cannot delete - not your comment"));
    }
}

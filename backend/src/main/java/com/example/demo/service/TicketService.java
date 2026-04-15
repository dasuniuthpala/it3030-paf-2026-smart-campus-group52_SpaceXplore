package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TicketService {
    
    @Autowired
    private TicketRepository ticketRepository;
    
    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private AttachmentRepository attachmentRepository;
    
    @Value("${file.upload-dir:uploads/}")
    private String uploadDir;
    
    // CREATE ticket with attachments
    @Transactional
    public IncidentTicket createTicket(IncidentTicket ticket, List<MultipartFile> files, String userEmail) throws IOException {
        ticket.setCreatedBy(userEmail);
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        
        IncidentTicket savedTicket = ticketRepository.save(ticket);
        
        // Save attachments (max 3)
        if (files != null && !files.isEmpty()) {
            int count = 0;
            for (MultipartFile file : files) {
                if (count >= 3) break;
                if (file != null && !file.isEmpty()) {
                    saveAttachment(savedTicket, file);
                    count++;
                }
            }
        }
        
        return savedTicket;
    }
    
    // GET all tickets
    public List<IncidentTicket> getAllTickets() {
        return ticketRepository.findAll();
    }
    
    // GET tickets by user
    public List<IncidentTicket> getTicketsByUser(String userEmail) {
        return ticketRepository.findByCreatedBy(userEmail);
    }
    
    // GET tickets by status
    public List<IncidentTicket> getTicketsByStatus(TicketStatus status) {
        return ticketRepository.findByStatus(status);
    }
    
    // GET tickets assigned to technician
    public List<IncidentTicket> getTicketsAssignedTo(String technicianName) {
        return ticketRepository.findByAssignedTo(technicianName);
    }
    
    // GET ticket by ID with all details
    public IncidentTicket getTicketById(Long id) {
        return ticketRepository.findById(id).orElse(null);
    }
    
    // UPDATE status
    @Transactional
    public IncidentTicket updateStatus(Long id, String newStatus, String reason) {
        IncidentTicket ticket = ticketRepository.findById(id).orElse(null);
        if (ticket != null) {
            ticket.setStatus(TicketStatus.valueOf(newStatus));
            if ("REJECTED".equals(newStatus) && reason != null) {
                ticket.setRejectionReason(reason);
            }
            ticket.setUpdatedAt(LocalDateTime.now());
            return ticketRepository.save(ticket);
        }
        return null;
    }
    
    // ASSIGN technician
    @Transactional
    public IncidentTicket assignTechnician(Long id, String technicianName) {
        IncidentTicket ticket = ticketRepository.findById(id).orElse(null);
        if (ticket != null) {
            ticket.setAssignedTo(technicianName);
            if (ticket.getStatus() == TicketStatus.OPEN) {
                ticket.setStatus(TicketStatus.IN_PROGRESS);
            }
            ticket.setUpdatedAt(LocalDateTime.now());
            return ticketRepository.save(ticket);
        }
        return null;
    }
    
    // ADD resolution notes
    @Transactional
    public IncidentTicket addResolutionNotes(Long id, String notes) {
        IncidentTicket ticket = ticketRepository.findById(id).orElse(null);
        if (ticket != null) {
            ticket.setResolutionNotes(notes);
            ticket.setUpdatedAt(LocalDateTime.now());
            return ticketRepository.save(ticket);
        }
        return null;
    }
    
    // ADD comment
    @Transactional
    public TicketComment addComment(Long ticketId, String content, String author, String authorRole) {
        IncidentTicket ticket = ticketRepository.findById(ticketId).orElse(null);
        if (ticket != null) {
            TicketComment comment = new TicketComment();
            comment.setTicket(ticket);
            comment.setContent(content);
            comment.setAuthor(author);
            comment.setAuthorRole(authorRole);
            comment.setCreatedAt(LocalDateTime.now());
            comment.setUpdatedAt(LocalDateTime.now());
            return commentRepository.save(comment);
        }
        return null;
    }
    
    // GET comments for a ticket
    public List<TicketComment> getCommentsByTicket(Long ticketId) {
        IncidentTicket ticket = ticketRepository.findById(ticketId).orElse(null);
        if (ticket != null) {
            return commentRepository.findByTicketOrderByCreatedAtAsc(ticket);
        }
        return List.of();
    }
    
    // EDIT comment (only if author matches)
    @Transactional
    public TicketComment editComment(Long commentId, String newContent, String requesterEmail) {
        TicketComment comment = commentRepository.findById(commentId).orElse(null);
        if (comment != null && comment.getAuthor().equals(requesterEmail)) {
            comment.setContent(newContent);
            comment.setUpdatedAt(LocalDateTime.now());
            return commentRepository.save(comment);
        }
        return null;
    }
    
    // DELETE comment (only if author matches or admin)
    @Transactional
    public boolean deleteComment(Long commentId, String requesterEmail, boolean isAdmin) {
        TicketComment comment = commentRepository.findById(commentId).orElse(null);
        if (comment != null && (comment.getAuthor().equals(requesterEmail) || isAdmin)) {
            commentRepository.delete(comment);
            return true;
        }
        return false;
    }
    
    // GET attachments for a ticket
    public List<TicketAttachment> getAttachmentsByTicket(Long ticketId) {
        IncidentTicket ticket = ticketRepository.findById(ticketId).orElse(null);
        if (ticket != null) {
            return attachmentRepository.findByTicket(ticket);
        }
        return List.of();
    }
    
    // Convert Entity to Response DTO
    public TicketResponseDTO convertToResponseDTO(IncidentTicket ticket, String currentUserEmail, boolean isAdmin) {
        TicketResponseDTO dto = new TicketResponseDTO();
        dto.setId(ticket.getId());
        dto.setTitle(ticket.getTitle());
        dto.setDescription(ticket.getDescription());
        dto.setStatus(ticket.getStatus().name());
        dto.setPriority(ticket.getPriority().name());
        dto.setCategory(ticket.getCategory());
        dto.setResourceLocation(ticket.getResourceLocation());
        dto.setContactEmail(ticket.getContactEmail());
        dto.setContactPhone(ticket.getContactPhone());
        dto.setCreatedBy(ticket.getCreatedBy());
        dto.setCreatedAt(ticket.getCreatedAt());
        dto.setUpdatedAt(ticket.getUpdatedAt());
        dto.setAssignedTo(ticket.getAssignedTo());
        dto.setResolutionNotes(ticket.getResolutionNotes());
        dto.setRejectionReason(ticket.getRejectionReason());
        
        // Convert attachments
        List<AttachmentDTO> attachmentDTOs = ticket.getAttachments().stream().map(att -> {
            AttachmentDTO attDto = new AttachmentDTO();
            attDto.setId(att.getId());
            attDto.setFileName(att.getFileName());
            attDto.setFileType(att.getFileType());
            attDto.setFileSize(att.getFileSize());
            attDto.setFileUrl("/api/uploads/" + att.getId());
            return attDto;
        }).collect(Collectors.toList());
        dto.setAttachments(attachmentDTOs);
        
        // Convert comments with edit permissions
        List<CommentDTO> commentDTOs = ticket.getComments().stream().map(comment -> {
            CommentDTO commentDto = new CommentDTO();
            commentDto.setId(comment.getId());
            commentDto.setContent(comment.getContent());
            commentDto.setAuthor(comment.getAuthor());
            commentDto.setAuthorRole(comment.getAuthorRole());
            commentDto.setCreatedAt(comment.getCreatedAt());
            commentDto.setUpdatedAt(comment.getUpdatedAt());
            commentDto.setCanEdit(comment.getAuthor().equals(currentUserEmail) || isAdmin);
            return commentDto;
        }).collect(Collectors.toList());
        dto.setComments(commentDTOs);
        
        return dto;
    }
    
    // Helper: Save attachment
    private void saveAttachment(IncidentTicket ticket, MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        String originalName = file.getOriginalFilename();
        String extension = "";
        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf("."));
        }
        String newFileName = UUID.randomUUID().toString() + extension;
        Path filePath = uploadPath.resolve(newFileName);
        Files.copy(file.getInputStream(), filePath);
        
        TicketAttachment attachment = new TicketAttachment();
        attachment.setTicket(ticket);
        attachment.setFileName(originalName);
        attachment.setFilePath(filePath.toString());
        attachment.setFileType(file.getContentType());
        attachment.setFileSize(file.getSize());
        
        attachmentRepository.save(attachment);
    }
}
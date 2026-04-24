package com.example.demo.dto;

import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public class TicketRequestDTO {
    private String title;
    private String description;
    private String priority;
    private String category;
    private String resourceLocation;
    private String contactEmail;
    private String contactPhone;
    private List<MultipartFile> attachments;
    
    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public String getResourceLocation() { return resourceLocation; }
    public void setResourceLocation(String resourceLocation) { this.resourceLocation = resourceLocation; }
    
    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
    
    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    
    public List<MultipartFile> getAttachments() { return attachments; }
    public void setAttachments(List<MultipartFile> attachments) { this.attachments = attachments; }
}
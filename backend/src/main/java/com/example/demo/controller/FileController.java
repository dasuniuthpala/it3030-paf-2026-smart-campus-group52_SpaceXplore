package com.example.demo.controller;

import com.example.demo.model.TicketAttachment;
import com.example.demo.repository.AttachmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/uploads")
@CrossOrigin(origins = "http://localhost:3000")
public class FileController {

    @Autowired
    private AttachmentRepository attachmentRepository;

    @GetMapping("/{attachmentId}")
    public ResponseEntity<byte[]> getFile(@PathVariable Long attachmentId) {
        TicketAttachment attachment = attachmentRepository.findById(attachmentId).orElse(null);
        if (attachment == null) {
            return ResponseEntity.notFound().build();
        }
        try {
            Path filePath = Paths.get(attachment.getFilePath());
            byte[] bytes = Files.readAllBytes(filePath);
            MediaType mediaType = MediaType.IMAGE_JPEG;
            if (attachment.getFileType() != null) {
                try { mediaType = MediaType.parseMediaType(attachment.getFileType()); } catch (Exception ignored) {}
            }
            return ResponseEntity.ok().contentType(mediaType).body(bytes);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

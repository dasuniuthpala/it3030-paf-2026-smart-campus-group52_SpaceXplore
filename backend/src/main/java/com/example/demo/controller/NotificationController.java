package com.example.demo.controller;

import com.example.demo.model.Notification;
import com.example.demo.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping
    public ResponseEntity<List<Notification>> getUserNotifications(@RequestHeader("X-User-Id") Long userId) {
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(notificationRepository.findByUserIdOrderByCreatedAtDesc(userId));
    }

    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnreadUserNotifications(@RequestHeader("X-User-Id") Long userId) {
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id, @RequestHeader("X-User-Id") Long userId) {
        Optional<Notification> notifOpt = notificationRepository.findById(id);
        if (notifOpt.isPresent()) {
            Notification notif = notifOpt.get();
            if (notif.getUserId().equals(userId)) {
                notif.setRead(true);
                notificationRepository.save(notif);
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.status(403).body("Not authorized to read this notification");
            }
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(@RequestHeader("X-User-Id") Long userId) {
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }
        List<Notification> unread = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        for(Notification n : unread) {
            n.setRead(true);
        }
        notificationRepository.saveAll(unread);
        return ResponseEntity.ok().build();
    }
}

package com.hospital.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String recipientEmail;

    @Column(nullable = false)
    private String recipientRole; // PATIENT, DOCTOR, ADMIN

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String type; // APPOINTMENT, REMINDER, ALERT, GENERAL

    private Boolean isRead = false;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    public Notification() {}

    public Notification(Long id, String recipientEmail, String recipientRole, String message, String title, String type, Boolean isRead) {
        this.id = id;
        this.recipientEmail = recipientEmail;
        this.recipientRole = recipientRole;
        this.message = message;
        this.title = title;
        this.type = type;
        this.isRead = isRead != null ? isRead : false;
    }

    public static NotificationBuilder builder() {
        return new NotificationBuilder();
    }

    public static class NotificationBuilder {
        private Long id;
        private String recipientEmail;
        private String recipientRole;
        private String message;
        private String title;
        private String type;
        private Boolean isRead = false;

        public NotificationBuilder id(Long id) { this.id = id; return this; }
        public NotificationBuilder recipientEmail(String recipientEmail) { this.recipientEmail = recipientEmail; return this; }
        public NotificationBuilder recipientRole(String recipientRole) { this.recipientRole = recipientRole; return this; }
        public NotificationBuilder message(String message) { this.message = message; return this; }
        public NotificationBuilder title(String title) { this.title = title; return this; }
        public NotificationBuilder type(String type) { this.type = type; return this; }
        public NotificationBuilder isRead(Boolean isRead) { this.isRead = isRead; return this; }
        public Notification build() {
            return new Notification(id, recipientEmail, recipientRole, message, title, type, isRead);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRecipientEmail() { return recipientEmail; }
    public void setRecipientEmail(String recipientEmail) { this.recipientEmail = recipientEmail; }
    public String getRecipientRole() { return recipientRole; }
    public void setRecipientRole(String recipientRole) { this.recipientRole = recipientRole; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

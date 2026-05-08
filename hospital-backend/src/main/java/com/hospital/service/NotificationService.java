package com.hospital.service;

import com.hospital.entity.Notification;
import com.hospital.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final EmailService emailService;

    public NotificationService(NotificationRepository notificationRepository, EmailService emailService) {
        this.notificationRepository = notificationRepository;
        this.emailService = emailService;
    }

    public void createNotification(String recipientEmail, String role, String title, String message, String type) {
        Notification notification = Notification.builder()
                .recipientEmail(recipientEmail)
                .recipientRole(role)
                .title(title)
                .message(message)
                .type(type)
                .isRead(false)
                .build();
        notificationRepository.save(notification);

        // Also send email
        emailService.sendEmail(recipientEmail, "[Hospital] " + title, message);
    }

    public List<Notification> getUserNotifications(String email) {
        return notificationRepository.findByRecipientEmailOrderByCreatedAtDesc(email);
    }

    public long getUnreadCount(String email) {
        return notificationRepository.countByRecipientEmailAndIsReadFalse(email);
    }

    public void markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new com.hospital.exception.ResourceNotFoundException("Notification", "id", id));
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    public void markAllAsRead(String email) {
        List<Notification> unread = notificationRepository.findByRecipientEmailAndIsReadFalse(email);
        unread.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(unread);
    }
}

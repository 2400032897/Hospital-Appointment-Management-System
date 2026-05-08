package com.hospital.controller;

import com.hospital.dto.ApiResponse;
import com.hospital.entity.Notification;
import com.hospital.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Notification>>> getNotifications(@RequestParam String email) {
        return ResponseEntity.ok(ApiResponse.success("Notifications fetched",
                notificationService.getUserNotifications(email)));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(@RequestParam String email) {
        return ResponseEntity.ok(ApiResponse.success("Unread count",
                notificationService.getUnreadCount(email)));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read"));
    }

    @PutMapping("/mark-all-read")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(@RequestBody Map<String, String> body) {
        notificationService.markAllAsRead(body.get("email"));
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read"));
    }
}

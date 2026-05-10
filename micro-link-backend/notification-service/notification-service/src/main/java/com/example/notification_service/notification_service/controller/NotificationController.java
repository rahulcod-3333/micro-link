package com.example.notification_service.notification_service.controller;

import com.example.notification_service.notification_service.auth.UserContextHolder;
import com.example.notification_service.notification_service.entity.Notification;
import com.example.notification_service.notification_service.service.NotificationQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationQueryService notificationQueryService;

    @GetMapping
    public ResponseEntity<List<Notification>> getMyNotifications() {
        Long userId = UserContextHolder.getCurrentUserId();
        return ResponseEntity.ok(notificationQueryService.getNotificationsForUser(userId));
    }
}

package com.ziohelp.controller;

import com.ziohelp.entity.Notification;
import com.ziohelp.entity.Organization;
import com.ziohelp.repository.NotificationRepository;
import com.ziohelp.service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin
public class NotificationController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private OrganizationService organizationService;

    @PostMapping("/send")
    public void sendNotification(@RequestBody String message) {
        messagingTemplate.convertAndSend("/topic/notifications", message);
    }

    @GetMapping("/by-org/{orgId}")
    public ResponseEntity<List<Notification>> getNotificationsByOrganization(@PathVariable Long orgId) {
        return ResponseEntity.ok(notificationRepository.findByOrganizationId(orgId));
    }

    @PostMapping("/by-org/{orgId}")
    public ResponseEntity<Notification> createNotificationForOrganization(@RequestBody Notification notification, @PathVariable Long orgId) {
        Organization org = organizationService.getOrganizationById(orgId);
        if (org == null) return ResponseEntity.badRequest().build();
        notification.setOrganization(org);
        return ResponseEntity.ok(notificationRepository.save(notification));
    }
} 
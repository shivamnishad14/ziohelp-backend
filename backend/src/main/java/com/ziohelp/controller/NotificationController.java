package com.ziohelp.controller;

import com.ziohelp.entity.Notification;
import com.ziohelp.entity.Organization;
import com.ziohelp.repository.NotificationRepository;
import com.ziohelp.service.OrganizationService;
import com.ziohelp.service.AccessControlService;
import com.ziohelp.service.AuthService;
import com.ziohelp.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

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

    @Autowired
    private AccessControlService accessControlService;
    @Autowired
    private AuthService authService;

    @PostMapping("/send")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')") // Only admin or tenant admin can send notifications
    public void sendNotification(@RequestBody String message) {
        messagingTemplate.convertAndSend("/topic/notifications", message);
    }

    @GetMapping("/by-org/{orgId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'USER', 'DEVELOPER')") // All authenticated users can view notifications
    public ResponseEntity<List<Notification>> getNotificationsByOrganization(@PathVariable Long orgId) {
        User currentUser = authService.getAuthenticatedUser();
        accessControlService.validateOrganizationAccess(currentUser, orgId);
        return ResponseEntity.ok(notificationRepository.findByOrganizationId(orgId));
    }

    @PostMapping("/by-org/{orgId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')") // Only admin or tenant admin can create notifications
    public ResponseEntity<Notification> createNotificationForOrganization(@RequestBody Notification notification, @PathVariable Long orgId) {
        User currentUser = authService.getAuthenticatedUser();
        accessControlService.validateContentCreation(currentUser, orgId);
        Organization org = organizationService.getOrganizationById(orgId);
        if (org == null) return ResponseEntity.badRequest().build();
        notification.setOrganization(org);
        return ResponseEntity.ok(notificationRepository.save(notification));
    }
} 
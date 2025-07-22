package com.ziohelp.service;

import com.ziohelp.entity.Notification;
import com.ziohelp.entity.Ticket;
import com.ziohelp.entity.User;
import com.ziohelp.entity.Organization;
import com.ziohelp.repository.NotificationRepository;
import com.ziohelp.repository.UserRepository;
import com.ziohelp.service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private EmailService emailService;

    @Autowired
    private OrganizationService organizationService;

    public void sendTicketNotification(Ticket ticket, String type, String message) {
        // Get the user by email
        User recipient = userRepository.findByEmail(ticket.getCreatedBy()).orElse(null);
        
        if (recipient == null) {
            // If user not found, create notification without recipient
            Organization org = organizationService.getOrganizationById(ticket.getOrganizationId());
            Notification notification = Notification.builder()
                    .type(type)
                    .message(message)
                    .seen(false)
                    .timestamp(LocalDateTime.now())
                    .recipient(null)
                    .organization(org)
                    .build();
            
            notificationRepository.save(notification);
            return;
        }

        // Create notification record
        Organization org = organizationService.getOrganizationById(ticket.getOrganizationId());
        Notification notification = Notification.builder()
                .type(type)
                .message(message)
                .seen(false)
                .timestamp(LocalDateTime.now())
                .recipient(recipient)
                .organization(org)
                .build();
        
        notificationRepository.save(notification);

        // Send real-time notification via WebSocket
        Map<String, Object> notificationData = new HashMap<>();
        notificationData.put("id", notification.getId());
        notificationData.put("type", type);
        notificationData.put("message", message);
        notificationData.put("timestamp", notification.getTimestamp());
        notificationData.put("ticketId", ticket.getId());
        notificationData.put("ticketTitle", ticket.getTitle());

        // Send to specific user
        messagingTemplate.convertAndSendToUser(
            ticket.getCreatedBy(), 
            "/queue/notifications", 
            notificationData
        );

        // Send to admin/agent channels
        messagingTemplate.convertAndSend("/topic/ticket-updates", notificationData);

        // Send email notification
        sendEmailNotification(ticket, type, message);
    }

    public void sendSystemNotification(String type, String message, Long organizationId) {
        // Get all users in the organization
        Organization org = organizationService.getOrganizationById(organizationId);
        List<User> users = userRepository.findByOrganizationId(organizationId);
        
        for (User user : users) {
            Notification notification = Notification.builder()
                    .type(type)
                    .message(message)
                    .seen(false)
                    .timestamp(LocalDateTime.now())
                    .recipient(user)
                    .organization(org)
                    .build();
            
            notificationRepository.save(notification);

            // Send real-time notification
            Map<String, Object> notificationData = new HashMap<>();
            notificationData.put("id", notification.getId());
            notificationData.put("type", type);
            notificationData.put("message", message);
            notificationData.put("timestamp", notification.getTimestamp());

            messagingTemplate.convertAndSendToUser(
                user.getEmail(), 
                "/queue/notifications", 
                notificationData
            );
        }

        // Send to organization-wide channel
        Map<String, Object> systemNotification = new HashMap<>();
        systemNotification.put("type", type);
        systemNotification.put("message", message);
        systemNotification.put("timestamp", LocalDateTime.now());
        systemNotification.put("organizationId", organizationId);

        messagingTemplate.convertAndSend("/topic/system-updates", systemNotification);
    }

    public void sendDashboardUpdate(String type, Map<String, Object> data) {
        // Send dashboard updates to all connected clients
        Map<String, Object> update = new HashMap<>();
        update.put("type", type);
        update.put("data", data);
        update.put("timestamp", LocalDateTime.now());

        messagingTemplate.convertAndSend("/topic/dashboard-updates", update);
    }

    public void sendTicketStatusUpdate(Ticket ticket, String oldStatus, String newStatus) {
        String message = String.format("Ticket #%d status changed from %s to %s", 
            ticket.getId(), oldStatus, newStatus);
        
        sendTicketNotification(ticket, "STATUS_UPDATE", message);
        
        // Send to admin dashboard
        Map<String, Object> statusUpdate = new HashMap<>();
        statusUpdate.put("ticketId", ticket.getId());
        statusUpdate.put("oldStatus", oldStatus);
        statusUpdate.put("newStatus", newStatus);
        statusUpdate.put("timestamp", LocalDateTime.now());
        
        messagingTemplate.convertAndSend("/topic/ticket-status-updates", statusUpdate);
    }

    public void sendNewTicketNotification(Ticket ticket) {
        String message = String.format("New ticket #%d created: %s", 
            ticket.getId(), ticket.getTitle());
        
        sendTicketNotification(ticket, "NEW_TICKET", message);
        
        // Notify all admins and agents
        List<User> admins = userRepository.findByRolesNameIn(java.util.Arrays.asList("ADMIN", "TENANT_ADMIN", "DEVELOPER"));
        
        for (User admin : admins) {
            Map<String, Object> newTicketNotification = new HashMap<>();
            newTicketNotification.put("ticketId", ticket.getId());
            newTicketNotification.put("title", ticket.getTitle());
            newTicketNotification.put("priority", ticket.getPriority());
            newTicketNotification.put("createdBy", ticket.getCreatedBy());
            newTicketNotification.put("timestamp", LocalDateTime.now());
            
            messagingTemplate.convertAndSendToUser(
                admin.getEmail(), 
                "/queue/new-tickets", 
                newTicketNotification
            );
        }
    }

    public void sendCommentNotification(Ticket ticket, String commentAuthor, String comment) {
        String message = String.format("New comment on ticket #%d by %s", 
            ticket.getId(), commentAuthor);
        
        sendTicketNotification(ticket, "COMMENT", message);
    }

    public void sendSLAWarning(Ticket ticket, int hoursRemaining) {
        String message = String.format("SLA warning: Ticket #%d has %d hours remaining", 
            ticket.getId(), hoursRemaining);
        
        sendTicketNotification(ticket, "SLA_WARNING", message);
        
        // Send to admin escalation channel
        Map<String, Object> slaWarning = new HashMap<>();
        slaWarning.put("ticketId", ticket.getId());
        slaWarning.put("hoursRemaining", hoursRemaining);
        slaWarning.put("priority", ticket.getPriority());
        slaWarning.put("timestamp", LocalDateTime.now());
        
        messagingTemplate.convertAndSend("/topic/sla-warnings", slaWarning);
    }

    public void sendSLAViolation(Ticket ticket) {
        String message = String.format("SLA violation: Ticket #%d has exceeded SLA time", 
            ticket.getId());
        
        sendTicketNotification(ticket, "SLA_VIOLATION", message);
        
        // Send to admin escalation channel
        Map<String, Object> slaViolation = new HashMap<>();
        slaViolation.put("ticketId", ticket.getId());
        slaViolation.put("priority", ticket.getPriority());
        slaViolation.put("timestamp", LocalDateTime.now());
        
        messagingTemplate.convertAndSend("/topic/sla-violations", slaViolation);
    }

    public List<Notification> getUserNotifications(String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElse(null);
        if (user == null) {
            return new ArrayList<>();
        }
        return notificationRepository.findByRecipientOrderByTimestampDesc(user);
    }

    public void markNotificationAsSeen(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setSeen(true);
            notificationRepository.save(notification);
        });
    }

    public void markAllNotificationsAsSeen(String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElse(null);
        if (user != null) {
            List<Notification> notifications = notificationRepository.findByRecipientAndSeenFalse(user);
            for (Notification notification : notifications) {
                notification.setSeen(true);
                notificationRepository.save(notification);
            }
        }
    }

    public long getUnreadNotificationCount(String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElse(null);
        if (user == null) {
            return 0;
        }
        return notificationRepository.countByRecipientAndSeenFalse(user);
    }

    private void sendEmailNotification(Ticket ticket, String type, String message) {
        try {
            String subject = String.format("Ticket Update - #%d", ticket.getId());
            String emailBody = String.format(
                "Hello,\n\n" +
                "%s\n\n" +
                "Ticket Details:\n" +
                "- ID: %d\n" +
                "- Title: %s\n" +
                "- Status: %s\n" +
                "- Priority: %s\n\n" +
                "You can view the ticket at: http://localhost:3000/tickets/%d\n\n" +
                "Best regards,\n" +
                "ZioHelp Support Team\n",
                message, ticket.getId(), ticket.getTitle(), ticket.getStatus(), ticket.getPriority(), ticket.getId()
            );
            
            emailService.sendEmail(ticket.getCreatedBy(), subject, emailBody);
        } catch (Exception e) {
            // Log error but don't fail the notification
            System.err.println("Failed to send email notification: " + e.getMessage());
        }
    }

    public void sendWelcomeNotification(User user) {
        String message = "Welcome to ZioHelp! Your account has been successfully created.";
        
        Notification notification = Notification.builder()
                .type("WELCOME")
                .message(message)
                .seen(false)
                .timestamp(LocalDateTime.now())
                .recipient(user)
                .organization(user.getOrganization()) // Assuming User entity has an organization field
                .build();
        
        notificationRepository.save(notification);

        // Send real-time notification
        Map<String, Object> notificationData = new HashMap<>();
        notificationData.put("id", notification.getId());
        notificationData.put("type", "WELCOME");
        notificationData.put("message", message);
        notificationData.put("timestamp", notification.getTimestamp());

        messagingTemplate.convertAndSendToUser(
            user.getEmail(), 
            "/queue/notifications", 
            notificationData
        );
    }

    public void sendPasswordResetNotification(String email, String resetToken) {
        String message = "Password reset requested. Use the provided token to reset your password.";
        
        // Send email with reset token
        String subject = "Password Reset Request";
        String emailBody = String.format(
            "Hello,\n\n" +
            "You have requested a password reset for your ZioHelp account.\n\n" +
            "Reset Token: %s\n\n" +
            "If you did not request this reset, please ignore this email.\n\n" +
            "Best regards,\n" +
            "ZioHelp Support Team\n",
            resetToken
        );
        
        try {
            emailService.sendEmail(email, subject, emailBody);
        } catch (Exception e) {
            System.err.println("Failed to send password reset email: " + e.getMessage());
        }
    }
    
    // Add missing methods for TicketController
    public void sendNotification(String message) {
        // Send system-wide notification
        Map<String, Object> notificationData = new HashMap<>();
        notificationData.put("type", "SYSTEM");
        notificationData.put("message", message);
        notificationData.put("timestamp", LocalDateTime.now());
        
        messagingTemplate.convertAndSend("/topic/system-notifications", notificationData);
    }
    
    public void sendTicketEvent(String eventType, Ticket ticket) {
        // Send ticket event notification
        Map<String, Object> eventData = new HashMap<>();
        eventData.put("eventType", eventType);
        eventData.put("ticketId", ticket.getId());
        eventData.put("ticketTitle", ticket.getTitle());
        eventData.put("timestamp", LocalDateTime.now());
        
        messagingTemplate.convertAndSend("/topic/ticket-events", eventData);
    }
} 
package com.ziohelp.service;

import com.ziohelp.entity.Notification;
import com.ziohelp.entity.Organization;
import com.ziohelp.entity.User;
import com.ziohelp.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class NotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private NotificationRepository notificationRepository;

    public void sendNotification(String message) {
        messagingTemplate.convertAndSend("/topic/notifications", message);
    }

    public void notifyUser(User user, String type, String message, Organization org) {
        Notification n = Notification.builder()
                .recipient(user)
                .type(type)
                .message(message)
                .seen(false)
                .timestamp(LocalDateTime.now())
                .organization(org)
                .build();
        notificationRepository.save(n);
        sendNotification(message);
        // TODO: send email/push (stub)
    }

    public void sendEmailStub(String to, String subject, String content) {
        // TODO: Integrate real email service
        System.out.println("[EMAIL STUB] To: " + to + ", Subject: " + subject + ", Content: " + content);
    }

    public void sendPushStub(String to, String message) {
        // TODO: Integrate real push service
        System.out.println("[PUSH STUB] To: " + to + ", Message: " + message);
    }
} 
package com.ziohelp.repository;

import com.ziohelp.entity.Notification;
import com.ziohelp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientAndSeenFalse(User recipient);
    List<Notification> findByOrganizationId(Long organizationId);
    
    // Add missing methods
    List<Notification> findByRecipientIdOrderByTimestampDesc(String recipientId);
    List<Notification> findByRecipientIdAndSeenFalse(String recipientId);
    long countByRecipientIdAndSeenFalse(String recipientId);
} 
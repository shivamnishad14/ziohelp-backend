package com.ziohelp.service;

import com.ziohelp.entity.AuditLog;
import com.ziohelp.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuditLogService {
    @Autowired
    private AuditLogRepository auditLogRepository;

    public void logActivity(String action, String details, String userEmail) {
        AuditLog log = new AuditLog();
        log.setAction(action);
        log.setDetails(details != null && details.length() > 255 ? details.substring(0, 255) : details);
        log.setUserEmail(userEmail);
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);
    }
} 
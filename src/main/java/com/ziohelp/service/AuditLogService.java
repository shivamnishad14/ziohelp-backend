package com.ziohelp.service;

import com.ziohelp.entity.Organization;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class AuditLogService {

    private static final Logger logger = LoggerFactory.getLogger("AuditTrail");

    public void log(String message) {
        logger.info(message);
    }

    public void log(String message, Organization organization) {
        logger.info("[Org:{}] {}", organization != null ? organization.getId() : "N/A", message);
    }
} 
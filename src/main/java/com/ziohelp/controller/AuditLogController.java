package com.ziohelp.controller;

import com.ziohelp.entity.AuditLog;
import com.ziohelp.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {
    @Autowired
    private AuditLogRepository auditLogRepository;

    @GetMapping("/by-org/{orgId}")
    public ResponseEntity<List<AuditLog>> getAuditLogsByOrganization(@PathVariable Long orgId) {
        return ResponseEntity.ok(auditLogRepository.findByOrganizationId(orgId));
    }
} 
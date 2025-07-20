package com.ziohelp.controller;

import com.ziohelp.entity.AuditLog;
import com.ziohelp.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {
    @Autowired
    private AuditLogRepository auditLogRepository;

    @GetMapping("/by-org/{orgId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')") // Only admin or tenant admin can view audit logs
    public ResponseEntity<List<AuditLog>> getAuditLogsByOrganization(@PathVariable Long orgId) {
        // TODO: For TENANT_ADMIN, only allow if org matches their tenant
        return ResponseEntity.ok(auditLogRepository.findByOrganizationId(orgId));
    }
} 
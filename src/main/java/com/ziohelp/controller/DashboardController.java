package com.ziohelp.controller;

import com.ziohelp.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/dashboard")
@Tag(name = "Dashboard Analytics", description = "Dashboard analytics and statistics endpoints")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER')")
    @Operation(summary = "Get dashboard statistics", description = "Get comprehensive dashboard statistics for the current user's organization")
    public ResponseEntity<Map<String, Object>> getDashboardStats(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(dashboardService.getDashboardStats(startDate, endDate));
    }

    @GetMapping("/ticket-trends")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER')")
    @Operation(summary = "Get ticket trends", description = "Get ticket creation and resolution trends over time")
    public ResponseEntity<Map<String, Object>> getTicketTrends(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(dashboardService.getTicketTrends(startDate, endDate, days));
    }

    @GetMapping("/user-activity")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')")
    @Operation(summary = "Get user activity", description = "Get user activity statistics and metrics")
    public ResponseEntity<Map<String, Object>> getUserActivity(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(dashboardService.getUserActivity(startDate, endDate));
    }

    @GetMapping("/product-metrics")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')")
    @Operation(summary = "Get product metrics", description = "Get metrics and statistics for different products")
    public ResponseEntity<Map<String, Object>> getProductMetrics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(dashboardService.getProductMetrics(startDate, endDate));
    }

    @GetMapping("/sla-compliance")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER')")
    @Operation(summary = "Get SLA compliance", description = "Get SLA compliance statistics and metrics")
    public ResponseEntity<Map<String, Object>> getSLACompliance(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(dashboardService.getSLACompliance(startDate, endDate));
    }

    @GetMapping("/export/report")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')")
    @Operation(summary = "Export dashboard report", description = "Export dashboard report in PDF or Excel format")
    public ResponseEntity<byte[]> exportDashboardReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "pdf") String format) {
        return dashboardService.exportDashboardReport(startDate, endDate, format);
    }

    @GetMapping("/realtime/updates")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER')")
    @Operation(summary = "Get real-time updates", description = "Get real-time dashboard updates via WebSocket")
    public ResponseEntity<Map<String, Object>> getRealtimeUpdates() {
        return ResponseEntity.ok(dashboardService.getRealtimeUpdates());
    }
} 
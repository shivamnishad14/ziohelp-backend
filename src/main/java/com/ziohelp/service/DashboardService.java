package com.ziohelp.service;

import com.ziohelp.entity.Ticket;
import com.ziohelp.entity.User;
import com.ziohelp.repository.TicketRepository;
import com.ziohelp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    public Map<String, Object> getDashboardStats(LocalDate startDate, LocalDate endDate) {
        Map<String, Object> stats = new HashMap<>();
        
        // Set default date range if not provided
        if (startDate == null) {
            startDate = LocalDate.now().minusDays(30);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }

        // Ticket statistics
        long totalTickets = ticketRepository.countByCreatedAtBetween(startDate.atStartOfDay(), endDate.atTime(23, 59, 59));
        long openTickets = ticketRepository.countByStatusAndCreatedAtBetween("OPEN", startDate.atStartOfDay(), endDate.atTime(23, 59, 59));
        long resolvedTickets = ticketRepository.countByStatusAndCreatedAtBetween("RESOLVED", startDate.atStartOfDay(), endDate.atTime(23, 59, 59));
        long closedTickets = ticketRepository.countByStatusAndCreatedAtBetween("CLOSED", startDate.atStartOfDay(), endDate.atTime(23, 59, 59));

        // Priority distribution
        Map<String, Long> priorityStats = ticketRepository.findByCreatedAtBetween(startDate.atStartOfDay(), endDate.atTime(23, 59, 59))
                .stream()
                .collect(Collectors.groupingBy(Ticket::getPriority, Collectors.counting()));

        // User statistics
        long totalUsers = userRepository.countByCreatedAtBetween(startDate.atStartOfDay(), endDate.atTime(23, 59, 59));
        long activeUsers = userRepository.countByActiveTrueAndCreatedAtBetween(startDate.atStartOfDay(), endDate.atTime(23, 59, 59));

        stats.put("totalTickets", totalTickets);
        stats.put("openTickets", openTickets);
        stats.put("resolvedTickets", resolvedTickets);
        stats.put("closedTickets", closedTickets);
        stats.put("priorityDistribution", priorityStats);
        stats.put("totalUsers", totalUsers);
        stats.put("activeUsers", activeUsers);
        stats.put("resolutionRate", totalTickets > 0 ? (double) (resolvedTickets + closedTickets) / totalTickets * 100 : 0);
        stats.put("averageResolutionTime", calculateAverageResolutionTime(startDate, endDate));
        Map<String, String> dateRange = new HashMap<>();
        dateRange.put("startDate", startDate.toString());
        dateRange.put("endDate", endDate.toString());
        stats.put("dateRange", dateRange);

        return stats;
    }

    public Map<String, Object> getTicketTrends(LocalDate startDate, LocalDate endDate, int days) {
        Map<String, Object> trends = new HashMap<>();
        
        if (startDate == null) {
            startDate = LocalDate.now().minusDays(days);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }

        // Daily ticket creation trends
        List<Map<String, Object>> dailyTrends = new ArrayList<>();
        LocalDate currentDate = startDate;
        
        while (!currentDate.isAfter(endDate)) {
            LocalDateTime startOfDay = currentDate.atStartOfDay();
            LocalDateTime endOfDay = currentDate.atTime(23, 59, 59);
            
            long created = ticketRepository.countByCreatedAtBetween(startOfDay, endOfDay);
            long resolved = ticketRepository.countByStatusAndUpdatedAtBetween("RESOLVED", startOfDay, endOfDay);
            
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", currentDate.toString());
            dayData.put("created", created);
            dayData.put("resolved", resolved);
            dailyTrends.add(dayData);
            
            currentDate = currentDate.plusDays(1);
        }

        // Weekly trends
        List<Map<String, Object>> weeklyTrends = calculateWeeklyTrends(startDate, endDate);

        trends.put("dailyTrends", dailyTrends);
        trends.put("weeklyTrends", weeklyTrends);
        trends.put("totalDays", days);

        return trends;
    }

    public Map<String, Object> getUserActivity(LocalDate startDate, LocalDate endDate) {
        Map<String, Object> activity = new HashMap<>();
        
        if (startDate == null) {
            startDate = LocalDate.now().minusDays(30);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }

        // User registration trends
        long newUsers = userRepository.countByCreatedAtBetween(startDate.atStartOfDay(), endDate.atTime(23, 59, 59));
        
        // Most active users (by ticket creation)
        List<Map<String, Object>> topUsers = ticketRepository.findByCreatedAtBetween(startDate.atStartOfDay(), endDate.atTime(23, 59, 59))
                .stream()
                .collect(Collectors.groupingBy(Ticket::getCreatedBy, Collectors.counting()))
                .entrySet()
                .stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(10)
                .map(entry -> {
                    Map<String, Object> userData = new HashMap<>();
                    userData.put("email", entry.getKey());
                    userData.put("ticketCount", entry.getValue());
                    return userData;
                })
                .collect(Collectors.toList());

        // User engagement metrics
        long totalActiveUsers = userRepository.countByActiveTrue();
        long usersWithTickets = ticketRepository.findByCreatedAtBetween(startDate.atStartOfDay(), endDate.atTime(23, 59, 59))
                .stream()
                .map(Ticket::getCreatedBy)
                .distinct()
                .count();

        activity.put("newUsers", newUsers);
        activity.put("topUsers", topUsers);
        activity.put("totalActiveUsers", totalActiveUsers);
        activity.put("usersWithTickets", usersWithTickets);
        activity.put("engagementRate", totalActiveUsers > 0 ? (double) usersWithTickets / totalActiveUsers * 100 : 0);

        return activity;
    }

    public Map<String, Object> getProductMetrics(LocalDate startDate, LocalDate endDate) {
        Map<String, Object> metrics = new HashMap<>();
        
        if (startDate == null) {
            startDate = LocalDate.now().minusDays(30);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }

        // Product-wise ticket distribution
        Map<String, Long> productTicketCounts = ticketRepository.findByCreatedAtBetween(startDate.atStartOfDay(), endDate.atTime(23, 59, 59))
                .stream()
                .collect(Collectors.groupingBy(ticket -> ticket.getOrganizationId().toString(), Collectors.counting()));

        // Product performance metrics
        List<Map<String, Object>> productPerformance = new ArrayList<>();
        for (Map.Entry<String, Long> entry : productTicketCounts.entrySet()) {
            Map<String, Object> productData = new HashMap<>();
            productData.put("productId", entry.getKey());
            productData.put("totalTickets", entry.getValue());
            
            // Calculate resolution rate for this product
            long resolvedTickets = ticketRepository.countByOrganizationIdAndStatusAndCreatedAtBetween(
                Long.parseLong(entry.getKey()), "RESOLVED", startDate.atStartOfDay(), endDate.atTime(23, 59, 59));
            productData.put("resolvedTickets", resolvedTickets);
            productData.put("resolutionRate", entry.getValue() > 0 ? (double) resolvedTickets / entry.getValue() * 100 : 0);
            
            productPerformance.add(productData);
        }

        metrics.put("productPerformance", productPerformance);
        metrics.put("totalProducts", productTicketCounts.size());

        return metrics;
    }

    public Map<String, Object> getSLACompliance(LocalDate startDate, LocalDate endDate) {
        Map<String, Object> sla = new HashMap<>();
        
        if (startDate == null) {
            startDate = LocalDate.now().minusDays(30);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }

        // SLA compliance calculation
        List<Ticket> tickets = ticketRepository.findByCreatedAtBetween(startDate.atStartOfDay(), endDate.atTime(23, 59, 59));
        
        long totalTickets = tickets.size();
        long slaCompliantTickets = 0;
        long slaBreachedTickets = 0;
        
        for (Ticket ticket : tickets) {
            if (ticket.getStatus().equals("RESOLVED") || ticket.getStatus().equals("CLOSED")) {
                // Calculate if ticket was resolved within SLA (assuming 24 hours for HIGH, 48 hours for MEDIUM, 72 hours for LOW)
                long slaHours = getSLAHours(ticket.getPriority());
                long resolutionTimeHours = java.time.Duration.between(ticket.getCreatedAt(), ticket.getUpdatedAt()).toHours();
                
                if (resolutionTimeHours <= slaHours) {
                    slaCompliantTickets++;
                } else {
                    slaBreachedTickets++;
                }
            }
        }

        sla.put("totalTickets", totalTickets);
        sla.put("slaCompliantTickets", slaCompliantTickets);
        sla.put("slaBreachedTickets", slaBreachedTickets);
        sla.put("slaComplianceRate", totalTickets > 0 ? (double) slaCompliantTickets / totalTickets * 100 : 0);
        sla.put("averageResolutionTime", calculateAverageResolutionTime(startDate, endDate));

        return sla;
    }

    public ResponseEntity<byte[]> exportDashboardReport(LocalDate startDate, LocalDate endDate, String format) {
        // Generate report data
        Map<String, Object> reportData = getDashboardStats(startDate, endDate);
        
        // For now, return a simple JSON report
        // In a real implementation, you would generate PDF or Excel
        String reportContent = generateReportContent(reportData, format);
        byte[] reportBytes = reportContent.getBytes();
        
        HttpHeaders headers = new HttpHeaders();
        if ("pdf".equalsIgnoreCase(format)) {
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "dashboard-report.pdf");
        } else {
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "dashboard-report.xlsx");
        }
        
        return new ResponseEntity<>(reportBytes, headers, HttpStatus.OK);
    }

    public Map<String, Object> getRealtimeUpdates() {
        Map<String, Object> updates = new HashMap<>();
        
        // Get recent activity
        LocalDateTime lastHour = LocalDateTime.now().minusHours(1);
        long newTickets = ticketRepository.countByCreatedAtAfter(lastHour);
        long resolvedTickets = ticketRepository.countByStatusAndUpdatedAtAfter("RESOLVED", lastHour);
        long newUsers = userRepository.countByCreatedAtAfter(lastHour);
        
        updates.put("newTickets", newTickets);
        updates.put("resolvedTickets", resolvedTickets);
        updates.put("newUsers", newUsers);
        updates.put("lastUpdated", LocalDateTime.now().toString());
        
        return updates;
    }

    // Helper methods
    private double calculateAverageResolutionTime(LocalDate startDate, LocalDate endDate) {
        List<Ticket> resolvedTickets = ticketRepository.findByStatusInAndCreatedAtBetween(
            Arrays.asList("RESOLVED", "CLOSED"), startDate.atStartOfDay(), endDate.atTime(23, 59, 59));
        
        if (resolvedTickets.isEmpty()) {
            return 0.0;
        }
        
        double totalHours = resolvedTickets.stream()
            .mapToLong(ticket -> java.time.Duration.between(ticket.getCreatedAt(), ticket.getUpdatedAt()).toHours())
            .sum();
        
        return totalHours / resolvedTickets.size();
    }

    private List<Map<String, Object>> calculateWeeklyTrends(LocalDate startDate, LocalDate endDate) {
        List<Map<String, Object>> weeklyTrends = new ArrayList<>();
        LocalDate currentWeek = startDate;
        
        while (!currentWeek.isAfter(endDate)) {
            LocalDate weekEnd = currentWeek.plusDays(6);
            if (weekEnd.isAfter(endDate)) {
                weekEnd = endDate;
            }
            
            long created = ticketRepository.countByCreatedAtBetween(currentWeek.atStartOfDay(), weekEnd.atTime(23, 59, 59));
            long resolved = ticketRepository.countByStatusAndUpdatedAtBetween("RESOLVED", currentWeek.atStartOfDay(), weekEnd.atTime(23, 59, 59));
            
            Map<String, Object> weekData = new HashMap<>();
            weekData.put("weekStart", currentWeek.toString());
            weekData.put("weekEnd", weekEnd.toString());
            weekData.put("created", created);
            weekData.put("resolved", resolved);
            weeklyTrends.add(weekData);
            
            currentWeek = currentWeek.plusWeeks(1);
        }
        
        return weeklyTrends;
    }

    private long getSLAHours(String priority) {
        switch (priority.toUpperCase()) {
            case "HIGH": return 24;
            case "MEDIUM": return 48;
            case "LOW": return 72;
            default: return 48;
        }
    }

    private String generateReportContent(Map<String, Object> data, String format) {
        StringBuilder content = new StringBuilder();
        content.append("Dashboard Report\n");
        content.append("Generated: ").append(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))).append("\n\n");
        
        content.append("Ticket Statistics:\n");
        content.append("- Total Tickets: ").append(data.get("totalTickets")).append("\n");
        content.append("- Open Tickets: ").append(data.get("openTickets")).append("\n");
        content.append("- Resolved Tickets: ").append(data.get("resolvedTickets")).append("\n");
        content.append("- Resolution Rate: ").append(String.format("%.2f%%", (Double) data.get("resolutionRate"))).append("\n");
        
        return content.toString();
    }
} 
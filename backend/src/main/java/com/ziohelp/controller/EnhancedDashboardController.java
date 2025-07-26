package com.ziohelp.controller;

import com.ziohelp.entity.Role;
import com.ziohelp.entity.User;
import com.ziohelp.repository.UserRepository;
import com.ziohelp.repository.TicketRepository;
import com.ziohelp.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin
public class EnhancedDashboardController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private RoleRepository roleRepository;

    @GetMapping("/user")
    @PreAuthorize("hasRole('USER') or hasRole('AGENT') or hasRole('ADMIN') or hasRole('MASTER_ADMIN')")
    public ResponseEntity<?> getUserDashboard(Authentication auth) {
        try {
            String email = auth.getName();
            User user = userRepository.findByEmailIgnoreCase(email).orElse(null);
            
            if (user == null) {
                return ResponseEntity.status(404).body("User not found");
            }

            Map<String, Object> dashboard = new HashMap<>();
            dashboard.put("welcomeMessage", "Welcome, " + user.getFullName());
            dashboard.put("userInfo", createUserInfo(user));
            
            // User-specific metrics
            long myTickets = ticketRepository.countByCreatedByEmail(email);
            long openTickets = ticketRepository.countByCreatedByEmailAndStatus(email, "OPEN");
            long resolvedTickets = ticketRepository.countByCreatedByEmailAndStatus(email, "RESOLVED");
            
            Map<String, Object> metrics = new HashMap<>();
            metrics.put("myTickets", myTickets);
            metrics.put("openTickets", openTickets);
            metrics.put("resolvedTickets", resolvedTickets);
            metrics.put("pendingTickets", myTickets - openTickets - resolvedTickets);
            
            dashboard.put("metrics", metrics);
            dashboard.put("dashboardType", "USER");
            dashboard.put("features", getUserFeatures());
            
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error loading dashboard: " + e.getMessage());
        }
    }

    @GetMapping("/agent")
    @PreAuthorize("hasRole('AGENT') or hasRole('ADMIN') or hasRole('MASTER_ADMIN')")
    public ResponseEntity<?> getAgentDashboard(Authentication auth) {
        try {
            String email = auth.getName();
            User user = userRepository.findByEmailIgnoreCase(email).orElse(null);
            
            if (user == null) {
                return ResponseEntity.status(404).body("User not found");
            }

            Map<String, Object> dashboard = new HashMap<>();
            dashboard.put("welcomeMessage", "Agent Dashboard - " + user.getFullName());
            dashboard.put("userInfo", createUserInfo(user));
            
            // Agent-specific metrics
            long assignedTickets = ticketRepository.countByAssignedToEmail(email);
            long totalTickets = ticketRepository.count();
            long openTickets = ticketRepository.countByStatus("OPEN");
            long inProgressTickets = ticketRepository.countByAssignedToEmailAndStatus(email, "IN_PROGRESS");
            
            Map<String, Object> metrics = new HashMap<>();
            metrics.put("assignedTickets", assignedTickets);
            metrics.put("totalTickets", totalTickets);
            metrics.put("openTickets", openTickets);
            metrics.put("inProgressTickets", inProgressTickets);
            metrics.put("resolvedToday", 0); // TODO: Implement date-based queries
            
            dashboard.put("metrics", metrics);
            dashboard.put("dashboardType", "AGENT");
            dashboard.put("features", getAgentFeatures());
            
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error loading agent dashboard: " + e.getMessage());
        }
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MASTER_ADMIN')")
    public ResponseEntity<?> getAdminDashboard(Authentication auth) {
        try {
            String email = auth.getName();
            User user = userRepository.findByEmailIgnoreCase(email).orElse(null);
            
            if (user == null) {
                return ResponseEntity.status(404).body("User not found");
            }

            Map<String, Object> dashboard = new HashMap<>();
            dashboard.put("welcomeMessage", "Admin Dashboard - " + user.getFullName());
            dashboard.put("userInfo", createUserInfo(user));
            
            // Admin-specific metrics
            long totalUsers = userRepository.count();
            long activeUsers = userRepository.countByActive(true);
            long pendingApprovals = userRepository.countByApproved(false);
            long totalTickets = ticketRepository.count();
            long openTickets = ticketRepository.countByStatus("OPEN");
            long resolvedTickets = ticketRepository.countByStatus("RESOLVED");
            
            Map<String, Object> metrics = new HashMap<>();
            metrics.put("totalUsers", totalUsers);
            metrics.put("activeUsers", activeUsers);
            metrics.put("pendingApprovals", pendingApprovals);
            metrics.put("totalTickets", totalTickets);
            metrics.put("openTickets", openTickets);
            metrics.put("resolvedTickets", resolvedTickets);
            metrics.put("resolutionRate", totalTickets > 0 ? (resolvedTickets * 100.0) / totalTickets : 0);
            
            dashboard.put("metrics", metrics);
            dashboard.put("dashboardType", "ADMIN");
            dashboard.put("features", getAdminFeatures());
            
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error loading admin dashboard: " + e.getMessage());
        }
    }

    @GetMapping("/master-admin")
    @PreAuthorize("hasRole('MASTER_ADMIN')")
    public ResponseEntity<?> getMasterAdminDashboard(Authentication auth) {
        try {
            String email = auth.getName();
            User user = userRepository.findByEmailIgnoreCase(email).orElse(null);
            
            if (user == null) {
                return ResponseEntity.status(404).body("User not found");
            }

            Map<String, Object> dashboard = new HashMap<>();
            dashboard.put("welcomeMessage", "Master Admin Dashboard - " + user.getFullName());
            dashboard.put("userInfo", createUserInfo(user));
            
            // Master admin metrics (system-wide)
            long totalUsers = userRepository.count();
            long totalOrganizations = 1; // TODO: Implement when organization support is added
            long totalTickets = ticketRepository.count();
            long systemHealth = 100; // TODO: Implement system health check
            
            Map<String, Object> metrics = new HashMap<>();
            metrics.put("totalUsers", totalUsers);
            metrics.put("totalOrganizations", totalOrganizations);
            metrics.put("totalTickets", totalTickets);
            metrics.put("systemHealth", systemHealth);
            metrics.put("activeAgents", userRepository.countUsersWithRole("AGENT"));
            metrics.put("activeAdmins", userRepository.countUsersWithRole("ADMIN"));
            
            dashboard.put("metrics", metrics);
            dashboard.put("dashboardType", "MASTER_ADMIN");
            dashboard.put("features", getMasterAdminFeatures());
            
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error loading master admin dashboard: " + e.getMessage());
        }
    }

    @GetMapping("/developer")
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('MASTER_ADMIN')")
    public ResponseEntity<?> getDeveloperDashboard(Authentication auth) {
        try {
            String email = auth.getName();
            User user = userRepository.findByEmailIgnoreCase(email).orElse(null);
            
            if (user == null) {
                return ResponseEntity.status(404).body("User not found");
            }

            Map<String, Object> dashboard = new HashMap<>();
            dashboard.put("welcomeMessage", "Developer Dashboard - " + user.getFullName());
            dashboard.put("userInfo", createUserInfo(user));
            
            // Developer-specific metrics
            Map<String, Object> metrics = new HashMap<>();
            metrics.put("apiEndpoints", 25); // TODO: Dynamic endpoint counting
            metrics.put("databaseTables", 14); // TODO: Dynamic table counting
            metrics.put("systemUptime", "99.9%"); // TODO: Implement uptime tracking
            metrics.put("lastDeployment", "2024-01-15"); // TODO: Implement deployment tracking
            
            dashboard.put("metrics", metrics);
            dashboard.put("dashboardType", "DEVELOPER");
            dashboard.put("features", getDeveloperFeatures());
            
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error loading developer dashboard: " + e.getMessage());
        }
    }

    private Map<String, Object> createUserInfo(User user) {
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("email", user.getEmail());
        userInfo.put("fullName", user.getFullName());
        userInfo.put("username", user.getUsername());
        userInfo.put("roles", user.getRoles().stream().map(Role::getName).collect(Collectors.toList()));
        userInfo.put("isActive", user.isActive());
        userInfo.put("isApproved", user.isApproved());
        userInfo.put("emailVerified", user.isEmailVerified());
        return userInfo;
    }

    private List<String> getUserFeatures() {
        return List.of(
            "Create Tickets",
            "View My Tickets",
            "Track Ticket Status",
            "Browse Knowledge Base",
            "Update Profile"
        );
    }

    private List<String> getAgentFeatures() {
        return List.of(
            "Assigned Tickets",
            "All Tickets",
            "Ticket Assignment",
            "Customer Communication",
            "Knowledge Base Management",
            "Ticket Resolution",
            "Report Generation"
        );
    }

    private List<String> getAdminFeatures() {
        return List.of(
            "User Management",
            "Agent Management",
            "System Settings",
            "Organization Settings",
            "Analytics & Reports",
            "Audit Logs",
            "Email Templates",
            "Knowledge Base Admin"
        );
    }

    private List<String> getMasterAdminFeatures() {
        return List.of(
            "Multi-tenant Management",
            "System Administration",
            "Global Settings",
            "Platform Analytics",
            "Security Management",
            "Backup & Recovery",
            "System Monitoring",
            "API Management"
        );
    }

    private List<String> getDeveloperFeatures() {
        return List.of(
            "API Documentation",
            "Database Management",
            "System Logs",
            "Performance Monitoring",
            "Code Deployment",
            "Environment Management",
            "Debug Tools",
            "System Metrics"
        );
    }
}

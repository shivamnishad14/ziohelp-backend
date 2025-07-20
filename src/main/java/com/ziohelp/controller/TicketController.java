package com.ziohelp.controller;

import com.ziohelp.entity.Ticket;
import com.ziohelp.repository.TicketRepository;
import com.ziohelp.service.AuthService;
import com.ziohelp.service.OrganizationService;
import com.ziohelp.entity.Organization;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import com.ziohelp.entity.Attachment;
import com.ziohelp.entity.TicketHistory;
import com.ziohelp.repository.AttachmentRepository;
import com.ziohelp.repository.TicketHistoryRepository;
import org.springframework.web.multipart.MultipartFile;
import java.util.Optional;
import com.ziohelp.service.NotificationService;
import com.ziohelp.dto.PageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import com.ziohelp.repository.UserRepository;
import com.ziohelp.entity.User;
import com.ziohelp.service.AccessControlService;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
@Tag(name = "Tickets", description = "Operations related to support tickets")
public class TicketController {

    private final TicketRepository ticketRepository;
    private final AuthService authService;
    private final OrganizationService organizationService;
    private final AttachmentRepository attachmentRepository;
    private final TicketHistoryRepository ticketHistoryRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final AccessControlService accessControlService;

    // For demo: store last assigned developer per org in memory
    private static final java.util.Map<Long, Integer> lastAssignedDevIndex = new java.util.HashMap<>();

    @GetMapping
    @Operation(summary = "Get paginated, searchable, and sortable list of tickets")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')") // Only admins and tenant admins can view all tickets
    public ResponseEntity<PageResponse<Ticket>> getAllTickets(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        LocalDateTime from = fromDate != null ? fromDate.atStartOfDay() : null;
        LocalDateTime to = toDate != null ? toDate.atTime(java.time.LocalTime.MAX) : null;
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Ticket> ticketPage = ticketRepository.findAllFilteredPaged(status, from, to, search.isEmpty() ? null : search, pageable);
        PageResponse<Ticket> response = new PageResponse<>(
            ticketPage.getContent(),
            ticketPage.getNumber(),
            ticketPage.getSize(),
            ticketPage.getTotalElements(),
            ticketPage.getTotalPages(),
            ticketPage.isLast()
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('USER', 'DEVELOPER')") // Users and developers can view their own/assigned tickets
    public ResponseEntity<List<Ticket>> getMyTickets() {
        User currentUser = authService.getAuthenticatedUser();
        boolean isDeveloper = currentUser.getRoles().stream()
            .anyMatch(role -> "DEVELOPER".equals(role.getName()));
        
        if (isDeveloper) {
            // For developers, return tickets assigned to them
            return ResponseEntity.ok(ticketRepository.findByAssignedTo(currentUser));
        } else {
            // For regular users, return tickets they created
            return ResponseEntity.ok(ticketRepository.findByCreatedByOrderByCreatedAtDesc(currentUser.getEmail()));
        }
    }

    @GetMapping("/by-org/{orgId}")
    @PreAuthorize("hasRole('TENANT_ADMIN')") // Tenant admin can view tickets for their org
    public ResponseEntity<List<Ticket>> getTicketsByOrganization(@PathVariable Long orgId) {
        User currentUser = authService.getAuthenticatedUser();
        accessControlService.validateOrganizationAccess(currentUser, orgId);
        return ResponseEntity.ok(ticketRepository.findByOrganizationId(orgId));
    }

    @PostMapping("/by-org/{orgId}")
    @PreAuthorize("hasRole('TENANT_ADMIN')") // Tenant admin can create tickets for their org
    public ResponseEntity<Ticket> createTicketForOrganization(@RequestBody Ticket ticket, @PathVariable Long orgId) {
        User currentUser = authService.getAuthenticatedUser();
        accessControlService.validateContentCreation(currentUser, orgId);
        Organization org = organizationService.getOrganizationById(orgId);
        if (org == null) return ResponseEntity.badRequest().build();
        ticket.setOrganization(org);
        ticket.setCreatedAt(java.time.LocalDateTime.now());
        return ResponseEntity.ok(ticketRepository.save(ticket));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TENANT_ADMIN')") // Users, admins, tenant admins can raise tickets
    public ResponseEntity<Ticket> raiseTicket(@RequestBody Ticket ticket) {
        ticket.setStatus("OPEN");
        ticket.setCreatedBy(authService.getAuthenticatedUser().getEmail());
        ticket.setCreatedAt(LocalDateTime.now());
        Ticket saved = ticketRepository.save(ticket);
        notificationService.sendNotification("New ticket created: " + saved.getTitle());
        notificationService.sendTicketEvent("NEW", saved);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEVELOPER', 'TENANT_ADMIN')") // Only admins, developers, tenant admins can resolve
    public ResponseEntity<Ticket> resolveTicket(@PathVariable Long id) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new RuntimeException("Ticket not found"));
        User currentUser = authService.getAuthenticatedUser();
        accessControlService.validateTicketModification(currentUser, ticket);
        ticket.setStatus("RESOLVED");
        Ticket saved = ticketRepository.save(ticket);
        notificationService.sendNotification("Ticket resolved: " + saved.getTitle());
        notificationService.sendTicketEvent("RESOLVED", saved);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER', 'USER')") // All roles except guest can view ticket by id
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new RuntimeException("Ticket not found"));
        User currentUser = authService.getAuthenticatedUser();
        accessControlService.validateTicketAccess(currentUser, ticket);
        return ResponseEntity.ok(ticket);
    }

    @PostMapping("/{id}/attachments")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER', 'USER')")
    public ResponseEntity<Attachment> uploadAttachment(@PathVariable Long id, @RequestParam("file") MultipartFile file) throws Exception {
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new RuntimeException("Ticket not found"));
        User currentUser = authService.getAuthenticatedUser();
        accessControlService.validateTicketAccess(currentUser, ticket);
        // In real app, save file to storage and set URL
        Attachment att = Attachment.builder()
            .filename(file.getOriginalFilename())
            .contentType(file.getContentType())
            .url("/files/" + file.getOriginalFilename())
            .ticket(ticket)
            .build();
        attachmentRepository.save(att);
        return ResponseEntity.ok(att);
    }

    @GetMapping("/{id}/attachments")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER', 'USER')")
    public ResponseEntity<List<Attachment>> getAttachments(@PathVariable Long id) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new RuntimeException("Ticket not found"));
        User currentUser = authService.getAuthenticatedUser();
        accessControlService.validateTicketAccess(currentUser, ticket);
        return ResponseEntity.ok(new java.util.ArrayList<>(ticket.getAttachments()));
    }

    @PostMapping("/{id}/history")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER')")
    public ResponseEntity<TicketHistory> logHistory(@PathVariable Long id, @RequestBody TicketHistory history) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new RuntimeException("Ticket not found"));
        User currentUser = authService.getAuthenticatedUser();
        accessControlService.validateTicketAccess(currentUser, ticket);
        history.setTicket(ticket);
        history.setTimestamp(LocalDateTime.now());
        ticketHistoryRepository.save(history);
        return ResponseEntity.ok(history);
    }

    @PutMapping("/{id}/category")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')")
    public ResponseEntity<Ticket> setCategory(@PathVariable Long id, @RequestBody String category) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new RuntimeException("Ticket not found"));
        User currentUser = authService.getAuthenticatedUser();
        accessControlService.validateTicketAccess(currentUser, ticket);
        ticket.setCategory(category);
        return ResponseEntity.ok(ticketRepository.save(ticket));
    }

    @PutMapping("/{id}/auto-assign")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')")
    public ResponseEntity<Ticket> autoAssign(@PathVariable Long id) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new RuntimeException("Ticket not found"));
        Long orgId = ticket.getOrganization() != null ? ticket.getOrganization().getId() : null;
        if (orgId == null) return ResponseEntity.badRequest().build();
        List<User> devs = userRepository.findDevelopersByOrganizationId(orgId);
        if (devs.isEmpty()) return ResponseEntity.badRequest().body(ticket);
        int idx = lastAssignedDevIndex.getOrDefault(orgId, -1);
        idx = (idx + 1) % devs.size();
        lastAssignedDevIndex.put(orgId, idx);
        User assignedDev = devs.get(idx);
        ticket.setAssignedTo(assignedDev);
        TicketHistory history = TicketHistory.builder()
            .action("ASSIGNMENT")
            .detail("Auto-assigned to developer: " + assignedDev.getFullName() + " (" + assignedDev.getEmail() + ")")
            .changedBy("system")
            .timestamp(LocalDateTime.now())
            .ticket(ticket)
            .build();
        ticketHistoryRepository.save(history);
        notificationService.sendNotification("Ticket auto-assigned: " + ticket.getTitle());
        notificationService.sendTicketEvent("ASSIGNED", ticket);
        return ResponseEntity.ok(ticketRepository.save(ticket));
    }

    @PutMapping("/{id}/assign/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')")
    public ResponseEntity<Ticket> assignTicket(@PathVariable Long id, @PathVariable Long userId) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new RuntimeException("Ticket not found"));
        User assignedUser = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        User currentUser = authService.getAuthenticatedUser();
        accessControlService.validateTicketAssignment(currentUser, assignedUser);
        ticket.setAssignedTo(assignedUser);
        TicketHistory history = TicketHistory.builder()
            .action("ASSIGNMENT")
            .detail("Manually assigned to: " + assignedUser.getFullName() + " (" + assignedUser.getEmail() + ")")
            .changedBy(currentUser.getEmail())
            .timestamp(LocalDateTime.now())
            .ticket(ticket)
            .build();
        ticketHistoryRepository.save(history);
        notificationService.sendNotification("Ticket assigned: " + ticket.getTitle());
        notificationService.sendTicketEvent("ASSIGNED", ticket);
        return ResponseEntity.ok(ticketRepository.save(ticket));
    }
} 
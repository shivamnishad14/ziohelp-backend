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

    @GetMapping
    @Operation(summary = "Get paginated, searchable, and sortable list of tickets")
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
    public ResponseEntity<List<Ticket>> getMyTickets() {
        String currentUser = authService.getAuthenticatedUser().getEmail();
        return ResponseEntity.ok(ticketRepository.findByCreatedByOrderByCreatedAtDesc(currentUser));
    }

    @GetMapping("/by-org/{orgId}")
    public ResponseEntity<List<Ticket>> getTicketsByOrganization(@PathVariable Long orgId) {
        return ResponseEntity.ok(ticketRepository.findByOrganizationId(orgId));
    }

    @PostMapping("/by-org/{orgId}")
    public ResponseEntity<Ticket> createTicketForOrganization(@RequestBody Ticket ticket, @PathVariable Long orgId) {
        Organization org = organizationService.getOrganizationById(orgId);
        if (org == null) return ResponseEntity.badRequest().build();
        ticket.setOrganization(org);
        ticket.setCreatedAt(java.time.LocalDateTime.now());
        return ResponseEntity.ok(ticketRepository.save(ticket));
    }

    @PostMapping
    public ResponseEntity<Ticket> raiseTicket(@RequestBody Ticket ticket) {
        ticket.setStatus("OPEN");
        ticket.setCreatedBy(authService.getAuthenticatedUser().getEmail());
        ticket.setCreatedAt(LocalDateTime.now());
        Ticket saved = ticketRepository.save(ticket);
        notificationService.sendNotification("New ticket created: " + saved.getTitle());
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<Ticket> resolveTicket(@PathVariable Long id) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticket.setStatus("RESOLVED");
        Ticket saved = ticketRepository.save(ticket);
        notificationService.sendNotification("Ticket resolved: " + saved.getTitle());
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ticketRepository.findById(id).orElseThrow(() -> new RuntimeException("Ticket not found")));
    }

    @PostMapping("/{id}/attachments")
    public ResponseEntity<Attachment> uploadAttachment(@PathVariable Long id, @RequestParam("file") MultipartFile file) throws Exception {
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new RuntimeException("Ticket not found"));
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
    public ResponseEntity<List<Attachment>> getAttachments(@PathVariable Long id) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new RuntimeException("Ticket not found"));
        return ResponseEntity.ok(new java.util.ArrayList<>(ticket.getAttachments()));
    }

    @PostMapping("/{id}/history")
    public ResponseEntity<TicketHistory> logHistory(@PathVariable Long id, @RequestBody TicketHistory history) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new RuntimeException("Ticket not found"));
        history.setTicket(ticket);
        history.setTimestamp(LocalDateTime.now());
        ticketHistoryRepository.save(history);
        return ResponseEntity.ok(history);
    }

    @PutMapping("/{id}/category")
    public ResponseEntity<Ticket> setCategory(@PathVariable Long id, @RequestBody String category) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticket.setCategory(category);
        return ResponseEntity.ok(ticketRepository.save(ticket));
    }

    @PutMapping("/{id}/auto-assign")
    public ResponseEntity<Ticket> autoAssign(@PathVariable Long id) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new RuntimeException("Ticket not found"));
        // TODO: Implement round-robin developer assignment
        // For now, just log history
        TicketHistory history = TicketHistory.builder()
            .action("ASSIGNMENT")
            .detail("Auto-assigned to developer (stub)")
            .changedBy("system")
            .timestamp(LocalDateTime.now())
            .ticket(ticket)
            .build();
        ticketHistoryRepository.save(history);
        notificationService.sendNotification("Ticket auto-assigned: " + ticket.getTitle());
        return ResponseEntity.ok(ticket);
    }
} 
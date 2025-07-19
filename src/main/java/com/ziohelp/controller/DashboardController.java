package com.ziohelp.controller;

import com.ziohelp.repository.TicketRepository;
import com.ziohelp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary(@RequestParam(defaultValue = "7") int days) {
        LocalDateTime since = LocalDateTime.now().minusDays(days);
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTickets", ticketRepository.countByCreatedAtAfter(since));
        stats.put("openTickets", ticketRepository.countByStatusAndCreatedAtAfter("OPEN", since));
        stats.put("resolvedTickets", ticketRepository.countByStatusAndCreatedAtAfter("RESOLVED", since));
        stats.put("users", userRepository.countByCreatedAtAfter(since));
        return ResponseEntity.ok(stats);
    }
} 
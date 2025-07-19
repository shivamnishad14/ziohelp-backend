package com.ziohelp.controller;

import com.ziohelp.entity.Ticket;
import com.ziohelp.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickets/guest")
@CrossOrigin
public class GuestTicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping
    public ResponseEntity<Ticket> submitTicketAsGuest(@RequestBody Ticket ticket) {
        return ResponseEntity.ok(ticketService.createTicket(ticket));
    }

    @GetMapping("/{id}/{email}")
    public ResponseEntity<?> getTicketStatus(@PathVariable Long id, @PathVariable String email) {
        Ticket ticket = ticketService.getTicketById(id);
        String ticketEmail = ticket.getRaisedBy(); // getRaisedBy returns email directly
        return email.equals(ticketEmail)
                ? ResponseEntity.ok(ticket)
                : ResponseEntity.badRequest().body("Ticket not found or email mismatch");
    }
} 
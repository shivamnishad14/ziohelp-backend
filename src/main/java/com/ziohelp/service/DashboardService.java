package com.ziohelp.service;

import com.ziohelp.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    @Autowired
    private TicketRepository ticketRepository;

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTickets", ticketRepository.count());
        stats.put("openTickets", ticketRepository.countByStatus("Open"));
        stats.put("resolvedTickets", ticketRepository.countByStatus("Resolved"));
        return stats;
    }
} 
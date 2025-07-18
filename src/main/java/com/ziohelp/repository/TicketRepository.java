package com.ziohelp.repository;

import com.ziohelp.entity.Ticket;
import com.ziohelp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByRaisedBy(User user);
    List<Ticket> findByAssignedTo(User developer);
} 
package com.ziohelp.repository;

import com.ziohelp.entity.Comment;
import com.ziohelp.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByTicket(Ticket ticket);
} 
package com.ziohelp.repository;

import com.ziohelp.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByTicketIdOrderByCreatedAtAsc(Long ticketId);
    List<Comment> findByTicketId(Long ticketId);
} 
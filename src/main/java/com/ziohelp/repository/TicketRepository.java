package com.ziohelp.repository;

import com.ziohelp.entity.Ticket;
import com.ziohelp.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    long countByCreatedAtAfter(LocalDateTime since);
    long countByStatusAndCreatedAtAfter(String status, LocalDateTime since);
    long countByStatus(String status);

    List<Ticket> findAllByOrderByCreatedAtDesc();
    List<Ticket> findByCreatedByOrderByCreatedAtDesc(String createdBy);
    List<Ticket> findByOrganizationId(Long organizationId);

    @Query("SELECT t FROM Ticket t WHERE (:status IS NULL OR t.status = :status) AND (:fromDate IS NULL OR t.createdAt >= :fromDate) AND (:toDate IS NULL OR t.createdAt <= :toDate) ORDER BY t.createdAt DESC")
    List<Ticket> findAllFiltered(@Param("status") String status, @Param("fromDate") LocalDateTime fromDate, @Param("toDate") LocalDateTime toDate);

    @Query("SELECT t FROM Ticket t WHERE " +
            "(:status IS NULL OR t.status = :status) AND " +
            "(:fromDate IS NULL OR t.createdAt >= :fromDate) AND " +
            "(:toDate IS NULL OR t.createdAt <= :toDate) AND " +
            "(:search IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%')))" )
    Page<Ticket> findAllFilteredPaged(@Param("status") String status, @Param("fromDate") LocalDateTime fromDate, @Param("toDate") LocalDateTime toDate, @Param("search") String search, Pageable pageable);
} 
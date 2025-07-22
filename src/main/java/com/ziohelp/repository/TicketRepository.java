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
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    List<Ticket> findAllByCreatedAtAfter(LocalDateTime since);

    List<Ticket> findAllByOrderByCreatedAtDesc();
    List<Ticket> findByCreatedByOrderByCreatedAtDesc(String createdBy);
    
    // Fixed organization queries
    @Query("SELECT t FROM Ticket t WHERE t.organization.id = :organizationId")
    List<Ticket> findByOrganizationId(@Param("organizationId") Long organizationId);

    @Query("SELECT t FROM Ticket t WHERE (:status IS NULL OR t.status = :status) AND (:fromDate IS NULL OR t.createdAt >= :fromDate) AND (:toDate IS NULL OR t.createdAt <= :toDate) ORDER BY t.createdAt DESC")
    List<Ticket> findAllFiltered(@Param("status") String status, @Param("fromDate") LocalDateTime fromDate, @Param("toDate") LocalDateTime toDate);

    @Query("SELECT t FROM Ticket t WHERE " +
            "(:status IS NULL OR t.status = :status) AND " +
            "(:fromDate IS NULL OR t.createdAt >= :fromDate) AND " +
            "(:toDate IS NULL OR t.createdAt <= :toDate) AND " +
            "(:search IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%')))" )
    Page<Ticket> findAllFilteredPaged(@Param("status") String status, @Param("fromDate") LocalDateTime fromDate, @Param("toDate") LocalDateTime toDate, @Param("search") String search, Pageable pageable);

    List<Ticket> findByAssignedTo(User assignedTo);
    List<Ticket> findByAssignedToId(Long assignedToId);
    
    @Query("SELECT t FROM Ticket t WHERE t.organization.id = :organizationId AND t.assignedTo.id = :assignedToId")
    List<Ticket> findByOrganizationIdAndAssignedToId(@Param("organizationId") Long organizationId, @Param("assignedToId") Long assignedToId);
    
    // Add missing methods with proper queries
    long countByStatusAndCreatedAtBetween(String status, LocalDateTime start, LocalDateTime end);
    List<Ticket> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    long countByStatusAndUpdatedAtBetween(String status, LocalDateTime start, LocalDateTime end);
    long countByStatusAndUpdatedAtAfter(String status, LocalDateTime after);
    List<Ticket> findByStatusInAndCreatedAtBetween(List<String> statuses, LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.organization.id = :organizationId AND t.status = :status AND t.createdAt BETWEEN :start AND :end")
    long countByOrganizationIdAndStatusAndCreatedAtBetween(@Param("organizationId") Long organizationId, @Param("status") String status, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
} 
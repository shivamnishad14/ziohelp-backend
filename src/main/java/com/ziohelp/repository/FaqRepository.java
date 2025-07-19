package com.ziohelp.repository;

import com.ziohelp.entity.Faq;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FaqRepository extends JpaRepository<Faq, Long> {
    List<Faq> findByOrganizationId(Long organizationId);

    @Query("SELECT f FROM Faq f WHERE (:search IS NULL OR LOWER(f.question) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(f.answer) LIKE LOWER(CONCAT('%', :search, '%')))" )
    Page<Faq> findAllPaged(@Param("search") String search, Pageable pageable);

    @Query("SELECT f FROM Faq f WHERE f.organization.id = :orgId AND (:search IS NULL OR LOWER(f.question) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(f.answer) LIKE LOWER(CONCAT('%', :search, '%')))" )
    Page<Faq> findByOrganizationIdPaged(@Param("orgId") Long orgId, @Param("search") String search, Pageable pageable);
} 
package com.ziohelp.repository;

import com.ziohelp.entity.Organization;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
 
public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    Organization findByName(String name);

    @Query("SELECT o FROM Organization o WHERE (:search IS NULL OR LOWER(o.name) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Organization> findAllPaged(@Param("search") String search, Pageable pageable);
} 
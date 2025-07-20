package com.ziohelp.repository;

import com.ziohelp.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    long countByCreatedAtAfter(LocalDateTime since);
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    List<User> findByOrganizationId(Long organizationId);

    @Query("SELECT u FROM User u WHERE (:search IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<User> findAllPaged(@Param("search") String search, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.organization.id = :orgId AND (:search IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<User> findByOrganizationIdPaged(@Param("orgId") Long orgId, @Param("search") String search, Pageable pageable);

    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name = 'DEVELOPER' AND u.organization.id = :orgId")
    List<User> findDevelopersByOrganizationId(@Param("orgId") Long orgId);
    
    // Add missing methods
    List<User> findByRolesNameIn(List<String> roleNames);
    long countByActiveTrue();
    long countByActiveTrueAndCreatedAtBetween(LocalDateTime start, LocalDateTime end);
} 
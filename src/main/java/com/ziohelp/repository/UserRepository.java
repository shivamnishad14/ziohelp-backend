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
    
    // Fixed organization queries
    @Query("SELECT u FROM User u WHERE u.organization.id = :organizationId")
    List<User> findByOrganizationId(@Param("organizationId") Long organizationId);
    
    @Query("SELECT u FROM User u WHERE u.organization.id = :organizationId")
    long countByOrganizationId(@Param("organizationId") Long organizationId);

    @Query("SELECT u FROM User u WHERE (:search IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<User> findAllPaged(@Param("search") String search, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.organization.id = :orgId AND (:search IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<User> findByOrganizationIdPaged(@Param("orgId") Long orgId, @Param("search") String search, Pageable pageable);

    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name = 'DEVELOPER' AND u.organization.id = :orgId")
    List<User> findDevelopersByOrganizationId(@Param("orgId") Long orgId);
    
    // Role-based queries
    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name IN :roleNames")
    List<User> findByRolesNameIn(@Param("roleNames") List<String> roleNames);
    
    // Active user queries
    long countByActiveTrue();
    long countByActiveTrueAndCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    Optional<User> findByEmailIgnoreCase(String email);
    Optional<User> findByVerificationToken(String verificationToken);
    Optional<User> findByResetToken(String resetToken);
    Optional<User> findByUsernameIgnoreCase(String username);
    @Query(value = "SELECT * FROM \"user\" WHERE email = :email", nativeQuery = true)
    Optional<User> findByEmailNative(@Param("email") String email);
} 
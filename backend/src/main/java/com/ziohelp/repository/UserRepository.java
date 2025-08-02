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
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.email = :email")
    Optional<User> findByEmail(@Param("email") String email);
    boolean existsByEmail(String email);
    long countByCreatedAtAfter(LocalDateTime since);
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    
    // Fixed organization queries
    @Query("SELECT u FROM User u WHERE u.organization.id = :organizationId")
    List<User> findByOrganizationId(@Param("organizationId") Long organizationId);
    
    @Query("SELECT u FROM User u WHERE u.organization.id = :organizationId")
    long countByOrganizationId(@Param("organizationId") Long organizationId);

    @Query(value = "SELECT * FROM \"user\" u WHERE (:search IS NULL OR LOWER(CAST(u.full_name AS TEXT)) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(CAST(u.email AS TEXT)) LIKE LOWER(CONCAT('%', :search, '%')))",
           countQuery = "SELECT COUNT(*) FROM \"user\" u WHERE (:search IS NULL OR LOWER(CAST(u.full_name AS TEXT)) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(CAST(u.email AS TEXT)) LIKE LOWER(CONCAT('%', :search, '%')))",
           nativeQuery = true)
    Page<User> findAllPaged(@Param("search") String search, Pageable pageable);

    @Query(value = "SELECT * FROM \"user\" u WHERE u.organization_id = :orgId AND (:search IS NULL OR LOWER(CAST(u.full_name AS TEXT)) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(CAST(u.email AS TEXT)) LIKE LOWER(CONCAT('%', :search, '%')))",
           countQuery = "SELECT COUNT(*) FROM \"user\" u WHERE u.organization_id = :orgId AND (:search IS NULL OR LOWER(CAST(u.full_name AS TEXT)) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(CAST(u.email AS TEXT)) LIKE LOWER(CONCAT('%', :search, '%')))",
           nativeQuery = true)
    Page<User> findByOrganizationIdPaged(@Param("orgId") Long orgId, @Param("search") String search, Pageable pageable);

    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name = 'DEVELOPER' AND u.organization.id = :orgId")
    List<User> findDevelopersByOrganizationId(@Param("orgId") Long orgId);
    
    // Role-based queries
    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name IN :roleNames")
    List<User> findByRolesNameIn(@Param("roleNames") List<String> roleNames);
    
    // Active user queries
    long countByActiveTrue();
    long countByActiveTrueAndCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE LOWER(u.email) = LOWER(:email)")
    Optional<User> findByEmailIgnoreCase(@Param("email") String email);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE LOWER(u.username) = LOWER(:username)")
    Optional<User> findByUsernameIgnoreCase(@Param("username") String username);
    
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.resetToken = :resetToken")
    Optional<User> findByResetToken(@Param("resetToken") String resetToken);
    
    @Query(value = "SELECT ur.role_id FROM user_roles ur WHERE ur.user_id = :userId", nativeQuery = true)
    List<Long> findRoleIdsByUserId(@Param("userId") Long userId);
} 
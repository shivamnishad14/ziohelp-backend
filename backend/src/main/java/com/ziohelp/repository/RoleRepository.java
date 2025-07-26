package com.ziohelp.repository;

import com.ziohelp.entity.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    
    Optional<Role> findByName(String name);
    
    List<Role> findByIsActiveTrueOrderByName();
    
    List<Role> findByIsSystemFalseOrderByName();
    
    @Query("SELECT r FROM Role r WHERE r.isActive = true AND (:search IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Role> findActiveRoles(@Param("search") String search, Pageable pageable);
    
    @Query("SELECT r FROM Role r WHERE (:search IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:active IS NULL OR r.isActive = :active)")
    Page<Role> findRolesWithFilters(@Param("search") String search, @Param("active") Boolean active, Pageable pageable);
    
    @Query("SELECT r, COUNT(u) as userCount FROM Role r LEFT JOIN r.users u " +
           "WHERE (:search IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "GROUP BY r ORDER BY r.name")
    List<Object[]> findRolesWithUserCount(@Param("search") String search);
    
    @Query("SELECT COUNT(u) FROM User u JOIN u.roles r WHERE r.id = :roleId")
    Long countUsersByRoleId(@Param("roleId") Long roleId);
    
    boolean existsByName(String name);
    
    boolean existsByNameAndIdNot(String name, Long id);
} 
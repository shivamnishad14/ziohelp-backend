package com.ziohelp.repository;

import com.ziohelp.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {
    Optional<Permission> findByName(String name);
    
    List<Permission> findByIsActiveTrue();
    
    List<Permission> findByResourceType(String resourceType);
    
    List<Permission> findByResourceTypeAndActionType(String resourceType, String actionType);
    
    @Query("SELECT p FROM Permission p WHERE p.isSystem = false AND p.isActive = true")
    List<Permission> findNonSystemActivePermissions();
    
    @Query("SELECT p FROM Permission p JOIN p.roles r WHERE r.id = :roleId")
    List<Permission> findByRoleId(@Param("roleId") Long roleId);
    
    @Query("SELECT p FROM Permission p WHERE p.name IN :names")
    List<Permission> findByNameIn(@Param("names") List<String> names);
    
    boolean existsByName(String name);
    
    boolean existsByNameAndIdNot(String name, Long id);
}

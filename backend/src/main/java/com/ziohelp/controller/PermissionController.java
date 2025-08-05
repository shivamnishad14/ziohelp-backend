package com.ziohelp.controller;

import com.ziohelp.entity.Permission;
import com.ziohelp.repository.PermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/permissions")
@Tag(name = "Permissions", description = "Operations related to permissions")
public class PermissionController {
    
    @Autowired
    private PermissionRepository permissionRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')")
    @Operation(summary = "Get all permissions")
    public ResponseEntity<List<Permission>> getAllPermissions() {
        return ResponseEntity.ok(permissionRepository.findByIsActiveTrue());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')")
    @Operation(summary = "Get permission by ID")
    public ResponseEntity<Permission> getPermissionById(@PathVariable Long id) {
        return permissionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create new permission")
    public ResponseEntity<?> createPermission(@RequestBody Permission permission) {
        if (permission.getName() == null || permission.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Permission name is required");
        }
        
        if (permissionRepository.existsByName(permission.getName())) {
            return ResponseEntity.badRequest().body("Permission name already exists");
        }
        
        Permission saved = permissionRepository.save(permission);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update permission")
    public ResponseEntity<?> updatePermission(@PathVariable Long id, @RequestBody Permission permission) {
        Optional<Permission> existing = permissionRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        if (permission.getName() == null || permission.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Permission name is required");
        }
        
        if (permissionRepository.existsByNameAndIdNot(permission.getName(), id)) {
            return ResponseEntity.badRequest().body("Permission name already exists");
        }
        
        Permission toUpdate = existing.get();
        toUpdate.setName(permission.getName());
        toUpdate.setDescription(permission.getDescription());
        toUpdate.setResourceType(permission.getResourceType());
        toUpdate.setActionType(permission.getActionType());
        toUpdate.setIsActive(permission.getIsActive());
        
        Permission saved = permissionRepository.save(toUpdate);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete permission")
    public ResponseEntity<?> deletePermission(@PathVariable Long id) {
        Optional<Permission> existing = permissionRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Permission permission = existing.get();
        if (permission.getIsSystem()) {
            return ResponseEntity.badRequest().body("System permissions cannot be deleted");
        }
        
        permissionRepository.deleteById(id);
        return ResponseEntity.ok().body("Permission deleted successfully");
    }

    @GetMapping("/resource/{resourceType}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')")
    @Operation(summary = "Get permissions by resource type")
    public ResponseEntity<List<Permission>> getPermissionsByResourceType(@PathVariable String resourceType) {
        return ResponseEntity.ok(permissionRepository.findByResourceType(resourceType));
    }

    @GetMapping("/check-name/{name}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')")
    @Operation(summary = "Check if permission name exists")
    public ResponseEntity<Boolean> checkPermissionName(@PathVariable String name) {
        return ResponseEntity.ok(permissionRepository.existsByName(name));
    }
}

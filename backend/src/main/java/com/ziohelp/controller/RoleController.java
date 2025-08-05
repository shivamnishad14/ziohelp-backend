package com.ziohelp.controller;

import com.ziohelp.entity.Role;
import com.ziohelp.entity.Permission;
import com.ziohelp.entity.RolePermission;
import com.ziohelp.repository.RoleRepository;
import com.ziohelp.repository.PermissionRepository;
import com.ziohelp.repository.RolePermissionRepository;
import com.ziohelp.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/roles")
public class RoleController {
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private PermissionRepository permissionRepository;
    
    @Autowired
    private RolePermissionRepository rolePermissionRepository;
    
    @Autowired
    private AuthService authService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')")
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')")
    public ResponseEntity<?> getRoleById(@PathVariable Long id) {
        Optional<Role> role = roleRepository.findById(id);
        return role.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body((Object)"Role not found"));
    }

    @GetMapping("/name/{name}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')")
    public ResponseEntity<?> getRoleByName(@PathVariable String name) {
        Optional<Role> role = roleRepository.findAll().stream().filter(r -> r.getName().equalsIgnoreCase(name)).findFirst();
        return role.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body((Object)"Role not found"));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createRole(@RequestBody Role role) {
        if (role.getName() == null || role.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Role name is required");
        }
        boolean exists = roleRepository.findAll().stream().anyMatch(r -> r.getName().equalsIgnoreCase(role.getName()));
        if (exists) {
            return ResponseEntity.badRequest().body("Role name already exists");
        }
        Role saved = roleRepository.save(role);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateRole(@PathVariable Long id, @RequestBody Role role) {
        Optional<Role> existing = roleRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.status(404).body("Role not found");
        }
        if (role.getName() == null || role.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Role name is required");
        }
        boolean exists = roleRepository.findAll().stream().anyMatch(r -> r.getName().equalsIgnoreCase(role.getName()) && !r.getId().equals(id));
        if (exists) {
            return ResponseEntity.badRequest().body("Role name already exists");
        }
        Role toUpdate = existing.get();
        toUpdate.setName(role.getName());
        Role saved = roleRepository.save(toUpdate);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteRole(@PathVariable Long id) {
        Optional<Role> existing = roleRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.status(404).body("Role not found");
        }
        roleRepository.deleteById(id);
        return ResponseEntity.ok().body("Role deleted");
    }

    @GetMapping("/check-name/{name}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')")
    public ResponseEntity<?> checkRoleName(@PathVariable String name) {
        boolean exists = roleRepository.findAll().stream().anyMatch(r -> r.getName().equalsIgnoreCase(name));
        return ResponseEntity.ok(exists);
    }
    
    // ==== PERMISSION MANAGEMENT ====
    
    @GetMapping("/permissions")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')")
    public ResponseEntity<List<Permission>> getAllPermissions() {
        return ResponseEntity.ok(permissionRepository.findByIsActiveTrue());
    }
    
    @GetMapping("/{id}/permissions")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')")
    public ResponseEntity<List<Permission>> getRolePermissions(@PathVariable Long id) {
        if (!roleRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        List<Permission> permissions = permissionRepository.findByRoleId(id);
        return ResponseEntity.ok(permissions);
    }
    
    @PostMapping("/{id}/permissions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> assignPermissionsToRole(@PathVariable Long id, @RequestBody List<Long> permissionIds) {
        Optional<Role> roleOpt = roleRepository.findById(id);
        if (roleOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Role role = roleOpt.get();
        String currentUser = authService.getAuthenticatedUser().getEmail();
        
        // Remove existing permissions
        rolePermissionRepository.deleteByRoleId(id);
        
        // Add new permissions
        for (Long permissionId : permissionIds) {
            Optional<Permission> permissionOpt = permissionRepository.findById(permissionId);
            if (permissionOpt.isPresent()) {
                RolePermission rolePermission = RolePermission.builder()
                    .role(role)
                    .permission(permissionOpt.get())
                    .grantedBy(currentUser)
                    .build();
                rolePermissionRepository.save(rolePermission);
            }
        }
        
        return ResponseEntity.ok().body("Permissions updated successfully");
    }
    
    @PostMapping("/{roleId}/permissions/{permissionId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> assignSinglePermissionToRole(@PathVariable Long roleId, @PathVariable Long permissionId) {
        Optional<Role> roleOpt = roleRepository.findById(roleId);
        Optional<Permission> permissionOpt = permissionRepository.findById(permissionId);
        
        if (roleOpt.isEmpty() || permissionOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        // Check if already exists
        if (rolePermissionRepository.existsByRoleIdAndPermissionId(roleId, permissionId)) {
            return ResponseEntity.badRequest().body("Permission already assigned to role");
        }
        
        String currentUser = authService.getAuthenticatedUser().getEmail();
        RolePermission rolePermission = RolePermission.builder()
            .role(roleOpt.get())
            .permission(permissionOpt.get())
            .grantedBy(currentUser)
            .build();
            
        rolePermissionRepository.save(rolePermission);
        return ResponseEntity.ok().body("Permission assigned successfully");
    }
    
    @DeleteMapping("/{roleId}/permissions/{permissionId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> removePermissionFromRole(@PathVariable Long roleId, @PathVariable Long permissionId) {
        RolePermission rolePermission = rolePermissionRepository.findByRoleIdAndPermissionId(roleId, permissionId);
        if (rolePermission == null) {
            return ResponseEntity.notFound().build();
        }
        
        rolePermissionRepository.delete(rolePermission);
        return ResponseEntity.ok().body("Permission removed successfully");
    }
}
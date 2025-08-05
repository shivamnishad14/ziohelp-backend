package com.ziohelp.service;

import com.ziohelp.entity.Permission;
import com.ziohelp.entity.Role;
import com.ziohelp.entity.RolePermission;
import com.ziohelp.repository.PermissionRepository;
import com.ziohelp.repository.RoleRepository;
import com.ziohelp.repository.RolePermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class DataInitializationService implements ApplicationRunner {
    
    @Autowired
    private PermissionRepository permissionRepository;
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private RolePermissionRepository rolePermissionRepository;
    
    @Override
    @Transactional
    public void run(ApplicationArguments args) throws Exception {
        initializePermissions();
        initializeRolePermissions();
    }
    
    private void initializePermissions() {
        List<Permission> defaultPermissions = Arrays.asList(
            // User Management
            Permission.builder().name("USER_CREATE").description("Create new users").resourceType("USER").actionType("CREATE").isSystem(true).build(),
            Permission.builder().name("USER_READ").description("View user details").resourceType("USER").actionType("READ").isSystem(true).build(),
            Permission.builder().name("USER_UPDATE").description("Update user information").resourceType("USER").actionType("UPDATE").isSystem(true).build(),
            Permission.builder().name("USER_DELETE").description("Delete users").resourceType("USER").actionType("DELETE").isSystem(true).build(),
            Permission.builder().name("USER_ROLE_ASSIGN").description("Assign roles to users").resourceType("USER").actionType("ASSIGN").isSystem(true).build(),
            
            // Role Management
            Permission.builder().name("ROLE_CREATE").description("Create new roles").resourceType("ROLE").actionType("CREATE").isSystem(true).build(),
            Permission.builder().name("ROLE_READ").description("View role details").resourceType("ROLE").actionType("READ").isSystem(true).build(),
            Permission.builder().name("ROLE_UPDATE").description("Update role information").resourceType("ROLE").actionType("UPDATE").isSystem(true).build(),
            Permission.builder().name("ROLE_DELETE").description("Delete roles").resourceType("ROLE").actionType("DELETE").isSystem(true).build(),
            Permission.builder().name("ROLE_PERMISSION_ASSIGN").description("Assign permissions to roles").resourceType("ROLE").actionType("ASSIGN").isSystem(true).build(),
            
            // Ticket Management
            Permission.builder().name("TICKET_CREATE").description("Create new tickets").resourceType("TICKET").actionType("CREATE").isSystem(true).build(),
            Permission.builder().name("TICKET_READ").description("View ticket details").resourceType("TICKET").actionType("READ").isSystem(true).build(),
            Permission.builder().name("TICKET_UPDATE").description("Update ticket information").resourceType("TICKET").actionType("UPDATE").isSystem(true).build(),
            Permission.builder().name("TICKET_DELETE").description("Delete tickets").resourceType("TICKET").actionType("DELETE").isSystem(true).build(),
            Permission.builder().name("TICKET_ASSIGN").description("Assign tickets to users").resourceType("TICKET").actionType("ASSIGN").isSystem(true).build(),
            Permission.builder().name("TICKET_RESOLVE").description("Resolve tickets").resourceType("TICKET").actionType("RESOLVE").isSystem(true).build(),
            
            // FAQ Management
            Permission.builder().name("FAQ_CREATE").description("Create new FAQs").resourceType("FAQ").actionType("CREATE").isSystem(true).build(),
            Permission.builder().name("FAQ_READ").description("View FAQ details").resourceType("FAQ").actionType("READ").isSystem(true).build(),
            Permission.builder().name("FAQ_UPDATE").description("Update FAQ information").resourceType("FAQ").actionType("UPDATE").isSystem(true).build(),
            Permission.builder().name("FAQ_DELETE").description("Delete FAQs").resourceType("FAQ").actionType("DELETE").isSystem(true).build(),
            
            // Article Management
            Permission.builder().name("ARTICLE_CREATE").description("Create new articles").resourceType("ARTICLE").actionType("CREATE").isSystem(true).build(),
            Permission.builder().name("ARTICLE_READ").description("View article details").resourceType("ARTICLE").actionType("READ").isSystem(true).build(),
            Permission.builder().name("ARTICLE_UPDATE").description("Update article information").resourceType("ARTICLE").actionType("UPDATE").isSystem(true).build(),
            Permission.builder().name("ARTICLE_DELETE").description("Delete articles").resourceType("ARTICLE").actionType("DELETE").isSystem(true).build(),
            Permission.builder().name("ARTICLE_PUBLISH").description("Publish articles").resourceType("ARTICLE").actionType("PUBLISH").isSystem(true).build(),
            
            // Menu Management
            Permission.builder().name("MENU_CREATE").description("Create new menu items").resourceType("MENU").actionType("CREATE").isSystem(true).build(),
            Permission.builder().name("MENU_READ").description("View menu details").resourceType("MENU").actionType("READ").isSystem(true).build(),
            Permission.builder().name("MENU_UPDATE").description("Update menu information").resourceType("MENU").actionType("UPDATE").isSystem(true).build(),
            Permission.builder().name("MENU_DELETE").description("Delete menu items").resourceType("MENU").actionType("DELETE").isSystem(true).build(),
            
            // Product Management
            Permission.builder().name("PRODUCT_CREATE").description("Create new products").resourceType("PRODUCT").actionType("CREATE").isSystem(true).build(),
            Permission.builder().name("PRODUCT_READ").description("View product details").resourceType("PRODUCT").actionType("READ").isSystem(true).build(),
            Permission.builder().name("PRODUCT_UPDATE").description("Update product information").resourceType("PRODUCT").actionType("UPDATE").isSystem(true).build(),
            Permission.builder().name("PRODUCT_DELETE").description("Delete products").resourceType("PRODUCT").actionType("DELETE").isSystem(true).build()
        );
        
        for (Permission permission : defaultPermissions) {
            if (!permissionRepository.existsByName(permission.getName())) {
                permissionRepository.save(permission);
            }
        }
    }
    
    private void initializeRolePermissions() {
        // Assign permissions to ADMIN role
        Optional<Role> adminRole = roleRepository.findAll().stream()
            .filter(role -> "ADMIN".equals(role.getName()))
            .findFirst();
            
        if (adminRole.isPresent()) {
            Role admin = adminRole.get();
            List<Permission> allPermissions = permissionRepository.findAll();
            
            for (Permission permission : allPermissions) {
                if (!rolePermissionRepository.existsByRoleIdAndPermissionId(admin.getId(), permission.getId())) {
                    RolePermission rolePermission = RolePermission.builder()
                        .role(admin)
                        .permission(permission)
                        .grantedBy("system")
                        .build();
                    rolePermissionRepository.save(rolePermission);
                }
            }
        }
        
        // Assign basic permissions to TENANT_ADMIN role
        Optional<Role> tenantAdminRole = roleRepository.findAll().stream()
            .filter(role -> "TENANT_ADMIN".equals(role.getName()))
            .findFirst();
            
        if (tenantAdminRole.isPresent()) {
            Role tenantAdmin = tenantAdminRole.get();
            List<String> tenantAdminPermissions = Arrays.asList(
                "USER_READ", "USER_UPDATE", "USER_ROLE_ASSIGN",
                "TICKET_CREATE", "TICKET_READ", "TICKET_UPDATE", "TICKET_ASSIGN", "TICKET_RESOLVE",
                "FAQ_CREATE", "FAQ_READ", "FAQ_UPDATE", "FAQ_DELETE",
                "ARTICLE_CREATE", "ARTICLE_READ", "ARTICLE_UPDATE", "ARTICLE_DELETE", "ARTICLE_PUBLISH",
                "MENU_READ", "PRODUCT_READ"
            );
            
            for (String permissionName : tenantAdminPermissions) {
                Optional<Permission> permission = permissionRepository.findByName(permissionName);
                if (permission.isPresent() && 
                    !rolePermissionRepository.existsByRoleIdAndPermissionId(tenantAdmin.getId(), permission.get().getId())) {
                    RolePermission rolePermission = RolePermission.builder()
                        .role(tenantAdmin)
                        .permission(permission.get())
                        .grantedBy("system")
                        .build();
                    rolePermissionRepository.save(rolePermission);
                }
            }
        }
        
        // Assign basic permissions to DEVELOPER role
        Optional<Role> developerRole = roleRepository.findAll().stream()
            .filter(role -> "DEVELOPER".equals(role.getName()))
            .findFirst();
            
        if (developerRole.isPresent()) {
            Role developer = developerRole.get();
            List<String> developerPermissions = Arrays.asList(
                "TICKET_READ", "TICKET_UPDATE", "TICKET_RESOLVE",
                "FAQ_READ", "ARTICLE_READ", "ARTICLE_CREATE", "ARTICLE_UPDATE",
                "MENU_READ", "PRODUCT_READ"
            );
            
            for (String permissionName : developerPermissions) {
                Optional<Permission> permission = permissionRepository.findByName(permissionName);
                if (permission.isPresent() && 
                    !rolePermissionRepository.existsByRoleIdAndPermissionId(developer.getId(), permission.get().getId())) {
                    RolePermission rolePermission = RolePermission.builder()
                        .role(developer)
                        .permission(permission.get())
                        .grantedBy("system")
                        .build();
                    rolePermissionRepository.save(rolePermission);
                }
            }
        }
        
        // Assign basic permissions to USER role
        Optional<Role> userRole = roleRepository.findAll().stream()
            .filter(role -> "USER".equals(role.getName()))
            .findFirst();
            
        if (userRole.isPresent()) {
            Role user = userRole.get();
            List<String> userPermissions = Arrays.asList(
                "TICKET_CREATE", "TICKET_READ",
                "FAQ_READ", "ARTICLE_READ", "MENU_READ", "PRODUCT_READ"
            );
            
            for (String permissionName : userPermissions) {
                Optional<Permission> permission = permissionRepository.findByName(permissionName);
                if (permission.isPresent() && 
                    !rolePermissionRepository.existsByRoleIdAndPermissionId(user.getId(), permission.get().getId())) {
                    RolePermission rolePermission = RolePermission.builder()
                        .role(user)
                        .permission(permission.get())
                        .grantedBy("system")
                        .build();
                    rolePermissionRepository.save(rolePermission);
                }
            }
        }
    }
}

package com.ziohelp.entity;

import jakarta.persistence.*;
import lombok.*;
import jakarta.validation.constraints.NotBlank;
import java.util.Set;

@Entity
@Table(name = "permissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Permission name is required")
    @Column(unique = true, nullable = false)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(name = "resource_type")
    private String resourceType; // e.g., "TICKET", "FAQ", "ARTICLE", "USER", "MENU"

    @Column(name = "action_type")
    private String actionType; // e.g., "CREATE", "READ", "UPDATE", "DELETE", "ASSIGN"

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isSystem = false; // System permissions cannot be deleted

    @ManyToMany(mappedBy = "permissions")
    private Set<Role> roles;
    // Explicit getters and setters for compatibility
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getResourceType() { return resourceType; }
    public void setResourceType(String resourceType) { this.resourceType = resourceType; }
    public String getActionType() { return actionType; }
    public void setActionType(String actionType) { this.actionType = actionType; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public Boolean getIsSystem() { return isSystem; }
    public void setIsSystem(Boolean isSystem) { this.isSystem = isSystem; }
    public Set<Role> getRoles() { return roles; }
    public void setRoles(Set<Role> roles) { this.roles = roles; }
    // Builder for compatibility
    public static PermissionBuilder builder() { return new PermissionBuilder(); }
    public static class PermissionBuilder {
        private Permission p = new Permission();
        public PermissionBuilder id(Long id) { p.setId(id); return this; }
        public PermissionBuilder name(String name) { p.setName(name); return this; }
        public PermissionBuilder description(String description) { p.setDescription(description); return this; }
        public PermissionBuilder resourceType(String resourceType) { p.setResourceType(resourceType); return this; }
        public PermissionBuilder actionType(String actionType) { p.setActionType(actionType); return this; }
        public PermissionBuilder isActive(Boolean isActive) { p.setIsActive(isActive); return this; }
        public PermissionBuilder isSystem(Boolean isSystem) { p.setIsSystem(isSystem); return this; }
        public PermissionBuilder roles(Set<Role> roles) { p.setRoles(roles); return this; }
        public Permission build() { return p; }
    }
}

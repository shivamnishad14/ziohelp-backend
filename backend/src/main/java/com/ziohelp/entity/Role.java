
package com.ziohelp.entity;

import jakarta.persistence.*;
import lombok.*;
import jakarta.validation.constraints.NotBlank;
import java.util.Set;

@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Role name is required")
    @Column(unique = true, nullable = false)
    private String name;

    // Indicates if this is a system role (for filtering in repository)
    @Column(nullable = false)
    @Builder.Default
    private boolean isSystem = false;

    // Indicates if this role is active (for filtering in repository)
    @Column(nullable = false)
    @Builder.Default
    private boolean isActive = true;
    
    @ManyToMany(mappedBy = "roles")
    private Set<User> users;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "role_permissions",
        joinColumns = @JoinColumn(name = "role_id"),
        inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    private Set<Permission> permissions;
    // Explicit getters and setters for compatibility
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public boolean isSystem() { return isSystem; }
    public void setSystem(boolean isSystem) { this.isSystem = isSystem; }
    public boolean isActive() { return isActive; }
    public void setActive(boolean isActive) { this.isActive = isActive; }
    public Set<User> getUsers() { return users; }
    public void setUsers(Set<User> users) { this.users = users; }
    public Set<Permission> getPermissions() { return permissions; }
    public void setPermissions(Set<Permission> permissions) { this.permissions = permissions; }
    // Builder for compatibility
    public static RoleBuilder builder() { return new RoleBuilder(); }
    public static class RoleBuilder {
        private Role r = new Role();
        public RoleBuilder id(Long id) { r.setId(id); return this; }
        public RoleBuilder name(String name) { r.setName(name); return this; }
        public RoleBuilder isSystem(boolean isSystem) { r.setSystem(isSystem); return this; }
        public RoleBuilder isActive(boolean isActive) { r.setActive(isActive); return this; }
        public RoleBuilder users(Set<User> users) { r.setUsers(users); return this; }
        public RoleBuilder permissions(Set<Permission> permissions) { r.setPermissions(permissions); return this; }
        public Role build() { return r; }
    }
}
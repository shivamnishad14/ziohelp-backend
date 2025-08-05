package com.ziohelp.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "role_permissions",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"role_id", "permission_id"})
    }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RolePermission {
    // Explicit getters and setters for compatibility
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public Permission getPermission() { return permission; }
    public void setPermission(Permission permission) { this.permission = permission; }
    public String getGrantedBy() { return grantedBy; }
    public void setGrantedBy(String grantedBy) { this.grantedBy = grantedBy; }
    public java.time.LocalDateTime getGrantedAt() { return grantedAt; }
    public void setGrantedAt(java.time.LocalDateTime grantedAt) { this.grantedAt = grantedAt; }
    // Builder for compatibility
    public static RolePermissionBuilder builder() { return new RolePermissionBuilder(); }
    public static class RolePermissionBuilder {
        private RolePermission r = new RolePermission();
        public RolePermissionBuilder id(Long id) { r.setId(id); return this; }
        public RolePermissionBuilder role(Role role) { r.setRole(role); return this; }
        public RolePermissionBuilder permission(Permission permission) { r.setPermission(permission); return this; }
        public RolePermissionBuilder grantedBy(String grantedBy) { r.setGrantedBy(grantedBy); return this; }
        public RolePermissionBuilder grantedAt(java.time.LocalDateTime grantedAt) { r.setGrantedAt(grantedAt); return this; }
        public RolePermission build() { return r; }
    }
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "permission_id", nullable = false)
    private Permission permission;

    @Column(name = "granted_by")
    private String grantedBy;

    @Column(name = "granted_at")
    private LocalDateTime grantedAt;

    @PrePersist
    protected void onCreate() {
        grantedAt = LocalDateTime.now();
    }
}

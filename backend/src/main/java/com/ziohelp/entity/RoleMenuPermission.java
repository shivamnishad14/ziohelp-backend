package com.ziohelp.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "role_menu_permissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleMenuPermission {
    // Explicit getters and setters for compatibility
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getRoleId() { return roleId; }
    public void setRoleId(Long roleId) { this.roleId = roleId; }
    public Long getMenuItemId() { return menuItemId; }
    public void setMenuItemId(Long menuItemId) { this.menuItemId = menuItemId; }
    public Boolean getCanView() { return canView; }
    public void setCanView(Boolean canView) { this.canView = canView; }
    public Boolean getCanEdit() { return canEdit; }
    public void setCanEdit(Boolean canEdit) { this.canEdit = canEdit; }
    public Boolean getCanDelete() { return canDelete; }
    public void setCanDelete(Boolean canDelete) { this.canDelete = canDelete; }
    // Builder for compatibility
    public static RoleMenuPermissionBuilder builder() { return new RoleMenuPermissionBuilder(); }
    public static class RoleMenuPermissionBuilder {
        private RoleMenuPermission r = new RoleMenuPermission();
        public RoleMenuPermissionBuilder id(Long id) { r.setId(id); return this; }
        public RoleMenuPermissionBuilder roleId(Long roleId) { r.setRoleId(roleId); return this; }
        public RoleMenuPermissionBuilder menuItemId(Long menuItemId) { r.setMenuItemId(menuItemId); return this; }
        public RoleMenuPermissionBuilder canView(Boolean canView) { r.setCanView(canView); return this; }
        public RoleMenuPermissionBuilder canEdit(Boolean canEdit) { r.setCanEdit(canEdit); return this; }
        public RoleMenuPermissionBuilder canDelete(Boolean canDelete) { r.setCanDelete(canDelete); return this; }
        public RoleMenuPermission build() { return r; }
    }
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "role_id", nullable = false)
    private Long roleId;

    @Column(name = "menu_item_id", nullable = false)
    private Long menuItemId;

    @Column(name = "can_view", nullable = false)
    private Boolean canView;

    @Column(name = "can_edit", nullable = false)
    private Boolean canEdit;

    @Column(name = "can_delete", nullable = false)
    private Boolean canDelete;
}

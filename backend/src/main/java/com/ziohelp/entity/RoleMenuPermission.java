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

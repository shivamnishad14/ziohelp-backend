package com.ziohelp.repository;

import com.ziohelp.entity.RoleMenuPermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public interface RoleMenuPermissionRepository extends JpaRepository<RoleMenuPermission, Long> {
    List<RoleMenuPermission> findByRoleIdAndCanViewTrue(Long roleId);
    List<RoleMenuPermission> findByRoleIdInAndCanViewTrue(List<Long> roleIds);
    
    // Bulk delete methods for improved performance
    @Modifying
    @Transactional
    @Query("DELETE FROM RoleMenuPermission rmp WHERE rmp.menuItemId = :menuItemId")
    void deleteByMenuItemId(@Param("menuItemId") Long menuItemId);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM RoleMenuPermission rmp WHERE rmp.menuItemId IN :menuItemIds")
    void deleteByMenuItemIdIn(@Param("menuItemIds") List<Long> menuItemIds);
}

package com.ziohelp.repository;

import com.ziohelp.entity.RoleMenuPermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RoleMenuPermissionRepository extends JpaRepository<RoleMenuPermission, Long> {
    List<RoleMenuPermission> findByRoleIdAndCanViewTrue(Long roleId);
    List<RoleMenuPermission> findByRoleIdInAndCanViewTrue(List<Long> roleIds);
}

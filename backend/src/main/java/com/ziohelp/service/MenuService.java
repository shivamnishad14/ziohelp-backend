
package com.ziohelp.service;

import com.ziohelp.dto.MenuItemDto;
import com.ziohelp.entity.MenuItem;
import com.ziohelp.entity.Role;
import com.ziohelp.entity.User;
import com.ziohelp.repository.MenuItemRepository;
import com.ziohelp.repository.RoleRepository;
import com.ziohelp.repository.UserRepository;
import com.ziohelp.repository.RoleMenuPermissionRepository;
import com.ziohelp.entity.RoleMenuPermission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MenuService {
    @Autowired
    private MenuItemRepository menuItemRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private RoleMenuPermissionRepository roleMenuPermissionRepository;

    // Admin: Get all menu items as tree (no user filtering)
    public List<MenuItemDto> getAllMenuItemsTree() {
        List<MenuItem> allMenus = menuItemRepository.findAll();
        Map<Long, MenuItemDto> dtoMap = new HashMap<>();
        List<MenuItemDto> roots = new ArrayList<>();

        // For each menu item, fetch allowed roles
        Map<Long, List<String>> menuRolesMap = new HashMap<>();
        List<RoleMenuPermission> allPerms = roleMenuPermissionRepository.findAll();
        Map<Long, String> roleIdToName = new HashMap<>();
        for (RoleMenuPermission perm : allPerms) {
            if (perm.getCanView() != null && perm.getCanView()) {
                Long roleId = perm.getRoleId();
                String roleName = roleIdToName.get(roleId);
                if (roleName == null) {
                    if (roleRepository != null) {
                        Role role = roleRepository.findById(roleId).orElse(null);
                        if (role != null) {
                            roleName = role.getName();
                            roleIdToName.put(roleId, roleName);
                        }
                    }
                }
                if (roleName != null) {
                    menuRolesMap.computeIfAbsent(perm.getMenuItemId(), k -> new ArrayList<>()).add(roleName);
                }
            }
        }

        // Convert all to DTOs
        for (MenuItem item : allMenus) {
            List<String> allowedRoles = menuRolesMap.getOrDefault(item.getId(), new ArrayList<>());
            MenuItemDto dto = MenuItemDto.builder()
                .id(item.getId())
                .name(item.getName())
                .path(item.getPath())
                .icon(item.getIcon())
                .description(item.getDescription())
                .sortOrder(item.getSortOrder())
                .isActive(item.getIsActive())
                .category(item.getCategory())
                .parentId(item.getParentId())
                .children(new ArrayList<>())
                .roles(allowedRoles)
                .build();
            dtoMap.put(dto.getId(), dto);
        }
        // Build tree
        for (MenuItemDto dto : dtoMap.values()) {
            if (dto.getParentId() == null) {
                roots.add(dto);
            } else {
                MenuItemDto parent = dtoMap.get(dto.getParentId());
                if (parent != null) {
                    parent.getChildren().add(dto);
                } else {
                    roots.add(dto); // fallback: treat as root if parent missing
                }
            }
        }
        sortMenuTree(roots);
        return roots;
    }

    // Admin: Create menu item
    public MenuItemDto createMenuItem(MenuItemDto dto) {
        MenuItem item = MenuItem.builder()
            .name(dto.getName())
            .path(dto.getPath())
            .icon(dto.getIcon())
            .description(dto.getDescription())
            .sortOrder(dto.getSortOrder())
            .isActive(dto.getIsActive())
            .category(dto.getCategory())
            .parentId(dto.getParentId())
            .build();
        MenuItem saved = menuItemRepository.save(item);
        return MenuItemDto.builder()
            .id(saved.getId())
            .name(saved.getName())
            .path(saved.getPath())
            .icon(saved.getIcon())
            .description(saved.getDescription())
            .sortOrder(saved.getSortOrder())
            .isActive(saved.getIsActive())
            .category(saved.getCategory())
            .parentId(saved.getParentId())
            .children(new ArrayList<>())
            .roles(new ArrayList<>())
            .build();
    }

    // Admin: Update menu item
    public MenuItemDto updateMenuItem(Long id, MenuItemDto dto) {
        MenuItem item = menuItemRepository.findById(id).orElseThrow();
        item.setName(dto.getName());
        item.setPath(dto.getPath());
        item.setIcon(dto.getIcon());
        item.setDescription(dto.getDescription());
        item.setSortOrder(dto.getSortOrder());
        item.setIsActive(dto.getIsActive());
        item.setCategory(dto.getCategory());
        item.setParentId(dto.getParentId());
        MenuItem saved = menuItemRepository.save(item);
        // Optionally update roles here if needed
        return MenuItemDto.builder()
            .id(saved.getId())
            .name(saved.getName())
            .path(saved.getPath())
            .icon(saved.getIcon())
            .description(saved.getDescription())
            .sortOrder(saved.getSortOrder())
            .isActive(saved.getIsActive())
            .category(saved.getCategory())
            .parentId(saved.getParentId())
            .children(new ArrayList<>())
            .roles(new ArrayList<>())
            .build();
    }

    // Admin: Delete menu item
    public void deleteMenuItem(Long id) {
        menuItemRepository.deleteById(id);
        // Optionally delete related role-menu permissions
        List<RoleMenuPermission> perms = roleMenuPermissionRepository.findAll();
        perms.stream().filter(p -> p.getMenuItemId().equals(id)).forEach(p -> roleMenuPermissionRepository.deleteById(p.getId()));
    }

    // Admin: Update roles for a menu item
    public void updateMenuItemRoles(Long menuItemId, List<String> roles) {
        // Remove old permissions for this menu item
        List<RoleMenuPermission> perms = roleMenuPermissionRepository.findAll();
        perms.stream().filter(p -> p.getMenuItemId().equals(menuItemId)).forEach(p -> roleMenuPermissionRepository.deleteById(p.getId()));
        // Add new permissions
        for (String roleName : roles) {
            Optional<Role> roleOpt = roleRepository.findByName(roleName);
            if (roleOpt.isPresent()) {
                Role role = roleOpt.get();
                RoleMenuPermission perm = RoleMenuPermission.builder()
                    .roleId(role.getId())
                    .menuItemId(menuItemId)
                    .canView(true)
                    .canEdit(false)
                    .canDelete(false)
                    .build();
                roleMenuPermissionRepository.save(perm);
            }
        }
    }

    // Build a nested menu tree for the user as DTOs
    public List<MenuItemDto> getMenuTreeForUser(Long userId) {
        List<MenuItem> flatMenu = getMenuForUser(userId);
        Map<Long, MenuItemDto> dtoMap = new HashMap<>();
        List<MenuItemDto> roots = new ArrayList<>();

        // For each menu item, fetch allowed roles
        Map<Long, List<String>> menuRolesMap = new HashMap<>();
        List<RoleMenuPermission> allPerms = roleMenuPermissionRepository.findAll();
        Map<Long, String> roleIdToName = new HashMap<>();
        for (RoleMenuPermission perm : allPerms) {
            if (perm.getCanView() != null && perm.getCanView()) {
                Long roleId = perm.getRoleId();
                String roleName = roleIdToName.get(roleId);
                if (roleName == null) {
                    if (roleRepository != null) {
                        Role role = roleRepository.findById(roleId).orElse(null);
                        if (role != null) {
                            roleName = role.getName();
                            roleIdToName.put(roleId, roleName);
                        }
                    }
                }
                if (roleName != null) {
                    menuRolesMap.computeIfAbsent(perm.getMenuItemId(), k -> new ArrayList<>()).add(roleName);
                }
            }
        }

        // Convert all to DTOs
        for (MenuItem item : flatMenu) {
            List<String> allowedRoles = menuRolesMap.getOrDefault(item.getId(), new ArrayList<>());
            MenuItemDto dto = MenuItemDto.builder()
                .id(item.getId())
                .name(item.getName())
                .path(item.getPath())
                .icon(item.getIcon())
                .description(item.getDescription())
                .sortOrder(item.getSortOrder())
                .isActive(item.getIsActive())
                .category(item.getCategory())
                .parentId(item.getParentId())
                .children(new ArrayList<>())
                .roles(allowedRoles)
                .build();
            dtoMap.put(dto.getId(), dto);
        }
        // Build tree
        for (MenuItemDto dto : dtoMap.values()) {
            if (dto.getParentId() == null) {
                roots.add(dto);
            } else {
                MenuItemDto parent = dtoMap.get(dto.getParentId());
                if (parent != null) {
                    parent.getChildren().add(dto);
                } else {
                    roots.add(dto); // fallback: treat as root if parent missing
                }
            }
        }
        // Sort children by sortOrder
        sortMenuTree(roots);
        return roots;
    }

    private void sortMenuTree(List<MenuItemDto> items) {
        items.sort((a, b) -> Integer.compare(
            a.getSortOrder() != null ? a.getSortOrder() : 0,
            b.getSortOrder() != null ? b.getSortOrder() : 0
        ));
        for (MenuItemDto item : items) {
            if (item.getChildren() != null && !item.getChildren().isEmpty()) {
                sortMenuTree(item.getChildren());
            }
        }
    }

    // Fetch menu items for a user based on their roles
    public List<MenuItem> getMenuForUser(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return List.of();
        // Get all role IDs for the user
        List<Long> roleIds = user.getRoles().stream().map(Role::getId).collect(Collectors.toList());
        // Get all menu item IDs the user can view
        List<RoleMenuPermission> permissions = roleMenuPermissionRepository.findByRoleIdInAndCanViewTrue(roleIds);
        Set<Long> allowedMenuIds = permissions.stream().map(RoleMenuPermission::getMenuItemId).collect(Collectors.toSet());
        // Fetch allowed menu items
        List<MenuItem> allowedMenus = menuItemRepository.findAllById(allowedMenuIds);
        // Optionally, sort by sortOrder
        allowedMenus.sort((a, b) -> Integer.compare(
            a.getSortOrder() != null ? a.getSortOrder() : 0,
            b.getSortOrder() != null ? b.getSortOrder() : 0
        ));
        return allowedMenus;
    }

    // Helper to get user by email
    public java.util.Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email);
    }
}

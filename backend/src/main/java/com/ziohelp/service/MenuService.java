
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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
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

    // Admin: Get all menu items as tree (no user filtering) - Cached
    @Cacheable("menuItemsTree")
    public List<MenuItemDto> getAllMenuItemsTree() {
        List<MenuItem> allMenus = menuItemRepository.findAll();
        return buildMenuTreeFromItems(allMenus);
    }

    // Build menu tree from items with role information
    private List<MenuItemDto> buildMenuTreeFromItems(List<MenuItem> items) {
        Map<Long, MenuItemDto> dtoMap = new HashMap<>();
        List<MenuItemDto> roots = new ArrayList<>();

        // Optimize: Single query to get all role-menu mappings
        Map<Long, List<String>> menuRolesMap = getMenuRolesMapping();

        // Convert all to DTOs
        for (MenuItem item : items) {
            List<String> allowedRoles = menuRolesMap.getOrDefault(item.getId(), new ArrayList<>());
            MenuItemDto dto = buildMenuItemDto(item, allowedRoles);
            dtoMap.put(dto.getId(), dto);
        }
        
        // Build tree structure
        return buildTreeStructure(dtoMap);
    }

    // Optimized role mapping query
    @Cacheable("menuRolesMapping")
    private Map<Long, List<String>> getMenuRolesMapping() {
        Map<Long, List<String>> menuRolesMap = new HashMap<>();
        
        // Single query with joins to get all permissions and role names
        List<RoleMenuPermission> allPerms = roleMenuPermissionRepository.findAll();
        Map<Long, String> roleIdToName = roleRepository.findAll().stream()
            .collect(Collectors.toMap(Role::getId, Role::getName));
        
        for (RoleMenuPermission perm : allPerms) {
            if (perm.getCanView() != null && perm.getCanView()) {
                String roleName = roleIdToName.get(perm.getRoleId());
                if (roleName != null) {
                    menuRolesMap.computeIfAbsent(perm.getMenuItemId(), k -> new ArrayList<>())
                               .add(roleName);
                }
            }
        }
        return menuRolesMap;
    }

    // Helper to build MenuItemDto
    private MenuItemDto buildMenuItemDto(MenuItem item, List<String> roles) {
        return MenuItemDto.builder()
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
            .roles(roles)
            .build();
    }

    // Helper to build tree structure
    private List<MenuItemDto> buildTreeStructure(Map<Long, MenuItemDto> dtoMap) {
        List<MenuItemDto> roots = new ArrayList<>();
        
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

    // Admin: Create menu item with cache eviction
    @Transactional
    @CacheEvict(value = {"menuItemsTree", "menuRolesMapping"}, allEntries = true)
    public MenuItemDto createMenuItem(MenuItemDto dto) {
        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Menu item name is required");
        }
        if (dto.getPath() == null || dto.getPath().trim().isEmpty()) {
            throw new IllegalArgumentException("Menu item path is required");
        }
        
        MenuItem item = MenuItem.builder()
            .name(dto.getName())
            .path(dto.getPath())
            .icon(dto.getIcon())
            .description(dto.getDescription())
            .sortOrder(dto.getSortOrder())
            .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
            .category(dto.getCategory())
            .parentId(dto.getParentId())
            .build();
        MenuItem saved = menuItemRepository.save(item);
        return buildMenuItemDto(saved, new ArrayList<>());
    }

    // Admin: Update menu item with cache eviction
    @Transactional
    @CacheEvict(value = {"menuItemsTree", "menuRolesMapping"}, allEntries = true)
    public MenuItemDto updateMenuItem(Long id, MenuItemDto dto) {
        MenuItem item = menuItemRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Menu item not found with id: " + id));
            
        if (dto.getName() != null && !dto.getName().trim().isEmpty()) {
            item.setName(dto.getName());
        }
        if (dto.getPath() != null && !dto.getPath().trim().isEmpty()) {
            item.setPath(dto.getPath());
        }
        if (dto.getIcon() != null) {
            item.setIcon(dto.getIcon());
        }
        if (dto.getDescription() != null) {
            item.setDescription(dto.getDescription());
        }
        if (dto.getSortOrder() != null) {
            item.setSortOrder(dto.getSortOrder());
        }
        if (dto.getIsActive() != null) {
            item.setIsActive(dto.getIsActive());
        }
        if (dto.getCategory() != null) {
            item.setCategory(dto.getCategory());
        }
        if (dto.getParentId() != null) {
            item.setParentId(dto.getParentId());
        }
        
        MenuItem saved = menuItemRepository.save(item);
        return buildMenuItemDto(saved, new ArrayList<>());
    }

    // Admin: Delete menu item with cache eviction and cascade delete
    @Transactional
    @CacheEvict(value = {"menuItemsTree", "menuRolesMapping"}, allEntries = true)
    public void deleteMenuItem(Long id) {
        if (!menuItemRepository.existsById(id)) {
            throw new IllegalArgumentException("Menu item not found with id: " + id);
        }
        
        // Delete related role-menu permissions in bulk
        roleMenuPermissionRepository.deleteByMenuItemId(id);
        menuItemRepository.deleteById(id);
    }

    // Admin: Update roles for a menu item with transaction
    @Transactional
    @CacheEvict(value = {"menuItemsTree", "menuRolesMapping"}, allEntries = true)
    public void updateMenuItemRoles(Long menuItemId, List<String> roles) {
        if (!menuItemRepository.existsById(menuItemId)) {
            throw new IllegalArgumentException("Menu item not found with id: " + menuItemId);
        }
        
        // Remove old permissions for this menu item in bulk
        roleMenuPermissionRepository.deleteByMenuItemId(menuItemId);
        
        // Add new permissions
        List<RoleMenuPermission> newPermissions = new ArrayList<>();
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
                newPermissions.add(perm);
            }
        }
        roleMenuPermissionRepository.saveAll(newPermissions);
    }

    // Bulk operations
    @Transactional
    @CacheEvict(value = {"menuItemsTree", "menuRolesMapping"}, allEntries = true)
    public List<MenuItemDto> createMenuItems(List<MenuItemDto> dtos) {
        List<MenuItem> items = new ArrayList<>();
        for (MenuItemDto dto : dtos) {
            if (dto.getName() == null || dto.getName().trim().isEmpty()) {
                throw new IllegalArgumentException("Menu item name is required for all items");
            }
            if (dto.getPath() == null || dto.getPath().trim().isEmpty()) {
                throw new IllegalArgumentException("Menu item path is required for all items");
            }
            
            MenuItem item = MenuItem.builder()
                .name(dto.getName())
                .path(dto.getPath())
                .icon(dto.getIcon())
                .description(dto.getDescription())
                .sortOrder(dto.getSortOrder())
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .category(dto.getCategory())
                .parentId(dto.getParentId())
                .build();
            items.add(item);
        }
        
        List<MenuItem> saved = menuItemRepository.saveAll(items);
        return saved.stream()
            .map(item -> buildMenuItemDto(item, new ArrayList<>()))
            .collect(Collectors.toList());
    }

    @Transactional
    @CacheEvict(value = {"menuItemsTree", "menuRolesMapping"}, allEntries = true)
    public void deleteMenuItems(List<Long> ids) {
        // Validate all ids exist
        List<MenuItem> existingItems = menuItemRepository.findAllById(ids);
        if (existingItems.size() != ids.size()) {
            throw new IllegalArgumentException("Some menu items not found");
        }
        
        // Delete related permissions in bulk
        roleMenuPermissionRepository.deleteByMenuItemIdIn(ids);
        menuItemRepository.deleteAllById(ids);
    }

    // Get available roles
    @Cacheable("availableRoles")
    public List<String> getAvailableRoles() {
        return roleRepository.findAll().stream()
            .map(Role::getName)
            .sorted()
            .collect(Collectors.toList());
    }

    // Build a nested menu tree for the user as DTOs - Cached per user
    @Cacheable(value = "userMenuTree", key = "#userId")
    public List<MenuItemDto> getMenuTreeForUser(Long userId) {
        List<MenuItem> flatMenu = getMenuForUser(userId);
        return buildMenuTreeFromItems(flatMenu);
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

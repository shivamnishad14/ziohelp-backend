package com.ziohelp.controller;

import com.ziohelp.dto.MenuItemDto;
import com.ziohelp.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;
import com.ziohelp.entity.MenuItem;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.validation.annotation.Validated;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.Optional;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/menu")
@Validated
public class MenuController {
    @Autowired
    private MenuService menuService;

    @GetMapping
    public ResponseEntity<List<MenuItemDto>> getMenuForCurrentUser() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            Long userId = null;
            var userOpt = menuService.getUserByEmail(email);
            if (userOpt.isPresent()) {
                userId = userOpt.get().getId();
            }
            List<MenuItemDto> menuTree = menuService.getMenuTreeForUser(userId);
            return ResponseEntity.ok(menuTree);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch user menu: " + e.getMessage(), e);
        }
    }

    // --- Admin endpoints ---
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MenuItemDto>> getAllMenuItems() {
        try {
            List<MenuItemDto> allMenus = menuService.getAllMenuItemsTree();
            return ResponseEntity.ok(allMenus);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch all menu items: " + e.getMessage(), e);
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MenuItemDto> createMenuItem(@Valid @RequestBody MenuItemDto dto) {
        try {
            MenuItemDto created = menuService.createMenuItem(dto);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create menu item: " + e.getMessage(), e);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MenuItemDto> updateMenuItem(
            @PathVariable @NotNull Long id, 
            @Valid @RequestBody MenuItemDto dto) {
        try {
            MenuItemDto updated = menuService.updateMenuItem(id, dto);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update menu item with id " + id + ": " + e.getMessage(), e);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable @NotNull Long id) {
        try {
            menuService.deleteMenuItem(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete menu item with id " + id + ": " + e.getMessage(), e);
        }
    }

    @PutMapping("/{id}/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateMenuItemRoles(
            @PathVariable @NotNull Long id, 
            @RequestBody @NotNull List<String> roles) {
        try {
            menuService.updateMenuItemRoles(id, roles);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to update roles for menu item with id " + id + ": " + e.getMessage(), e);
        }
    }

    // Bulk operations
    @PostMapping("/bulk")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MenuItemDto>> createMenuItems(@Valid @RequestBody List<MenuItemDto> dtos) {
        try {
            List<MenuItemDto> created = menuService.createMenuItems(dtos);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create menu items in bulk: " + e.getMessage(), e);
        }
    }

    @DeleteMapping("/bulk")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMenuItems(@RequestBody @NotNull List<Long> ids) {
        try {
            menuService.deleteMenuItems(ids);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete menu items in bulk: " + e.getMessage(), e);
        }
    }

    // Get available roles for menu assignment
    @GetMapping("/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<String>> getAvailableRoles() {
        try {
            List<String> roles = menuService.getAvailableRoles();
            return ResponseEntity.ok(roles);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch available roles: " + e.getMessage(), e);
        }
    }

    // Exception handler for better error responses
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException e) {
        Map<String, String> error = new HashMap<>();
        error.put("error", e.getMessage());
        error.put("timestamp", java.time.Instant.now().toString());
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgumentException(IllegalArgumentException e) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "Invalid request: " + e.getMessage());
        error.put("timestamp", java.time.Instant.now().toString());
        return ResponseEntity.badRequest().body(error);
    }
}

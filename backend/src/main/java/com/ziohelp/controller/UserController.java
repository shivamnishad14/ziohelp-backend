package com.ziohelp.controller;

import com.ziohelp.dto.UserDto;
import com.ziohelp.entity.User;
import com.ziohelp.entity.Role;
import com.ziohelp.repository.UserRepository;
import com.ziohelp.repository.RoleRepository;
import com.ziohelp.service.AuthService;
import com.ziohelp.service.OrganizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.ziohelp.dto.PageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Map;
import java.util.Collections;
import com.ziohelp.service.AuditLogService;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "Operations related to users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final UserRepository userRepository;
    private final AuthService authService;
    private final OrganizationService organizationService;
    private final RoleRepository roleRepository;
    private final AuditLogService auditLogService;

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TENANT_ADMIN', 'DEVELOPER')") // All authenticated users except guest
    public ResponseEntity<UserDto> getCurrentUser() {
        User user = authService.getAuthenticatedUser();
        return ResponseEntity.ok(safeMapUserToDto(user));
    }

    @PutMapping("/me")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TENANT_ADMIN', 'DEVELOPER')") // All authenticated users except guest
    public ResponseEntity<UserDto> updateProfile(@RequestBody UserDto dto) {
        User user = authService.getAuthenticatedUser();
        user.setFullName(dto.getName());
        user.setEmail(dto.getEmail());
        userRepository.save(user);
        return ResponseEntity.ok(safeMapUserToDto(user));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')") // Only admin or tenant admin can create users
    public ResponseEntity<?> createUser(@RequestBody UserDto dto, @RequestParam Long organizationId) {
        try {
            com.ziohelp.entity.Organization org = organizationService.getOrganizationById(organizationId);
            if (org == null) return ResponseEntity.badRequest().body("Organization not found");
            User user = new User();
            user.setFullName(dto.getName());
            user.setEmail(dto.getEmail());
            user.setUsername(dto.getUsername());
            user.setOrganization(org);
            user.setActive(dto.isActive());
            user.setApproved(dto.isApproved());
            if (dto.getRoles() != null && !dto.getRoles().isEmpty()) {
                List<Role> roleEntities = roleRepository.findAll().stream()
                    .filter(r -> dto.getRoles().contains(r.getName()))
                    .collect(Collectors.toList());
                user.setRoles(new java.util.HashSet<>(roleEntities));
            }
            if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
                user.setPassword(authService.encodePassword(dto.getPassword()));
            }
            userRepository.save(user);
            return ResponseEntity.ok(safeMapUserToDto(user));
        } catch (Exception e) {
            logger.error("Error creating user", e);
            return ResponseEntity.status(500).body(new java.util.HashMap<String, Object>() {{
                put("error", "Error creating user");
                put("message", e.getMessage());
            }});
        }
    }

    @GetMapping("/by-org/{orgId}")
    @Operation(summary = "Get paginated, searchable, and sortable list of users by organization")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')") // Only admin or tenant admin can view users by org
    public ResponseEntity<PageResponse<UserDto>> getUsersByOrganization(
            @PathVariable Long orgId,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "fullName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<User> userPage = userRepository.findByOrganizationIdPaged(orgId, search.isEmpty() ? null : search, pageable);
        List<UserDto> dtos = userPage.getContent().stream().map(this::safeMapUserToDto).collect(java.util.stream.Collectors.toList());
        PageResponse<UserDto> response = new PageResponse<>(
            dtos,
            userPage.getNumber(),
            userPage.getSize(),
            userPage.getTotalElements(),
            userPage.getTotalPages(),
            userPage.isLast()
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUserRoles(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();
        List<String> roles = user.getRoles().stream().map(Role::getName).collect(Collectors.toList());
        return ResponseEntity.ok(roles);
    }

    @DeleteMapping("/{userId}/roles/{roleName}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> removeUserRole(@PathVariable Long userId, @PathVariable String roleName) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();
        boolean removed = user.getRoles().removeIf(role -> role.getName().equalsIgnoreCase(roleName));
        userRepository.save(user);
        // Audit log
        auditLogService.logActivity("ROLE_UPDATE", "Role removed: " + roleName, user.getEmail());
        return ResponseEntity.ok(Collections.singletonMap("message", removed ? "Role removed" : "Role not found for user"));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUsers(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "") String search
    ) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<User> userPage = userRepository.findAllPaged(search.isEmpty() ? null : search, pageable);
            List<UserDto> content = userPage.getContent().stream().map(this::safeMapUserToDto).collect(Collectors.toList());
            // Return structure matching frontend expectation
            return ResponseEntity.ok(
                new java.util.HashMap<String, Object>() {{
                    put("content", content);
                    put("page", userPage.getNumber());
                    put("size", userPage.getSize());
                    put("totalElements", userPage.getTotalElements());
                    put("totalPages", userPage.getTotalPages());
                    put("last", userPage.isLast());
                }}
            );
        } catch (Exception e) {
            logger.error("Error fetching users", e);
            return ResponseEntity.status(500).body(new java.util.HashMap<String, Object>() {{
                put("error", "Internal server error");
                put("message", e.getMessage());
            }});
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{userId}/roles")
    public ResponseEntity<?> assignRolesToUser(@PathVariable Long userId, @RequestBody List<String> roles) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();
        List<Role> roleEntities = roleRepository.findAll().stream()
            .filter(r -> roles.contains(r.getName()))
            .collect(Collectors.toList());
        user.setRoles(new java.util.HashSet<>(roleEntities));
        userRepository.save(user);
        // Audit log
        auditLogService.logActivity("ROLE_UPDATE", "Roles updated: " + roles, user.getEmail());
        return ResponseEntity.ok(Collections.singletonMap("message", "Roles updated"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    @Operation(summary = "Get paginated, searchable, and sortable list of all users")
    public ResponseEntity<PageResponse<UserDto>> getAllUsers(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "fullName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<User> userPage = userRepository.findAllPaged(search.isEmpty() ? null : search, pageable);
        List<UserDto> dtos = userPage.getContent().stream().map(this::safeMapUserToDto).collect(java.util.stream.Collectors.toList());
        PageResponse<UserDto> response = new PageResponse<>(
            dtos,
            userPage.getNumber(),
            userPage.getSize(),
            userPage.getTotalElements(),
            userPage.getTotalPages(),
            userPage.isLast()
        );
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        userRepository.deleteById(userId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{userId}/toggle-active")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')")
    public ResponseEntity<?> toggleActive(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.status(404).body("User not found");
        user.setActive(!user.isActive());
        userRepository.save(user);
        return ResponseEntity.ok(safeMapUserToDto(user));
    }

    @PutMapping("/{userId}/approve-admin")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')")
    public ResponseEntity<?> approveAdmin(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.status(404).body("User not found");
        user.setApproved(true);
        userRepository.save(user);
        return ResponseEntity.ok(safeMapUserToDto(user));
    }

    @PutMapping("/{userId}/reject-admin")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')")
    public ResponseEntity<?> rejectAdmin(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.status(404).body("User not found");
        user.setApproved(false);
        userRepository.save(user);
        return ResponseEntity.ok(safeMapUserToDto(user));
    }
    // --- Utility: Map User to UserDto (null-safe, all expected fields) ---
    private UserDto safeMapUserToDto(User user) {
        if (user == null) return null;
        UserDto dto = new UserDto();
        try {
            dto.setId(user.getId() != null ? user.getId().toString() : null);
            dto.setName(user.getFullName() != null ? user.getFullName() : "");
            dto.setEmail(user.getEmail() != null ? user.getEmail() : "");
            // If roles is null or empty, fallback to user.getRole() if present
            if (user.getRoles() != null && !user.getRoles().isEmpty()) {
                dto.setRoles(user.getRoles().stream().map(r -> r != null && r.getName() != null ? r.getName() : "").collect(Collectors.toList()));
            } else if (user.getRole() != null) {
                dto.setRoles(java.util.Collections.singletonList(user.getRole()));
            } else {
                dto.setRoles(java.util.Collections.emptyList());
            }
            dto.setActive(user.isActive());
            dto.setApproved(user.isApproved());
            dto.setUsername(user.getUsername() != null ? user.getUsername() : "");
            dto.setOrganizationId(user.getOrganization() != null && user.getOrganization().getId() != null ? user.getOrganization().getId().toString() : null);
            // Add createdAt, isApproved, isActive for frontend
            dto.setCreatedAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null);
        } catch (Exception e) {
            logger.error("Error mapping User to UserDto for user id: {}", user.getId(), e);
        }
        return dto;
    }

    @GetMapping("/roles")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')")
    public ResponseEntity<List<Role>> listRoles() {
        return ResponseEntity.ok(roleRepository.findAll());
    }

    @GetMapping("/pending-admins")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')")
    public ResponseEntity<List<User>> pendingAdmins() {
        List<User> pending = userRepository.findAll().stream()
            .filter(u -> u.getRoles().stream().anyMatch(r -> r.getName().equals("ADMIN")) && !u.isApproved())
            .collect(Collectors.toList());
        return ResponseEntity.ok(pending);
    }

    @GetMapping("/count")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')")
    public ResponseEntity<Long> userCount() {
        return ResponseEntity.ok(userRepository.count());
    }
} 
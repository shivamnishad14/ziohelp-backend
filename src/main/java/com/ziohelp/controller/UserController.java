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

    private final UserRepository userRepository;
    private final AuthService authService;
    private final OrganizationService organizationService;
    private final RoleRepository roleRepository;
    private final AuditLogService auditLogService;

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TENANT_ADMIN', 'DEVELOPER')") // All authenticated users except guest
    public ResponseEntity<UserDto> getCurrentUser() {
        User user = authService.getAuthenticatedUser();
        UserDto dto = new UserDto();
        dto.setName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setRoles(user.getRoles().stream().map(Role::getName).collect(Collectors.toList()));
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/me")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TENANT_ADMIN', 'DEVELOPER')") // All authenticated users except guest
    public ResponseEntity<UserDto> updateProfile(@RequestBody UserDto dto) {
        User user = authService.getAuthenticatedUser();
        user.setFullName(dto.getName());
        user.setEmail(dto.getEmail());
        userRepository.save(user);
        UserDto updatedDto = new UserDto();
        updatedDto.setName(user.getFullName());
        updatedDto.setEmail(user.getEmail());
        return ResponseEntity.ok(updatedDto);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')") // Only admin or tenant admin can create users
    public ResponseEntity<UserDto> createUser(@RequestBody UserDto dto, @RequestParam Long organizationId) {
        com.ziohelp.entity.Organization org = organizationService.getOrganizationById(organizationId);
        if (org == null) return ResponseEntity.badRequest().build();
        User user = new User();
        user.setFullName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setOrganization(org);
        userRepository.save(user);
        UserDto createdDto = new UserDto();
        createdDto.setName(user.getFullName());
        createdDto.setEmail(user.getEmail());
        return ResponseEntity.ok(createdDto);
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
        List<UserDto> dtos = userPage.getContent().stream().map(u -> {
            UserDto dto = new UserDto();
            dto.setName(u.getFullName());
            dto.setEmail(u.getEmail());
            return dto;
        }).collect(java.util.stream.Collectors.toList());
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
    public ResponseEntity<Page<UserDto>> getUsers(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "") String search
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> userPage = userRepository.findAllPaged(search.isEmpty() ? null : search, pageable);
        Page<UserDto> dtoPage = userPage.map(u -> {
            UserDto dto = new UserDto();
            dto.setName(u.getFullName());
            dto.setEmail(u.getEmail());
            dto.setRoles(u.getRoles().stream().map(Role::getName).collect(Collectors.toList()));
            return dto;
        });
        return ResponseEntity.ok(dtoPage);
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
        List<UserDto> dtos = userPage.getContent().stream().map(u -> {
            UserDto dto = new UserDto();
            dto.setName(u.getFullName());
            dto.setEmail(u.getEmail());
            dto.setRoles(u.getRoles().stream().map(Role::getName).collect(java.util.stream.Collectors.toList()));
            return dto;
        }).collect(java.util.stream.Collectors.toList());
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
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(!user.isActive());
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{userId}/approve-admin")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')")
    public ResponseEntity<?> approveAdmin(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setApproved(true);
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{userId}/reject-admin")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')")
    public ResponseEntity<?> rejectAdmin(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setApproved(false);
        userRepository.save(user);
        return ResponseEntity.ok().build();
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
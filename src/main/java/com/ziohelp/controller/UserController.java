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

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "Operations related to users")
public class UserController {

    private final UserRepository userRepository;
    private final AuthService authService;
    private final OrganizationService organizationService;
    private final RoleRepository roleRepository;

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser() {
        User user = authService.getAuthenticatedUser();
        UserDto dto = new UserDto();
        dto.setName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setRoles(user.getRoles().stream().map(Role::getName).collect(Collectors.toList()));
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/me")
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
        return ResponseEntity.ok("Roles updated");
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
} 
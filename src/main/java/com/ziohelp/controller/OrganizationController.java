package com.ziohelp.controller;

import com.ziohelp.entity.Organization;
import com.ziohelp.service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.ziohelp.dto.PageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/organizations")
@Tag(name = "Organizations", description = "Operations related to organizations")
public class OrganizationController {
    @Autowired
    private OrganizationService organizationService;

    @GetMapping
    @Operation(summary = "Get paginated, searchable, and sortable list of organizations")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'USER', 'DEVELOPER')") // All authenticated users can view orgs
    public ResponseEntity<PageResponse<Organization>> getAllOrganizations(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Organization> orgPage = organizationService.getAllOrganizationsPaged(search, pageable);
        PageResponse<Organization> response = new PageResponse<>(
            orgPage.getContent(),
            orgPage.getNumber(),
            orgPage.getSize(),
            orgPage.getTotalElements(),
            orgPage.getTotalPages(),
            orgPage.isLast()
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'USER', 'DEVELOPER')")
    public ResponseEntity<Organization> getOrganizationById(@PathVariable Long id) {
        // TODO: For TENANT_ADMIN, only allow if org matches their tenant
        Organization org = organizationService.getOrganizationById(id);
        if (org == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(org);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // Only admin can create orgs
    public ResponseEntity<Organization> createOrganization(@RequestBody Organization org) {
        return ResponseEntity.ok(organizationService.createOrganization(org));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Only admin can delete orgs
    public ResponseEntity<Void> deleteOrganization(@PathVariable Long id) {
        organizationService.deleteOrganization(id);
        return ResponseEntity.noContent().build();
    }
} 
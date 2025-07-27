package com.ziohelp.controller;

import com.ziohelp.entity.Faq;
import com.ziohelp.entity.Organization;
import com.ziohelp.repository.FaqRepository;
import com.ziohelp.service.OrganizationService;
import com.ziohelp.dto.PageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
// import com.ziohelp.service.AccessControlService;
import com.ziohelp.service.AuthService;
import com.ziohelp.entity.User;

@RestController
@RequestMapping("/api/faq")
@Tag(name = "FAQs", description = "Operations related to FAQs")
public class FaqController {
    @Autowired
    private FaqRepository faqRepository;
    @Autowired
    private OrganizationService organizationService;
    // @Autowired
    // private AccessControlService accessControlService;
    @Autowired
    private AuthService authService;

    @GetMapping
    @Operation(summary = "Get paginated, searchable, and sortable list of FAQs")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'USER', 'DEVELOPER')") // All authenticated users can view FAQs
    public ResponseEntity<PageResponse<Faq>> getAllFaqs(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "question") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Faq> faqPage = faqRepository.findAllPaged(search.isEmpty() ? null : search, pageable);
        PageResponse<Faq> response = new PageResponse<>(
            faqPage.getContent(),
            faqPage.getNumber(),
            faqPage.getSize(),
            faqPage.getTotalElements(),
            faqPage.getTotalPages(),
            faqPage.isLast()
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/by-org/{orgId}")
    @Operation(summary = "Get paginated, searchable, and sortable list of FAQs by organization")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'USER', 'DEVELOPER')")
    public ResponseEntity<PageResponse<Faq>> getFaqsByOrganization(
            @PathVariable Long orgId,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "question") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Faq> faqPage = faqRepository.findByOrganizationIdPaged(orgId, search.isEmpty() ? null : search, pageable);
        PageResponse<Faq> response = new PageResponse<>(
            faqPage.getContent(),
            faqPage.getNumber(),
            faqPage.getSize(),
            faqPage.getTotalElements(),
            faqPage.getTotalPages(),
            faqPage.isLast()
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/by-org/{orgId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')") // Only admin or tenant admin can create FAQs
    public ResponseEntity<Faq> createFaqForOrganization(@RequestBody Faq faq, @PathVariable Long orgId) {
        User currentUser = authService.getAuthenticatedUser();
        // accessControlService.validateContentCreation(currentUser, orgId);
        Organization org = organizationService.getOrganizationById(orgId);
        if (org == null) return ResponseEntity.badRequest().build();
        faq.setOrganization(org);
        return ResponseEntity.ok(faqRepository.save(faq));
    }

    @PostMapping
    public ResponseEntity<Faq> createFaq(@RequestBody Faq faq) {
        return ResponseEntity.ok(faqRepository.save(faq));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'USER', 'DEVELOPER')")
    public ResponseEntity<Faq> getFaqById(@PathVariable Long id) {
        return faqRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')")
    public ResponseEntity<Faq> updateFaq(@PathVariable Long id, @RequestBody Faq faq) {
        Faq existing = faqRepository.findById(id).orElseThrow(() -> new RuntimeException("FAQ not found"));
        existing.setQuestion(faq.getQuestion());
        existing.setAnswer(faq.getAnswer());
        faqRepository.save(existing);
        return ResponseEntity.ok(existing);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')")
    public ResponseEntity<?> deleteFaq(@PathVariable Long id) {
        faqRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/by-category/{category}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'USER', 'DEVELOPER')")
    public ResponseEntity<List<Faq>> getFaqsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(faqRepository.findByCategory(category));
    }

    @GetMapping("/categories")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'USER', 'DEVELOPER')")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(faqRepository.findDistinctCategories());
    }
} 
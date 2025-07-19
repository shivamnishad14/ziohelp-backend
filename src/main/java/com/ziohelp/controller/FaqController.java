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

import java.util.List;

@RestController
@RequestMapping("/api/faq")
@Tag(name = "FAQs", description = "Operations related to FAQs")
public class FaqController {
    @Autowired
    private FaqRepository faqRepository;
    @Autowired
    private OrganizationService organizationService;

    @GetMapping
    @Operation(summary = "Get paginated, searchable, and sortable list of FAQs")
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
    public ResponseEntity<Faq> createFaqForOrganization(@RequestBody Faq faq, @PathVariable Long orgId) {
        Organization org = organizationService.getOrganizationById(orgId);
        if (org == null) return ResponseEntity.badRequest().build();
        faq.setOrganization(org);
        return ResponseEntity.ok(faqRepository.save(faq));
    }
} 
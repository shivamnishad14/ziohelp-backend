package com.ziohelp.controller;

import com.ziohelp.entity.KnowledgeBaseArticle;
import com.ziohelp.service.KnowledgeBaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/knowledge-base/articles")
public class KnowledgeBaseController {
    @Autowired
    private KnowledgeBaseService service;

    @GetMapping("/list")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER', 'USER')")
    public ResponseEntity<Page<KnowledgeBaseArticle>> listArticles(@RequestParam(required = false) Long productId,
                                                                  @RequestParam(defaultValue = "0") int page,
                                                                  @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(service.listArticles(productId, page, size));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER', 'USER')")
    public ResponseEntity<KnowledgeBaseArticle> getArticle(@PathVariable Long id) {
        return service.getArticle(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER')")
    public ResponseEntity<KnowledgeBaseArticle> createArticle(@RequestBody KnowledgeBaseArticle article) {
        return ResponseEntity.ok(service.createArticle(article));
    }

    @PutMapping("/{id}/update")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER')")
    public ResponseEntity<KnowledgeBaseArticle> updateArticle(@PathVariable Long id, @RequestBody KnowledgeBaseArticle article) {
        return ResponseEntity.ok(service.updateArticle(id, article));
    }

    @DeleteMapping("/{id}/delete")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER')")
    public ResponseEntity<?> deleteArticle(@PathVariable Long id) {
        service.deleteArticle(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/category/{category}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER', 'USER')")
    public ResponseEntity<List<KnowledgeBaseArticle>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(service.findByCategory(category));
    }

    @GetMapping("/product-category")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER', 'USER')")
    public ResponseEntity<List<KnowledgeBaseArticle>> getByProductAndCategory(@RequestParam Long productId, @RequestParam String category) {
        return ResponseEntity.ok(service.findByProductIdAndCategory(productId, category));
    }
} 
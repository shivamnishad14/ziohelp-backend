package com.ziohelp.controller;

import com.ziohelp.entity.KnowledgeBaseArticle;
import com.ziohelp.service.KnowledgeBaseService;
import com.ziohelp.dto.KnowledgeBaseArticleRequest;
import com.ziohelp.dto.KnowledgeBaseArticleResponse;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import com.ziohelp.dto.ApiError;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/knowledge-base")
@Tag(name = "Knowledge Base", description = "Operations related to Knowledge Base Articles")
@CrossOrigin(origins = "*", maxAge = 3600)
public class KnowledgeBaseController {
    @Autowired
    private KnowledgeBaseService service;

    @GetMapping("/articles")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER', 'USER')")
    @Operation(summary = "List all articles with pagination")
    public ResponseEntity<Page<KnowledgeBaseArticleResponse>> listArticles(@RequestParam(required = false) Long productId,
                                                                          @RequestParam(defaultValue = "0") int page,
                                                                          @RequestParam(defaultValue = "10") int size) {
        Page<KnowledgeBaseArticle> articles = service.listArticles(productId, page, size);
        Page<KnowledgeBaseArticleResponse> response = articles.map(this::toResponseDto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/articles/published")
    @Operation(summary = "List published articles with pagination")
    public ResponseEntity<Page<KnowledgeBaseArticleResponse>> listPublishedArticles(@RequestParam(required = false) Long productId,
                                                                                   @RequestParam(defaultValue = "0") int page,
                                                                                   @RequestParam(defaultValue = "10") int size) {
        Page<KnowledgeBaseArticle> articles = service.listPublishedArticles(productId, page, size);
        Page<KnowledgeBaseArticleResponse> response = articles.map(this::toResponseDto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/articles/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER', 'USER')")
    @Operation(summary = "Get article by ID")
    public ResponseEntity<KnowledgeBaseArticleResponse> getArticle(@PathVariable Long id) {
        return service.getArticle(id)
                .map(article -> ResponseEntity.ok(toResponseDto(article)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/articles")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER')")
    @Operation(summary = "Create new article")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Article created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request body or product not found", useReturnTypeSchema = false),
        @ApiResponse(responseCode = "500", description = "Internal server error", useReturnTypeSchema = false)
    })
    public ResponseEntity<?> createArticle(@Valid @RequestBody KnowledgeBaseArticleRequest request) {
        try {
            KnowledgeBaseArticle entity = toEntity(request);
            KnowledgeBaseArticle created = service.createArticle(entity);
            return ResponseEntity.ok(toResponseDto(created));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiError(400, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiError(500, "Internal server error: " + e.getMessage()));
        }
    }

    @PutMapping("/articles/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER')")
    @Operation(summary = "Update article")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Article updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request body", useReturnTypeSchema = false),
        @ApiResponse(responseCode = "404", description = "Article not found", useReturnTypeSchema = false),
        @ApiResponse(responseCode = "500", description = "Internal server error", useReturnTypeSchema = false)
    })
    public ResponseEntity<?> updateArticle(@PathVariable Long id, @Valid @RequestBody KnowledgeBaseArticleRequest request) {
        try {
            KnowledgeBaseArticle entity = toEntity(request);
            KnowledgeBaseArticle updated = service.updateArticle(id, entity);
            return ResponseEntity.ok(toResponseDto(updated));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(new ApiError(404, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiError(500, "Internal server error: " + e.getMessage()));
        }
    }

    @DeleteMapping("/articles/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER')")
    @Operation(summary = "Delete article")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Article deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Article not found", useReturnTypeSchema = false),
        @ApiResponse(responseCode = "500", description = "Internal server error", useReturnTypeSchema = false)
    })
    public ResponseEntity<?> deleteArticle(@PathVariable Long id) {
        try {
            service.deleteArticle(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(new ApiError(404, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiError(500, "Internal server error: " + e.getMessage()));
        }
    }

    // ==== PRODUCT-SPECIFIC ENDPOINTS ====

    @GetMapping("/articles/product/{productId}")
    @Operation(summary = "Get articles by product ID")
    public ResponseEntity<Page<KnowledgeBaseArticleResponse>> getArticlesByProduct(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<KnowledgeBaseArticle> articles = service.listPublishedArticles(productId, page, size);
        Page<KnowledgeBaseArticleResponse> response = articles.map(this::toResponseDto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/articles/public/product/{domain}")
    @Operation(summary = "Get public articles by product domain")
    public ResponseEntity<Page<KnowledgeBaseArticleResponse>> getPublicArticlesByProductDomain(
            @PathVariable String domain,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<KnowledgeBaseArticle> articles = service.getArticlesByProductDomain(domain, page, size);
        Page<KnowledgeBaseArticleResponse> response = articles.map(this::toResponseDto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/articles/product/{productId}/search")
    @Operation(summary = "Search articles by keyword for a specific product")
    public ResponseEntity<Page<KnowledgeBaseArticleResponse>> searchArticlesByProduct(
            @PathVariable Long productId,
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<KnowledgeBaseArticle> articles = service.searchArticlesByProduct(productId, keyword, page, size);
        Page<KnowledgeBaseArticleResponse> response = articles.map(this::toResponseDto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/articles/product/{productId}/category/{category}")
    @Operation(summary = "Get articles by product and category")
    public ResponseEntity<List<KnowledgeBaseArticleResponse>> getByProductAndCategory(
            @PathVariable Long productId, 
            @PathVariable String category) {
        List<KnowledgeBaseArticle> articles = service.findByProductIdAndCategory(productId, category);
        List<KnowledgeBaseArticleResponse> response = articles.stream().map(this::toResponseDto).toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/articles/product/{productId}/categories")
    @Operation(summary = "Get all categories for a specific product")
    public ResponseEntity<List<String>> getCategoriesByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(service.getCategoriesByProduct(productId));
    }

    @PutMapping("/articles/{id}/toggle-publication")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER')")
    @Operation(summary = "Toggle article publication status")
    public ResponseEntity<KnowledgeBaseArticle> toggleArticlePublication(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.toggleArticlePublication(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/articles/product/{productId}/stats")
    @Operation(summary = "Get knowledge base statistics for a product")
    public ResponseEntity<Map<String, Object>> getKnowledgeBaseStatsByProduct(@PathVariable Long productId) {
        long publishedCount = service.getPublishedArticleCountByProduct(productId);
        List<String> categories = service.getCategoriesByProduct(productId);
        List<KnowledgeBaseArticle> recentArticles = service.getRecentArticlesByProduct(productId, 5);
        
        Map<String, Object> stats = Map.of(
            "publishedCount", publishedCount,
            "categoriesCount", categories.size(),
            "categories", categories,
            "recentArticles", recentArticles
        );
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/articles/product/{productId}/recent")
    @Operation(summary = "Get recent articles for a product")
    public ResponseEntity<List<KnowledgeBaseArticleResponse>> getRecentArticlesByProduct(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "5") int limit) {
        List<KnowledgeBaseArticle> recentArticles = service.getRecentArticlesByProduct(productId, limit);
        List<KnowledgeBaseArticleResponse> response = recentArticles.stream().map(this::toResponseDto).toList();
        return ResponseEntity.ok(response);
    }

    // Legacy endpoints for backward compatibility
    @GetMapping("/articles/category/{category}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER', 'USER')")
    @Operation(summary = "Get articles by category")
    public ResponseEntity<List<KnowledgeBaseArticle>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(service.findByCategory(category));
    }

    @PostMapping("/articles/product/{productId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER')")
    @Operation(summary = "Create article for specific product")
    public ResponseEntity<KnowledgeBaseArticleResponse> createArticleForProduct(
            @PathVariable Long productId, 
            @Valid @RequestBody KnowledgeBaseArticleRequest request) {
        try {
            KnowledgeBaseArticle entity = toEntity(request);
            entity.setProduct(com.ziohelp.entity.Product.builder().id(productId).build());
            KnowledgeBaseArticle created = service.createArticle(entity);
            return ResponseEntity.ok(toResponseDto(created));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    // --- DTO mapping helpers ---
    private KnowledgeBaseArticleResponse toResponseDto(KnowledgeBaseArticle article) {
        return KnowledgeBaseArticleResponse.builder()
                .id(article.getId())
                .productId(article.getProductId())
                .title(article.getTitle())
                .content(article.getContent())
                .category(article.getCategory())
                .author(article.getAuthor())
                .isPublished(article.getIsPublished())
                .createdAt(article.getCreatedAt())
                .updatedAt(article.getUpdatedAt())
                .build();
    }

    private KnowledgeBaseArticle toEntity(KnowledgeBaseArticleRequest request) {
        return KnowledgeBaseArticle.builder()
                .id(null)
                .product(com.ziohelp.entity.Product.builder().id(request.getProductId()).build())
                .title(request.getTitle())
                .content(request.getContent())
                .category(request.getCategory())
                .author(request.getAuthor())
                .isPublished(request.getIsPublished())
                .build();
    }
} 
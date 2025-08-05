package com.ziohelp.controller;

import com.ziohelp.entity.Product;
import com.ziohelp.entity.Faq;
import com.ziohelp.entity.KnowledgeBaseArticle;
import com.ziohelp.entity.Ticket;
import com.ziohelp.service.ProductService;
import com.ziohelp.repository.FaqRepository;
import com.ziohelp.repository.KnowledgeBaseArticleRepository;
import com.ziohelp.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@Tag(name = "Products", description = "Operations related to products and their content")
public class ProductController {
    @Autowired
    private ProductService productService;
    
    @Autowired
    private FaqRepository faqRepository;
    
    @Autowired
    private KnowledgeBaseArticleRepository articleRepository;
    
    @Autowired
    private TicketRepository ticketRepository;

    @GetMapping("/list")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')")
    public ResponseEntity<Page<Product>> listProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        return ResponseEntity.ok(productService.listProducts(page, size, name, status, category, sortBy, direction));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')")
    public ResponseEntity<Product> getProduct(@PathVariable Long id) {
        return productService.getProduct(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')")
    public ResponseEntity<?> createProduct(@RequestBody Product product) {
        try {
            return ResponseEntity.ok(productService.createProduct(product));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/update")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        try {
            return ResponseEntity.ok(productService.updateProduct(id, product));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}/delete")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // ==== PRODUCT-BASED CONTENT MANAGEMENT ====
    
    @GetMapping("/{id}/faqs")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER', 'USER')")
    @Operation(summary = "Get FAQs for a specific product")
    public ResponseEntity<List<Faq>> getProductFaqs(@PathVariable Long id) {
        return ResponseEntity.ok(faqRepository.findByProduct_Id(id));
    }
    
    @GetMapping("/{id}/articles")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER', 'USER')")
    @Operation(summary = "Get knowledge base articles for a specific product")
    public ResponseEntity<List<KnowledgeBaseArticle>> getProductArticles(@PathVariable Long id) {
        return ResponseEntity.ok(articleRepository.findByProduct_Id(id));
    }
    
    @GetMapping("/{id}/tickets")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER')")
    @Operation(summary = "Get tickets for a specific product")
    public ResponseEntity<List<Ticket>> getProductTickets(@PathVariable Long id) {
        return ResponseEntity.ok(ticketRepository.findByProduct_Id(id));
    }
    
    @PostMapping("/{id}/faqs")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN')")
    @Operation(summary = "Create FAQ for a specific product")
    public ResponseEntity<Faq> createProductFaq(@PathVariable Long id, @RequestBody Faq faq) {
        faq.setProduct(Product.builder().id(id).build());
        return ResponseEntity.ok(faqRepository.save(faq));
    }
    
    @PostMapping("/{id}/articles")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER')")
    @Operation(summary = "Create knowledge base article for a specific product")
    public ResponseEntity<KnowledgeBaseArticle> createProductArticle(@PathVariable Long id, @RequestBody KnowledgeBaseArticle article) {
        article.setProduct(Product.builder().id(id).build());
        return ResponseEntity.ok(articleRepository.save(article));
    }
    
    @PostMapping("/{id}/tickets")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'USER')")
    @Operation(summary = "Create ticket for a specific product")
    public ResponseEntity<Ticket> createProductTicket(@PathVariable Long id, @RequestBody Ticket ticket) {
        ticket.setProduct(Product.builder().id(id).build());
        ticket.setStatus("OPEN");
        ticket.setCreatedAt(java.time.LocalDateTime.now());
        return ResponseEntity.ok(ticketRepository.save(ticket));
    }
    
    @GetMapping("/{id}/faq-categories")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER', 'USER')")
    @Operation(summary = "Get FAQ categories for a specific product")
    public ResponseEntity<List<String>> getProductFaqCategories(@PathVariable Long id) {
        return ResponseEntity.ok(faqRepository.findDistinctCategoriesByProduct_Id(id));
    }
    
    @GetMapping("/{id}/article-categories")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER', 'USER')")
    @Operation(summary = "Get article categories for a specific product")
    public ResponseEntity<List<String>> getProductArticleCategories(@PathVariable Long id) {
        return ResponseEntity.ok(articleRepository.findDistinctCategoriesByProduct_Id(id));
    }
} 
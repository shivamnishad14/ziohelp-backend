package com.ziohelp.controller;

import com.ziohelp.entity.Product;
import com.ziohelp.entity.Faq;
import com.ziohelp.entity.KnowledgeBaseArticle;
import com.ziohelp.entity.Ticket;
import com.ziohelp.service.ProductService;
import com.ziohelp.service.FaqService;
import com.ziohelp.service.KnowledgeBaseService;
import com.ziohelp.service.TicketService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/product-help")
@Tag(name = "Product Help Integration", description = "Integrated help system for products including FAQs, articles, and tickets")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProductHelpController {

    @Autowired
    private ProductService productService;
    
    @Autowired
    private FaqService faqService;
    
    @Autowired
    private KnowledgeBaseService knowledgeBaseService;
    
    @Autowired
    private TicketService ticketService;

    // ==== PUBLIC ENDPOINTS (No Authentication Required) ====

    /**
     * Get complete help information for a product by domain (public endpoint)
     */
    @GetMapping("/public/{domain}")
    @Operation(summary = "Get all help content for a product by domain (public)")
    public ResponseEntity<Map<String, Object>> getPublicProductHelp(
            @PathVariable String domain,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Map<String, Object> helpData = new HashMap<>();
        
        // Get FAQs
        Page<Faq> faqs = faqService.getFaqsByProductDomain(domain, page, size);
        
        // Get Knowledge Base Articles
        Page<KnowledgeBaseArticle> articles = knowledgeBaseService.getArticlesByProductDomain(domain, page, size);
        
        helpData.put("faqs", faqs);
        helpData.put("articles", articles);
        helpData.put("domain", domain);
        
        return ResponseEntity.ok(helpData);
    }

    /**
     * Create a support ticket for a product (public endpoint)
     */
    @PostMapping("/public/{domain}/ticket")
    @Operation(summary = "Create a support ticket for a product (public)")
    public ResponseEntity<Ticket> createPublicTicket(
            @PathVariable String domain,
            @RequestBody Ticket ticket) {
        try {
            ticket.setGuest(true); // Mark as guest ticket
            Ticket createdTicket = ticketService.createTicketForProductDomain(domain, ticket);
            return ResponseEntity.ok(createdTicket);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Search help content for a product (public endpoint)
     */
    @GetMapping("/public/{domain}/search")
    @Operation(summary = "Search FAQs and articles for a product (public)")
    public ResponseEntity<Map<String, Object>> searchPublicProductHelp(
            @PathVariable String domain,
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Map<String, Object> searchResults = new HashMap<>();
        
        // Search FAQs and Articles - would need to implement domain-based search
        // For now, returning empty results
        searchResults.put("faqs", Page.empty());
        searchResults.put("articles", Page.empty());
        searchResults.put("keyword", keyword);
        searchResults.put("domain", domain);
        
        return ResponseEntity.ok(searchResults);
    }

    // ==== AUTHENTICATED ENDPOINTS ====

    /**
     * Get complete help dashboard for a product (authenticated)
     */
    @GetMapping("/product/{productId}/dashboard")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER', 'USER')")
    @Operation(summary = "Get complete help dashboard for a product")
    public ResponseEntity<Map<String, Object>> getProductHelpDashboard(@PathVariable Long productId) {
        
        Map<String, Object> dashboard = new HashMap<>();
        
        try {
            // Get product details
            Optional<Product> product = productService.getProduct(productId);
            if (product.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // Get statistics
            long faqCount = faqService.getPublishedFaqCountByProduct(productId);
            long articleCount = knowledgeBaseService.getPublishedArticleCountByProduct(productId);
            
            // Get categories
            List<String> faqCategories = faqService.getCategoriesByProduct(productId);
            List<String> articleCategories = knowledgeBaseService.getCategoriesByProduct(productId);
            List<String> ticketCategories = ticketService.getTicketCategoriesByProduct(productId);
            
            // Get recent content
            List<Faq> recentFaqs = faqService.getRecentFaqsByProduct(productId, 5);
            List<KnowledgeBaseArticle> recentArticles = knowledgeBaseService.getRecentArticlesByProduct(productId, 5);
            
            // Get ticket statistics
            long openTickets = ticketService.getTicketCountByProductAndStatus(productId, "OPEN");
            long inProgressTickets = ticketService.getTicketCountByProductAndStatus(productId, "IN_PROGRESS");
            long closedTickets = ticketService.getTicketCountByProductAndStatus(productId, "CLOSED");
            
            dashboard.put("product", product.get());
            dashboard.put("statistics", Map.of(
                "faqCount", faqCount,
                "articleCount", articleCount,
                "openTickets", openTickets,
                "inProgressTickets", inProgressTickets,
                "closedTickets", closedTickets
            ));
            dashboard.put("categories", Map.of(
                "faqs", faqCategories,
                "articles", articleCategories,
                "tickets", ticketCategories
            ));
            dashboard.put("recentContent", Map.of(
                "faqs", recentFaqs,
                "articles", recentArticles
            ));
            
            return ResponseEntity.ok(dashboard);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get all help content for a product (authenticated)
     */
    @GetMapping("/product/{productId}/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER', 'USER')")
    @Operation(summary = "Get all help content for a product")
    public ResponseEntity<Map<String, Object>> getProductAllContent(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Map<String, Object> allContent = new HashMap<>();
        
        // Get FAQs
        Page<Faq> faqs = faqService.getFaqsByProduct(productId, page, size);
        
        // Get Knowledge Base Articles
        Page<KnowledgeBaseArticle> articles = knowledgeBaseService.listPublishedArticles(productId, page, size);
        
        // Get Tickets (for admins only)
        Page<Ticket> tickets = ticketService.getTicketsByProduct(productId, page, size);
        
        allContent.put("faqs", faqs);
        allContent.put("articles", articles);
        allContent.put("tickets", tickets);
        allContent.put("productId", productId);
        
        return ResponseEntity.ok(allContent);
    }

    /**
     * Search all help content for a product (authenticated)
     */
    @GetMapping("/product/{productId}/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER', 'USER')")
    @Operation(summary = "Search all help content for a product")
    public ResponseEntity<Map<String, Object>> searchProductHelp(
            @PathVariable Long productId,
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Map<String, Object> searchResults = new HashMap<>();
        
        try {
            // Search FAQs
            Page<Faq> faqs = faqService.searchFaqsByProduct(productId, keyword, page, size);
            
            // Search Articles
            Page<KnowledgeBaseArticle> articles = knowledgeBaseService.searchArticlesByProduct(productId, keyword, page, size);
            
            // Search Tickets
            Page<Ticket> tickets = ticketService.searchTicketsByProduct(productId, keyword, page, size);
            
            searchResults.put("faqs", faqs);
            searchResults.put("articles", articles);
            searchResults.put("tickets", tickets);
            searchResults.put("keyword", keyword);
            searchResults.put("productId", productId);
            
            return ResponseEntity.ok(searchResults);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get help content by category for a product (authenticated)
     */
    @GetMapping("/product/{productId}/category/{category}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER', 'USER')")
    @Operation(summary = "Get help content by category for a product")
    public ResponseEntity<Map<String, Object>> getProductContentByCategory(
            @PathVariable Long productId,
            @PathVariable String category) {
        
        Map<String, Object> categoryContent = new HashMap<>();
        
        // Get FAQs by category
        List<Faq> faqs = faqService.getFaqsByProductAndCategory(productId, category);
        
        // Get Articles by category
        List<KnowledgeBaseArticle> articles = knowledgeBaseService.findByProductIdAndCategory(productId, category);
        
        // Get Tickets by category
        List<Ticket> tickets = ticketService.getTicketsByProductAndCategory(productId, category);
        
        categoryContent.put("faqs", faqs);
        categoryContent.put("articles", articles);
        categoryContent.put("tickets", tickets);
        categoryContent.put("category", category);
        categoryContent.put("productId", productId);
        
        return ResponseEntity.ok(categoryContent);
    }

    /**
     * Create help content for a product (Admin only)
     */
    @PostMapping("/product/{productId}/content")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER')")
    @Operation(summary = "Create help content for a product")
    public ResponseEntity<Map<String, Object>> createProductContent(
            @PathVariable Long productId,
            @RequestBody Map<String, Object> contentData) {
        
        Map<String, Object> results = new HashMap<>();
        
        try {
            String contentType = (String) contentData.get("type");
            
            switch (contentType.toLowerCase()) {
                case "faq":
                    // Create FAQ
                    Faq faq = new Faq();
                    faq.setQuestion((String) contentData.get("question"));
                    faq.setAnswer((String) contentData.get("answer"));
                    faq.setCategory((String) contentData.get("category"));
                    faq.setProduct(Product.builder().id(productId).build());
                    Faq createdFaq = faqService.createFaq(faq);
                    results.put("faq", createdFaq);
                    break;
                    
                case "article":
                    // Create Article
                    KnowledgeBaseArticle article = new KnowledgeBaseArticle();
                    article.setTitle((String) contentData.get("title"));
                    article.setContent((String) contentData.get("content"));
                    article.setCategory((String) contentData.get("category"));
                    article.setProduct(Product.builder().id(productId).build());
                    KnowledgeBaseArticle createdArticle = knowledgeBaseService.createArticle(article);
                    results.put("article", createdArticle);
                    break;
                    
                case "ticket":
                    // Create Ticket
                    Ticket ticket = new Ticket();
                    ticket.setTitle((String) contentData.get("title"));
                    ticket.setDescription((String) contentData.get("description"));
                    ticket.setCategory((String) contentData.get("category"));
                    ticket.setCreatedBy((String) contentData.get("createdBy"));
                    ticket.setProduct(Product.builder().id(productId).build());
                    Ticket createdTicket = ticketService.createTicket(ticket);
                    results.put("ticket", createdTicket);
                    break;
                    
                default:
                    return ResponseEntity.badRequest().build();
            }
            
            return ResponseEntity.ok(results);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get product help statistics (Admin only)
     */
    @GetMapping("/product/{productId}/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER')")
    @Operation(summary = "Get comprehensive help statistics for a product")
    public ResponseEntity<Map<String, Object>> getProductHelpStats(@PathVariable Long productId) {
        
        Map<String, Object> stats = new HashMap<>();
        
        try {
            // FAQ Statistics
            long totalFaqs = faqService.getPublishedFaqCountByProduct(productId);
            List<String> faqCategories = faqService.getCategoriesByProduct(productId);
            
            // Article Statistics
            long totalArticles = knowledgeBaseService.getPublishedArticleCountByProduct(productId);
            List<String> articleCategories = knowledgeBaseService.getCategoriesByProduct(productId);
            
            // Ticket Statistics
            long openTickets = ticketService.getTicketCountByProductAndStatus(productId, "OPEN");
            long inProgressTickets = ticketService.getTicketCountByProductAndStatus(productId, "IN_PROGRESS");
            long closedTickets = ticketService.getTicketCountByProductAndStatus(productId, "CLOSED");
            long resolvedTickets = ticketService.getTicketCountByProductAndStatus(productId, "RESOLVED");
            
            List<String> ticketStatuses = ticketService.getTicketStatusesByProduct(productId);
            List<String> ticketCategories = ticketService.getTicketCategoriesByProduct(productId);
            
            stats.put("faqs", Map.of(
                "total", totalFaqs,
                "categories", faqCategories,
                "categoriesCount", faqCategories.size()
            ));
            
            stats.put("articles", Map.of(
                "total", totalArticles,
                "categories", articleCategories,
                "categoriesCount", articleCategories.size()
            ));
            
            stats.put("tickets", Map.of(
                "open", openTickets,
                "inProgress", inProgressTickets,
                "closed", closedTickets,
                "resolved", resolvedTickets,
                "total", openTickets + inProgressTickets + closedTickets + resolvedTickets,
                "statuses", ticketStatuses,
                "categories", ticketCategories
            ));
            
            stats.put("productId", productId);
            
            return ResponseEntity.ok(stats);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}

package com.ziohelp.service;

import com.ziohelp.entity.KnowledgeBaseArticle;
import com.ziohelp.entity.Product;
import com.ziohelp.repository.KnowledgeBaseArticleRepository;
import com.ziohelp.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class KnowledgeBaseService {
    @Autowired
    private KnowledgeBaseArticleRepository repository;
    
    @Autowired
    private ProductRepository productRepository;

    public Page<KnowledgeBaseArticle> listArticles(Long productId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        if (productId != null) {
            return repository.findByProduct_Id(productId, pageable);
        }
        return repository.findPublishedArticles(null, pageable);
    }
    
    public Page<KnowledgeBaseArticle> listPublishedArticles(Long productId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return repository.findPublishedArticles(productId, pageable);
    }
    
    /**
     * Get articles by product domain (for public access)
     */
    public Page<KnowledgeBaseArticle> getArticlesByProductDomain(String domain, int page, int size) {
        Optional<Product> product = productRepository.findByDomain(domain);
        if (product.isPresent()) {
            return listPublishedArticles(product.get().getId(), page, size);
        }
        return Page.empty();
    }
    
    /**
     * Search articles by keyword for a specific product
     */
    public Page<KnowledgeBaseArticle> searchArticlesByProduct(Long productId, String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return repository.searchByProduct_IdAndKeyword(productId, keyword, pageable);
    }

    public Optional<KnowledgeBaseArticle> getArticle(Long id) {
        return repository.findById(id);
    }

    public KnowledgeBaseArticle createArticle(KnowledgeBaseArticle article) {
        // Validate product exists
        if (article.getProduct() != null && article.getProduct().getId() != null) {
            Optional<Product> product = productRepository.findById(article.getProduct().getId());
            if (product.isPresent()) {
                article.setProduct(product.get());
            } else {
                throw new RuntimeException("Product not found with ID: " + article.getProduct().getId());
            }
        }
        
        article.setCreatedAt(LocalDateTime.now());
        article.setUpdatedAt(LocalDateTime.now());
        
        if (article.getIsPublished() == null) {
            article.setIsPublished(false);
        }
        
        return repository.save(article);
    }

    public KnowledgeBaseArticle updateArticle(Long id, KnowledgeBaseArticle article) {
        KnowledgeBaseArticle existing = repository.findById(id).orElseThrow(() -> new RuntimeException("Article not found"));
        existing.setTitle(article.getTitle());
        existing.setContent(article.getContent());
        existing.setCategory(article.getCategory());
        existing.setAuthor(article.getAuthor());
        existing.setIsPublished(article.getIsPublished());
        existing.setUpdatedAt(LocalDateTime.now());
        
        // Update product if provided
        if (article.getProduct() != null && article.getProduct().getId() != null) {
            Optional<Product> product = productRepository.findById(article.getProduct().getId());
            if (product.isPresent()) {
                existing.setProduct(product.get());
            }
        }
        
        return repository.save(existing);
    }

    public void deleteArticle(Long id) {
        repository.deleteById(id);
    }

    public List<KnowledgeBaseArticle> findByCategory(String category) {
        return repository.findByCategory(category);
    }

    public List<KnowledgeBaseArticle> findByProductIdAndCategory(Long productId, String category) {
        return repository.findByProduct_IdAndCategory(productId, category);
    }
    
    /**
     * Get all categories for a specific product
     */
    public List<String> getCategoriesByProduct(Long productId) {
        return repository.findDistinctCategoriesByProduct_Id(productId);
    }
    
    /**
     * Toggle article publication status
     */
    public KnowledgeBaseArticle toggleArticlePublication(Long id) {
        Optional<KnowledgeBaseArticle> existingArticle = repository.findById(id);
        if (existingArticle.isPresent()) {
            KnowledgeBaseArticle article = existingArticle.get();
            article.setIsPublished(!article.getIsPublished());
            article.setUpdatedAt(LocalDateTime.now());
            return repository.save(article);
        } else {
            throw new RuntimeException("Article not found with ID: " + id);
        }
    }
    
    /**
     * Get published articles count by product
     */
    public long getPublishedArticleCountByProduct(Long productId) {
        return repository.countByProduct_IdAndIsPublished(productId, true);
    }
    
    /**
     * Get most recent articles for a product
     */
    public List<KnowledgeBaseArticle> getRecentArticlesByProduct(Long productId, int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by("createdAt").descending());
        return repository.findByProduct_IdAndIsPublished(productId, true, pageable).getContent();
    }
} 
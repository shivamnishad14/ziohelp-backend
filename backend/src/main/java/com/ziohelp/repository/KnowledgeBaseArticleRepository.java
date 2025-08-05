package com.ziohelp.repository;

import com.ziohelp.entity.KnowledgeBaseArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface KnowledgeBaseArticleRepository extends JpaRepository<KnowledgeBaseArticle, Long> {
    @Query("SELECT a FROM KnowledgeBaseArticle a WHERE a.product.id = :productId")
    List<KnowledgeBaseArticle> findByProduct_Id(@Param("productId") Long productId);
    
    List<KnowledgeBaseArticle> findByCategory(String category);
    
    @Query("SELECT a FROM KnowledgeBaseArticle a WHERE a.product.id = :productId AND a.category = :category")
    List<KnowledgeBaseArticle> findByProduct_IdAndCategory(@Param("productId") Long productId, @Param("category") String category);
    
    List<KnowledgeBaseArticle> findByIsPublished(Boolean isPublished);
    
    @Query("SELECT a FROM KnowledgeBaseArticle a WHERE a.product.id = :productId")
    Page<KnowledgeBaseArticle> findByProduct_Id(@Param("productId") Long productId, Pageable pageable);
    
    @Query("SELECT a FROM KnowledgeBaseArticle a WHERE (:productId IS NULL OR a.product.id = :productId) AND a.isPublished = true")
    Page<KnowledgeBaseArticle> findPublishedArticles(@Param("productId") Long productId, Pageable pageable);
    
    @Query("SELECT DISTINCT a.category FROM KnowledgeBaseArticle a WHERE a.product.id = :productId")
    List<String> findDistinctCategoriesByProduct_Id(@Param("productId") Long productId);
    
    // Additional methods for enhanced functionality
    Page<KnowledgeBaseArticle> findByProduct_IdAndIsPublished(Long productId, Boolean isPublished, Pageable pageable);
    
    @Query("SELECT a FROM KnowledgeBaseArticle a WHERE a.product.id = :productId AND a.isPublished = true AND " +
           "(LOWER(a.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.content) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<KnowledgeBaseArticle> searchByProduct_IdAndKeyword(
        @Param("productId") Long productId, 
        @Param("keyword") String keyword, 
        Pageable pageable);
    
    long countByProduct_IdAndIsPublished(Long productId, Boolean isPublished);
    
    @Query("SELECT a FROM KnowledgeBaseArticle a WHERE a.product.id = :productId AND a.category = :category AND a.isPublished = :isPublished")
    List<KnowledgeBaseArticle> findByProduct_IdAndCategoryAndIsPublished(
        @Param("productId") Long productId, 
        @Param("category") String category, 
        @Param("isPublished") Boolean isPublished);
} 
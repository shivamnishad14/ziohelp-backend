package com.ziohelp.repository;

import com.ziohelp.entity.Faq;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FaqRepository extends JpaRepository<Faq, Long> {
    List<Faq> findByOrganizationId(Long organizationId);
    
    // Basic product queries
    @Query("SELECT f FROM Faq f WHERE f.product.id = :productId")
    List<Faq> findByProduct_Id(@Param("productId") Long productId);
    
    @Query("SELECT f FROM Faq f WHERE f.product.id = :productId AND f.category = :category")
    List<Faq> findByProduct_IdAndCategory(@Param("productId") Long productId, @Param("category") String category);
    
    // Published FAQs methods
    @Query("SELECT f FROM Faq f WHERE f.product.id = :productId AND f.isPublished = :isPublished")
    Page<Faq> findByProduct_IdAndIsPublished(@Param("productId") Long productId, @Param("isPublished") Boolean isPublished, Pageable pageable);
    
    @Query("SELECT f FROM Faq f WHERE f.product.id = :productId AND f.category = :category AND f.isPublished = :isPublished")
    List<Faq> findByProduct_IdAndCategoryAndIsPublished(@Param("productId") Long productId, @Param("category") String category, @Param("isPublished") Boolean isPublished);
    
    // Search methods
    @Query("SELECT f FROM Faq f WHERE f.product.id = :productId AND f.isPublished = :isPublished AND " +
           "(LOWER(f.question) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(f.answer) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Faq> searchByProduct_IdAndKeyword(@Param("productId") Long productId, @Param("keyword") String keyword, @Param("isPublished") Boolean isPublished, Pageable pageable);
    
    // Count methods
    @Query("SELECT COUNT(f) FROM Faq f WHERE f.product.id = :productId AND f.isPublished = :isPublished")
    long countByProduct_IdAndIsPublished(@Param("productId") Long productId, @Param("isPublished") Boolean isPublished);

    @Query("SELECT f FROM Faq f WHERE (:search IS NULL OR LOWER(f.question) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(f.answer) LIKE LOWER(CONCAT('%', :search, '%')))" )
    Page<Faq> findAllPaged(@Param("search") String search, Pageable pageable);

    @Query("SELECT f FROM Faq f WHERE f.organization.id = :orgId AND (:search IS NULL OR LOWER(f.question) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(f.answer) LIKE LOWER(CONCAT('%', :search, '%')))" )
    Page<Faq> findByOrganizationIdPaged(@Param("orgId") Long orgId, @Param("search") String search, Pageable pageable);
    
    @Query("SELECT f FROM Faq f WHERE f.product.id = :productId AND (:search IS NULL OR LOWER(f.question) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(f.answer) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Faq> findByProduct_IdPaged(@Param("productId") Long productId, @Param("search") String search, Pageable pageable);

    List<Faq> findByCategory(String category);

    @Query("SELECT DISTINCT f.category FROM Faq f")
    List<String> findDistinctCategories();
    
    @Query("SELECT DISTINCT f.category FROM Faq f WHERE f.product.id = :productId")
    List<String> findDistinctCategoriesByProduct_Id(@Param("productId") Long productId);
} 
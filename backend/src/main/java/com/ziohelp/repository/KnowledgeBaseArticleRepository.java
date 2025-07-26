package com.ziohelp.repository;

import com.ziohelp.entity.KnowledgeBaseArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface KnowledgeBaseArticleRepository extends JpaRepository<KnowledgeBaseArticle, Long> {
    List<KnowledgeBaseArticle> findByProductId(Long productId);
    List<KnowledgeBaseArticle> findByCategory(String category);
    List<KnowledgeBaseArticle> findByProductIdAndCategory(Long productId, String category);
    List<KnowledgeBaseArticle> findByIsPublished(Boolean isPublished);
    Page<KnowledgeBaseArticle> findByProductId(Long productId, Pageable pageable);
} 
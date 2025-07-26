package com.ziohelp.service;

import com.ziohelp.entity.KnowledgeBaseArticle;
import com.ziohelp.repository.KnowledgeBaseArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class KnowledgeBaseService {
    @Autowired
    private KnowledgeBaseArticleRepository repository;

    public Page<KnowledgeBaseArticle> listArticles(Long productId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        if (productId != null) {
            return repository.findByProductId(productId, pageable);
        }
        return repository.findAll(pageable);
    }

    public Optional<KnowledgeBaseArticle> getArticle(Long id) {
        return repository.findById(id);
    }

    public KnowledgeBaseArticle createArticle(KnowledgeBaseArticle article) {
        return repository.save(article);
    }

    public KnowledgeBaseArticle updateArticle(Long id, KnowledgeBaseArticle article) {
        KnowledgeBaseArticle existing = repository.findById(id).orElseThrow(() -> new RuntimeException("Article not found"));
        existing.setTitle(article.getTitle());
        existing.setContent(article.getContent());
        existing.setCategory(article.getCategory());
        existing.setAuthor(article.getAuthor());
        existing.setIsPublished(article.getIsPublished());
        return repository.save(existing);
    }

    public void deleteArticle(Long id) {
        repository.deleteById(id);
    }

    public List<KnowledgeBaseArticle> findByCategory(String category) {
        return repository.findByCategory(category);
    }

    public List<KnowledgeBaseArticle> findByProductIdAndCategory(Long productId, String category) {
        return repository.findByProductIdAndCategory(productId, category);
    }
} 
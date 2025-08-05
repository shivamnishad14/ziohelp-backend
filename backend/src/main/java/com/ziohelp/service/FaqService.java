package com.ziohelp.service;

import com.ziohelp.entity.Faq;
import com.ziohelp.entity.Product;
import com.ziohelp.repository.FaqRepository;
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
public class FaqService {
    
    @Autowired
    private FaqRepository faqRepository;
    
    @Autowired
    private ProductRepository productRepository;

    /**
     * Get all FAQs with pagination
     */
    public Page<Faq> getAllFaqs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return faqRepository.findAll(pageable);
    }

    /**
     * Get FAQs by product ID
     */
    public Page<Faq> getFaqsByProduct(Long productId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return faqRepository.findByProduct_IdAndIsPublished(productId, true, pageable);
    }

    /**
     * Get FAQs by product domain (for public access)
     */
    public Page<Faq> getFaqsByProductDomain(String domain, int page, int size) {
        Optional<Product> product = productRepository.findByDomain(domain);
        if (product.isPresent()) {
            return getFaqsByProduct(product.get().getId(), page, size);
        }
        return Page.empty();
    }

    /**
     * Get FAQs by category for a specific product
     */
    public List<Faq> getFaqsByProductAndCategory(Long productId, String category) {
        return faqRepository.findByProduct_IdAndCategoryAndIsPublished(productId, category, true);
    }

    /**
     * Search FAQs by keyword for a specific product
     */
    public Page<Faq> searchFaqsByProduct(Long productId, String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return faqRepository.searchByProduct_IdAndKeyword(productId, keyword, true, pageable);
    }

    /**
     * Get FAQ by ID
     */
    public Optional<Faq> getFaqById(Long id) {
        return faqRepository.findById(id);
    }

    /**
     * Create new FAQ
     */
    public Faq createFaq(Faq faq) {
        // Validate product exists
        if (faq.getProduct() != null && faq.getProduct().getId() != null) {
            Optional<Product> product = productRepository.findById(faq.getProduct().getId());
            if (product.isPresent()) {
                faq.setProduct(product.get());
            } else {
                throw new RuntimeException("Product not found with ID: " + faq.getProduct().getId());
            }
        }
        
        faq.setCreatedAt(LocalDateTime.now());
        faq.setUpdatedAt(LocalDateTime.now());
        
        if (faq.getIsPublished() == null) {
            faq.setIsPublished(true);
        }
        
        return faqRepository.save(faq);
    }

    /**
     * Update existing FAQ
     */
    public Faq updateFaq(Long id, Faq faqDetails) {
        Optional<Faq> existingFaq = faqRepository.findById(id);
        if (existingFaq.isPresent()) {
            Faq faq = existingFaq.get();
            faq.setQuestion(faqDetails.getQuestion());
            faq.setAnswer(faqDetails.getAnswer());
            faq.setCategory(faqDetails.getCategory());
            faq.setIsPublished(faqDetails.getIsPublished());
            faq.setUpdatedAt(LocalDateTime.now());
            
            // Update product if provided
            if (faqDetails.getProduct() != null && faqDetails.getProduct().getId() != null) {
                Optional<Product> product = productRepository.findById(faqDetails.getProduct().getId());
                if (product.isPresent()) {
                    faq.setProduct(product.get());
                }
            }
            
            return faqRepository.save(faq);
        } else {
            throw new RuntimeException("FAQ not found with ID: " + id);
        }
    }

    /**
     * Delete FAQ
     */
    public void deleteFaq(Long id) {
        if (faqRepository.existsById(id)) {
            faqRepository.deleteById(id);
        } else {
            throw new RuntimeException("FAQ not found with ID: " + id);
        }
    }

    /**
     * Get all categories for a specific product
     */
    public List<String> getCategoriesByProduct(Long productId) {
        return faqRepository.findDistinctCategoriesByProduct_Id(productId);
    }

    /**
     * Toggle FAQ publication status
     */
    public Faq toggleFaqPublication(Long id) {
        Optional<Faq> existingFaq = faqRepository.findById(id);
        if (existingFaq.isPresent()) {
            Faq faq = existingFaq.get();
            faq.setIsPublished(!faq.getIsPublished());
            faq.setUpdatedAt(LocalDateTime.now());
            return faqRepository.save(faq);
        } else {
            throw new RuntimeException("FAQ not found with ID: " + id);
        }
    }

    /**
     * Get published FAQs count by product
     */
    public long getPublishedFaqCountByProduct(Long productId) {
        return faqRepository.countByProduct_IdAndIsPublished(productId, true);
    }

    /**
     * Get most recent FAQs for a product
     */
    public List<Faq> getRecentFaqsByProduct(Long productId, int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by("createdAt").descending());
        return faqRepository.findByProduct_IdAndIsPublished(productId, true, pageable).getContent();
    }
}

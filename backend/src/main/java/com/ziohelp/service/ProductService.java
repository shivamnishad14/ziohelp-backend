package com.ziohelp.service;

import com.ziohelp.entity.Product;
import com.ziohelp.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public Page<Product> listProducts(int page, int size, String name, String status, String category, String sortBy, String direction) {
        Pageable pageable = PageRequest.of(page, size, 
            "desc".equalsIgnoreCase(direction) ? org.springframework.data.domain.Sort.by(sortBy).descending() : org.springframework.data.domain.Sort.by(sortBy).ascending()
        );
        // Filtering logic
        if (name != null && !name.isEmpty()) {
            return productRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(name, pageable);
        } else if (status != null && !status.isEmpty()) {
            return productRepository.findByStatusAndIsActiveTrue(status, pageable);
        } else if (category != null && !category.isEmpty()) {
            return productRepository.findByCategoryAndIsActiveTrue(category, pageable);
        } else {
            return productRepository.findByIsActiveTrue(pageable);
        }
    }

    public Optional<Product> getProduct(Long id) {
        return productRepository.findById(id);
    }

    public Product createProduct(Product product) {
        if (product.getName() == null || product.getName().isEmpty()) {
            throw new IllegalArgumentException("Product name is required");
        }
        if (product.getDomain() == null || product.getDomain().isEmpty()) {
            throw new IllegalArgumentException("Product domain is required");
        }
        if (productRepository.existsByName(product.getName())) {
            throw new IllegalArgumentException("Product name already exists");
        }
        if (productRepository.existsByDomain(product.getDomain())) {
            throw new IllegalArgumentException("Product domain already exists");
        }
        product.setIsActive(true);
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product product) {
        Product existing = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        if (product.getName() != null && !product.getName().equals(existing.getName()) && productRepository.existsByName(product.getName())) {
            throw new IllegalArgumentException("Product name already exists");
        }
        if (product.getDomain() != null && !product.getDomain().equals(existing.getDomain()) && productRepository.existsByDomain(product.getDomain())) {
            throw new IllegalArgumentException("Product domain already exists");
        }
        existing.setName(product.getName());
        existing.setDomain(product.getDomain());
        existing.setLogoUrl(product.getLogoUrl());
        existing.setThemeColor(product.getThemeColor());
        existing.setDescription(product.getDescription());
        existing.setVersion(product.getVersion());
        existing.setStatus(product.getStatus());
        existing.setCategory(product.getCategory());
        // Don't allow update of isActive here
        return productRepository.save(existing);
    }

    // Soft delete
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        product.setIsActive(false);
        productRepository.save(product);
    }
} 
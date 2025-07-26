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

    public Page<Product> listProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findAll(pageable);
    }

    public Optional<Product> getProduct(Long id) {
        return productRepository.findById(id);
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product product) {
        Product existing = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        existing.setName(product.getName());
        existing.setDomain(product.getDomain());
        existing.setLogoUrl(product.getLogoUrl());
        existing.setThemeColor(product.getThemeColor());
        existing.setDescription(product.getDescription());
        existing.setVersion(product.getVersion());
        existing.setStatus(product.getStatus());
        existing.setCategory(product.getCategory());
        existing.setIsActive(product.getIsActive());
        return productRepository.save(existing);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
} 
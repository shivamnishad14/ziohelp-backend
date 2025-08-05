package com.ziohelp.repository;

import com.ziohelp.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsByName(String name);
    boolean existsByDomain(String domain);
    Optional<Product> findByDomain(String domain);
    List<Product> findByIsActiveTrue();
    List<Product> findByCategory(String category);
    List<Product> findByStatus(String status);

    // Paging and filtering
    org.springframework.data.domain.Page<Product> findByIsActiveTrue(org.springframework.data.domain.Pageable pageable);
    org.springframework.data.domain.Page<Product> findByNameContainingIgnoreCaseAndIsActiveTrue(String name, org.springframework.data.domain.Pageable pageable);
    org.springframework.data.domain.Page<Product> findByStatusAndIsActiveTrue(String status, org.springframework.data.domain.Pageable pageable);
    org.springframework.data.domain.Page<Product> findByCategoryAndIsActiveTrue(String category, org.springframework.data.domain.Pageable pageable);
}
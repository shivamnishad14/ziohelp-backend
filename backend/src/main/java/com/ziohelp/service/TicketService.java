package com.ziohelp.service;

import com.ziohelp.entity.Ticket;
import com.ziohelp.entity.Product;
import com.ziohelp.exception.ResourceNotFoundException;
import com.ziohelp.repository.TicketRepository;
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
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;
    
    @Autowired
    private ProductRepository productRepository;

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }
    
    public Page<Ticket> getAllTickets(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ticketRepository.findAll(pageable);
    }

    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
    }

    public Ticket createTicket(Ticket ticket) {
        // Validate product exists
        if (ticket.getProduct() != null && ticket.getProduct().getId() != null) {
            Optional<Product> product = productRepository.findById(ticket.getProduct().getId());
            if (product.isPresent()) {
                ticket.setProduct(product.get());
            } else {
                throw new RuntimeException("Product not found with ID: " + ticket.getProduct().getId());
            }
        }
        
        ticket.setStatus("OPEN");
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        
        if (ticket.getPriority() == null) {
            ticket.setPriority("MEDIUM");
        }
        
        return ticketRepository.save(ticket);
    }

    public Ticket updateTicket(Ticket ticket) {
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    public void deleteTicket(Long id) {
        if (!ticketRepository.existsById(id)) {
            throw new ResourceNotFoundException("Ticket not found with id: " + id);
        }
        ticketRepository.deleteById(id);
    }
    
    // ==== PRODUCT-SPECIFIC METHODS ====
    
    /**
     * Get tickets by product ID
     */
    public Page<Ticket> getTicketsByProduct(Long productId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ticketRepository.findByProduct_Id(productId, pageable);
    }
    
    /**
     * Get tickets by product domain (for public access)
     */
    public Page<Ticket> getTicketsByProductDomain(String domain, int page, int size) {
        Optional<Product> product = productRepository.findByDomain(domain);
        if (product.isPresent()) {
            return getTicketsByProduct(product.get().getId(), page, size);
        }
        return Page.empty();
    }
    
    /**
     * Get tickets by status for a specific product
     */
    public List<Ticket> getTicketsByProductAndStatus(Long productId, String status) {
        return ticketRepository.findByProduct_IdAndStatus(productId, status);
    }
    
    /**
     * Get tickets by priority for a specific product
     */
    public List<Ticket> getTicketsByProductAndPriority(Long productId, String priority) {
        return ticketRepository.findByProduct_IdAndPriority(productId, priority);
    }
    
    /**
     * Get tickets by category for a specific product
     */
    public List<Ticket> getTicketsByProductAndCategory(Long productId, String category) {
        return ticketRepository.findByProduct_IdAndCategory(productId, category);
    }
    
    /**
     * Get tickets created by a specific user for a product
     */
    public Page<Ticket> getTicketsByProductAndCreatedBy(Long productId, String createdBy, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ticketRepository.findByProduct_IdAndCreatedBy(productId, createdBy, pageable);
    }
    
    /**
     * Search tickets by keyword for a specific product
     */
    public Page<Ticket> searchTicketsByProduct(Long productId, String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ticketRepository.searchByProduct_IdAndKeyword(productId, keyword, pageable);
    }
    
    /**
     * Get ticket count by status for a product
     */
    public long getTicketCountByProductAndStatus(Long productId, String status) {
        return ticketRepository.countByProduct_IdAndStatus(productId, status);
    }
    
    /**
     * Get all statuses for tickets in a product
     */
    public List<String> getTicketStatusesByProduct(Long productId) {
        return ticketRepository.findDistinctStatusesByProduct_Id(productId);
    }
    
    /**
     * Get all categories for tickets in a product
     */
    public List<String> getTicketCategoriesByProduct(Long productId) {
        return ticketRepository.findDistinctCategoriesByProduct_Id(productId);
    }
    
    /**
     * Create ticket for specific product using product domain
     */
    public Ticket createTicketForProductDomain(String domain, Ticket ticket) {
        Optional<Product> product = productRepository.findByDomain(domain);
        if (product.isPresent()) {
            ticket.setProduct(product.get());
            return createTicket(ticket);
        } else {
            throw new RuntimeException("Product not found with domain: " + domain);
        }
    }
    
    /**
     * Update ticket status
     */
    public Ticket updateTicketStatus(Long ticketId, String status) {
        Ticket ticket = getTicketById(ticketId);
        ticket.setStatus(status);
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }
    
    /**
     * Assign ticket to user
     */
    public Ticket assignTicket(Long ticketId, Long userId) {
        Ticket ticket = getTicketById(ticketId);
        // Assuming User entity exists and can be referenced
        ticket.setAssignedTo(com.ziohelp.entity.User.builder().id(userId).build());
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }
} 
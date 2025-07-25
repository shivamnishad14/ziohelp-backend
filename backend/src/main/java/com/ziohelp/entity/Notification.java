package com.ziohelp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // NEW_TICKET, COMMENT, STATUS_UPDATE
    private String message;
    private boolean seen;
    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "recipient_id")
    private User recipient;

    @ManyToOne
    @JoinColumn(name = "organization_id")
    private Organization organization;

    public Organization getOrganization() { return organization; }
    public void setOrganization(Organization organization) { this.organization = organization; }
    
    // Helper method to get recipient email
    public String getRecipientEmail() { 
        return recipient != null ? recipient.getEmail() : null; 
    }
} 
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
    private String recipientId; // Add this field for direct recipient ID

    @ManyToOne
    private User recipient;

    @ManyToOne
    @JoinColumn(name = "organization_id")
    private Organization organization;

    public Organization getOrganization() { return organization; }
    public void setOrganization(Organization organization) { this.organization = organization; }
    
    // Add getter and setter for recipientId
    public String getRecipientId() { return recipientId; }
    public void setRecipientId(String recipientId) { this.recipientId = recipientId; }
} 
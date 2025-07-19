package com.ziohelp.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String status;
    private String priority;
    private String createdBy;
    private boolean isGuest;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String category;

    @ManyToOne
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL)
    private List<Comment> comments;

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL)
    private Set<Attachment> attachments;

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL)
    private Set<TicketHistory> history;

    public void setStatus(String status) { this.status = status; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getStatus() { return status; }
    public String getPriority() { return priority; }
    public Organization getOrganization() { return organization; }
    public void setOrganization(Organization organization) { this.organization = organization; }
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    public boolean isGuest() { return isGuest; }
    public void setGuest(boolean guest) { isGuest = guest; }
    public String getRaisedBy() { return createdBy; }
} 
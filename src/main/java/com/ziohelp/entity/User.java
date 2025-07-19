package com.ziohelp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Table(name = "\"user\"")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String email;
    private String password;
    private boolean approved;
    private boolean active;

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles;

    @ManyToOne
    @JoinColumn(name = "organization_id")
    private Organization organization;

    public void setApproved(boolean approved) { this.approved = approved; }
    public void setActive(boolean active) { this.active = active; }
    public void setRole(Role role) {
        this.roles = new java.util.HashSet<>();
        this.roles.add(role);
    }
    public Role getRole() {
        return (roles != null && !roles.isEmpty()) ? roles.iterator().next() : null;
    }

    public String getEmail() { return email; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public boolean isApproved() { return approved; }
    public boolean isActive() { return active; }
    public Organization getOrganization() { return organization; }
    public void setOrganization(Organization organization) { this.organization = organization; }
    public Set<Role> getRoles() { return roles; }
    public void setRoles(Set<Role> roles) { this.roles = roles; }
} 
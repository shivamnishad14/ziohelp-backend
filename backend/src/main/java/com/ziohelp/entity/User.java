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

    @Column(nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles;

    // Additional fields for compatibility
    private Boolean active;
    private Boolean emailVerified;
    private Boolean approved;
    private String phoneNumber;
    private String jobTitle;
    private String department;
    private String avatarUrl;
    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime updatedAt;
    private java.time.LocalDateTime lastLoginAt;
    private Integer loginAttempts;
    private Boolean accountLocked;
    private java.time.LocalDateTime lockedUntil;
    private String verificationToken;
    private String resetToken;

    // Getters and setters for all fields (Lombok @Data covers this)

    // Compatibility methods for legacy code
    public boolean isActive() { return active != null ? active : true; }
    public void setActive(boolean active) { this.active = active; }

    public boolean isApproved() { return approved != null ? approved : false; }
    public void setApproved(boolean approved) { this.approved = approved; }

    public boolean isEmailVerified() { return emailVerified != null ? emailVerified : false; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }

    public boolean isAccountLocked() { return accountLocked != null ? accountLocked : false; }
    public void setAccountLocked(boolean accountLocked) { this.accountLocked = accountLocked; }

    public Long getOrganizationId() { return organization != null ? organization.getId() : null; }

    public void setRole(Role role) {
        if (this.roles == null) this.roles = new java.util.HashSet<>();
        this.roles.clear();
        this.roles.add(role);
    }

    public String getVerificationToken() { return verificationToken; }
    public void setVerificationToken(String verificationToken) { this.verificationToken = verificationToken; }

    public String getResetToken() { return resetToken; }
    public void setResetToken(String resetToken) { this.resetToken = resetToken; }

    // For DTO compatibility
    public Boolean getEmailVerified() { return emailVerified; }
    public Boolean getIsActive() { return active; }
    public Boolean getIsApproved() { return approved; }
    public Boolean getIsAccountLocked() { return accountLocked; }
    public java.time.LocalDateTime getLockedUntil() { return lockedUntil; }
    public java.time.LocalDateTime getCreatedAt() { return createdAt; }
    public java.time.LocalDateTime getUpdatedAt() { return updatedAt; }
    public java.time.LocalDateTime getLastLoginAt() { return lastLoginAt; }
    public Integer getLoginAttempts() { return loginAttempts; }
    public String getPhoneNumber() { return phoneNumber; }
    public String getJobTitle() { return jobTitle; }
    public String getDepartment() { return department; }
    public String getAvatarUrl() { return avatarUrl; }
}

    package com.ziohelp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private String id;
    
    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Size(max = 255, message = "Email cannot exceed 255 characters")
    private String email;
    
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;
    
    private List<String> roles;
    private Boolean isActive;
    private Boolean isEmailVerified;
    private Boolean isApproved;
    
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
    
    // Profile fields
    @Size(max = 20, message = "Phone number cannot exceed 20 characters")
    private String phoneNumber;
    
    @Size(max = 100, message = "Job title cannot exceed 100 characters")
    private String jobTitle;
    
    @Size(max = 100, message = "Department cannot exceed 100 characters")
    private String department;
    
    private String avatarUrl;
    
    // Timestamps
    private String createdAt;
    private String updatedAt;
    private String lastLoginAt;
    
    // Organization
    private String organizationId;
    private String organizationName;
    
    // Account security
    private Integer loginAttempts;
    private Boolean isAccountLocked;
    private String lockedUntil;
    
    // Constructor to convert from User entity
    public static UserDto fromUser(com.ziohelp.entity.User user) {
        if (user == null) return null;
        
        UserDto dto = UserDto.builder()
            .id(user.getId().toString())
            .fullName(user.getFullName())
            .email(user.getEmail())
            .username(user.getUsername())
            .isActive(user.isActive())
            .isEmailVerified(user.getEmailVerified())
            .isApproved(user.isApproved())
            .phoneNumber(user.getPhoneNumber())
            .jobTitle(user.getJobTitle())
            .department(user.getDepartment())
            .avatarUrl(user.getAvatarUrl())
            .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null)
            .updatedAt(user.getUpdatedAt() != null ? user.getUpdatedAt().toString() : null)
            .lastLoginAt(user.getLastLoginAt() != null ? user.getLastLoginAt().toString() : null)
            .organizationId(user.getOrganizationId() != null ? user.getOrganizationId().toString() : null)
            .organizationName(user.getOrganization() != null ? user.getOrganization().getName() : null)
            .loginAttempts(user.getLoginAttempts())
            .isAccountLocked(user.isAccountLocked())
            .lockedUntil(user.getLockedUntil() != null ? user.getLockedUntil().toString() : null)
            .build();
        
        if (user.getRoles() != null) {
            dto.setRoles(user.getRoles().stream()
                .map(com.ziohelp.entity.Role::getName)
                .collect(java.util.stream.Collectors.toList()));
        }
        
        return dto;
    }

    // For compatibility with controller code
    public String getName() { return fullName; }
    public void setName(String name) { this.fullName = name; }
    public boolean isApproved() { return isApproved != null ? isApproved : false; }
    public void setApproved(boolean approved) { this.isApproved = approved; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public boolean getIsActive() { return isActive != null ? isActive : true; }
    public void setIsActive(boolean isActive) { this.isActive = isActive; }
    public boolean getIsEmailVerified() { return isEmailVerified != null ? isEmailVerified : false; }
    public void setIsEmailVerified(boolean isEmailVerified) { this.isEmailVerified = isEmailVerified; }
    
    // Additional compatibility methods for controller usage
    public boolean isActive() { return isActive != null ? isActive : true; }
    public void setActive(boolean active) { this.isActive = active; }
    
    // Explicit getter/setter for compilation
    public void setRoles(List<String> roles) { this.roles = roles; }
    public List<String> getRoles() { return roles; }
} 
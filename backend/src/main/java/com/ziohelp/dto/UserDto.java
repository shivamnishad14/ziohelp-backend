// Compatibility for various controller usages
package com.ziohelp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private String id;  // Changed to String to match frontend
    private String fullName;
    private String email;
    private String username;
    private List<String> roles;
    private boolean isActive;
    private boolean isEmailVerified;
    private String createdAt;
    private String updatedAt;
    private String lastLoginAt;
    private String organizationId;
    private boolean isApproved;
    private String password;
    
    // Constructor to convert from User entity
    public static UserDto fromUser(com.ziohelp.entity.User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId().toString());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setUsername(user.getUsername());
        dto.setIsActive(user.isActive());
        dto.setIsEmailVerified(user.isEmailVerified());
        dto.setIsApproved(user.isApproved());
        dto.setCreatedAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null);
        dto.setOrganizationId(user.getOrganizationId() != null ? user.getOrganizationId().toString() : null);
        
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
    public boolean isApproved() { return isApproved; }
    public void setApproved(boolean approved) { this.isApproved = approved; }
    public boolean isApproved() { return isApproved; }
    public void setIsActive(boolean isActive) { this.isActive = isActive; }
    public boolean getIsActive() { return isActive; }
    public boolean getIsEmailVerified() { return isEmailVerified; }
    public void setIsEmailVerified(boolean isEmailVerified) { this.isEmailVerified = isEmailVerified; }
}
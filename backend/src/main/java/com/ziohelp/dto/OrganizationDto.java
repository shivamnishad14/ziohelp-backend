package com.ziohelp.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganizationDto {
    private String id;
    
    @NotBlank(message = "Organization name is required")
    @Size(min = 2, max = 100, message = "Organization name must be between 2 and 100 characters")
    private String name;
    
    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;
    
    @Size(max = 255, message = "Website URL cannot exceed 255 characters")
    private String websiteUrl;
    
    @Size(max = 20, message = "Phone number cannot exceed 20 characters")
    private String phoneNumber;
    
    @Size(max = 255, message = "Address cannot exceed 255 characters")
    private String address;
    
    @Size(max = 100, message = "City cannot exceed 100 characters")
    private String city;
    
    @Size(max = 100, message = "Country cannot exceed 100 characters")
    private String country;
    
    @Size(max = 20, message = "Postal code cannot exceed 20 characters")
    private String postalCode;
    
    private String status;
    private String subscriptionTier;
    private Integer maxUsers;
    private Integer currentUserCount;
    private String logoUrl;
    private String createdAt;
    private String updatedAt;
    private String subscriptionExpiresAt;
    private String metadata;
    
    // Static factory method
    public static OrganizationDto fromEntity(com.ziohelp.entity.Organization organization) {
        if (organization == null) return null;
        
        return OrganizationDto.builder()
            .id(organization.getId().toString())
            .name(organization.getName())
            .description(organization.getDescription())
            .websiteUrl(organization.getWebsiteUrl())
            .phoneNumber(organization.getPhoneNumber())
            .address(organization.getAddress())
            .city(organization.getCity())
            .country(organization.getCountry())
            .postalCode(organization.getPostalCode())
            .status(organization.getStatus() != null ? organization.getStatus().toString() : null)
            .subscriptionTier(organization.getSubscriptionTier() != null ? organization.getSubscriptionTier().toString() : null)
            .maxUsers(organization.getMaxUsers())
            .currentUserCount(organization.getCurrentUserCount())
            .logoUrl(organization.getLogoUrl())
            .createdAt(organization.getCreatedAt() != null ? organization.getCreatedAt().toString() : null)
            .updatedAt(organization.getUpdatedAt() != null ? organization.getUpdatedAt().toString() : null)
            .subscriptionExpiresAt(organization.getSubscriptionExpiresAt() != null ? organization.getSubscriptionExpiresAt().toString() : null)
            .metadata(organization.getMetadata())
            .build();
    }
}

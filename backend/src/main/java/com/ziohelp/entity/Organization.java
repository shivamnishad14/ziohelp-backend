package com.ziohelp.entity;

import jakarta.persistence.*;
import lombok.*;
import jakarta.validation.constraints.NotBlank;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.Set;

@Entity
@Table(name = "organizations")
@Data
@EqualsAndHashCode(exclude = {"users"})
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Organization {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Organization name is required")
    @Column(unique = true, nullable = false)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(length = 255)
    private String websiteUrl;

    @Column(length = 20)
    private String phoneNumber;

    @Column(length = 255)
    private String address;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String country;

    @Column(length = 20)
    private String postalCode;

    @Column(length = 50)
    private String status;

    @Column(length = 50)
    private String subscriptionTier;

    private Integer maxUsers;
    private Integer currentUserCount;

    @Column(length = 255)
    private String logoUrl;

    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime updatedAt;
    private java.time.LocalDateTime subscriptionExpiresAt;

    @Column(columnDefinition = "TEXT")
    private String metadata;

    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<User> users;

    // Explicit getters and setters for compatibility
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getWebsiteUrl() { return websiteUrl; }
    public void setWebsiteUrl(String websiteUrl) { this.websiteUrl = websiteUrl; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getSubscriptionTier() { return subscriptionTier; }
    public void setSubscriptionTier(String subscriptionTier) { this.subscriptionTier = subscriptionTier; }
    public Integer getMaxUsers() { return maxUsers; }
    public void setMaxUsers(Integer maxUsers) { this.maxUsers = maxUsers; }
    public Integer getCurrentUserCount() { return currentUserCount; }
    public void setCurrentUserCount(Integer currentUserCount) { this.currentUserCount = currentUserCount; }
    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
    public java.time.LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(java.time.LocalDateTime createdAt) { this.createdAt = createdAt; }
    public java.time.LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(java.time.LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public java.time.LocalDateTime getSubscriptionExpiresAt() { return subscriptionExpiresAt; }
    public void setSubscriptionExpiresAt(java.time.LocalDateTime subscriptionExpiresAt) { this.subscriptionExpiresAt = subscriptionExpiresAt; }
    public String getMetadata() { return metadata; }
    public void setMetadata(String metadata) { this.metadata = metadata; }
    public Set<User> getUsers() { return users; }
    public void setUsers(Set<User> users) { this.users = users; }
    // Builder for compatibility
    public static OrganizationBuilder builder() { return new OrganizationBuilder(); }
    public static class OrganizationBuilder {
        private Organization org = new Organization();
        public OrganizationBuilder id(Long id) { org.setId(id); return this; }
        public OrganizationBuilder name(String name) { org.setName(name); return this; }
        public OrganizationBuilder description(String description) { org.setDescription(description); return this; }
        public OrganizationBuilder websiteUrl(String websiteUrl) { org.setWebsiteUrl(websiteUrl); return this; }
        public OrganizationBuilder phoneNumber(String phoneNumber) { org.setPhoneNumber(phoneNumber); return this; }
        public OrganizationBuilder address(String address) { org.setAddress(address); return this; }
        public OrganizationBuilder city(String city) { org.setCity(city); return this; }
        public OrganizationBuilder country(String country) { org.setCountry(country); return this; }
        public OrganizationBuilder postalCode(String postalCode) { org.setPostalCode(postalCode); return this; }
        public OrganizationBuilder status(String status) { org.setStatus(status); return this; }
        public OrganizationBuilder subscriptionTier(String subscriptionTier) { org.setSubscriptionTier(subscriptionTier); return this; }
        public OrganizationBuilder maxUsers(Integer maxUsers) { org.setMaxUsers(maxUsers); return this; }
        public OrganizationBuilder currentUserCount(Integer currentUserCount) { org.setCurrentUserCount(currentUserCount); return this; }
        public OrganizationBuilder logoUrl(String logoUrl) { org.setLogoUrl(logoUrl); return this; }
        public OrganizationBuilder createdAt(java.time.LocalDateTime createdAt) { org.setCreatedAt(createdAt); return this; }
        public OrganizationBuilder updatedAt(java.time.LocalDateTime updatedAt) { org.setUpdatedAt(updatedAt); return this; }
        public OrganizationBuilder subscriptionExpiresAt(java.time.LocalDateTime subscriptionExpiresAt) { org.setSubscriptionExpiresAt(subscriptionExpiresAt); return this; }
        public OrganizationBuilder metadata(String metadata) { org.setMetadata(metadata); return this; }
        public OrganizationBuilder users(Set<User> users) { org.setUsers(users); return this; }
        public Organization build() { return org; }
    }
}
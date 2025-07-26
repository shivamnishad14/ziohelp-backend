package com.ziohelp.service;

import com.ziohelp.entity.User;
import com.ziohelp.entity.Organization;
import com.ziohelp.entity.Ticket;
import com.ziohelp.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AccessControlService {

    /**
     * Check if user can access organization data
     */
    public void validateOrganizationAccess(User user, Long organizationId) {
        if (user == null || organizationId == null) {
            throw new AccessDeniedException("Invalid user or organization");
        }

        // Admin can access all organizations
        if (isAdmin(user)) {
            return;
        }

        // Tenant admin can only access their own organization
        if (isTenantAdmin(user)) {
            if (!user.getOrganization().getId().equals(organizationId)) {
                throw new AccessDeniedException("Tenant admin can only access their own organization");
            }
            return;
        }

        // Regular users can only access their own organization
        if (!user.getOrganization().getId().equals(organizationId)) {
            throw new AccessDeniedException("User can only access their own organization");
        }
    }

    /**
     * Check if user can access ticket
     */
    public void validateTicketAccess(User user, Ticket ticket) {
        if (user == null || ticket == null) {
            throw new AccessDeniedException("Invalid user or ticket");
        }

        // Admin can access all tickets
        if (isAdmin(user)) {
            return;
        }

        // Tenant admin can access tickets in their organization
        if (isTenantAdmin(user)) {
            if (!user.getOrganization().getId().equals(ticket.getOrganization().getId())) {
                throw new AccessDeniedException("Tenant admin can only access tickets in their organization");
            }
            return;
        }

        // Developer can access tickets assigned to them or in their organization
        if (isDeveloper(user)) {
            if (ticket.getAssignedTo() != null && ticket.getAssignedTo().getId().equals(user.getId())) {
                return; // Assigned to this developer
            }
            if (user.getOrganization().getId().equals(ticket.getOrganization().getId())) {
                return; // Same organization
            }
            throw new AccessDeniedException("Developer can only access assigned tickets or tickets in their organization");
        }

        // Regular user can only access tickets they created
        if (!ticket.getCreatedBy().equals(user.getEmail())) {
            throw new AccessDeniedException("User can only access tickets they created");
        }
    }

    /**
     * Check if user can modify ticket
     */
    public void validateTicketModification(User user, Ticket ticket) {
        validateTicketAccess(user, ticket);

        // Additional checks for modification
        if (isDeveloper(user)) {
            if (ticket.getAssignedTo() == null || !ticket.getAssignedTo().getId().equals(user.getId())) {
                throw new AccessDeniedException("Developer can only modify tickets assigned to them");
            }
        }
    }

    /**
     * Check if user can assign tickets
     */
    public void validateTicketAssignment(User user, User assignee) {
        if (user == null || assignee == null) {
            throw new AccessDeniedException("Invalid user or assignee");
        }

        // Only admin and tenant admin can assign tickets
        if (!isAdmin(user) && !isTenantAdmin(user)) {
            throw new AccessDeniedException("Only admin and tenant admin can assign tickets");
        }

        // Tenant admin can only assign to users in their organization
        if (isTenantAdmin(user)) {
            if (!user.getOrganization().getId().equals(assignee.getOrganization().getId())) {
                throw new AccessDeniedException("Tenant admin can only assign to users in their organization");
            }
        }
    }

    /**
     * Check if user can create content for organization
     */
    public void validateContentCreation(User user, Long organizationId) {
        if (user == null || organizationId == null) {
            throw new AccessDeniedException("Invalid user or organization");
        }

        // Only admin and tenant admin can create content
        if (!isAdmin(user) && !isTenantAdmin(user)) {
            throw new AccessDeniedException("Only admin and tenant admin can create content");
        }

        // Tenant admin can only create content for their organization
        if (isTenantAdmin(user)) {
            if (!user.getOrganization().getId().equals(organizationId)) {
                throw new AccessDeniedException("Tenant admin can only create content for their organization");
            }
        }
    }

    // Helper methods to check user roles
    public boolean isAdmin(User user) {
        return user.getRoles().stream()
                .anyMatch(role -> "ADMIN".equals(role.getName()));
    }

    public boolean isTenantAdmin(User user) {
        return user.getRoles().stream()
                .anyMatch(role -> "TENANT_ADMIN".equals(role.getName()));
    }

    public boolean isDeveloper(User user) {
        return user.getRoles().stream()
                .anyMatch(role -> "DEVELOPER".equals(role.getName()));
    }

    public boolean isUser(User user) {
        return user.getRoles().stream()
                .anyMatch(role -> "USER".equals(role.getName()));
    }

    public boolean isGuest(User user) {
        return user.getRoles().stream()
                .anyMatch(role -> "GUEST".equals(role.getName()));
    }

    /**
     * Get user's organization ID
     */
    public Long getUserOrganizationId(User user) {
        return user.getOrganization() != null ? user.getOrganization().getId() : null;
    }

    /**
     * Check if user has any of the specified roles
     */
    public boolean hasAnyRole(User user, String... roles) {
        Set<String> userRoles = user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.toSet());
        
        for (String role : roles) {
            if (userRoles.contains(role)) {
                return true;
            }
        }
        return false;
    }
} 
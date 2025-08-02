package com.ziohelp.security;

import com.ziohelp.entity.User;
import com.ziohelp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;
import java.util.Collections;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        
        // Check if user is approved and active
        if (!user.isApproved()) {
            throw new UsernameNotFoundException("User account is not approved: " + email);
        }
        
        if (!user.isActive()) {
            throw new UsernameNotFoundException("User account is not active: " + email);
        }
        
        // PRIORITY FIX: Use the role string field instead of the problematic roles collection
        // This matches the fix we made in AuthController
        List<SimpleGrantedAuthority> authorities;
        
        if (user.getRole() != null && !user.getRole().trim().isEmpty()) {
            // Use the role string field which is populated correctly
            authorities = Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + user.getRole().trim().toUpperCase())
            );
            System.out.println("Using role from string field for security context: " + user.getRole());
        } else {
            // Fallback to roles collection if string field is empty
            authorities = user.getRoles() != null ? 
                user.getRoles().stream()
                    .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
                    .collect(Collectors.toList()) :
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
            System.out.println("Using roles collection fallback for security context");
        }
        
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities(authorities)
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(!user.isActive())
                .build();
    }
} 
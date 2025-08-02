package com.ziohelp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private Long userId;
    private String email;
    private String fullName;
    private String role;
    
    // Explicit setters for compilation
    public void setRole(String role) { this.role = role; }
    public String getRole() { return role; }
} 
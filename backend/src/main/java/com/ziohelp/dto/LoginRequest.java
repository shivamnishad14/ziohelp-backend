package com.ziohelp.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @Pattern(regexp = "^[A-Za-z0-9+_.-]+@(.+)$", message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password cannot be empty")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    @Pattern(regexp = "^[A-Za-z0-9_-]{3,20}$", message = "Username must be 3-20 characters and can only contain letters, numbers, underscore and hyphen")
    private String username;
    
    public boolean hasEmailOrUsername() {
        return (email != null && !email.trim().isEmpty()) || 
               (username != null && !username.trim().isEmpty());
    }
    
    public String getLoginIdentifier() {
        return email != null && !email.trim().isEmpty() ? email.trim() : username.trim();
    }
    
    // Explicit getters for compilation
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
} 
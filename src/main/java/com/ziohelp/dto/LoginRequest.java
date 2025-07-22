package com.ziohelp.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    private String email;
    private String password;
    private String username;
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
} 
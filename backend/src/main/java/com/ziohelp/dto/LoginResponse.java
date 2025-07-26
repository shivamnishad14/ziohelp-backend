package com.ziohelp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String accessToken;  // Changed from 'token' to 'accessToken'
    private String refreshToken;
    private Long userId;
    private String email;
    private String username;
    private String fullName;
    private List<String> roles;
    private UserDto user;  // Full user object
    private long expiresIn;  // Token expiration time in seconds
} 
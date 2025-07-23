package com.ziohelp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private List<String> roles;
    private boolean active;
    private boolean approved;
    private String username;
    private Long organizationId;
    private String password; // Added for password support
    // Add more fields as needed
} 
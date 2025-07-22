package com.ziohelp.security;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class TestPassword {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = "testing123";
        String hash = encoder.encode(password);
        System.out.println("Hash for '" + password + "': " + hash);
        
        // Test stored hash
        String storedHash = "$2a$10$9Xn7Li89B4cz6MYP00KmLuQWxGR9lJ0jT38CXpq6wLzEjhqGBQM4y";
        boolean matches = encoder.matches(password, storedHash);
        System.out.println("Password matches stored hash: " + matches);
    }
}

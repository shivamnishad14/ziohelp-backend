package com.ziohelp;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class HashVerifier {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String existingHash = "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.";
        
        // Test common passwords
        String[] passwords = {
            "password", 
            "password123", 
            "admin", 
            "123456", 
            "secret", 
            "test", 
            "demo",
            "hello",
            "qwerty"
        };
        
        for (String pwd : passwords) {
            boolean matches = encoder.matches(pwd, existingHash);
            System.out.println("Password '" + pwd + "' matches: " + matches);
        }
    }
}

package com.ziohelp;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GeneratePasswordHashes {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String[] passwords = {"password123", "admin123", "dev123"};
        for (String password : passwords) {
            System.out.println("Password: " + password);
            System.out.println("Hash: " + encoder.encode(password));
            System.out.println("---");
        }
    }
}

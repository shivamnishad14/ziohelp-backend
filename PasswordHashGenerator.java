import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // Check if the existing hash matches common passwords
        String existingHash = "$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa";
        
        String[] testPasswords = {"password", "password123", "admin", "123456", "Password123"};
        
        for (String password : testPasswords) {
            boolean matches = encoder.matches(password, existingHash);
            System.out.println("Password '" + password + "' matches existing hash: " + matches);
        }
        
        // Generate new hash for password123
        String newHash = encoder.encode("password123");
        System.out.println("\nNew hash for 'password123': " + newHash);
    }
}

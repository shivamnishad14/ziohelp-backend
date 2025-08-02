import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordTest {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = "password123";
        String hash = encoder.encode(password);
        System.out.println("Generated hash: " + hash);
        
        // Test existing hash
        String existingHash = "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.";
        boolean matches = encoder.matches(password, existingHash);
        System.out.println("Existing hash matches 'password123': " + matches);
        
        // Test with different passwords
        System.out.println("Matches 'password': " + encoder.matches("password", existingHash));
        System.out.println("Matches 'admin': " + encoder.matches("admin", existingHash));
        System.out.println("Matches 'secret': " + encoder.matches("secret", existingHash));
    }
}

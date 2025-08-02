import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenerateHash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = "password123";
        String hash = encoder.encode(password);
        System.out.println("Hash for '" + password + "': " + hash);
        
        // Test the hash works
        boolean matches = encoder.matches(password, hash);
        System.out.println("Hash verification: " + matches);
    }
}

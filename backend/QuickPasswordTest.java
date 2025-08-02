import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class QuickPasswordTest {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // Test the hash in our database
        String hash = "$2a$10$3ouMiMaNdmxu2sSAWO0eC.iGgzSPV8QJhZOUvOwVwRj.RRBAkCGmO";
        
        String[] passwords = {"password123", "password", "admin", "test", "demo", "123456"};
        
        for (String pwd : passwords) {
            boolean matches = encoder.matches(pwd, hash);
            System.out.println("Password '" + pwd + "' matches: " + matches);
        }
        
        // Generate a fresh hash for password123
        String freshHash = encoder.encode("password123");
        System.out.println("Fresh hash for 'password123': " + freshHash);
        System.out.println("Fresh hash matches 'password123': " + encoder.matches("password123", freshHash));
    }
}

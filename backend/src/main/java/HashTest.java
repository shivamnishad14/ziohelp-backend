public class HashTest {
    public static void main(String[] args) {
        // Print the BCrypt hash from online calculator for 'testing123'
        String storedHash = "$2a$10$9Xn7Li89B4cz6MYP00KmLuQWxGR9lJ0jT38CXpq6wLzEjhqGBQM4y";
        System.out.println("Using password 'testing123' with hash: " + storedHash);
    }
}

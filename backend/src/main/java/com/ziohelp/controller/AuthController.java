package com.ziohelp.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.ziohelp.dto.LoginRequest;
import com.ziohelp.dto.LoginResponse;
import com.ziohelp.dto.RegisterRequest;
import com.ziohelp.entity.Role;
import com.ziohelp.entity.User;
import com.ziohelp.repository.RoleRepository;
import com.ziohelp.repository.UserRepository;
import com.ziohelp.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.Optional;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import com.ziohelp.service.EmailService;
import java.util.Map;
import com.ziohelp.service.AuditLogService;
import com.ziohelp.dto.ApiError;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {
    // Utility method to get stack trace as string
    private String getStackTrace(Throwable t) {
        java.io.StringWriter sw = new java.io.StringWriter();
        java.io.PrintWriter pw = new java.io.PrintWriter(sw);
        t.printStackTrace(pw);
        return sw.toString();
    }

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private com.ziohelp.repository.OrganizationRepository organizationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private AuditLogService auditLogService;

    @PersistenceContext
    private EntityManager entityManager;

    private final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Operation(
        summary = "User login",
        description = "Authenticate user and return JWT token and user details."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Login successful", content = @Content(schema = @Schema(implementation = LoginResponse.class))),
        @ApiResponse(responseCode = "400", description = "Invalid credentials or input", content = @Content),
        @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @org.springframework.web.bind.annotation.RequestBody LoginRequest request) {
        try {
            logger.info("Login attempt for identifier: {}", request.getLoginIdentifier());

            // Input validation
            if (!request.hasEmailOrUsername()) {
                logger.warn("Login attempt failed: No email or username provided");
                return ResponseEntity.badRequest()
                    .body(new ApiError(1001, "Please provide either email or username"));
            }

            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                logger.warn("Login attempt failed: Empty password");
                return ResponseEntity.badRequest()
                    .body(new ApiError(1002, "Password cannot be empty"));
            }

            // Find user by email or username
            String loginIdentifier = request.getLoginIdentifier();
            User user = null;

            // First try email
            if (request.getEmail() != null) {
                user = userRepository.findByEmailIgnoreCase(request.getEmail().trim()).orElse(null);
            }

            // If not found by email and username is provided, try username
            if (user == null && request.getUsername() != null) {
                user = userRepository.findByUsernameIgnoreCase(request.getUsername().trim()).orElse(null);
            }

            if (user == null) {
                String identifier = request.getEmail() != null ? "email" : "username";
                auditLogService.logActivity("LOGIN_FAIL", "Invalid " + identifier, loginIdentifier);
                // Return 400 for non-existent user
                return ResponseEntity.status(400)
                    .body(new ApiError(1001, "Invalid " + identifier + ". Please check and try again."));
            }

            // Check account status
            if (!user.isActive()) {
                auditLogService.logActivity("LOGIN_FAIL", "Account inactive", user.getEmail());
                return ResponseEntity.status(400)
                    .body(new ApiError(1003, "Your account is currently inactive. Please contact support."));
            }

            if (!user.isApproved()) {
                auditLogService.logActivity("LOGIN_FAIL", "Account pending approval", user.getEmail());
                return ResponseEntity.status(400)
                    .body(new ApiError(1004, "Your account is pending approval. Please wait for admin approval."));
            }

            if (!user.isEmailVerified()) {
                auditLogService.logActivity("LOGIN_FAIL", "Email not verified", user.getEmail());
                return ResponseEntity.status(400)
                    .body(new ApiError(1005, "Please verify your email address. Check your inbox for the verification link."));
            }

            // Validate password
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                auditLogService.logActivity("LOGIN_FAIL", "Invalid password", user.getEmail());
                return ResponseEntity.status(400)
                    .body(new ApiError(1002, "Invalid password. Please try again."));
            }
            System.out.println("Login attempt for email: " + request.getEmail());
            // Authenticate user
            Authentication authentication = null;
            try {
                authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
            } catch (Exception authEx) {
                System.err.println("Authentication failed for: " + request.getEmail() + ": " + authEx.getMessage());
                authEx.printStackTrace();
                auditLogService.logActivity("LOGIN_FAIL", "Authentication failed", request.getEmail());
                // Return 400 for authentication failure (invalid credentials)
                return ResponseEntity.status(400).body(new ApiError(1002, "Invalid credentials: " + authEx.getMessage()));
            }
            System.out.println("Authentication successful for: " + request.getEmail());
            auditLogService.logActivity("LOGIN_SUCCESS", "User logged in", request.getEmail());
            // Generate token
            String token = jwtTokenProvider.generateToken(authentication);
            System.out.println("Token generated successfully");
            // Create response
            LoginResponse response = new LoginResponse();
            response.setToken(token);
            response.setUserId(user.getId());
            response.setEmail(user.getEmail());
            response.setFullName(user.getFullName());
            // Debug: Print all roles loaded for this user
            if (user.getRoles() != null) {
                System.out.println("Roles loaded for user " + user.getEmail() + ":");
                for (Role r : user.getRoles()) {
                    System.out.println("- Role: " + r.getName());
                }
            } else {
                System.out.println("No roles loaded for user " + user.getEmail());
            }
            
            // Select the best role based on priority (ADMIN > TENANT_ADMIN > DEVELOPER > USER)
            String role = "USER"; // Default role
            
            // PRIORITY FIX: Use the role string field instead of the problematic roles collection
            // The role string field is populated correctly from data.sql
            if (user.getRole() != null && !user.getRole().trim().isEmpty()) {
                role = user.getRole().trim().toUpperCase();
                System.out.println("Using role from string field: " + role);
            } else {
                // Fallback to roles collection if string field is empty
                Set<Role> roles = user.getRoles();
                if (roles != null && !roles.isEmpty()) {
                    // Find the highest priority role
                    for (Role r : roles) {
                        if (r != null && r.getName() != null) {
                            String roleName = r.getName();
                            // Priority: ADMIN > TENANT_ADMIN > DEVELOPER > USER
                            if ("ADMIN".equals(roleName)) {
                                role = "ADMIN";
                                break; // ADMIN has highest priority
                            } else if ("TENANT_ADMIN".equals(roleName) && !"ADMIN".equals(role)) {
                                role = "TENANT_ADMIN";
                            } else if ("DEVELOPER".equals(roleName) && !"ADMIN".equals(role) && !"TENANT_ADMIN".equals(role)) {
                                role = "DEVELOPER";
                            } else if ("USER".equals(roleName) && "USER".equals(role)) {
                                role = "USER";
                            }
                        }
                    }
                    System.out.println("Using role from collection fallback: " + role);
                } else {
                    System.out.println("No roles found, using default: " + role);
                }
            }
            response.setRole(role);
            System.out.println("Login successful for: " + request.getEmail() + " with role: " + role);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Login error for " + request.getEmail() + ": " + e.getMessage());
            e.printStackTrace(); // Print full stack trace
            auditLogService.logActivity("LOGIN_FAIL", "Exception: " + e.getMessage(), request.getEmail());
            return ResponseEntity.status(500).body(new ApiError(1500, "Login error: " + e.getMessage() + "\n" + getStackTrace(e)));
        }
    }

    @PostMapping("/login-debug")
    public ResponseEntity<?> loginDebug(@org.springframework.web.bind.annotation.RequestBody String rawBody) {
        System.out.println("Raw request body: " + rawBody);
        com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
        try {
            LoginRequest request = mapper.readValue(rawBody, LoginRequest.class);
            System.out.println("Parsed email: " + request.getEmail());
            System.out.println("Parsed password: " + request.getPassword());
            
            // Find user and check password
            User user = userRepository.findByEmailIgnoreCase(request.getEmail().trim()).orElse(null);
            if (user != null) {
                System.out.println("User found: " + user.getEmail());
                System.out.println("Stored password: " + user.getPassword());
                System.out.println("Input password: " + request.getPassword());
                System.out.println("Password matches: " + passwordEncoder.matches(request.getPassword(), user.getPassword()));
                System.out.println("User active: " + user.isActive());
                System.out.println("User approved: " + user.isApproved());
                System.out.println("Email verified: " + user.isEmailVerified());
                return ResponseEntity.ok("Debug info logged to console for: " + request.getEmail());
            } else {
                return ResponseEntity.ok("User not found: " + request.getEmail());
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(400).body("JSON parse error: " + e.getMessage());
        }
    }

    @Operation(
        summary = "User registration",
        description = "Register a new user. Admin approval required before login."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Registration successful. Awaiting admin approval.", content = @Content),
        @ApiResponse(responseCode = "400", description = "Email already in use or registration failed", content = @Content)
    })
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
        required = true,
        content = @Content(schema = @Schema(implementation = RegisterRequest.class))
    )
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            if (userRepository.existsByEmail(request.getEmail())) {
                auditLogService.logActivity("REGISTER_FAIL", "Email already in use", request.getEmail());
                return ResponseEntity.badRequest().body(new ApiError(1006, "Email already in use"));
            }
            // Check for duplicate username
            if (request.getUsername() != null && !request.getUsername().isEmpty()) {
                if (userRepository.findByUsernameIgnoreCase(request.getUsername()).isPresent()) {
                    auditLogService.logActivity("REGISTER_FAIL", "Username already in use", request.getUsername());
                    return ResponseEntity.badRequest().body(new ApiError(1007, "Username already in use"));
                }
            }
            String requestedRole = request.getRole();
            Role role = null;
            if (requestedRole != null && !requestedRole.isEmpty()) {
                role = roleRepository.findByName(requestedRole.toUpperCase()).orElse(null);
            }
            if (role == null) {
                role = roleRepository.findByName("USER").orElseGet(() -> {
                    Role r = new Role();
                    r.setName("USER");
                    return roleRepository.save(r);
                });
            }
            User user = new User();
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setFullName(request.getFullName());
            user.setUsername(request.getUsername());
            user.setApproved(false); // Admin needs to approve
            user.setActive(true);
            user.setRole(role);
            // Email verification
            String verificationToken = java.util.UUID.randomUUID().toString();
            user.setVerificationToken(verificationToken);
            user.setEmailVerified(false);
            userRepository.save(user);
            // Send verification email
            emailService.sendVerificationEmail(user.getEmail(), verificationToken);
            auditLogService.logActivity("REGISTER_SUCCESS", "User registered", request.getEmail());
            return ResponseEntity.ok("Registration successful. Please check your email to verify your account.");
        } catch (Exception e) {
            System.err.println("Registration error: " + e.getMessage());
            e.printStackTrace();
            auditLogService.logActivity("REGISTER_FAIL", "Exception: " + e.getMessage(), request.getEmail());
            return ResponseEntity.badRequest().body(new ApiError(1098, "Registration failed"));
        }
    }
    public ResponseEntity<?> requestPasswordReset(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        User user = userRepository.findByEmailIgnoreCase(email).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("No user with that email");
        }
        String resetToken = java.util.UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        userRepository.save(user);
        String resetLink = "http://localhost:5173/reset-password?token=" + resetToken;
        emailService.sendEmail(user.getEmail(), "Password Reset", "Click to reset your password: " + resetLink);
        return ResponseEntity.ok("Password reset email sent");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");
        User user = userRepository.findByResetToken(token).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("Invalid or expired reset token");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        userRepository.save(user);
        return ResponseEntity.ok("Password reset successful");
    }

    @Operation(
        summary = "Logout",
        description = "Logout user (stateless, just returns 200 OK for JWT-based auth)"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Logged out successfully", content = @Content)
    })
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // No server-side session to invalidate (JWT is stateless)
        return ResponseEntity.ok("Logged out successfully");
    }

    @GetMapping("/debug-roles/{email}")
    public ResponseEntity<?> debugUserRoles(@PathVariable String email) {
        try {
            User user = userRepository.findByEmailIgnoreCase(email).orElse(null);
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            Map<String, Object> debug = new HashMap<>();
            debug.put("userId", user.getId());
            debug.put("email", user.getEmail());
            debug.put("fullName", user.getFullName());
            debug.put("roleStringField", user.getRole());
            
            if (user.getRoles() != null) {
                debug.put("rolesCollectionSize", user.getRoles().size());
                List<String> roleNames = user.getRoles().stream()
                    .map(role -> role.getName())
                    .collect(Collectors.toList());
                debug.put("roleNames", roleNames);
            } else {
                debug.put("rolesCollection", "null");
            }
            
            return ResponseEntity.ok(debug);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/force-load-roles/{email}")
    public ResponseEntity<?> forceLoadRoles(@PathVariable String email) {
        try {
            // Force a fresh query to load user with roles
            User user = userRepository.findByEmailIgnoreCase(email).orElse(null);
            if (user == null) { 
                return ResponseEntity.badRequest().body("User not found");
            }
            
            // Force initialize the roles collection
            if (user.getRoles() != null) {
                user.getRoles().size(); // This forces lazy loading
            }
            
            Map<String, Object> result = new HashMap<>();
            result.put("userId", user.getId());
            result.put("email", user.getEmail());
            result.put("rolesFound", user.getRoles() != null ? user.getRoles().size() : 0);
            
            if (user.getRoles() != null && !user.getRoles().isEmpty()) {
                List<String> roleNames = user.getRoles().stream()
                    .map(role -> role.getName())
                    .collect(Collectors.toList());
                result.put("roleNames", roleNames);
            }
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/test-entity-manager/{email}")
    public ResponseEntity<?> testEntityManager(@PathVariable String email) {
        try {
            // Use EntityManager to directly query with explicit join
            String jpql = "SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE LOWER(u.email) = LOWER(:email)";
            User user = entityManager.createQuery(jpql, User.class)
                .setParameter("email", email)
                .getResultList()
                .stream()
                .findFirst()
                .orElse(null);
            
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            Map<String, Object> result = new HashMap<>();
            result.put("userId", user.getId());
            result.put("email", user.getEmail());
            result.put("rolesFound", user.getRoles() != null ? user.getRoles().size() : 0);
            
            if (user.getRoles() != null && !user.getRoles().isEmpty()) {
                List<String> roleNames = user.getRoles().stream()
                    .map(role -> role.getName())
                    .collect(Collectors.toList());
                result.put("roleNames", roleNames);
                result.put("success", true);
            } else {
                result.put("success", false);
            }
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/test-native-query/{email}")
    public ResponseEntity<?> testNativeQuery(@PathVariable String email) {
        try {
            // Find user first
            User user = userRepository.findByEmailIgnoreCase(email).orElse(null);
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            // Test native query to get role IDs
            List<Long> roleIds = userRepository.findRoleIdsByUserId(user.getId());
            
            Map<String, Object> result = new HashMap<>();
            result.put("userId", user.getId());
            result.put("email", user.getEmail());
            result.put("roleStringField", user.getRole());
            result.put("roleIdsFromNativeQuery", roleIds);
            result.put("rolesCollectionSize", user.getRoles() != null ? user.getRoles().size() : 0);
            
            if (user.getRoles() != null && !user.getRoles().isEmpty()) {
                List<String> roleNames = user.getRoles().stream()
                    .map(role -> role.getName())
                    .collect(Collectors.toList());
                result.put("roleNamesFromCollection", roleNames);
            }
            
            // If native query found roles but collection is empty, there's a JPA issue
            if (!roleIds.isEmpty() && (user.getRoles() == null || user.getRoles().isEmpty())) {
                result.put("jpaMismatch", true);
                result.put("recommendation", "Use role string field instead of collection");
            } else {
                result.put("jpaMismatch", false);
            }
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/fix-user-roles")
    public ResponseEntity<?> fixUserRoles() {
        try {
            // Manually insert missing user-role relationships
            Map<String, Object> result = new HashMap<>();
            
            // Find users and roles
            User admin = userRepository.findByEmailIgnoreCase("admin@ziohelp.com").orElse(null);
            User bob = userRepository.findByEmailIgnoreCase("bob@beta.com").orElse(null);
            User charlie = userRepository.findByEmailIgnoreCase("charlie@gamma.com").orElse(null);
            User eve = userRepository.findByEmailIgnoreCase("eve@epsilon.com").orElse(null);
            
            Role adminRole = roleRepository.findByName("ADMIN").orElse(null);
            Role devRole = roleRepository.findByName("DEVELOPER").orElse(null);
            Role userRole = roleRepository.findByName("USER").orElse(null);
            Role tenantAdminRole = roleRepository.findByName("TENANT_ADMIN").orElse(null);
            
            // Fix admin user
            if (admin != null && adminRole != null) {
                if (admin.getRoles() == null) admin.setRoles(new HashSet<>());
                admin.getRoles().clear();
                admin.getRoles().add(adminRole);
                userRepository.save(admin);
                result.put("admin", "Fixed - added ADMIN role");
            }
            
            // Fix bob (developer)
            if (bob != null && devRole != null) {
                if (bob.getRoles() == null) bob.setRoles(new HashSet<>());
                bob.getRoles().clear();
                bob.getRoles().add(devRole);
                userRepository.save(bob);
                result.put("bob", "Fixed - added DEVELOPER role");
            }
            
            // Fix charlie (user)
            if (charlie != null && userRole != null) {
                if (charlie.getRoles() == null) charlie.setRoles(new HashSet<>());
                charlie.getRoles().clear();
                charlie.getRoles().add(userRole);
                userRepository.save(charlie);
                result.put("charlie", "Fixed - added USER role");
            }
            
            // Fix eve (tenant admin)
            if (eve != null && tenantAdminRole != null) {
                if (eve.getRoles() == null) eve.setRoles(new HashSet<>());
                eve.getRoles().clear();
                eve.getRoles().add(tenantAdminRole);
                userRepository.save(eve);
                result.put("eve", "Fixed - added TENANT_ADMIN role");
            }
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
} 
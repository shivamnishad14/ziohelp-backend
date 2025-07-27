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
import java.util.stream.Collectors;
import java.util.Collections;
import java.util.List;
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
            try {
                Authentication authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
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
                // Get roles
                List<String> roles = user.getRoles() != null ?
                    user.getRoles().stream().map(Role::getName).collect(Collectors.toList()) :
                    Collections.singletonList("USER");
                response.setRoles(roles);
                System.out.println("Login successful for: " + request.getEmail() + " with roles: " + roles);
                return ResponseEntity.ok(response);
            } catch (Exception authEx) {
                System.err.println("Authentication failed for: " + request.getEmail() + ": " + authEx.getMessage());
                authEx.printStackTrace();
                auditLogService.logActivity("LOGIN_FAIL", "Authentication failed", request.getEmail());
                return ResponseEntity.badRequest().body("Invalid credentials");
            }
        } catch (Exception e) {
            System.err.println("Login error for " + request.getEmail() + ": " + e.getMessage());
            e.printStackTrace(); // Print full stack trace
            auditLogService.logActivity("LOGIN_FAIL", "Exception: " + e.getMessage(), request.getEmail());
            return ResponseEntity.status(400).body(new ApiError(1099, "Invalid credentials"));
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
                return ResponseEntity.badRequest().body("Email already in use");
            }
            Role role = roleRepository.findByName("USER")
                    .orElseGet(() -> {
                        Role r = new Role();
                        r.setName("USER");
                        return roleRepository.save(r);
                    });
            User user = new User();
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setFullName(request.getFullName());
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
            return ResponseEntity.badRequest().body("Registration failed");
        }
    }

    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        User user = userRepository.findByVerificationToken(token).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("Invalid or expired verification token");
        }
        user.setEmailVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);
        return ResponseEntity.ok("Email verified successfully");
    }

    @PostMapping("/request-password-reset")
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
} 
-- Test user with known password 'password123' and its correct BCrypt hash
INSERT INTO organization (id, name, metadata) 
VALUES (999, 'Test Organization', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO "user" (
  id, full_name, email, password, approved, active, organization_id, created_at,
  email_verified, verification_token, reset_token, username
)
VALUES
  (999, 'Test User', 'test@example.com', '$2a$10$6c3QxNucuBiGJB5nkNBBluImVThn02DwWVn/xIZBc83t9JbHqNFZm', true, true, 999, NOW(), true, null, null, 'testuser')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_roles (user_id, role_id) 
VALUES (999, 1)  -- Role ID 1 is ADMIN
ON CONFLICT (user_id, role_id) DO NOTHING;

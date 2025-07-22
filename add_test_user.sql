-- Insert test users with known password
INSERT INTO organization (id, name, metadata) 
VALUES (999, 'Test Organization', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO "user" (
  id, full_name, email, password, approved, active, organization_id, created_at,
  email_verified, verification_token, reset_token, username
)
VALUES
  (999, 'Test User', 'test@example.com', '$2a$10$9Xn7Li89B4cz6MYP00KmLuQWxGR9lJ0jT38CXpq6wLzEjhqGBQM4y', true, true, 999, NOW(), true, null, null, 'testuser')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_roles (user_id, role_id) 
VALUES (999, 1)  -- Role ID 1 is ADMIN
ON CONFLICT (user_id, role_id) DO NOTHING;

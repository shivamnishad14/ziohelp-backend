-- Add Admin User Script
-- Run this in your PostgreSQL database

-- First, ensure roles exist
INSERT INTO role (id, name) VALUES 
(1, 'ADMIN'), 
(2, 'DEVELOPER'), 
(3, 'USER'), 
(4, 'GUEST'), 
(5, 'TENANT_ADMIN')
ON CONFLICT (id) DO NOTHING;

-- Add admin user
INSERT INTO "user" (id, full_name, email, password, approved, active, organization_id, created_at) VALUES
(16, 'ZioHelp Admin', 'admin@ziohelp.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', true, true, 1, NOW())
ON CONFLICT (id) DO NOTHING;

-- Assign ADMIN role to admin user
INSERT INTO user_roles (user_id, role_id) VALUES
(16, 1)
ON CONFLICT DO NOTHING;

-- Verify the user was created
SELECT u.full_name, u.email, u.approved, u.active, r.name as role 
FROM "user" u 
JOIN user_roles ur ON u.id = ur.user_id 
JOIN role r ON ur.role_id = r.id 
WHERE u.email = 'admin@ziohelp.com'; 
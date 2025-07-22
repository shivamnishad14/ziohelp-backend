-- SQL Script to Add Developer Admin
-- Run this in your PostgreSQL database

-- Add new developer admin user
INSERT INTO "user" (id, full_name, email, password, approved, active, organization_id, created_at) VALUES
(17, 'Developer Admin', 'developer@ziohelp.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', true, true, 1, NOW());

-- Assign DEVELOPER role to the new user
INSERT INTO user_roles (user_id, role_id) VALUES
(17, 2); -- DEVELOPER role

-- Optional: Also assign ADMIN role if you want them to have admin privileges
-- INSERT INTO user_roles (user_id, role_id) VALUES
-- (17, 1); -- ADMIN role

-- Verify the user was created
SELECT u.full_name, u.email, r.name as role 
FROM "user" u 
JOIN user_roles ur ON u.id = ur.user_id 
JOIN role r ON ur.role_id = r.id 
WHERE u.email = 'developer@ziohelp.com'; 
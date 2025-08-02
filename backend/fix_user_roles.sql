-- Manual insertion of user-role relationships
-- This compensates for the missing data in user_roles table

-- First check what users exist
SELECT id, email, full_name FROM "user" ORDER BY id;

-- Check what roles exist  
SELECT id, name FROM roles ORDER BY id;

-- Check existing user_roles relationships
SELECT ur.user_id, ur.role_id, u.email, r.name as role_name 
FROM user_roles ur 
JOIN "user" u ON ur.user_id = u.id 
JOIN roles r ON ur.role_id = r.id
ORDER BY ur.user_id;

-- Insert the missing relationships
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1),  -- Alice is ADMIN
(2, 2),  -- Bob is DEVELOPER  
(3, 3),  -- Charlie is USER
(4, 2),  -- David is DEVELOPER
(5, 5),  -- Eve is TENANT_ADMIN
(16, 1), -- ZioHelp Admin is ADMIN
(17, 2)  -- Developer Admin is DEVELOPER
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Verify the insertions
SELECT ur.user_id, ur.role_id, u.email, r.name as role_name 
FROM user_roles ur 
JOIN "user" u ON ur.user_id = u.id 
JOIN roles r ON ur.role_id = r.id
WHERE u.email IN ('admin@ziohelp.com', 'bob@beta.com', 'charlie@gamma.com', 'eve@epsilon.com')
ORDER BY ur.user_id;

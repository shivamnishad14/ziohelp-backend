-- Check what's actually in the user_roles table
SELECT u.id as user_id, u.email, u.full_name, 
       ur.role_id, r.name as role_name
FROM "user" u 
LEFT JOIN user_roles ur ON u.id = ur.user_id 
LEFT JOIN roles r ON ur.role_id = r.id 
WHERE u.email IN ('admin@ziohelp.com', 'charlie@gamma.com', 'bob@beta.com', 'eve@epsilon.com')
ORDER BY u.email;

-- Check all roles
SELECT * FROM roles;

-- Check all user_roles relationships
SELECT * FROM user_roles WHERE user_id IN (
    SELECT id FROM "user" 
    WHERE email IN ('admin@ziohelp.com', 'charlie@gamma.com', 'bob@beta.com', 'eve@epsilon.com')
);

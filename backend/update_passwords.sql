-- Update all user passwords to plain text
UPDATE "user" SET password = 'password123';

-- Verify the update
SELECT id, email, password FROM "user" WHERE email = 'admin@ziohelp.com';

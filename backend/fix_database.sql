-- Fix database issues for ZioHelp

-- First, let's check what organizations exist
SELECT * FROM organizations;

-- Update users to use valid organization IDs
UPDATE "user" SET organization_id = 1 WHERE organization_id = 999;
UPDATE "user" SET organization_id = 1 WHERE organization_id NOT IN (SELECT id FROM organizations);

-- Update any other tables that might reference organization ID 999
UPDATE faq SET organization_id = 1 WHERE organization_id = 999;
UPDATE faq SET organization_id = 1 WHERE organization_id NOT IN (SELECT id FROM organizations);

UPDATE tickets SET organization_id = 1 WHERE organization_id = 999;
UPDATE tickets SET organization_id = 1 WHERE organization_id NOT IN (SELECT id FROM organizations);

-- Fix any other foreign key issues
UPDATE notification SET recipient_id = 1 WHERE recipient_id NOT IN (SELECT id FROM "user");

-- Verify the fix
SELECT id, email, organization_id FROM "user" WHERE email = 'admin@ziohelp.com';
SELECT COUNT(*) as user_count FROM "user";
SELECT COUNT(*) as org_count FROM organizations;

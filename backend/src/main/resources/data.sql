-- Enhanced ZioHelp Database with RBAC - Gradual Implementation
-- Reset and setup with new RBAC features

-- Note: DELETE statements commented out to allow clean startup
-- DELETE FROM user_roles;
-- DELETE FROM role_permissions;
-- DELETE FROM role_menu_permissions;
-- DELETE FROM audit_log;
-- DELETE FROM notification;
-- DELETE FROM faq;
-- DELETE FROM tickets;
-- DELETE FROM "user";
-- DELETE FROM organizations;
-- DELETE FROM roles;
-- DELETE FROM permissions;
-- DELETE FROM menu_items;

-- Add enhanced columns to existing tables gradually
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS username VARCHAR(100) UNIQUE;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS first_name VARCHAR(50);
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS last_name VARCHAR(50);
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS job_title VARCHAR(100);
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS department VARCHAR(100);
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(255);
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS login_attempts INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Add enhanced columns to roles table
ALTER TABLE roles ADD COLUMN IF NOT EXISTS description VARCHAR(255);
ALTER TABLE roles ADD COLUMN IF NOT EXISTS is_system BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Add enhanced columns to organizations
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS description VARCHAR(500);
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS website_url VARCHAR(255);
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS address VARCHAR(255);
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS country VARCHAR(100);
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20);
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE';
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(20) NOT NULL DEFAULT 'FREE';
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS max_users INTEGER DEFAULT 10;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS logo_url VARCHAR(255);
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP;

-- Create RBAC tables if they don't exist
CREATE TABLE IF NOT EXISTS permissions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255),
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(resource, action)
);

CREATE TABLE IF NOT EXISTS menu_items (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    path VARCHAR(255) UNIQUE NOT NULL,
    icon VARCHAR(50),
    description VARCHAR(255),
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    category VARCHAR(50),
    parent_id BIGINT REFERENCES menu_items(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id BIGINT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS role_menu_permissions (
    id BIGSERIAL PRIMARY KEY,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    menu_item_id BIGINT NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    can_view BOOLEAN NOT NULL DEFAULT true,
    can_edit BOOLEAN NOT NULL DEFAULT false,
    can_delete BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, menu_item_id)
);

-- Drop and recreate constraints for existing tables
DELETE FROM notification n1
WHERE EXISTS (
    SELECT 1 FROM notification n2
    WHERE n2.recipient_id = n1.recipient_id
    AND n2.timestamp = n1.timestamp
    AND n2.ctid > n1.ctid
);
ALTER TABLE notification DROP CONSTRAINT IF EXISTS notification_recipient_timestamp;
ALTER TABLE notification ADD CONSTRAINT notification_recipient_timestamp UNIQUE (recipient_id, timestamp);

DELETE FROM audit_log a1
WHERE EXISTS (
    SELECT 1 FROM audit_log a2
    WHERE a2.user_email = a1.user_email
    AND a2.timestamp = a1.timestamp
    AND a2.ctid > a1.ctid
);
ALTER TABLE audit_log DROP CONSTRAINT IF EXISTS audit_log_email_timestamp;
ALTER TABLE audit_log ADD CONSTRAINT audit_log_email_timestamp UNIQUE (user_email, timestamp);

DELETE FROM faq f1
WHERE EXISTS (
    SELECT 1 FROM faq f2
    WHERE f2.question = f1.question
    AND f2.organization_id = f1.organization_id
    AND f2.ctid > f1.ctid
);
ALTER TABLE faq DROP CONSTRAINT IF EXISTS faq_question_org_id;
ALTER TABLE faq ADD CONSTRAINT faq_question_org_id UNIQUE (question, organization_id);

-- Insert or update roles with enhanced data
INSERT INTO roles (id, name, description, is_system, is_active) VALUES
(1, 'ADMIN', 'System Administrator with full access to all features', true, true),
(2, 'DEVELOPER', 'Developer/Agent with technical support access', true, true),
(3, 'USER', 'Regular user with basic access to tickets and knowledge base', true, true),
(4, 'GUEST', 'Guest user with limited access to create tickets', true, true),
(5, 'TENANT_ADMIN', 'Tenant Administrator with organization-level access', true, true)
ON CONFLICT (id) DO UPDATE SET
  description = EXCLUDED.description,
  is_system = EXCLUDED.is_system,
  is_active = EXCLUDED.is_active;

-- Insert default permissions
INSERT INTO permissions (name, description, resource, action) VALUES
('USER_READ', 'Read user information', 'USER', 'READ'),
('USER_WRITE', 'Create and update users', 'USER', 'WRITE'),
('USER_DELETE', 'Delete users', 'USER', 'DELETE'),
('USER_MANAGE', 'Full user management', 'USER', 'MANAGE'),
('ROLE_READ', 'Read role information', 'ROLE', 'READ'),
('ROLE_WRITE', 'Create and update roles', 'ROLE', 'WRITE'),
('ROLE_DELETE', 'Delete roles', 'ROLE', 'DELETE'),
('ROLE_MANAGE', 'Full role management', 'ROLE', 'MANAGE'),
('ORGANIZATION_READ', 'Read organization information', 'ORGANIZATION', 'READ'),
('ORGANIZATION_WRITE', 'Create and update organizations', 'ORGANIZATION', 'WRITE'),
('ORGANIZATION_DELETE', 'Delete organizations', 'ORGANIZATION', 'DELETE'),
('ORGANIZATION_MANAGE', 'Full organization management', 'ORGANIZATION', 'MANAGE'),
('TICKET_READ', 'Read tickets', 'TICKET', 'READ'),
('TICKET_WRITE', 'Create and update tickets', 'TICKET', 'WRITE'),
('TICKET_DELETE', 'Delete tickets', 'TICKET', 'DELETE'),
('TICKET_ASSIGN', 'Assign tickets', 'TICKET', 'ASSIGN'),
('SYSTEM_ADMIN', 'System administration', 'SYSTEM', 'ADMIN'),
('AUDIT_READ', 'Read audit logs', 'AUDIT', 'READ')
ON CONFLICT (resource, action) DO NOTHING;

-- Insert default menu items
INSERT INTO menu_items (name, path, icon, description, sort_order, category) VALUES
('Dashboard', '/dashboard', 'dashboard', 'Main dashboard', 0, 'GENERAL'),
('Users', '/admin/users', 'users', 'User management', 1, 'ADMIN'),
('Roles', '/admin/roles', 'shield', 'Role management', 2, 'ADMIN'),
('Organizations', '/admin/organizations', 'building', 'Organization management', 3, 'ADMIN'),
('Tickets', '/tickets', 'ticket', 'Ticket management', 4, 'GENERAL'),
('Knowledge Base', '/knowledge-base', 'book', 'Knowledge base', 5, 'GENERAL'),
('Reports', '/reports', 'chart-bar', 'Reports and analytics', 6, 'ADMIN'),
('Settings', '/settings', 'settings', 'System settings', 7, 'ADMIN'),
('Audit Logs', '/admin/audit-logs', 'file-text', 'Audit logs', 8, 'ADMIN')
ON CONFLICT (path) DO NOTHING;

-- Organizations with enhanced data
INSERT INTO organizations (
  id, name, description, status, subscription_tier, max_users, created_at
) VALUES
(1, 'Acme Corp', 'Leading technology solutions provider', 'ACTIVE', 'PREMIUM', 50, NOW()),
(2, 'Beta Inc', 'Innovative software development company', 'ACTIVE', 'STANDARD', 25, NOW()),
(3, 'Gamma LLC', 'Digital transformation consultancy', 'ACTIVE', 'FREE', 10, NOW()),
(4, 'Delta Ltd', 'Cloud infrastructure specialists', 'ACTIVE', 'PREMIUM', 100, NOW()),
(5, 'Epsilon GmbH', 'AI and machine learning solutions', 'ACTIVE', 'STANDARD', 30, NOW()),
(6, 'Zeta SA', 'Cybersecurity and data protection', 'ACTIVE', 'FREE', 10, NOW()),
(7, 'Eta BV', 'Mobile application development', 'ACTIVE', 'STANDARD', 20, NOW()),
(8, 'Theta PLC', 'Enterprise software solutions', 'ACTIVE', 'PREMIUM', 75, NOW()),
(9, 'Iota Inc', 'IoT and smart device integration', 'ACTIVE', 'FREE', 10, NOW()),
(10, 'Kappa Corp', 'Business process automation', 'ACTIVE', 'STANDARD', 40, NOW())
ON CONFLICT (id) DO UPDATE SET
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  subscription_tier = EXCLUDED.subscription_tier,
  max_users = EXCLUDED.max_users;

-- Enhanced Users with RBAC data
INSERT INTO "user" (
  id, full_name, first_name, last_name, email, username, password, 
  approved, active, organization_id, created_at, email_verified, 
  verification_token, reset_token, job_title, department
) VALUES
  (1, 'Alice Johnson', 'Alice', 'Johnson', 'alice@acme.com', 'alice', 'password123', true, true, 1, NOW(), true, null, null, 'CTO', 'Technology'),
  (2, 'Bob Smith', 'Bob', 'Smith', 'bob@beta.com', 'bob', 'password123', true, true, 2, NOW(), true, null, null, 'Lead Developer', 'Engineering'),
  (3, 'Charlie Brown', 'Charlie', 'Brown', 'charlie@gamma.com', 'charlie', 'password123', true, true, 3, NOW(), true, null, null, 'Support Manager', 'Customer Support'),
  (4, 'David Wilson', 'David', 'Wilson', 'david@delta.com', 'david', 'password123', true, true, 4, NOW(), true, null, null, 'DevOps Engineer', 'Infrastructure'),
  (5, 'Eve Davis', 'Eve', 'Davis', 'eve@epsilon.com', 'eve', 'password123', true, true, 5, NOW(), true, null, null, 'Product Manager', 'Product'),
  (16, 'ZioHelp Admin', 'Admin', 'User', 'admin@ziohelp.com', 'adminuser', 'password123', true, true, 1, NOW(), true, null, null, 'System Administrator', 'IT'),
  (17, 'Developer Admin', 'Developer', 'Admin', 'developer@ziohelp.com', 'devadmin', 'password123', true, true, 1, NOW(), true, null, null, 'Senior Developer', 'Development')
ON CONFLICT (id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  username = EXCLUDED.username,
  job_title = EXCLUDED.job_title,
  department = EXCLUDED.department;

-- User Roles (simplified for existing system compatibility)
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1), -- Alice is ADMIN
(2, 2), -- Bob is DEVELOPER  
(3, 3), -- Charlie is USER
(4, 2), -- David is DEVELOPER
(5, 5), -- Eve is TENANT_ADMIN
(16, 1), -- ZioHelp Admin is ADMIN
(17, 2)  -- Developer Admin is DEVELOPER
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Assign permissions to roles gradually
-- ADMIN gets all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.name = 'ADMIN'
ON CONFLICT DO NOTHING;

-- TENANT_ADMIN gets organization and user management
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.name = 'TENANT_ADMIN' 
AND p.resource IN ('USER', 'ORGANIZATION', 'TICKET') 
AND p.action IN ('READ', 'WRITE', 'MANAGE')
ON CONFLICT DO NOTHING;

-- DEVELOPER gets ticket management
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.name = 'DEVELOPER' 
AND p.resource = 'TICKET'
ON CONFLICT DO NOTHING;

-- USER gets basic read permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.name = 'USER' 
AND p.action = 'READ'
ON CONFLICT DO NOTHING;

-- Assign menu permissions to roles
-- ADMIN gets access to all menus
INSERT INTO role_menu_permissions (role_id, menu_item_id, can_view, can_edit, can_delete)
SELECT r.id, m.id, true, true, true
FROM roles r, menu_items m 
WHERE r.name = 'ADMIN'
ON CONFLICT DO NOTHING;

-- TENANT_ADMIN gets access to relevant menus
INSERT INTO role_menu_permissions (role_id, menu_item_id, can_view, can_edit, can_delete)
SELECT r.id, m.id, true, 
       CASE WHEN m.category = 'ADMIN' AND m.name NOT IN ('Roles', 'Audit Logs') THEN true ELSE false END,
       false
FROM roles r, menu_items m 
WHERE r.name = 'TENANT_ADMIN' 
AND (m.category = 'GENERAL' OR (m.category = 'ADMIN' AND m.name IN ('Users', 'Organizations')))
ON CONFLICT DO NOTHING;

-- Enhanced sample tickets
INSERT INTO ticket (id, title, description, status, priority, created_by, is_guest, created_at, updated_at, organization_id) VALUES
(1, 'Dashboard Performance Issue', 'Dashboard takes too long to load user analytics', 'OPEN', 'HIGH', 'alice@acme.com', false, NOW(), NOW(), 1),
(2, 'RBAC Permission Error', 'Users cannot access assigned menu items', 'OPEN', 'CRITICAL', 'bob@beta.com', false, NOW(), NOW(), 2),
(3, 'Email Verification Bug', 'Verification emails not being sent', 'OPEN', 'HIGH', 'charlie@gamma.com', false, NOW(), NOW(), 3),
(4, 'File Upload Feature Request', 'Need ability to upload attachments to tickets', 'OPEN', 'MEDIUM', 'david@delta.com', false, NOW(), NOW(), 4),
(5, 'Multi-tenant Data Isolation', 'Ensure tenant data isolation is working correctly', 'OPEN', 'HIGH', 'eve@epsilon.com', false, NOW(), NOW(), 5)
ON CONFLICT (id) DO NOTHING;

-- Enhanced comments with RBAC context
INSERT INTO comment (id, ticket_id, author, message, created_at) VALUES
(1, 1, 'admin@ziohelp.com', 'Investigating dashboard performance with new RBAC features.', NOW()),
(2, 2, 'developer@ziohelp.com', 'RBAC permissions have been updated. Please test again.', NOW()),
(3, 3, 'alice@acme.com', 'Email verification service has been enhanced with new features.', NOW()),
(4, 4, 'bob@beta.com', 'File upload functionality is being developed with security features.', NOW()),
(5, 5, 'eve@epsilon.com', 'Multi-tenant isolation has been verified and is working correctly.', NOW())
ON CONFLICT (id) DO NOTHING;

-- RBAC-aware notifications
INSERT INTO notification (type, message, seen, timestamp, recipient_id, organization_id) VALUES
('RBAC_UPDATE', 'Your role permissions have been updated.', false, NOW(), 1, 1),
('SYSTEM_UPGRADE', 'ZioHelp has been upgraded with enhanced RBAC features.', false, NOW(), 2, 2),
('MENU_ACCESS', 'New menu items are now available based on your role.', false, NOW(), 3, 3),
('SECURITY_ALERT', 'Enhanced security features have been enabled.', false, NOW(), 4, 4),
('FEATURE_RELEASE', 'New file upload and email verification features are live.', false, NOW(), 5, 5)
ON CONFLICT (recipient_id, timestamp) DO NOTHING;

-- Enhanced audit logs with RBAC actions
INSERT INTO audit_log (user_email, action, details, timestamp, organization_id) VALUES
('admin@ziohelp.com', 'RBAC_SETUP', 'Initialized RBAC system with permissions and menu access', NOW(), 1),
('alice@acme.com', 'ROLE_ASSIGNED', 'Assigned ADMIN role with full system access', NOW(), 1),
('eve@epsilon.com', 'ROLE_ASSIGNED', 'Assigned TENANT_ADMIN role for organization management', NOW(), 5),
('developer@ziohelp.com', 'PERMISSION_GRANTED', 'Granted TICKET management permissions', NOW(), 1),
('admin@ziohelp.com', 'SYSTEM_UPGRADE', 'Database enhanced with RBAC and security features', NOW(), 1)
ON CONFLICT (user_email, timestamp) DO NOTHING;

-- Enhanced FAQs with RBAC and new features
INSERT INTO faq (question, answer, organization_id) VALUES
('How does the new role-based access control work?', 'RBAC allows administrators to assign specific permissions to users based on their roles, controlling access to different features and menu items.', 1),
('What are the different user roles available?', 'ZioHelp supports 5 roles: ADMIN (full access), TENANT_ADMIN (organization management), DEVELOPER (ticket management), USER (basic access), and GUEST (limited access).', 1),
('How can I customize menu access for different roles?', 'Administrators can configure which menu items are visible and editable for each role through the role management interface.', 1),
('Is email verification required for new accounts?', 'Yes, all new user accounts require email verification before they can access the system.', 2),
('Can I upload files to tickets?', 'Yes, the new file upload feature allows you to attach documents, images, and other files to tickets for better support.', 2),
('How is data isolated between organizations?', 'ZioHelp uses multi-tenant architecture to ensure complete data isolation between different organizations.', 3),
('What subscription tiers are available?', 'We offer FREE (10 users), STANDARD (25-40 users), and PREMIUM (50-100 users) subscription tiers.', 3),
('How can I track user activity?', 'Administrators can view detailed audit logs showing all user actions and system changes.', 4),
('Can I integrate ZioHelp with other systems?', 'Yes, ZioHelp provides REST APIs and webhook support for integration with external systems.', 4),
('How do I reset my password?', 'Use the "Forgot Password" link on the login page to receive a secure password reset email.', 5)
ON CONFLICT (question, organization_id) DO NOTHING;
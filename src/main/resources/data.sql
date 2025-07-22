-- Add this at the top for migrations
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS username VARCHAR(100) UNIQUE;

-- Roles
INSERT INTO role (id, name) VALUES
(1, 'ADMIN'), (2, 'DEVELOPER'), (3, 'USER'), (4, 'GUEST'), (5, 'TENANT_ADMIN')
ON CONFLICT (id) DO NOTHING;

-- Organizations
INSERT INTO organization (id, name, metadata) VALUES
(1, 'Acme Corp', NULL), (2, 'Beta Inc', NULL), (3, 'Gamma LLC', NULL), (4, 'Delta Ltd', NULL), (5, 'Epsilon GmbH', NULL),
(6, 'Zeta SA', NULL), (7, 'Eta BV', NULL), (8, 'Theta PLC', NULL), (9, 'Iota Inc', NULL), (10, 'Kappa Corp', NULL),
(11, 'Lambda Ltd', NULL), (12, 'Mu GmbH', NULL), (13, 'Nu SA', NULL), (14, 'Xi BV', NULL), (15, 'Omicron PLC', NULL);

-- Users (with username)
INSERT INTO "user" (
  id, full_name, email, password, approved, active, organization_id, created_at,
  email_verified, verification_token, reset_token, username
) VALUES
  (1, 'Alice', 'alice@acme.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', true, true, 1, NOW(), true, null, null, 'alice'),
  (2, 'Bob', 'bob@beta.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', true, true, 2, NOW(), true, null, null, 'bob'),
  (3, 'Charlie', 'charlie@gamma.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', true, true, 3, NOW(), true, null, null, 'charlie'),
  (4, 'David', 'david@delta.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', true, true, 4, NOW(), true, null, null, 'david'),
  (5, 'Eve', 'eve@epsilon.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', true, true, 5, NOW(), true, null, null, 'eve'),
  (6, 'Frank', 'frank@zeta.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', true, true, 6, NOW(), true, null, null, 'frank'),
  (7, 'Grace', 'grace@eta.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', true, true, 7, NOW(), true, null, null, 'grace'),
  (8, 'Heidi', 'heidi@theta.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', true, true, 8, NOW(), true, null, null, 'heidi'),
  (9, 'Ivan', 'ivan@iota.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', true, true, 9, NOW(), true, null, null, 'ivan'),
  (10, 'Judy', 'judy@kappa.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', true, true, 10, NOW(), true, null, null, 'judy'),
  (11, 'Mallory', 'mallory@lambda.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', true, true, 11, NOW(), true, null, null, 'mallory'),
  (12, 'Niaj', 'niaj@mu.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', true, true, 12, NOW(), true, null, null, 'niaj'),
  (13, 'Olivia', 'olivia@nu.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', true, true, 13, NOW(), true, null, null, 'olivia'),
  (14, 'Peggy', 'peggy@xi.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', true, true, 14, NOW(), true, null, null, 'peggy'),
  (15, 'Sybil', 'sybil@omicron.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', true, true, 15, NOW(), true, null, null, 'sybil'),
  (16, 'ZioHelp Admin', 'admin@ziohelp.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', true, true, 1, NOW(), true, null, null, 'adminuser'),
  (17, 'Developer Admin', 'developer@ziohelp.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', true, true, 1, NOW(), true, null, null, 'devadmin');

-- User Roles (Many-to-Many join table, including admin and developer admin)
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1), -- Alice is ADMIN
(2, 2), -- Bob is DEVELOPER
(3, 3), -- Charlie is USER
(4, 2), -- David is DEVELOPER
(5, 3), -- Eve is USER
(6, 2), -- Frank is DEVELOPER
(7, 3), -- Grace is USER
(8, 2), -- Heidi is DEVELOPER
(9, 3), -- Ivan is USER
(10, 1), -- Judy is ADMIN
(11, 4), -- Mallory is GUEST
(12, 2), -- Niaj is DEVELOPER
(13, 5), -- Olivia is TENANT_ADMIN
(14, 3), -- Peggy is USER
(15, 3), -- Sybil is USER
(16, 1), -- ZioHelp Admin is ADMIN
(17, 2); -- Developer Admin is DEVELOPER

-- Tickets
INSERT INTO ticket (id, title, description, status, priority, created_by, is_guest, created_at, updated_at, organization_id) VALUES
(1, 'Login Issue', 'Cannot login to dashboard', 'OPEN', 'HIGH', 'alice@acme.com', false, NOW(), NOW(), 1),
(2, 'Payment Failed', 'Card declined', 'OPEN', 'MEDIUM', 'bob@beta.com', false, NOW(), NOW(), 2),
(3, 'Feature Request', 'Add dark mode', 'OPEN', 'LOW', 'charlie@gamma.com', false, NOW(), NOW(), 3),
(4, 'Bug Report', 'App crashes on submit', 'OPEN', 'HIGH', 'david@delta.com', false, NOW(), NOW(), 4),
(5, 'Account Locked', 'Too many attempts', 'OPEN', 'MEDIUM', 'eve@epsilon.com', false, NOW(), NOW(), 5),
(6, 'Password Reset', 'Forgot password', 'OPEN', 'LOW', 'frank@zeta.com', false, NOW(), NOW(), 6),
(7, 'UI Issue', 'Button not visible', 'OPEN', 'LOW', 'grace@eta.com', false, NOW(), NOW(), 7),
(8, 'Performance', 'Slow loading', 'OPEN', 'MEDIUM', 'heidi@theta.com', false, NOW(), NOW(), 8),
(9, 'Integration', 'API not working', 'OPEN', 'HIGH', 'ivan@iota.com', false, NOW(), NOW(), 9),
(10, 'Notification', 'Not receiving emails', 'OPEN', 'LOW', 'judy@kappa.com', false, NOW(), NOW(), 10),
(11, 'Data Loss', 'Lost ticket history', 'OPEN', 'HIGH', 'mallory@lambda.com', false, NOW(), NOW(), 11),
(12, 'Mobile Bug', 'App crashes on iOS', 'OPEN', 'MEDIUM', 'niaj@mu.com', false, NOW(), NOW(), 12),
(13, 'Export Issue', 'PDF export fails', 'OPEN', 'LOW', 'olivia@nu.com', false, NOW(), NOW(), 13),
(14, 'Settings', 'Cannot update profile', 'OPEN', 'MEDIUM', 'peggy@xi.com', false, NOW(), NOW(), 14),
(15, 'Other', 'General feedback', 'OPEN', 'LOW', 'sybil@omicron.com', false, NOW(), NOW(), 15);

-- Comments
INSERT INTO comment (ticket_id, author, message, created_at) VALUES
(1, 'alice@acme.com', 'We are looking into your login issue.', NOW()),
(2, 'bob@beta.com', 'Please try another card.', NOW()),
(3, 'charlie@gamma.com', 'Dark mode is on our roadmap.', NOW()),
(4, 'david@delta.com', 'Can you provide crash logs?', NOW()),
(5, 'eve@epsilon.com', 'We have unlocked your account.', NOW());

-- Notifications
INSERT INTO notification (type, message, seen, timestamp, recipient_id, organization_id) VALUES
('NEW_TICKET', 'A new ticket has been created.', false, NOW(), 1, 1),
('COMMENT', 'You have a new comment on your ticket.', false, NOW(), 2, 2),
('STATUS_UPDATE', 'Your ticket status changed to RESOLVED.', false, NOW(), 3, 3);

-- Audit Logs
INSERT INTO audit_log (user_email, action, details, timestamp, organization_id) VALUES
('alice@acme.com', 'CREATE', 'Created ticket', NOW(), 1),
('judy@kappa.com', 'UPDATE', 'Updated user', NOW(), 10),
('olivia@nu.com', 'DELETE', 'Deleted FAQ', NOW(), 13),
('admin@ziohelp.com', 'ROLE_UPDATE', 'Roles updated: ["ADMIN", "TENANT_ADMIN"]', NOW(), 1),
('developer@ziohelp.com', 'ROLE_UPDATE', 'Role removed: DEVELOPER', NOW(), 1),
('alice@acme.com', 'ROLE_UPDATE', 'Roles updated: ["ADMIN"]', NOW(), 1);

-- FAQs
INSERT INTO faq (question, answer, organization_id) VALUES
('How to reset password?', 'Go to login page and click on Forgot Password.', 1),
('How to check ticket status?', 'Visit ticket status page and enter ticket ID and email.', 2),
('How to contact support?', 'You can submit a ticket as guest or login to your account.', 3),
('How to change email?', 'Go to profile settings and update your email.', 4),
('How to delete account?', 'Contact support to delete your account.', 5),
('How to export tickets?', 'Use the export button on the dashboard.', 6),
('How to enable notifications?', 'Check your profile notification settings.', 7),
('How to invite users?', 'Admins can invite users from the admin panel.', 8),
('How to assign roles?', 'Role assignment is in the user management section.', 9),
('How to view audit logs?', 'Audit logs are available to admins.', 10),
('How to use API?', 'See the API documentation in Swagger.', 11),
('How to report a bug?', 'Submit a ticket with bug details.', 12),
('How to request a feature?', 'Submit a ticket with feature request.', 13),
('How to change password?', 'Go to profile and select change password.', 14),
('How to logout?', 'Click the logout button in the top right.', 15);

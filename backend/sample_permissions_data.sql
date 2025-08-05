-- Ensure permissions table exists
CREATE TABLE IF NOT EXISTS permissions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(255),
    resource_type VARCHAR(50),
    action_type VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_system BOOLEAN NOT NULL DEFAULT false
);

-- Ensure product table exists
CREATE TABLE IF NOT EXISTS product (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    domain VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(255),
    version VARCHAR(20),
    status VARCHAR(20),
    category VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Sample permissions data for testing
INSERT INTO permissions (name, description, resource_type, action_type, is_active, is_system) VALUES
('USER_CREATE', 'Create new users', 'USER', 'CREATE', true, true),
('USER_READ', 'View user details', 'USER', 'READ', true, true),
('USER_UPDATE', 'Update user information', 'USER', 'UPDATE', true, true),
('USER_DELETE', 'Delete users', 'USER', 'DELETE', true, true),
('USER_ROLE_ASSIGN', 'Assign roles to users', 'USER', 'ASSIGN', true, true),

('ROLE_CREATE', 'Create new roles', 'ROLE', 'CREATE', true, true),
('ROLE_READ', 'View role details', 'ROLE', 'READ', true, true),
('ROLE_UPDATE', 'Update role information', 'ROLE', 'UPDATE', true, true),
('ROLE_DELETE', 'Delete roles', 'ROLE', 'DELETE', true, true),
('ROLE_PERMISSION_ASSIGN', 'Assign permissions to roles', 'ROLE', 'ASSIGN', true, true),

('TICKET_CREATE', 'Create new tickets', 'TICKET', 'CREATE', true, true),
('TICKET_READ', 'View ticket details', 'TICKET', 'READ', true, true),
('TICKET_UPDATE', 'Update ticket information', 'TICKET', 'UPDATE', true, true),
('TICKET_DELETE', 'Delete tickets', 'TICKET', 'DELETE', true, true),
('TICKET_ASSIGN', 'Assign tickets to users', 'TICKET', 'ASSIGN', true, true),
('TICKET_RESOLVE', 'Resolve tickets', 'TICKET', 'RESOLVE', true, true),

('FAQ_CREATE', 'Create new FAQs', 'FAQ', 'CREATE', true, true),
('FAQ_READ', 'View FAQ details', 'FAQ', 'READ', true, true),
('FAQ_UPDATE', 'Update FAQ information', 'FAQ', 'UPDATE', true, true),
('FAQ_DELETE', 'Delete FAQs', 'FAQ', 'DELETE', true, true),

('ARTICLE_CREATE', 'Create new articles', 'ARTICLE', 'CREATE', true, true),
('ARTICLE_READ', 'View article details', 'ARTICLE', 'READ', true, true),
('ARTICLE_UPDATE', 'Update article information', 'ARTICLE', 'UPDATE', true, true),
('ARTICLE_DELETE', 'Delete articles', 'ARTICLE', 'DELETE', true, true),
('ARTICLE_PUBLISH', 'Publish articles', 'ARTICLE', 'PUBLISH', true, true),

('MENU_CREATE', 'Create new menu items', 'MENU', 'CREATE', true, true),
('MENU_READ', 'View menu details', 'MENU', 'READ', true, true),
('MENU_UPDATE', 'Update menu information', 'MENU', 'UPDATE', true, true),
('MENU_DELETE', 'Delete menu items', 'MENU', 'DELETE', true, true),

('PRODUCT_CREATE', 'Create new products', 'PRODUCT', 'CREATE', true, true),
('PRODUCT_READ', 'View product details', 'PRODUCT', 'READ', true, true),
('PRODUCT_UPDATE', 'Update product information', 'PRODUCT', 'UPDATE', true, true),
('PRODUCT_DELETE', 'Delete products', 'PRODUCT', 'DELETE', true, true)
ON CONFLICT (name) DO NOTHING;

-- Sample product data
INSERT INTO product (name, domain, description, version, status, category, is_active, created_at, updated_at) VALUES
('ZioHelp', 'ziohelp.com', 'Multi-tenant helpdesk and ticketing system', '1.0.0', 'ACTIVE', 'Helpdesk', true, NOW(), NOW()),
('ZioChat', 'ziochat.com', 'Real-time chat and communication platform', '1.2.0', 'ACTIVE', 'Communication', true, NOW(), NOW()),
('ZioAnalytics', 'zioanalytics.com', 'Advanced analytics and reporting dashboard', '2.1.0', 'BETA', 'Analytics', true, NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

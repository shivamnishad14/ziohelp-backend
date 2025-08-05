-- Enhanced ZioHelp Database with RBAC - Simple Version
-- Reset and setup with working data

-- Create basic tables if they don't exist
CREATE TABLE IF NOT EXISTS organizations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255),
    is_system BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "user" (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE,
    password VARCHAR(255) NOT NULL,
    organization_id BIGINT REFERENCES organizations(id),
    active BOOLEAN NOT NULL DEFAULT true,
    email_verified BOOLEAN NOT NULL DEFAULT false,
    approved BOOLEAN NOT NULL DEFAULT false,
    phone_number VARCHAR(20),
    job_title VARCHAR(100),
    department VARCHAR(100),
    avatar_url VARCHAR(255),
    role VARCHAR(50),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    login_attempts INTEGER NOT NULL DEFAULT 0,
    account_locked BOOLEAN NOT NULL DEFAULT false,
    locked_until TIMESTAMP,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS ticket (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    created_by VARCHAR(255) NOT NULL,
    is_guest BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    category VARCHAR(100),
    organization_id BIGINT REFERENCES organizations(id),
    product_id BIGINT REFERENCES product(id),
    assigned_to_id BIGINT REFERENCES "user"(id)
);

CREATE TABLE IF NOT EXISTS comment (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT NOT NULL REFERENCES ticket(id) ON DELETE CASCADE,
    author VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notification (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    seen BOOLEAN NOT NULL DEFAULT false,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    recipient_id BIGINT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    organization_id BIGINT REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS audit_log (
    id BIGSERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    organization_id BIGINT REFERENCES organizations(id)
);

-- Create products table
CREATE TABLE IF NOT EXISTS product (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    domain VARCHAR(255) NOT NULL UNIQUE,
    logo_url VARCHAR(500),
    theme_color VARCHAR(7),
    description TEXT,
    version VARCHAR(20),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    category VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced FAQ table with product relationship
CREATE TABLE IF NOT EXISTS faq (
    id BIGSERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    author VARCHAR(255),
    is_published BOOLEAN NOT NULL DEFAULT true,
    organization_id BIGINT REFERENCES organizations(id),
    product_id BIGINT REFERENCES product(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Knowledge base articles table
CREATE TABLE IF NOT EXISTS knowledge_base_article (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100),
    author VARCHAR(255),
    is_published BOOLEAN NOT NULL DEFAULT false,
    product_id BIGINT REFERENCES product(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert or update roles
INSERT INTO roles (id, name, is_system, is_active) VALUES
(1, 'ADMIN', true, true),
(2, 'DEVELOPER', true, true),
(3, 'USER', true, true),
(4, 'GUEST', true, true),
(5, 'TENANT_ADMIN', true, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  is_system = EXCLUDED.is_system,
  is_active = EXCLUDED.is_active;

-- Insert organizations
INSERT INTO organizations (id, name, description, status) VALUES
(1, 'Acme Corp', 'Leading technology solutions provider', 'ACTIVE'),
(2, 'Beta Inc', 'Innovative software development company', 'ACTIVE'),
(3, 'Gamma LLC', 'Digital transformation consultancy', 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  status = EXCLUDED.status;

-- Create menu_item table
CREATE TABLE IF NOT EXISTS menu_item (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    path VARCHAR(255) NOT NULL,
    icon VARCHAR(50),
    description VARCHAR(255),
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    parent_id BIGINT REFERENCES menu_item(id) ON DELETE SET NULL,
    category VARCHAR(50)
);

INSERT INTO "user" (
  id, full_name, first_name, last_name, email, username, password, 
  approved, active, organization_id, created_at, email_verified, 
  job_title, department, role
) VALUES
  (1, 'Alice Johnson', 'Alice', 'Johnson', 'alice@acme.com', 'alice', 'password123', true, true, 1, NOW(), true, 'CTO', 'Technology', 'ADMIN'),
  (2, 'Bob Smith', 'Bob', 'Smith', 'bob@beta.com', 'bob', 'password123', true, true, 2, NOW(), true, 'Lead Developer', 'Engineering', 'DEVELOPER'),
  (3, 'Charlie Brown', 'Charlie', 'Brown', 'charlie@gamma.com', 'charlie', 'password123', true, true, 3, NOW(), true, 'Support Manager', 'Customer Support', 'USER'),
  (16, 'ZioHelp Admin', 'Admin', 'User', 'admin@ziohelp.com', 'adminuser', 'admin123', true, true, 1, NOW(), true, 'System Administrator', 'IT', 'ADMIN'),
  (17, 'Developer Admin', 'Developer', 'Admin', 'developer@ziohelp.com', 'devadmin', 'dev123', true, true, 1, NOW(), true, 'Senior Developer', 'Development', 'DEVELOPER')
ON CONFLICT (id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  username = EXCLUDED.username,
  job_title = EXCLUDED.job_title,
  department = EXCLUDED.department,
  role = EXCLUDED.role;

-- User Roles
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1), -- Alice is ADMIN
(2, 2), -- Bob is DEVELOPER  
(3, 3), -- Charlie is USER
(16, 1), -- ZioHelp Admin is ADMIN
(17, 2)  -- Developer Admin is DEVELOPER
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Sample Products
INSERT INTO product (id, name, domain, logo_url, theme_color, description, version, status, category, is_active) VALUES
(1, 'Machine Inventory System', 'inventory.acme.com', '/assets/inventory-logo.png', '#2563eb', 'Complete machine and equipment inventory management system', '2.1.0', 'ACTIVE', 'Enterprise Software', true),
(2, 'Customer Support Portal', 'support.beta.com', '/assets/support-logo.png', '#059669', 'Advanced customer support and ticketing system', '1.8.5', 'ACTIVE', 'Support Tools', true),
(3, 'Digital Asset Manager', 'assets.gamma.com', '/assets/dam-logo.png', '#7c3aed', 'Digital asset management and workflow system', '3.0.2', 'ACTIVE', 'Content Management', true),
(4, 'ERP Finance Module', 'finance.acme.com', '/assets/finance-logo.png', '#dc2626', 'Enterprise resource planning finance module', '4.1.1', 'ACTIVE', 'Finance', true),
(5, 'HR Management System', 'hr.beta.com', '/assets/hr-logo.png', '#ea580c', 'Human resources management and payroll system', '2.3.0', 'ACTIVE', 'Human Resources', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  domain = EXCLUDED.domain,
  description = EXCLUDED.description,
  version = EXCLUDED.version,
  status = EXCLUDED.status;

-- Sample FAQs for Machine Inventory System
INSERT INTO faq (id, question, answer, category, author, is_published, organization_id, product_id) VALUES
(1, 'How do I add a new machine to the inventory?', 'To add a new machine: 1) Navigate to Inventory > Add Machine, 2) Fill in the machine details including serial number, model, and location, 3) Upload any relevant documents, 4) Click Save to add the machine to your inventory.', 'Getting Started', 'admin@ziohelp.com', true, 1, 1),
(2, 'How can I track machine maintenance schedules?', 'Use the Maintenance tab in the machine details. You can set recurring maintenance schedules, track service history, and receive notifications when maintenance is due.', 'Maintenance', 'admin@ziohelp.com', true, 1, 1),
(3, 'Can I export inventory reports?', 'Yes, go to Reports > Inventory Reports and select your desired format (PDF, Excel, CSV). You can filter by location, category, or date range.', 'Reports', 'admin@ziohelp.com', true, 1, 1),
(4, 'How do I set up location-based inventory tracking?', 'Navigate to Settings > Locations to add and configure your warehouse or facility locations. Then assign machines to specific locations during the add/edit process.', 'Configuration', 'admin@ziohelp.com', true, 1, 1),

-- Sample FAQs for Customer Support Portal
(5, 'How do I escalate a support ticket?', 'Click on the ticket and select "Escalate" from the Actions menu. Choose the escalation level and add any relevant notes for the senior support team.', 'Ticket Management', 'admin@ziohelp.com', true, 2, 2),
(6, 'Can customers track their ticket status?', 'Yes, customers receive a unique ticket ID and can use the self-service portal to track real-time updates on their support requests.', 'Customer Experience', 'admin@ziohelp.com', true, 2, 2),
(7, 'How do I set up automated responses?', 'Go to Settings > Automation and create response templates. You can trigger them based on ticket categories, keywords, or customer tiers.', 'Automation', 'admin@ziohelp.com', true, 2, 2),

-- Sample FAQs for Digital Asset Manager
(8, 'What file formats are supported?', 'We support images (JPG, PNG, GIF, SVG), videos (MP4, AVI, MOV), documents (PDF, DOC, XLS), and audio files (MP3, WAV, AAC).', 'File Management', 'admin@ziohelp.com', true, 3, 3),
(9, 'How do I organize assets with tags and categories?', 'Use the tagging system to add descriptive keywords to your assets. Create custom categories in Settings > Asset Categories for better organization.', 'Organization', 'admin@ziohelp.com', true, 3, 3),
(10, 'Can I set permissions for different user groups?', 'Yes, use the Access Control feature to define what different user roles can view, download, edit, or share within your asset library.', 'Security', 'admin@ziohelp.com', true, 3, 3)
ON CONFLICT (id) DO NOTHING;

-- Sample Knowledge Base Articles for Machine Inventory System
INSERT INTO knowledge_base_article (id, title, content, category, author, is_published, product_id) VALUES
(1, 'Machine Inventory Setup Guide', '# Getting Started with Machine Inventory System\n\n## Initial Setup\n\n1. **Configure Your Organization Profile**\n   - Add company details and locations\n   - Set up user roles and permissions\n   - Configure notification preferences\n\n2. **Import Existing Inventory**\n   - Use the bulk import feature with CSV templates\n   - Map your existing data fields\n   - Validate and review before final import\n\n3. **Setup Machine Categories**\n   - Create custom machine types\n   - Define required fields for each category\n   - Set up depreciation rules\n\n## Best Practices\n\n- Always include serial numbers for unique identification\n- Use consistent naming conventions\n- Regularly update maintenance records\n- Set up automated alerts for critical machines', 'Getting Started', 'admin@ziohelp.com', true, 1),

(2, 'Advanced Maintenance Scheduling', '# Maintenance Scheduling Features\n\n## Preventive Maintenance\n\n### Setting Up Recurring Schedules\n- Navigate to Machine Details > Maintenance Tab\n- Click "Add Maintenance Schedule"\n- Select frequency: Daily, Weekly, Monthly, or Custom\n- Set reminders and assign technicians\n\n### Maintenance Types\n- **Routine Inspection**: Regular visual and functional checks\n- **Preventive Maintenance**: Scheduled service based on time/usage\n- **Corrective Maintenance**: Repairs and issue resolution\n- **Predictive Maintenance**: Data-driven maintenance predictions\n\n### Integration with Work Orders\n- Automatically generate work orders from maintenance schedules\n- Track parts usage and costs\n- Monitor technician performance\n- Generate maintenance reports\n\n## Troubleshooting Common Issues\n\n**Q: Maintenance alerts not showing?**\nA: Check notification settings and ensure email/SMS preferences are configured.\n\n**Q: Cannot assign technician to maintenance task?**\nA: Verify user has appropriate role permissions in Settings > User Management.', 'Maintenance', 'admin@ziohelp.com', true, 1),

(3, 'Customer Support Best Practices', '# Customer Support Excellence Guide\n\n## Ticket Management Workflow\n\n### 1. Initial Response\n- Acknowledge receipt within 2 hours\n- Categorize and prioritize based on urgency\n- Assign to appropriate team member\n\n### 2. Investigation Process\n- Gather all relevant information\n- Reproduce the issue if possible\n- Document findings in ticket notes\n\n### 3. Resolution and Follow-up\n- Provide clear solution steps\n- Verify customer satisfaction\n- Close ticket with summary\n\n## Communication Guidelines\n\n### Professional Language\n- Use clear, jargon-free explanations\n- Be empathetic and understanding\n- Maintain positive tone throughout\n\n### Response Templates\n- Acknowledgment responses\n- Status update notifications\n- Resolution confirmations\n- Follow-up check-ins\n\n## Performance Metrics\n\n- **First Response Time**: Target <2 hours\n- **Resolution Time**: Category-based SLAs\n- **Customer Satisfaction**: >95% positive feedback\n- **Ticket Volume**: Track trends and patterns', 'Best Practices', 'admin@ziohelp.com', true, 2),

(4, 'Digital Asset Organization Guide', '# Organizing Your Digital Assets\n\n## Folder Structure Best Practices\n\n### Hierarchical Organization\n```\nCompany Assets/\n├── Brand Materials/\n│   ├── Logos/\n│   ├── Style Guides/\n│   └── Templates/\n├── Marketing Content/\n│   ├── Social Media/\n│   ├── Print Materials/\n│   └── Web Graphics/\n└── Product Images/\n    ├── Product Photos/\n    ├── Technical Diagrams/\n    └── User Manuals/\n```\n\n## Metadata and Tagging\n\n### Essential Metadata Fields\n- **Creation Date**: When asset was created\n- **Creator**: Who created the asset\n- **Usage Rights**: Copyright and licensing info\n- **File Version**: Track revisions and updates\n- **Project Association**: Link to specific campaigns\n\n### Effective Tagging Strategy\n- Use consistent tag naming conventions\n- Include both descriptive and functional tags\n- Add seasonal or time-based tags\n- Use color and style descriptors\n\n## Search and Discovery\n\n### Advanced Search Features\n- Filter by file type, size, and date\n- Search within file content (PDF, DOC)\n- Use boolean operators (AND, OR, NOT)\n- Save frequent searches as smart collections\n\n### Asset Collections\n- Create themed collections for projects\n- Share collections with team members\n- Set permissions for viewing and editing\n- Export collections for external use', 'Organization', 'admin@ziohelp.com', true, 3)
ON CONFLICT (id) DO NOTHING;

-- Sample Tickets for different products
INSERT INTO ticket (id, title, description, status, priority, created_by, is_guest, category, organization_id, product_id, assigned_to_id) VALUES
(1, 'Machine ABC-123 not appearing in inventory search', 'The machine with serial number ABC-123 is not showing up in search results even though it was added last week. Need urgent resolution as this affects our audit preparation.', 'OPEN', 'HIGH', 'alice@acme.com', false, 'Technical Issue', 1, 1, 2),
(2, 'Cannot generate maintenance report for Q4', 'Getting error message when trying to generate quarterly maintenance report. Error says "Data source not found". This is blocking our management review meeting.', 'IN_PROGRESS', 'MEDIUM', 'bob@beta.com', false, 'Bug Report', 2, 1, 17),
(3, 'Need help setting up automated ticket routing', 'Want to configure automatic assignment of tickets based on product category. Looking for step-by-step guidance on setting up routing rules.', 'OPEN', 'LOW', 'charlie@gamma.com', false, 'Feature Request', 3, 2, 1),
(4, 'Asset upload failing for large video files', 'Cannot upload video files larger than 100MB. Getting timeout errors. Need to upload training videos for our product launch.', 'RESOLVED', 'MEDIUM', 'alice@acme.com', false, 'Technical Issue', 1, 3, 2),
(5, 'Guest user reporting slow page load times', 'Guest customer reported that the support portal is loading very slowly, especially the knowledge base search feature.', 'OPEN', 'LOW', 'support@company.com', true, 'Performance', 2, 2, 17)
ON CONFLICT (id) DO NOTHING;

-- Menu Items
INSERT INTO menu_item (id, name, path, icon, description, sort_order, is_active, parent_id, category) VALUES
  (1, 'Dashboard', '/admin/dashboard', 'dashboard', 'Admin dashboard', 1, true, NULL, 'ADMIN'),
  (2, 'Users', '/admin/users', 'users', 'Manage users', 2, true, NULL, 'ADMIN'),
  (3, 'Menu Management', '/admin/menu', 'menu', 'Manage menu items', 3, true, NULL, 'ADMIN'),
  (4, 'Tickets', '/admin/tickets', 'ticket', 'View all tickets', 4, true, NULL, 'ADMIN'),
  (5, 'Settings', '/admin/settings', 'settings', 'System settings', 5, true, NULL, 'ADMIN'),
  (6, 'Profile', '/profile', 'person', 'User profile', 1, true, NULL, 'USER'),
  (7, 'My Tickets', '/user/tickets', 'ticket', 'My support tickets', 2, true, NULL, 'USER'),
  (8, 'Raise Ticket', '/user/raise-ticket', 'add', 'Create new ticket', 3, true, NULL, 'USER'),
  (9, 'Help Center', '/help-center', 'help', 'Help and FAQs', 4, true, NULL, 'USER'),
  (10, 'Admin Analytics', '/admin/analytics', 'analytics', 'Analytics dashboard', 6, true, NULL, 'ADMIN')
ON CONFLICT (id) DO NOTHING;

-- Assign menu roles (if you have a menu_role or role_menu_permission table, add here)
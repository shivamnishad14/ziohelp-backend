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
    organization_id BIGINT REFERENCES organizations(id)
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

CREATE TABLE IF NOT EXISTS faq (
    id BIGSERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    organization_id BIGINT REFERENCES organizations(id),
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

-- Insert users
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
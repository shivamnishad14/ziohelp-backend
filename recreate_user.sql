DROP SEQUENCE IF EXISTS user_id_seq;
CREATE SEQUENCE user_id_seq START 1000;
DROP TABLE IF EXISTS "user" CASCADE;
CREATE TABLE "user" (
    id bigint PRIMARY KEY DEFAULT nextval('user_id_seq'::regclass),
    full_name varchar(255),
    email varchar(255),
    password varchar(255),
    approved boolean NOT NULL,
    active boolean NOT NULL,
    organization_id bigint REFERENCES organization(id),
    created_at timestamp(6) without time zone,
    email_verified boolean NOT NULL,
    verification_token varchar(255),
    reset_token varchar(255),
    username varchar(255) UNIQUE
);
INSERT INTO "user" (
    id, full_name, email, password,
    approved, active, organization_id,
    created_at, email_verified,
    verification_token, reset_token, username
) VALUES (
    999, 'Test User', 'test@example.com',
    '$2a$10$6c3QxNucuBiGJB5nkNBBluImVThn02DwWVn/xIZBc83t9JbHqNFZm',
    true, true, 999,
    NOW(), true,
    null, null, 'testuser'
);

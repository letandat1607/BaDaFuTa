-- User Service E2E Seed Data
-- Schema: user_e2e

SET search_path TO user_e2e;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    password VARCHAR(255),
    role VARCHAR(20),
    image VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Xóa dữ liệu cũ nếu có
TRUNCATE TABLE users CASCADE;

-- Insert test users
INSERT INTO users (id, user_name, full_name, email, phone_number, password, role, created_at, updated_at) VALUES
('b008de0d-5ea3-4a7a-af75-8ee64e4c9fd1', 'merchant1', 'Le Tan Dat', 'merchant1@example.com', '0123456789', '$2b$10$8Hs4kbkrb1Q33afdq.Q88Op5mLf3MFmIqxIdB3bQULjKdxZACGTGe', 'merchant', NOW(), NOW()),
('5324c950-d209-44b7-9e1b-2c3d859a17af', 'user1', 'Nguyen Van A', 'user1@example.com', '0909778123', '$2b$10$bHjh/TvXxDiNsFy7.3kchOxUwX0K//FH/y2KZ8NhzpIkq.c5917Y.', 'customer', NOW(), NOW()),
('e67f2863-5f03-4dff-b247-478b140ab6c4', 'user2', 'Tran Van A', 'user2@example.com', '0905677123', '$2b$10$NVFS0V9VjGeRbCFq9u4iy.tWgmjqR6L/VHY/Fw1uVN64G8c18RYBS', 'customer', NOW(), NOW());

CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(50),
    geometry JSONB,
    full_address VARCHAR(255)
);

TRUNCATE TABLE addresses CASCADE;

INSERT INTO addresses (id, user_id, label, full_address) VALUES
('d622044d-7259-4a95-9a9f-930935073821', '5324c950-d209-44b7-9e1b-2c3d859a17af', 'home', '123 Nguyen Sy Sach'),
('90408ebb-8c11-4bdf-a008-8ad2fcbc3683', '5324c950-d209-44b7-9e1b-2c3d859a17af', 'Công ty', '1 An Duong Vuong');
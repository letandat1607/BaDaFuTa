-- Drone Service E2E Seed Data
-- Schema: drone_e2e

-- SET search_path TO drone_e2e;

CREATE TABLE IF NOT EXISTS drone (
    id UUID PRIMARY KEY,
    merchant_id UUID NOT NULL,
    order_id UUID,
    drone_name VARCHAR(100) NOT NULL,
    current_location JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'OFFLINE',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

TRUNCATE TABLE drone CASCADE;

INSERT INTO drone (id, merchant_id, drone_name, current_location, status, order_id) VALUES
('2a75a2a8-e0b1-4acd-8423-b6e811ade5e0', 'fb325480-5b1c-4c3b-a044-2fcac7ebce02', 'Drone 1', '{"lat": 21.0285, "lng": 105.8542}', 'READY', NULL),
('360127a3-23a5-49c5-82e7-1fb6f2996e34', 'fb325480-5b1c-4c3b-a044-2fcac7ebce02', 'Drone 2', '{"lat": 21.0456, "lng": 105.7987}', 'READY', NULL);
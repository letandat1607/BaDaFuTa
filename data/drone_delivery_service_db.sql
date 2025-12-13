-- 1. Tạo bảng drone (nếu chưa có)
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

-- 2. Insert dữ liệu 25 drone
INSERT INTO drone (
    id, merchant_id, drone_name, current_location, status, created_at, updated_at, order_id
) VALUES
('2a75a2a8-e0b1-4acd-8423-b6e811ade5e0', 'fb325480-5b1c-4c3b-a044-2fcac7ebce02', 'Drone 1', '{"lat": 21.0285, "lng": 105.8542}', 'READY', '2025-11-19 00:24:37.698638+07', '2025-11-19 00:24:37.698638+07', NULL),
('360127a3-23a5-49c5-82e7-1fb6f2996e34', 'fb325480-5b1c-4c3b-a044-2fcac7ebce02', 'Drone 5', '{"lat": 21.0456, "lng": 105.7987}', 'READY', '2025-11-19 00:24:37.698638+07', '2025-11-20 21:00:39.006+07', NULL),
('8c1c2a33-7c86-463c-a757-baac0d5e1376', 'fb325480-5b1c-4c3b-a044-2fcac7ebce02', 'Drone 4', '{"lat": 21.0078, "lng": 105.8123}', 'READY', '2025-11-19 00:24:37.698638+07', '2025-11-20 21:08:30.554+07', NULL),
('3c142959-d779-463c-a992-6cc0da1256bc', 'fb325480-5b1c-4c3b-a044-2fcac7ebce02', 'Drone 3', '{"lat": 21.0350, "lng": 105.8200}', 'READY', '2025-11-19 00:24:37.698638+07', '2025-11-20 20:50:56.077+07', NULL),
('14a54fab-10e9-42e6-98cc-7bb7dff31abf', 'fb325480-5b1c-4c3b-a044-2fcac7ebce02', 'Drone 2', '{"lat": 21.0123, "lng": 105.7891}', 'READY', '2025-11-19 00:24:37.698638+07', '2025-11-20 20:57:28.928+07', NULL);
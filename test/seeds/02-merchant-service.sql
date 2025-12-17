-- Merchant Service E2E Seed Data
-- Schema: merchant_e2e

-- SET search_path TO merchant_e2e;

CREATE TABLE IF NOT EXISTS merchant (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    merchant_name VARCHAR(100) NOT NULL,
    location JSONB NOT NULL,
    phone VARCHAR(20),
    email VARCHAR NOT NULL UNIQUE,
    profile_image VARCHAR NOT NULL,
    cover_image VARCHAR,
    cuisin VARCHAR,
    time_open JSONB
);

TRUNCATE TABLE merchant CASCADE;

INSERT INTO merchant (id, user_id, merchant_name, location, phone, email, profile_image, cover_image, time_open) VALUES
('fb325480-5b1c-4c3b-a044-2fcac7ebce02', 'b008de0d-5ea3-4a7a-af75-8ee64e4c9fd1', 'McDonald''s Nguyễn Huệ',
'{"lat": 10.7749, "lng": 106.7049, "address": "2 Nguyễn Huệ, Quận 1, TP.HCM"}',
'028-3829-1234', 'contact@mcdonalds.vn',
'{"url": "https://images.unsplash.com/photo-1600891964599-f61ba0e24092"}',
'{"url": "https://images.unsplash.com/photo-1571091718767-18b5b1457add"}',
'{"monday":{"open":"08:00","close":"22:00"},"tuesday":{"open":"08:00","close":"22:00"}}');

-- Category
CREATE TABLE IF NOT EXISTS category (
    id UUID PRIMARY KEY,
    merchant_id UUID NOT NULL REFERENCES merchant(id) ON DELETE CASCADE,
    category_name VARCHAR(100) NOT NULL
);

TRUNCATE TABLE category CASCADE;

INSERT INTO category (id, merchant_id, category_name) VALUES
('21990a15-73a6-4391-9f3d-47a204006823', 'fb325480-5b1c-4c3b-a044-2fcac7ebce02', 'Pizza'),
('fcbdad39-5d4f-4af4-b99c-378c5ae49972', 'fb325480-5b1c-4c3b-a044-2fcac7ebce02', 'Đồ Uống');

-- Menu Items
CREATE TABLE IF NOT EXISTS menu_item (
    id UUID PRIMARY KEY,
    merchant_id UUID NOT NULL REFERENCES merchant(id) ON DELETE CASCADE,
    category_id UUID REFERENCES category(id) ON DELETE SET NULL,
    name_item VARCHAR(100) NOT NULL,
    price BIGINT NOT NULL CHECK (price >= 0),
    likes BIGINT DEFAULT 0,
    sold_count BIGINT DEFAULT 0,
    description TEXT,
    image_item JSONB,
    status BOOLEAN DEFAULT FALSE
);

TRUNCATE TABLE menu_item CASCADE;

INSERT INTO menu_item (id, merchant_id, category_id, name_item, price, description, image_item, status) VALUES
('6434ea82-1629-4178-8d67-a0ac8e9039e9', 'fb325480-5b1c-4c3b-a044-2fcac7ebce02', '21990a15-73a6-4391-9f3d-47a204006823', 
'Pizza hải sản', 140000, 'Tôm, mực, nấm đùi gà',
'{"url": "https://bazantravel.com/cdn/medias/uploads/28/28073-pizza-hai-san-uc.jpg"}', true),
('31d17dbf-5ba4-4c82-b3a8-e3ef1eb8c467', 'fb325480-5b1c-4c3b-a044-2fcac7ebce02', 'fcbdad39-5d4f-4af4-b99c-378c5ae49972',
'Coca', 15000, 'Coca',
'{"url": "https://tse3.mm.bing.net/th/id/OIP.VpiWGSk9L3nVa-0kwcOU9wHaE8"}', true);

-- Options
CREATE TABLE IF NOT EXISTS option (
    id UUID PRIMARY KEY,
    merchant_id UUID NOT NULL REFERENCES merchant(id) ON DELETE CASCADE,
    option_name VARCHAR(100) NOT NULL,
    multi_select BOOLEAN DEFAULT FALSE,
    require_select BOOLEAN DEFAULT FALSE,
    number_select BIGINT DEFAULT 0 CHECK (number_select >= 0)
);

TRUNCATE TABLE option CASCADE;

INSERT INTO option (id, merchant_id, option_name, multi_select, require_select, number_select) VALUES
('63c98bf6-5593-4200-b1b4-d342ce3f1ce5', 'fb325480-5b1c-4c3b-a044-2fcac7ebce02', 'Size', false, true, 1);

-- Option Items
CREATE TABLE IF NOT EXISTS option_item (
    id UUID PRIMARY KEY,
    option_id UUID NOT NULL REFERENCES option(id) ON DELETE CASCADE,
    option_item_name VARCHAR(100) NOT NULL,
    price BIGINT NOT NULL CHECK (price >= 0),
    status BOOLEAN DEFAULT FALSE,
    status_select BOOLEAN DEFAULT FALSE
);

TRUNCATE TABLE option_item CASCADE;

INSERT INTO option_item (id, option_id, option_item_name, price, status_select, status) VALUES
('1fc0a01a-1be1-45e6-a11d-489c21c8b54e', '63c98bf6-5593-4200-b1b4-d342ce3f1ce5', 'S', 0, false, true),
('fcef3d18-4aec-4623-8ace-5a6c7ddf82ef', '63c98bf6-5593-4200-b1b4-d342ce3f1ce5', 'L', 50000, false, true);

-- Menu Item Options junction
CREATE TABLE IF NOT EXISTS menu_item_option (
    menu_item_id UUID NOT NULL REFERENCES menu_item(id) ON DELETE CASCADE,
    option_id UUID NOT NULL REFERENCES option(id) ON DELETE CASCADE,
    PRIMARY KEY (menu_item_id, option_id)
);

TRUNCATE TABLE menu_item_option CASCADE;

INSERT INTO menu_item_option (menu_item_id, option_id) VALUES
('6434ea82-1629-4178-8d67-a0ac8e9039e9', '63c98bf6-5593-4200-b1b4-d342ce3f1ce5');
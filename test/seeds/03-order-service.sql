-- Order Service E2E Seed Data
-- Schema: order_e2e

SET search_path TO order_e2e;

CREATE TABLE IF NOT EXISTS "order" (
    id UUID PRIMARY KEY,
    merchant_id UUID NOT NULL,
    user_id UUID NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    note TEXT,
    phone VARCHAR(20) NOT NULL,
    delivery_address JSONB NOT NULL,
    delivery_fee BIGINT NOT NULL CHECK (delivery_fee >= 0),
    total_amount BIGINT NOT NULL CHECK (total_amount >= 0),
    status VARCHAR NOT NULL,
    status_payment VARCHAR NOT NULL,
    method VARCHAR NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS order_item (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES "order"(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL,
    note TEXT,
    quantity BIGINT NOT NULL CHECK (quantity > 0),
    price BIGINT NOT NULL CHECK (price >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS order_item_option (
    order_item_id UUID NOT NULL REFERENCES order_item(id) ON DELETE CASCADE,
    option_item_id UUID NOT NULL,
    PRIMARY KEY (order_item_id, option_item_id) 
);

-- Tables are empty for E2E - orders will be created during tests
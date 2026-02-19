-- Create orders table for Furnit e-commerce
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Customer Information
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    
    -- Delivery Information
    delivery_address TEXT NOT NULL,
    delivery_city TEXT NOT NULL,
    delivery_district TEXT NOT NULL,
    delivery_sector TEXT NOT NULL,
    delivery_date DATE NOT NULL,
    delivery_time TEXT NOT NULL CHECK (delivery_time IN ('morning', 'afternoon', 'evening')),
    special_instructions TEXT,
    
    -- Payment Information
    payment_method TEXT NOT NULL CHECK (payment_method IN ('momo', 'bank')),
    payment_details TEXT NOT NULL,
    
    -- Order Details
    order_notes TEXT,
    subtotal DECIMAL(10, 2) NOT NULL,
    delivery_fee DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    
    -- Order Status
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    
    -- Order Items (stored as JSONB)
    items JSONB NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own orders
CREATE POLICY "Users can view own orders"
    ON orders
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own orders
CREATE POLICY "Users can create own orders"
    ON orders
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own pending orders
CREATE POLICY "Users can update own pending orders"
    ON orders
    FOR UPDATE
    USING (auth.uid() = user_id AND status = 'pending')
    WITH CHECK (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before update
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create a view for order summaries
CREATE OR REPLACE VIEW order_summaries AS
SELECT 
    id,
    user_id,
    customer_name,
    customer_email,
    delivery_date,
    total,
    status,
    jsonb_array_length(items) as item_count,
    created_at
FROM orders
ORDER BY created_at DESC;

COMMENT ON TABLE orders IS 'Stores customer orders with delivery and payment information';
COMMENT ON COLUMN orders.items IS 'JSONB array of order items with product details';
COMMENT ON COLUMN orders.delivery_time IS 'Preferred delivery time slot: morning, afternoon, or evening';
COMMENT ON COLUMN orders.payment_method IS 'Payment method: momo (Mobile Money) or bank (Bank Transfer)';

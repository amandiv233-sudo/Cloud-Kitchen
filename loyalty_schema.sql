-- Supabase Migration / Schema for Loyalty System

-- 1. Create the Loyalty Tracker Table
CREATE TABLE IF NOT EXISTS public.loyalty_tracker (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_stamps INT DEFAULT 0,
    consecutive_streak INT DEFAULT 0,
    last_order_date DATE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS for loyalty_tracker
ALTER TABLE public.loyalty_tracker ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own loyalty data" ON public.loyalty_tracker FOR SELECT USING (auth.uid() = user_id);
-- Normally insert/update are trusted server-side, but for ease here we allow authenticated users to update their own (or let backend RPC handle it safely)
CREATE POLICY "Users can insert their own tracker" ON public.loyalty_tracker FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tracker" ON public.loyalty_tracker FOR UPDATE USING (auth.uid() = user_id);

-- 2. Create the Discount Codes table for Rewards
CREATE TABLE IF NOT EXISTS public.discount_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percentage INT NOT NULL,  -- e.g., 20 or 50
    is_used BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS for discount_codes
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own discounts" ON public.discount_codes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own discounts" ON public.discount_codes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own discounts" ON public.discount_codes FOR INSERT WITH CHECK (auth.uid() = user_id);

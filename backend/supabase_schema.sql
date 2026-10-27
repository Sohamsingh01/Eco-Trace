-- ============================================================================
-- ECOTRACE: SMART HOUSEHOLD CARBON FOOTPRINT TRACKER
-- PRODUCTION SUPABASE POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Extends Supabase auth.users or standalone authentication)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    avatar_url TEXT,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    eco_credits INTEGER DEFAULT 150,
    eco_score NUMERIC(5, 2) DEFAULT 75.0,
    current_streak INTEGER DEFAULT 1,
    longest_streak INTEGER DEFAULT 1,
    last_active_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. HOUSEHOLDS
CREATE TABLE IF NOT EXISTS households (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    home_type VARCHAR(50) DEFAULT '2BHK',
    area_sqft NUMERIC(8, 2) DEFAULT 1000.0,
    city_state VARCHAR(200) DEFAULT 'Bangalore, Karnataka',
    household_members INTEGER DEFAULT 3 CHECK (household_members >= 1),
    avg_hours_at_home NUMERIC(4, 2) DEFAULT 14.0 CHECK (avg_hours_at_home BETWEEN 1 AND 24),
    daily_co2_target_kg NUMERIC(6, 2) DEFAULT 12.5 CHECK (daily_co2_target_kg > 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. APPLIANCES CATALOG
CREATE TABLE IF NOT EXISTS appliances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    default_power_watts NUMERIC(8, 2) DEFAULT 100.0,
    fuel_type VARCHAR(20) DEFAULT 'electric', -- 'electric' or 'gas'
    icon_name VARCHAR(50) DEFAULT 'Zap',
    is_custom BOOLEAN DEFAULT FALSE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    typical_daily_hours NUMERIC(4, 2) DEFAULT 2.0,
    energy_saving_tip TEXT
);

-- 4. HOUSEHOLD APPLIANCES (M:N Inventory)
CREATE TABLE IF NOT EXISTS household_appliances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    household_id UUID REFERENCES households(id) ON DELETE CASCADE NOT NULL,
    appliance_id UUID REFERENCES appliances(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER DEFAULT 1 CHECK (quantity >= 1),
    power_watts NUMERIC(8, 2) NOT NULL
);

-- 5. ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    appliance_id UUID REFERENCES appliances(id) ON DELETE SET NULL,
    appliance_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    fuel_type VARCHAR(20) DEFAULT 'electric',
    quantity INTEGER DEFAULT 1 CHECK (quantity >= 1),
    power_watts NUMERIC(8, 2) NOT NULL,
    duration_minutes NUMERIC(8, 2) NOT NULL CHECK (duration_minutes > 0),
    usage_mode VARCHAR(50) DEFAULT 'Medium',
    activity_date DATE DEFAULT CURRENT_DATE NOT NULL,
    logged_at TIMESTAMPTZ DEFAULT NOW(),
    energy_kwh NUMERIC(8, 3) NOT NULL DEFAULT 0.0,
    co2_kg NUMERIC(8, 3) NOT NULL DEFAULT 0.0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. DAILY CARBON BUDGETS
CREATE TABLE IF NOT EXISTS daily_carbon_budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    target_co2_kg NUMERIC(6, 2) NOT NULL DEFAULT 12.5,
    actual_co2_kg NUMERIC(8, 3) NOT NULL DEFAULT 0.0,
    total_energy_kwh NUMERIC(8, 3) NOT NULL DEFAULT 0.0,
    activity_count INTEGER NOT NULL DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    credits_awarded BOOLEAN DEFAULT FALSE,
    CONSTRAINT unique_user_daily_budget UNIQUE(user_id, date)
);

-- 7. CREDIT TRANSACTIONS (Audited Virtual Currency Ledger)
CREATE TABLE IF NOT EXISTS credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    amount INTEGER NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. REWARDS MARKETPLACE
CREATE TABLE IF NOT EXISTS rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    merchant VARCHAR(100) NOT NULL,
    category VARCHAR(50) DEFAULT 'Voucher',
    discount_text VARCHAR(100) NOT NULL,
    required_credits INTEGER NOT NULL CHECK (required_credits > 0),
    badge_color VARCHAR(50) DEFAULT 'emerald',
    icon_name VARCHAR(50) DEFAULT 'Gift',
    terms TEXT NOT NULL,
    sample_code_prefix VARCHAR(20) DEFAULT 'ECO',
    is_active BOOLEAN DEFAULT TRUE
);

-- 9. REDEMPTIONS & SCRATCH CARDS
CREATE TABLE IF NOT EXISTS redemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    reward_id UUID REFERENCES rewards(id) ON DELETE CASCADE NOT NULL,
    credits_spent INTEGER NOT NULL,
    voucher_code VARCHAR(100) NOT NULL,
    redeemed_at TIMESTAMPTZ DEFAULT NOW(),
    is_revealed BOOLEAN DEFAULT FALSE,
    revealed_at TIMESTAMPTZ
);

-- 10. ACHIEVEMENTS & BADGES
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    icon_name VARCHAR(50) DEFAULT 'Award',
    category VARCHAR(50) DEFAULT 'Streak',
    required_value INTEGER DEFAULT 1,
    credit_reward INTEGER DEFAULT 50
);

-- 11. USER ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    progress NUMERIC(5, 2) DEFAULT 100.0,
    CONSTRAINT unique_user_achievement UNIQUE(user_id, achievement_id)
);

-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_date ON activity_logs(user_id, activity_date);
CREATE INDEX IF NOT EXISTS idx_daily_budgets_user_date ON daily_carbon_budgets(user_id, date);
CREATE INDEX IF NOT EXISTS idx_credit_tx_user ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_eco_score ON profiles(eco_score DESC);
CREATE INDEX IF NOT EXISTS idx_appliances_custom ON appliances(user_id) WHERE is_custom = TRUE;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_carbon_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE appliances ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

-- 1. Profiles: Users can view safe public info for leaderboard, and modify only their own profile
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- 2. Households: Strict private access
CREATE POLICY "Users can view own household" ON households
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert/update own household" ON households
    FOR ALL USING (auth.uid() = user_id);

-- 3. Activity Logs: Strict private access
CREATE POLICY "Users can view own activity logs" ON activity_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity logs" ON activity_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update/delete own activity logs" ON activity_logs
    FOR ALL USING (auth.uid() = user_id);

-- 4. Daily Budgets: Strict private access
CREATE POLICY "Users can view own daily budgets" ON daily_carbon_budgets
    FOR SELECT USING (auth.uid() = user_id);

-- 5. Rewards: Catalog viewable by all authenticated users
CREATE POLICY "Rewards are viewable by all authenticated users" ON rewards
    FOR SELECT USING (is_active = true);

-- 6. Appliances: Standard presets viewable by all; custom viewable by owner
CREATE POLICY "Appliances catalog viewable" ON appliances
    FOR SELECT USING (is_custom = false OR auth.uid() = user_id);

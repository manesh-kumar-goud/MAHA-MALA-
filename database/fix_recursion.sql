-- =====================================================
-- FIX INFINITE RECURSION IN RLS POLICIES
-- =====================================================

-- =====================================================
-- USERS TABLE - Remove recursive policies
-- =====================================================
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;

-- Simple policy: Users can manage their own profile
CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- IMPORTANT: For admin policies, we'll check role AFTER selecting
-- Admin access will be handled at the application level, not RLS
-- This prevents infinite recursion

-- =====================================================
-- LEADS TABLE - Simplified policies
-- =====================================================
DROP POLICY IF EXISTS "Users can view their own leads" ON leads;
DROP POLICY IF EXISTS "Users can insert their own leads" ON leads;
DROP POLICY IF EXISTS "Admins can view all leads" ON leads;
DROP POLICY IF EXISTS "Admins can manage all leads" ON leads;

CREATE POLICY "Users can view their own leads" ON leads
  FOR SELECT USING (referrer_id = auth.uid());

CREATE POLICY "Users can insert their own leads" ON leads
  FOR INSERT WITH CHECK (referrer_id = auth.uid());

CREATE POLICY "Users can update their own leads" ON leads
  FOR UPDATE USING (referrer_id = auth.uid());

-- =====================================================
-- BANK DETAILS - Simplified
-- =====================================================
DROP POLICY IF EXISTS "Users can manage their own bank details" ON bank_details;
DROP POLICY IF EXISTS "Admins can view all bank details" ON bank_details;

CREATE POLICY "Users can manage their own bank details" ON bank_details
  FOR ALL USING (user_id = auth.uid());

-- =====================================================
-- WITHDRAWALS - Simplified
-- =====================================================
DROP POLICY IF EXISTS "Users can view their own withdrawals" ON withdrawals;
DROP POLICY IF EXISTS "Users can create withdrawals" ON withdrawals;
DROP POLICY IF EXISTS "Admins can manage withdrawals" ON withdrawals;

CREATE POLICY "Users can view their own withdrawals" ON withdrawals
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create withdrawals" ON withdrawals
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own withdrawals" ON withdrawals
  FOR UPDATE USING (user_id = auth.uid());

-- =====================================================
-- REWARDS HISTORY - Simplified
-- =====================================================
DROP POLICY IF EXISTS "Users can view their own rewards" ON rewards_history;
DROP POLICY IF EXISTS "Admins can manage rewards" ON rewards_history;

CREATE POLICY "Users can view their own rewards" ON rewards_history
  FOR SELECT USING (user_id = auth.uid());

-- =====================================================
-- NOTIFICATIONS - Simplified
-- =====================================================
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON notifications;

CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- =====================================================
-- CONTACT INQUIRIES
-- =====================================================
DROP POLICY IF EXISTS "Anyone can submit contact inquiry" ON contact_inquiries;

CREATE POLICY "Anyone can submit contact inquiry" ON contact_inquiries
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- COMPLETED!
-- =====================================================
-- Infinite recursion fixed
-- Admin access will be checked in the application code, not RLS


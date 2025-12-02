-- =====================================================
-- FIX ALL RLS POLICIES FOR USER OPERATIONS
-- Run this in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- USERS TABLE POLICIES
-- =====================================================
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "Admins can update all users" ON users
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- =====================================================
-- LEADS TABLE POLICIES
-- =====================================================
DROP POLICY IF EXISTS "Users can view their own leads" ON leads;
DROP POLICY IF EXISTS "Users can insert their own leads" ON leads;
DROP POLICY IF EXISTS "Admins can view all leads" ON leads;
DROP POLICY IF EXISTS "Admins can manage all leads" ON leads;

CREATE POLICY "Users can view their own leads" ON leads
  FOR SELECT USING (referrer_id = auth.uid());

CREATE POLICY "Users can insert their own leads" ON leads
  FOR INSERT WITH CHECK (referrer_id = auth.uid());

CREATE POLICY "Admins can view all leads" ON leads
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "Admins can manage all leads" ON leads
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- =====================================================
-- BANK DETAILS POLICIES
-- =====================================================
DROP POLICY IF EXISTS "Users can manage their own bank details" ON bank_details;
DROP POLICY IF EXISTS "Admins can view all bank details" ON bank_details;

CREATE POLICY "Users can manage their own bank details" ON bank_details
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can view all bank details" ON bank_details
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- =====================================================
-- WITHDRAWALS POLICIES
-- =====================================================
DROP POLICY IF EXISTS "Users can view their own withdrawals" ON withdrawals;
DROP POLICY IF EXISTS "Users can create withdrawals" ON withdrawals;
DROP POLICY IF EXISTS "Admins can manage withdrawals" ON withdrawals;

CREATE POLICY "Users can view their own withdrawals" ON withdrawals
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create withdrawals" ON withdrawals
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage withdrawals" ON withdrawals
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- =====================================================
-- REWARDS HISTORY POLICIES
-- =====================================================
DROP POLICY IF EXISTS "Users can view their own rewards" ON rewards_history;
DROP POLICY IF EXISTS "Admins can manage rewards" ON rewards_history;

CREATE POLICY "Users can view their own rewards" ON rewards_history
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage rewards" ON rewards_history
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- =====================================================
-- NOTIFICATIONS POLICIES
-- =====================================================
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON notifications;

CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- CONTACT INQUIRIES POLICIES
-- =====================================================
DROP POLICY IF EXISTS "Anyone can submit contact inquiry" ON contact_inquiries;
DROP POLICY IF EXISTS "Admins can manage inquiries" ON contact_inquiries;

CREATE POLICY "Anyone can submit contact inquiry" ON contact_inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage inquiries" ON contact_inquiries
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- =====================================================
-- GALLERY POLICIES (Already has public read)
-- =====================================================
DROP POLICY IF EXISTS "Admins can manage gallery" ON gallery;

CREATE POLICY "Admins can manage gallery" ON gallery
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- =====================================================
-- BLOG POSTS POLICIES (Already has public read for published)
-- =====================================================
DROP POLICY IF EXISTS "Admins can manage blog posts" ON blog_posts;

CREATE POLICY "Admins can manage blog posts" ON blog_posts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- =====================================================
-- ANNOUNCEMENTS POLICIES (Already has public read for active)
-- =====================================================
DROP POLICY IF EXISTS "Admins can manage announcements" ON announcements;

CREATE POLICY "Admins can manage announcements" ON announcements
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- =====================================================
-- FAQS, TESTIMONIALS, SERVICES, SUBSIDY_INFO POLICIES
-- =====================================================
DROP POLICY IF EXISTS "Admins can manage FAQs" ON faqs;
CREATE POLICY "Admins can manage FAQs" ON faqs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

DROP POLICY IF EXISTS "Admins can manage testimonials" ON testimonials;
CREATE POLICY "Admins can manage testimonials" ON testimonials
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

DROP POLICY IF EXISTS "Admins can manage services" ON services;
CREATE POLICY "Admins can manage services" ON services
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

DROP POLICY IF EXISTS "Admins can manage subsidy info" ON subsidy_info;
CREATE POLICY "Admins can manage subsidy info" ON subsidy_info
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- =====================================================
-- SYSTEM SETTINGS POLICIES
-- =====================================================
DROP POLICY IF EXISTS "Anyone can view system settings" ON system_settings;
DROP POLICY IF EXISTS "Admins can manage settings" ON system_settings;

CREATE POLICY "Anyone can view system settings" ON system_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage settings" ON system_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- =====================================================
-- COMPLETED!
-- =====================================================
-- All RLS policies have been updated
-- Users can now:
-- - Register and manage their profile
-- - Submit and view their leads
-- - Manage bank details
-- - Create withdrawal requests
-- - View their rewards
-- - View their notifications
-- - Submit contact inquiries
-- 
-- Admins can manage everything
-- Public can view published content


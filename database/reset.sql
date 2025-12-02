-- =====================================================
-- MAHALAXMI SOLAR ENERGIES - DATABASE RESET SCRIPT
-- =====================================================
-- This script will DELETE ALL DATA and recreate all tables
-- Use with caution! This will erase everything.
-- =====================================================

-- =====================================================
-- STEP 1: DROP ALL EXISTING TABLES
-- =====================================================
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS contact_inquiries CASCADE;
DROP TABLE IF EXISTS subsidy_info CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS faqs CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS gallery CASCADE;
DROP TABLE IF EXISTS rewards_history CASCADE;
DROP TABLE IF EXISTS withdrawals CASCADE;
DROP TABLE IF EXISTS bank_details CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;

-- Drop functions if they exist
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS check_duplicate_lead() CASCADE;
DROP FUNCTION IF EXISTS update_user_stats() CASCADE;

-- =====================================================
-- STEP 2: Enable UUID extension
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- STEP 3: CREATE ALL TABLES
-- =====================================================

-- USERS TABLE (Email OR Phone authentication)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) UNIQUE,
  email VARCHAR(255) UNIQUE,
  role VARCHAR(50) DEFAULT 'user', -- 'user', 'admin', 'super_admin'
  is_active BOOLEAN DEFAULT TRUE,
  total_leads INTEGER DEFAULT 0,
  total_rewards DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT at_least_one_contact CHECK (phone_number IS NOT NULL OR email IS NOT NULL)
);

-- LEADS TABLE
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(255),
  city VARCHAR(255) NOT NULL,
  property_type VARCHAR(100), -- 'residential', 'commercial', 'industrial'
  notes TEXT,
  status VARCHAR(50) DEFAULT 'submitted', -- 'submitted', 'verified', 'contacted', 'interested', 'installed', 'rewarded', 'rejected'
  reward_amount DECIMAL(10, 2) DEFAULT 0.00,
  is_duplicate BOOLEAN DEFAULT FALSE,
  duplicate_of UUID REFERENCES leads(id) ON DELETE SET NULL,
  contacted_date TIMESTAMP WITH TIME ZONE,
  installed_date TIMESTAMP WITH TIME ZONE,
  rewarded_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BANK DETAILS TABLE
CREATE TABLE bank_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  account_holder_name VARCHAR(255) NOT NULL,
  account_number VARCHAR(50) NOT NULL,
  ifsc_code VARCHAR(20) NOT NULL,
  bank_name VARCHAR(255) NOT NULL,
  branch_name VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WITHDRAWALS TABLE
CREATE TABLE withdrawals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'rejected'
  bank_details_id UUID REFERENCES bank_details(id) ON DELETE SET NULL,
  transaction_id VARCHAR(255),
  notes TEXT,
  processed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- REWARDS HISTORY TABLE
CREATE TABLE rewards_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'lead_reward', 'bonus', 'withdrawal', 'adjustment'
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GALLERY TABLE (Photos & Videos)
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(20) NOT NULL, -- 'photo', 'video'
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  category VARCHAR(100), -- 'installation', 'products', 'events', 'team'
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BLOG/NEWS TABLE
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  category VARCHAR(100), -- 'news', 'guide', 'update', 'subsidy'
  tags TEXT[], -- Array of tags
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ANNOUNCEMENTS/NPC TABLE
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'general', -- 'general', 'urgent', 'maintenance', 'promotion', 'subsidy_update'
  priority INTEGER DEFAULT 0, -- Higher number = higher priority
  is_active BOOLEAN DEFAULT TRUE,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  target_audience VARCHAR(50) DEFAULT 'all', -- 'all', 'users', 'admins'
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FAQS TABLE
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100), -- 'general', 'referral', 'subsidy', 'installation', 'technical'
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TESTIMONIALS TABLE
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name VARCHAR(255) NOT NULL,
  customer_location VARCHAR(255),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  avatar_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SERVICES TABLE
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon_name VARCHAR(100), -- Icon identifier for frontend
  features TEXT[], -- Array of features
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SUBSIDY INFO TABLE
CREATE TABLE subsidy_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  capacity VARCHAR(100), -- e.g., '1-3 kW', '3-10 kW'
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  eligibility_criteria TEXT[],
  required_documents TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CONTACT INQUIRIES TABLE
CREATE TABLE contact_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(500),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new', -- 'new', 'in_progress', 'resolved', 'closed'
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NOTIFICATIONS TABLE
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50), -- 'lead_update', 'reward_added', 'withdrawal_processed', 'announcement'
  is_read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SYSTEM SETTINGS TABLE
CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- STEP 4: CREATE INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

CREATE INDEX idx_leads_referrer ON leads(referrer_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
CREATE INDEX idx_leads_customer_phone ON leads(customer_phone);

CREATE INDEX idx_withdrawals_user ON withdrawals(user_id);
CREATE INDEX idx_withdrawals_status ON withdrawals(status);

CREATE INDEX idx_rewards_history_user ON rewards_history(user_id);
CREATE INDEX idx_rewards_history_created ON rewards_history(created_at DESC);

CREATE INDEX idx_gallery_type ON gallery(type);
CREATE INDEX idx_gallery_category ON gallery(category);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(is_published, published_at DESC);

CREATE INDEX idx_announcements_active ON announcements(is_active, priority DESC);
CREATE INDEX idx_announcements_dates ON announcements(start_date, end_date);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read);

-- =====================================================
-- STEP 5: ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE subsidy_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 6: CREATE RLS POLICIES
-- =====================================================

-- Public read policies for public content
CREATE POLICY "Anyone can view published blog posts" ON blog_posts FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Anyone can view active announcements" ON announcements FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Anyone can view active FAQs" ON faqs FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Anyone can view active testimonials" ON testimonials FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Anyone can view active services" ON services FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Anyone can view active subsidy info" ON subsidy_info FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Anyone can view gallery" ON gallery FOR SELECT USING (TRUE);

-- =====================================================
-- STEP 7: CREATE FUNCTIONS AND TRIGGERS
-- =====================================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bank_details_updated_at BEFORE UPDATE ON bank_details FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_withdrawals_updated_at BEFORE UPDATE ON withdrawals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gallery_updated_at BEFORE UPDATE ON gallery FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subsidy_info_updated_at BEFORE UPDATE ON subsidy_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_inquiries_updated_at BEFORE UPDATE ON contact_inquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to check for duplicate leads
CREATE OR REPLACE FUNCTION check_duplicate_lead()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if phone number exists in last 90 days
  IF EXISTS (
    SELECT 1 FROM leads 
    WHERE customer_phone = NEW.customer_phone 
    AND created_at > NOW() - INTERVAL '90 days'
    AND id != NEW.id
  ) THEN
    NEW.is_duplicate = TRUE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_lead_duplicate BEFORE INSERT OR UPDATE ON leads 
FOR EACH ROW EXECUTE FUNCTION check_duplicate_lead();

-- Function to update user statistics
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE users SET
      total_leads = (SELECT COUNT(*) FROM leads WHERE referrer_id = NEW.referrer_id),
      total_rewards = (SELECT COALESCE(SUM(amount), 0) FROM rewards_history WHERE user_id = NEW.referrer_id AND type = 'lead_reward')
    WHERE id = NEW.referrer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_stats_trigger AFTER INSERT OR UPDATE ON leads 
FOR EACH ROW EXECUTE FUNCTION update_user_stats();

-- =====================================================
-- STEP 8: INSERT SAMPLE DATA
-- =====================================================

-- Insert system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('company_name', 'Mahalaxmi Solar Energies', 'Company name'),
('company_email', 'info@mahalakshmisolarpower.com', 'Company email'),
('company_phone', '+91-XXXXXXXXXX', 'Company phone number'),
('company_address', 'Your Address Here', 'Company address'),
('reward_per_lead', '5000', 'Reward amount per successful installation'),
('min_withdrawal_amount', '1000', 'Minimum withdrawal amount'),
('facebook_url', 'https://www.facebook.com/p/Mahalakshmi-Solar-Energies-61558430126387/', 'Facebook page URL'),
('instagram_url', 'https://www.instagram.com/maha.lakshmisolarenergies/', 'Instagram page URL'),
('website_url', 'https://mahalakshmisolarpower.com/', 'Website URL');

-- Insert sample services
INSERT INTO services (title, description, icon_name, features, display_order) VALUES
('Residential Solar Installation', 'Complete solar power solutions for homes with government subsidies', 'home', 
  ARRAY['Free site survey', 'Government subsidy assistance', 'Net metering support', '25 years warranty', 'EMI options available'], 1),
('Commercial Solar Solutions', 'High-efficiency solar systems for businesses and industries', 'building', 
  ARRAY['Customized design', 'High capacity systems', 'Energy audit', 'Tax benefits', 'ROI calculation'], 2),
('Solar Water Heaters', 'Eco-friendly water heating solutions', 'droplet', 
  ARRAY['Energy efficient', 'Low maintenance', 'Durable construction', 'Quick installation', 'Cost effective'], 3),
('Solar Maintenance', 'Professional maintenance and cleaning services', 'wrench', 
  ARRAY['Regular inspection', 'Panel cleaning', 'Performance monitoring', 'Repair services', 'Annual contracts'], 4);

-- Insert sample subsidy information
INSERT INTO subsidy_info (title, capacity, amount, description, eligibility_criteria, display_order) VALUES
('Residential Subsidy - Small', '1-2 kW', 30000.00, 'Government subsidy for small residential installations', 
  ARRAY['Indian citizen', 'Residential property owner', 'Grid-connected system', 'First-time applicant'], 1),
('Residential Subsidy - Medium', '2-3 kW', 18000.00, 'Government subsidy for medium residential installations (per kW)', 
  ARRAY['Indian citizen', 'Residential property owner', 'Grid-connected system', 'First-time applicant'], 2),
('Residential Subsidy - Large', 'Above 3 kW', 18000.00, 'Government subsidy for larger residential installations (per kW, up to 10 kW)', 
  ARRAY['Indian citizen', 'Residential property owner', 'Grid-connected system', 'Maximum 10 kW subsidy'], 3);

-- Insert sample FAQs
INSERT INTO faqs (question, answer, category, display_order) VALUES
('How does the referral program work?', 'Simply refer someone interested in solar installation. When they complete the installation, you earn rewards!', 'referral', 1),
('How much reward do I get per successful referral?', 'You can earn up to ₹5,000 per successful solar installation through your referral.', 'referral', 2),
('What is the government subsidy for solar panels?', 'Government provides subsidy up to ₹30,000 for 1-2 kW and ₹18,000 per kW for higher capacities (up to 10 kW).', 'subsidy', 3),
('How long does installation take?', 'Typical residential installation takes 1-3 days depending on system size and complexity.', 'installation', 4),
('What documents are needed for subsidy?', 'You need Aadhar card, electricity bill, property documents, and bank account details.', 'subsidy', 5);

-- Insert sample testimonial
INSERT INTO testimonials (customer_name, customer_location, rating, content, is_featured, display_order) VALUES
('Rajesh Kumar', 'Mumbai, Maharashtra', 5, 'Excellent service! The installation was quick and professional. My electricity bills have reduced by 80%. Highly recommended!', true, 1),
('Priya Sharma', 'Pune, Maharashtra', 5, 'Very satisfied with the solar system. The team was knowledgeable and completed everything on time. Great experience!', true, 2),
('Amit Patel', 'Ahmedabad, Gujarat', 5, 'Best decision for my home! Government subsidy made it very affordable. Thank you Mahalaxmi Solar!', true, 3);

-- =====================================================
-- COMPLETED!
-- =====================================================
-- Database has been reset and all tables recreated successfully
-- You can now use the application with a fresh database


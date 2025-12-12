-- Lead Dashboard Management Schema
-- Add these tables to manage Lead Dashboard content

-- =====================================================
-- LEAD DASHBOARD CONTENT TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS lead_dashboard_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key VARCHAR(100) NOT NULL UNIQUE, -- 'hero', 'how_it_works', 'requirements', etc.
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- LEAD REWARD STRUCTURE TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS lead_reward_structure (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_type VARCHAR(100) NOT NULL, -- 'Residential (1-3 kW)', 'Commercial', etc.
  reward_amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  icon_name VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- LEAD DASHBOARD FAQs TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS lead_dashboard_faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- LEAD REQUIREMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS lead_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon_name VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- LEAD DASHBOARD SETTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS lead_dashboard_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  setting_type VARCHAR(50) DEFAULT 'text', -- 'text', 'number', 'boolean', 'json'
  description TEXT,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INSERT DEFAULT DATA
-- =====================================================

-- Default Reward Structure
INSERT INTO lead_reward_structure (lead_type, reward_amount, description, icon_name, display_order) VALUES
('Residential (1-3 kW)', 3000, 'Perfect for individual homes and small properties', 'Home', 1),
('Residential (3-10 kW)', 5000, 'Ideal for larger homes and villas', 'Building2', 2),
('Commercial/Industrial', 10000, 'For businesses, factories, and large establishments', 'Factory', 3)
ON CONFLICT DO NOTHING;

-- Default FAQs
INSERT INTO lead_dashboard_faqs (question, answer, category, display_order) VALUES
('How much can I earn per successful lead?', 'You can earn ₹3,000 to ₹10,000 per successful lead depending on the system size and property type. Residential leads typically earn ₹3,000-5,000, while commercial leads can earn up to ₹10,000.', 'earnings', 1),
('When will I receive my reward?', 'Rewards are credited to your wallet within 7 days after successful installation and commissioning of the solar system.', 'payments', 2),
('What makes a lead valid?', 'A valid lead must be a genuine prospect who owns property, has adequate rooftop space, and is genuinely interested in solar installation. Duplicate leads are automatically detected and rejected.', 'requirements', 3),
('How do I withdraw my earnings?', 'Once you have a minimum balance of ₹1,000, you can request a withdrawal. Add your bank details and the amount will be transferred within 3-5 business days.', 'payments', 4),
('Can I track my submitted leads?', 'Yes! After logging in, you can track all your leads in real-time from your dashboard. You will see the current status and any updates.', 'tracking', 5)
ON CONFLICT DO NOTHING;

-- Default Lead Requirements
INSERT INTO lead_requirements (title, description, icon_name, display_order) VALUES
('Property Ownership', 'Customer should own the property or have authorization', 'CheckCircle2', 1),
('Rooftop Space', 'Minimum 100 sq ft of shadow-free rooftop space', 'CheckCircle2', 2),
('Electricity Bill', 'Monthly bill of ₹1,000 or more recommended', 'CheckCircle2', 3),
('Service Area', 'Located within our service coverage zones', 'CheckCircle2', 4)
ON CONFLICT DO NOTHING;

-- Default Settings
INSERT INTO lead_dashboard_settings (setting_key, setting_value, setting_type, description) VALUES
('whatsapp_support_number', '+911234567890', 'text', 'WhatsApp support contact number'),
('phone_support_number', '+911234567890', 'text', 'Phone support contact number'),
('support_email', 'support@mahalakshmisolarpower.com', 'text', 'Support email address'),
('minimum_withdrawal_amount', '1000', 'number', 'Minimum amount for withdrawal in rupees'),
('processing_days', '7', 'number', 'Days to process rewards after installation'),
('withdrawal_processing_days', '5', 'number', 'Days to process withdrawal requests'),
('show_live_stats', 'true', 'boolean', 'Show/hide live statistics section'),
('show_leaderboard', 'true', 'boolean', 'Show/hide leaderboard section')
ON CONFLICT DO NOTHING;

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_lead_dashboard_content_section ON lead_dashboard_content(section_key);
CREATE INDEX IF NOT EXISTS idx_lead_dashboard_content_active ON lead_dashboard_content(is_active);
CREATE INDEX IF NOT EXISTS idx_lead_reward_structure_active ON lead_reward_structure(is_active);
CREATE INDEX IF NOT EXISTS idx_lead_dashboard_faqs_active ON lead_dashboard_faqs(is_active);
CREATE INDEX IF NOT EXISTS idx_lead_requirements_active ON lead_requirements(is_active);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE lead_dashboard_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_reward_structure ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_dashboard_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_dashboard_settings ENABLE ROW LEVEL SECURITY;

-- Public read access to active content
CREATE POLICY "Anyone can view active lead dashboard content"
  ON lead_dashboard_content FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view active reward structure"
  ON lead_reward_structure FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view active FAQs"
  ON lead_dashboard_faqs FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view active requirements"
  ON lead_requirements FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view settings"
  ON lead_dashboard_settings FOR SELECT
  USING (true);

-- Admin access for modifications
CREATE POLICY "Admins can manage lead dashboard content"
  ON lead_dashboard_content FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can manage reward structure"
  ON lead_reward_structure FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can manage FAQs"
  ON lead_dashboard_faqs FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can manage requirements"
  ON lead_requirements FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can manage settings"
  ON lead_dashboard_settings FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role IN ('admin', 'super_admin')
    )
  );

-- =====================================================
-- FUNCTIONS FOR AUTOMATIC TIMESTAMP UPDATES
-- =====================================================
CREATE OR REPLACE FUNCTION update_lead_dashboard_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_lead_dashboard_content_updated_at
  BEFORE UPDATE ON lead_dashboard_content
  FOR EACH ROW
  EXECUTE FUNCTION update_lead_dashboard_updated_at();

CREATE TRIGGER update_lead_reward_structure_updated_at
  BEFORE UPDATE ON lead_reward_structure
  FOR EACH ROW
  EXECUTE FUNCTION update_lead_dashboard_updated_at();

CREATE TRIGGER update_lead_dashboard_faqs_updated_at
  BEFORE UPDATE ON lead_dashboard_faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_lead_dashboard_updated_at();

CREATE TRIGGER update_lead_requirements_updated_at
  BEFORE UPDATE ON lead_requirements
  FOR EACH ROW
  EXECUTE FUNCTION update_lead_dashboard_updated_at();

CREATE TRIGGER update_lead_dashboard_settings_updated_at
  BEFORE UPDATE ON lead_dashboard_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_lead_dashboard_updated_at();















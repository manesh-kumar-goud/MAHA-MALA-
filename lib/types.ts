export interface User {
  id: string;
  name: string;
  phone_number: string;
  email?: string;
  role: 'user' | 'admin' | 'super_admin';
  is_active: boolean;
  total_leads: number;
  total_rewards: number;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  referrer_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  city: string;
  property_type?: string;
  notes?: string;
  status: 'submitted' | 'verified' | 'contacted' | 'interested' | 'installed' | 'rewarded' | 'rejected';
  reward_amount: number;
  is_duplicate: boolean;
  duplicate_of?: string;
  contacted_date?: string;
  installed_date?: string;
  rewarded_date?: string;
  created_at: string;
  updated_at: string;
}

export interface BankDetails {
  id: string;
  user_id: string;
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
  bank_name: string;
  branch_name?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Withdrawal {
  id: string;
  user_id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  bank_details_id?: string;
  transaction_id?: string;
  notes?: string;
  processed_by?: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface RewardHistory {
  id: string;
  user_id: string;
  lead_id?: string;
  amount: number;
  type: 'lead_reward' | 'bonus' | 'withdrawal' | 'adjustment';
  description?: string;
  created_at: string;
}

export interface Gallery {
  id: string;
  title: string;
  description?: string;
  type: 'photo' | 'video';
  url: string;
  thumbnail_url?: string;
  category?: string;
  is_featured: boolean;
  display_order: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  author_id?: string;
  category?: string;
  tags?: string[];
  is_published: boolean;
  published_at?: string;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'urgent' | 'maintenance' | 'promotion' | 'subsidy_update';
  priority: number;
  is_active: boolean;
  start_date: string;
  end_date?: string;
  target_audience: 'all' | 'users' | 'admins';
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  customer_location?: string;
  rating: number;
  content: string;
  avatar_url?: string;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon_name?: string;
  features?: string[];
  image_url?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface SubsidyInfo {
  id: string;
  title: string;
  capacity: string;
  amount: number;
  description?: string;
  eligibility_criteria?: string[];
  required_documents?: string[];
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  assigned_to?: string;
  responded_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type?: string;
  is_read: boolean;
  link?: string;
  created_at: string;
}

export interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  description?: string;
  updated_by?: string;
  updated_at: string;
}

export interface DashboardStats {
  totalLeads: number;
  activeLeads: number;
  totalRewards: number;
  pendingWithdrawals: number;
  conversionRate: number;
}

export interface LeaderboardEntry {
  user_id: string;
  name: string;
  total_leads: number;
  total_rewards: number;
  rank: number;
}

export interface LeadDashboardContent {
  id: string;
  section_key: string;
  title: string;
  content: string;
  display_order: number;
  is_active: boolean;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface LeadRewardStructure {
  id: string;
  lead_type: string;
  reward_amount: number;
  description?: string;
  icon_name?: string;
  display_order: number;
  is_active: boolean;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface LeadDashboardFAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  display_order: number;
  is_active: boolean;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface LeadRequirement {
  id: string;
  title: string;
  description: string;
  icon_name?: string;
  display_order: number;
  is_active: boolean;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface LeadDashboardSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  setting_type: 'text' | 'number' | 'boolean' | 'json';
  description?: string;
  updated_by?: string;
  updated_at: string;
}




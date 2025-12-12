# Lead Dashboard - Complete Guide

## 🎯 Overview

The **Lead Dashboard** is a dedicated page designed to educate users about your solar referral program and encourage them to submit leads. It's a comprehensive landing page that includes:

- **Live Statistics** - Real-time data showing platform performance
- **How It Works** - Step-by-step guide for submitting leads
- **Reward Structure** - Clear breakdown of earning potential
- **Lead Requirements** - Eligibility criteria for valid leads
- **Top Performers** - Leaderboard to motivate users
- **FAQs** - Common questions answered
- **Contact Support** - Multiple ways to get help

## 📍 Access Points

### For Users:
- **Homepage**: New "Lead Dashboard" button added alongside "Get Started" and "View Subsidy Details"
- **Direct URL**: `/leads-dashboard`

### For Admins:
- **Admin Panel**: "Lead Dashboard" management option in admin quick actions
- **Direct URL**: `/admin/lead-dashboard`

---

## 🚀 Setup Instructions

### Step 1: Run Database Schema

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Open the file: `database/lead_dashboard_schema.sql`
4. Copy the entire content
5. Paste it in the SQL Editor
6. Click **Run** to create all tables and insert default data

This will create:
- `lead_dashboard_content` - Content sections
- `lead_reward_structure` - Reward amounts and types
- `lead_dashboard_faqs` - Frequently asked questions
- `lead_requirements` - Lead eligibility criteria
- `lead_dashboard_settings` - Platform settings

### Step 2: Verify Default Data

The schema automatically inserts default data including:

**Default Reward Structure:**
- Residential (1-3 kW): ₹3,000
- Residential (3-10 kW): ₹5,000
- Commercial/Industrial: ₹10,000

**Default FAQs:**
- How much can I earn per successful lead?
- When will I receive my reward?
- What makes a lead valid?
- How do I withdraw my earnings?
- Can I track my submitted leads?

**Default Requirements:**
- Property Ownership
- Rooftop Space
- Electricity Bill
- Service Area

**Default Settings:**
- WhatsApp support number
- Phone support number
- Support email
- Minimum withdrawal amount (₹1,000)
- Processing days (7 days)
- Withdrawal processing days (5 days)

---

## 🎨 Customization via Admin Panel

### Accessing Admin Panel

1. Login as Admin
2. Go to **Admin Dashboard**
3. Click on **"Lead Dashboard"** card
4. You'll see 4 tabs: Rewards, FAQs, Requirements, Settings

### Managing Reward Structure

**Add New Reward:**
1. Click "Add Reward" button
2. Fill in:
   - Lead Type (e.g., "Residential (1-3 kW)")
   - Reward Amount (e.g., 3000)
   - Description (brief explanation)
   - Icon Name (Lucide React icon, e.g., "Home", "Building2", "Factory")
   - Display Order (for sorting)
3. Click "Save"

**Edit/Delete Reward:**
- Use the action buttons on each reward card
- Toggle active/inactive status with the eye icon
- Move items up/down to reorder
- Edit with the pencil icon
- Delete with the trash icon

### Managing FAQs

**Add New FAQ:**
1. Click "Add FAQ" button
2. Fill in:
   - Question (the FAQ question)
   - Answer (detailed answer)
   - Category (optional, e.g., "earnings", "payments", "tracking")
   - Display Order (for sorting)
3. Click "Save"

**Tips for Good FAQs:**
- Keep questions clear and concise
- Provide detailed, helpful answers
- Use categories to organize related questions
- Order FAQs by importance or frequency

### Managing Requirements

**Add New Requirement:**
1. Click "Add Requirement" button
2. Fill in:
   - Title (e.g., "Property Ownership")
   - Description (brief explanation)
   - Icon Name (Lucide React icon, e.g., "CheckCircle2")
   - Display Order (for sorting)
3. Click "Save"

**Best Practices:**
- Keep requirements clear and actionable
- Use positive language
- Explain why each requirement matters

### Managing Settings

Update key platform settings:

- **WhatsApp Support Number**: Your WhatsApp business number
- **Phone Support Number**: Your customer service number
- **Support Email**: Your support email address
- **Minimum Withdrawal Amount**: Minimum balance needed to withdraw (in ₹)
- **Processing Days**: Days to process rewards after installation
- **Withdrawal Processing Days**: Days to process withdrawal requests
- **Show Live Stats**: Toggle to show/hide statistics section (true/false)
- **Show Leaderboard**: Toggle to show/hide leaderboard section (true/false)

---

## 📊 Features Breakdown

### 1. Hero Section
- Eye-catching header with call-to-action
- Login and Register buttons prominently displayed
- Quick action links (Submit Lead, Track Leads, My Wallet)

### 2. Live Statistics
Real-time metrics that update automatically:
- Total Leads Submitted
- Success Rate (%)
- Average Reward (₹)
- Average Processing Time (days)

### 3. How It Works
4-step process visualization:
1. Register (create account)
2. Submit Lead (share details)
3. We Follow Up (team contacts customer)
4. Earn Rewards (get paid after installation)

### 4. Reward Structure
- Clear cards showing earning potential
- Separate tiers for different lead types
- Bonus information for milestone achievements
- Fully customizable via admin panel

### 5. Lead Requirements
- 4 key criteria displayed as cards
- Icons for visual clarity
- Duplicate detection explanation
- Helps users submit quality leads

### 6. Top Performers Leaderboard
- Top 5 performers of the month
- Shows name, total leads, and earnings
- Gamification to motivate users
- Crown icon for #1 performer

### 7. FAQs Section
- Common questions answered
- Categorized for easy navigation
- Fully manageable via admin panel

### 8. Contact & Support
3 contact options:
- WhatsApp (quick response)
- Phone (speak with team)
- Email (detailed queries)

### 9. Final CTA
- Prominent call-to-action at the bottom
- Login and Submit Lead buttons
- Encourages immediate action

---

## 🎯 Best Practices

### Content Management

1. **Keep Information Current**
   - Update reward amounts seasonally
   - Refresh FAQs based on user questions
   - Update contact information promptly

2. **Use Clear Language**
   - Avoid technical jargon
   - Write for your target audience
   - Be specific about requirements

3. **Visual Hierarchy**
   - Use display_order to prioritize important items
   - Keep most lucrative rewards at top
   - Put most-asked FAQs first

4. **Regular Updates**
   - Review content quarterly
   - Add new FAQs as questions arise
   - Update success metrics

### User Experience

1. **Fast Loading**
   - Page is optimized for performance
   - Images are lazy-loaded
   - Database queries are efficient

2. **Mobile Responsive**
   - Fully responsive design
   - Touch-friendly buttons
   - Easy navigation on mobile

3. **Clear CTAs**
   - Multiple touchpoints for login/registration
   - Prominent action buttons
   - Easy access to submit leads

---

## 🔧 Troubleshooting

### Issue: Tables not created in Supabase

**Solution:**
1. Ensure you're logged into correct Supabase project
2. Check SQL Editor for any error messages
3. Verify UUID extension is enabled
4. Run schema one section at a time if needed

### Issue: Admin can't access Lead Dashboard management

**Solution:**
1. Verify user role is 'admin' or 'super_admin' in users table
2. Check Row Level Security policies are applied
3. Clear browser cache and re-login
4. Check browser console for errors

### Issue: Live statistics not updating

**Solution:**
1. Verify leads data exists in database
2. Check Supabase connection
3. Ensure RLS policies allow read access
4. Check browser console for errors

### Issue: Default data not appearing

**Solution:**
1. Check if INSERT statements completed successfully
2. Verify `is_active` is set to true for items
3. Check RLS policies allow SELECT access
4. Try manually querying tables in Supabase

---

## 📝 Database Schema Details

### lead_reward_structure
```sql
- id (UUID, Primary Key)
- lead_type (VARCHAR)
- reward_amount (DECIMAL)
- description (TEXT)
- icon_name (VARCHAR)
- display_order (INTEGER)
- is_active (BOOLEAN)
- created_at, updated_at (TIMESTAMP)
```

### lead_dashboard_faqs
```sql
- id (UUID, Primary Key)
- question (TEXT)
- answer (TEXT)
- category (VARCHAR)
- display_order (INTEGER)
- is_active (BOOLEAN)
- created_at, updated_at (TIMESTAMP)
```

### lead_requirements
```sql
- id (UUID, Primary Key)
- title (VARCHAR)
- description (TEXT)
- icon_name (VARCHAR)
- display_order (INTEGER)
- is_active (BOOLEAN)
- created_at, updated_at (TIMESTAMP)
```

### lead_dashboard_settings
```sql
- id (UUID, Primary Key)
- setting_key (VARCHAR, UNIQUE)
- setting_value (TEXT)
- setting_type (VARCHAR)
- description (TEXT)
- updated_at (TIMESTAMP)
```

---

## 🎨 Customization Tips

### Icons
The dashboard uses **Lucide React** icons. Popular options:
- **Home** - Houses/residential
- **Building2** - Buildings/commercial
- **Factory** - Industrial facilities
- **CheckCircle2** - Checkmarks/verification
- **Award** - Rewards/achievements
- **DollarSign** - Money/payments

Browse all icons: [lucide.dev](https://lucide.dev)

### Colors
Current color scheme:
- Primary: Blue (for main actions)
- Success: Green (for rewards/earnings)
- Warning: Amber (for bonuses/highlights)
- Info: Purple (for statistics)

Modify in the component files to match your brand.

### Content
To customize hero text, section titles, or descriptions:
1. Edit `/app/leads-dashboard/page.tsx`
2. Find the relevant section
3. Update text content
4. Save and refresh

---

## 📈 Analytics & Tracking

### Metrics to Monitor

1. **Page Views**: Track visits to `/leads-dashboard`
2. **Conversion Rate**: Users who view page → register
3. **Lead Submission Rate**: Users who register → submit leads
4. **Time on Page**: Engagement indicator
5. **Click-through Rate**: Button clicks to actions

### Integration Suggestions

Add analytics tracking:
```javascript
// Google Analytics
gtag('event', 'page_view', {
  page_path: '/leads-dashboard'
});

// Track button clicks
onClick={() => {
  gtag('event', 'button_click', {
    button_name: 'login_from_lead_dashboard'
  });
}}
```

---

## 🎓 Marketing Tips

### Promoting the Lead Dashboard

1. **Email Campaigns**
   - Send link to existing users
   - Highlight earning potential
   - Include success stories

2. **Social Media**
   - Share screenshot of rewards
   - Post top performer achievements
   - Create video tutorials

3. **WhatsApp Marketing**
   - Share direct link in groups
   - Personal invitations
   - Quick earning examples

4. **SEO Optimization**
   - Add meta tags
   - Use relevant keywords
   - Create backlinks

---

## 🔐 Security Considerations

1. **Row Level Security (RLS)**
   - All tables have RLS enabled
   - Public read access for active items only
   - Admin-only write access

2. **Input Validation**
   - All forms validate input
   - SQL injection prevention via Supabase
   - XSS protection built-in

3. **Authentication**
   - Supabase Auth handles security
   - OTP-based verification
   - Session management

---

## 💡 Future Enhancements

Consider adding:

1. **Video Testimonials**
   - Success stories from top performers
   - Embedded video section

2. **Calculator Tool**
   - "Calculate your earnings" widget
   - Input expected leads → show potential income

3. **Referral Tracking**
   - Unique referral links
   - Track who brought in each lead

4. **Notifications**
   - Email alerts for new FAQs
   - Push notifications for bonuses

5. **Multi-language Support**
   - Hindi, Telugu, Tamil translations
   - Regional language support

---

## 📞 Support

If you need help:

- **Documentation**: This file + README.md
- **GitHub Issues**: Report bugs or request features
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

---

## ✅ Launch Checklist

Before going live:

- [ ] Database schema successfully executed
- [ ] Default data verified in Supabase
- [ ] Admin can access management panel
- [ ] Test all CRUD operations
- [ ] Update contact information (phone, email, WhatsApp)
- [ ] Customize reward amounts for your business
- [ ] Add region-specific FAQs
- [ ] Update service area requirements
- [ ] Test on mobile devices
- [ ] Verify all links work
- [ ] Check page load speed
- [ ] Set up analytics tracking
- [ ] Train admin team on management
- [ ] Create content calendar for updates
- [ ] Announce to users via email/WhatsApp

---

**Built with ❤️ for sustainable solar energy**

*Last Updated: December 2024*















# 👑 Admin Panel Guide - Mahalaxmi Solar Energies

## 🎯 Complete Admin Panel Features

Your admin panel now includes **12 comprehensive management modules**!

---

## 📊 Admin Dashboard

**Path**: `/admin`

**Features**:
- Real-time statistics overview
- Total users, leads, rewards paid
- Pending leads and withdrawals alerts
- Quick action cards for all modules

---

## 🔧 Management Modules

### 1. **User Management** (`/admin/users`)
✅ View all registered users
✅ Search by name, email, or phone
✅ Filter by role (User, Admin, Super Admin)
✅ Update user roles
✅ Activate/deactivate accounts
✅ View user statistics (leads, rewards)

**How to Make Admin**:
1. Go to Users page
2. Click Shield icon on user
3. Select Admin role
4. User gets admin access!

---

### 2. **Lead Management** (`/admin/leads`)
✅ View all submitted leads
✅ Search and filter by status
✅ Update lead status
✅ View referrer information
✅ Track lead progression
✅ Export lead data

**Status Flow**:
Submitted → Verified → Contacted → Interested → Installed → Rewarded

**Actions**:
- Click on any lead to view details
- Update status from dropdown
- Automatic reward calculation when status = Installed
- Automatic reward payout when status = Rewarded

---

### 3. **Withdrawal Management** (`/admin/withdrawals`)
✅ View all withdrawal requests
✅ Filter by status (Pending, Processing, Completed, Rejected)
✅ View bank details
✅ Process withdrawals
✅ Add transaction ID
✅ Approve or reject requests

**Process Flow**:
1. User requests withdrawal
2. Shows in Pending tab
3. Click "Process"
4. Enter transaction ID
5. Click "Approve"
6. Amount deducted from user wallet

---

### 4. **Announcement Management** (`/admin/announcements`)
✅ Create new announcements
✅ Edit existing announcements
✅ Delete announcements
✅ Set priority levels
✅ Set type (General, Urgent, Promotion, etc.)
✅ Target audience (All, Users, Admins)
✅ Set start/end dates
✅ Activate/deactivate

**Announcement Types**:
- General
- Urgent
- Maintenance
- Promotion
- Subsidy Update

---

### 5. **Gallery Management** (`/admin/gallery`)
✅ Add photos and videos
✅ Edit gallery items
✅ Delete items
✅ Set categories
✅ Feature items
✅ Set display order
✅ Add thumbnails for videos

**How to Add**:
1. Click "Add Item"
2. Enter title and URL
3. Select type (Photo/Video)
4. Optional: Add category, thumbnail
5. Save!

---

### 6. **Blog Management** (`/admin/blog`)
✅ Create new blog posts
✅ Edit existing posts
✅ Delete posts
✅ Publish/unpublish
✅ Add featured images
✅ Categorize posts
✅ Add tags
✅ Auto-generate slugs
✅ Track view counts

**Publishing**:
- Draft: Not visible to public
- Published: Visible on blog page

---

### 7. **Services Management** (`/admin/services`)
✅ Add new services
✅ Edit service details
✅ Delete services
✅ Add features list
✅ Set icons
✅ Set display order
✅ Activate/deactivate

**Icon Options**:
- home (for residential)
- building (for commercial)
- droplet (for water heaters)
- wrench (for maintenance)

---

### 8. **Testimonials Management** (`/admin/testimonials`)
✅ Add customer testimonials
✅ Edit reviews
✅ Delete testimonials
✅ Set star ratings (1-5)
✅ Feature testimonials
✅ Add customer location
✅ Set display order

**Best Practices**:
- Get customer permission first
- Use real names and locations
- Keep reviews authentic
- Feature your best reviews

---

### 9. **FAQs Management** (`/admin/faqs`)
✅ Add new FAQs
✅ Edit questions and answers
✅ Delete FAQs
✅ Categorize FAQs
✅ Set display order
✅ Activate/deactivate

**Categories**:
- General
- Referral
- Subsidy
- Installation
- Technical

---

### 10. **Subsidy Info Management** (`/admin/subsidy`)
✅ Add subsidy plans
✅ Edit subsidy details
✅ Set capacity ranges
✅ Set subsidy amounts
✅ Add eligibility criteria
✅ List required documents
✅ Set display order

**Example**:
- Title: "Residential Subsidy - Small"
- Capacity: "1-2 kW"
- Amount: ₹30,000
- Eligibility: (list of criteria)

---

### 11. **Contact Inquiries** (`/admin/contacts`)
✅ View all contact form submissions
✅ Filter by status
✅ View customer details
✅ Update inquiry status
✅ Track response time

**Status Flow**:
New → In Progress → Resolved → Closed

---

### 12. **System Settings** (`/admin/settings`)
✅ Update company information
✅ Set reward amounts
✅ Set minimum withdrawal limit
✅ Update social media links
✅ Configure contact details

**Settings Include**:
- Company name, email, phone, address
- Reward per lead amount
- Minimum withdrawal amount
- Facebook/Instagram URLs
- Website URL

---

## 🎯 Admin Workflow Examples

### **Processing a New Lead**
1. Go to **Manage Leads**
2. See new lead with "Submitted" status
3. Verify customer details
4. Update status to "Verified"
5. Contact customer (offline)
6. Update to "Contacted"
7. If interested, update to "Interested"
8. After installation, update to "Installed"
9. Update to "Rewarded" → Automatic ₹5,000 added to user wallet

### **Processing a Withdrawal**
1. Go to **Manage Withdrawals**
2. See pending request
3. Click "Process"
4. Verify bank details
5. Transfer money (offline)
6. Enter transaction ID
7. Click "Approve"
8. Amount deducted from user wallet

### **Creating an Announcement**
1. Go to **Announcements**
2. Click "New Announcement"
3. Enter title and content
4. Select type (e.g., "Subsidy Update")
5. Set priority (0 = normal, higher = more urgent)
6. Select target audience
7. Set dates (optional)
8. Save!

### **Adding Gallery Item**
1. Go to **Gallery**
2. Click "Add Item"
3. Upload image to hosting service (Imgur, Supabase Storage, etc.)
4. Copy image URL
5. Paste in URL field
6. Add title and description
7. Select category
8. Save!

---

## 🔒 Admin Security

### **Role-Based Access**:
- **User**: Can only access own dashboard
- **Admin**: Can access admin panel + manage content
- **Super Admin**: Same as admin (for future expansion)

### **Making Someone Admin**:

**Method 1: Through Users Page**
1. Go to `/admin/users`
2. Find the user
3. Click Shield icon
4. Select "Admin"
5. Done!

**Method 2: SQL Query**
```sql
UPDATE users SET role = 'admin' WHERE email = 'user@example.com';
```

---

## 📊 Key Statistics Explained

### **Dashboard Stats**:
- **Total Users**: All registered accounts
- **Total Leads**: All referral submissions
- **Pending Leads**: Awaiting review/action
- **Installed**: Successfully completed installations
- **Rewards Paid**: Total money distributed
- **Pending Withdrawals**: Awaiting processing

### **Conversion Rate**:
```
(Installed Leads / Total Leads) × 100
```

Example: 50 installed out of 200 total = 25% conversion

---

## 🎨 Content Best Practices

### **Services**:
- Use clear, benefit-focused descriptions
- List 3-5 key features per service
- Keep titles concise
- Order from most to least popular

### **Blog Posts**:
- Write helpful, informative content
- Use clear headings
- Add featured images
- Publish regularly for SEO
- Use relevant tags

### **Testimonials**:
- Get customer permission
- Use real names and locations
- Feature your best reviews
- Keep content authentic

### **FAQs**:
- Answer common questions
- Keep answers clear and concise
- Organize by category
- Update regularly

---

## 🚀 Quick Actions Checklist

### **Daily Tasks**:
- [ ] Check pending leads
- [ ] Review withdrawal requests
- [ ] Respond to contact inquiries
- [ ] Check new user signups

### **Weekly Tasks**:
- [ ] Create blog post or update
- [ ] Review and update FAQs
- [ ] Check testimonials
- [ ] Review system statistics

### **Monthly Tasks**:
- [ ] Update subsidy information
- [ ] Review and update services
- [ ] Analyze conversion rates
- [ ] Plan promotional announcements

---

## 🐛 Troubleshooting

### **Can't Access Admin Panel**:
- Verify your role is 'admin' in database
- Log out and log back in
- Clear browser cache

### **Can't Update Leads**:
- Check database connection
- Verify RLS policies are enabled
- Check Supabase logs

### **Images Not Showing**:
- Verify image URLs are valid
- Use absolute URLs (https://...)
- Check image hosting service

---

## 📞 Admin Support

For admin-specific issues:
- Check Supabase logs
- Review database policies
- Contact technical support

---

## ✅ Admin Panel Checklist

**Content Management** ✅
- Users
- Leads  
- Withdrawals
- Announcements
- Gallery
- Blog Posts

**Website Content** ✅
- Services
- Testimonials
- FAQs
- Subsidy Info

**Support** ✅
- Contact Inquiries
- System Settings

**All 12 modules working!** 🎉

---

**Your complete admin panel is ready!** 👑

Access it at: `http://localhost:3000/admin`




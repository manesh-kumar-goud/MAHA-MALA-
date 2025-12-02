# Quick Setup Guide - Mahalaxmi Solar Energies

## 🚀 Quick Start (5 Minutes)

### Step 1: Environment Setup

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials

### Step 2: Database Setup

1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the database to be ready (~2 minutes)
3. Go to SQL Editor
4. Copy the entire contents of `database/schema.sql`
5. Paste and click "Run"
6. ✅ Database is ready!

### Step 3: Enable Phone Authentication

1. In Supabase, go to **Authentication → Providers**
2. Enable **Phone** provider
3. Configure SMS provider:
   - **For Development**: Use Supabase's test SMS (limited)
   - **For Production**: Configure Twilio or MessageBird

**Note**: For testing without SMS, you can use Email OTP instead:
- In Supabase: Enable **Email** provider
- Update `lib/auth.ts` to use email instead of phone

### Step 4: Run the Application

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` 🎉

### Step 5: Create Admin Account

1. Register a new account through the app
2. Go to Supabase Dashboard
3. Navigate to **Table Editor → users**
4. Find your user
5. Change `role` from `'user'` to `'admin'`
6. Refresh the app - you'll see "Admin" button in navbar

## 📊 Populate Initial Data

### Add Sample Services

```sql
-- Run in Supabase SQL Editor
INSERT INTO services (title, description, icon_name, features, display_order) VALUES
('Residential Solar', 'Complete solar solutions for homes', 'home', 
  ARRAY['Free consultation', 'Government subsidy', '25 year warranty'], 1),
('Commercial Solar', 'High-efficiency systems for businesses', 'building', 
  ARRAY['Customized design', 'Tax benefits', 'ROI calculation'], 2);
```

### Add Sample FAQs

```sql
INSERT INTO faqs (question, answer, category, display_order) VALUES
('How does the referral program work?', 
  'Refer customers and earn ₹5,000 per successful installation!', 
  'referral', 1),
('What is the government subsidy amount?', 
  'Up to ₹30,000 for 1-2 kW and ₹18,000 per kW for higher capacities.', 
  'subsidy', 2);
```

### Add Sample Testimonial

```sql
INSERT INTO testimonials (customer_name, customer_location, rating, content, is_featured) VALUES
('Rajesh Kumar', 'Mumbai', 5, 
  'Excellent service! Highly recommended for solar installation.', 
  true);
```

## 🎨 Customization

### Update Company Information

1. Edit `components/Footer.tsx` - Update contact details
2. Edit `components/Navbar.tsx` - Update company name/logo
3. Edit `.env.local` - Update site name

### Add Your Logo

Replace the Sun icon in:
- `components/Navbar.tsx`
- `components/Footer.tsx`
- `app/auth/login/page.tsx`

### Update Colors

Edit `app/globals.css` to change the color scheme:
```css
/* Change blue-600 to your brand color throughout */
```

## 🧪 Testing Checklist

### Public Pages
- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Contact form submits
- [ ] Gallery displays
- [ ] Blog loads

### Authentication
- [ ] Phone OTP login works
- [ ] Name capture after OTP
- [ ] User can log out

### User Dashboard
- [ ] Dashboard shows stats
- [ ] Can submit new lead
- [ ] Lead appears in list
- [ ] Wallet page loads
- [ ] Can add bank details

### Admin Panel
- [ ] Admin can access /admin
- [ ] Can view all leads
- [ ] Can update lead status
- [ ] Can create announcements
- [ ] Statistics display correctly

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import to Vercel
3. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   ```
4. Deploy!

### Custom Domain

1. In Vercel: Settings → Domains
2. Add your domain
3. Update DNS records
4. SSL is automatic ✅

## 🔧 Troubleshooting

### OTP not sending?
- Check Supabase Phone provider is enabled
- Verify SMS provider credentials
- Check Supabase logs

### Database errors?
- Ensure schema.sql ran completely
- Check RLS policies are enabled
- Verify environment variables

### Can't access admin?
- Check user role in database
- Clear browser cache
- Log out and log back in

### Build errors?
- Run `npm install` again
- Delete `.next` folder
- Check Node.js version (18+)

## 📞 Support

Need help?
- Check README.md for detailed documentation
- Review database/schema.sql for database structure
- Contact: info@mahalakshmisolarpower.com

## 🎯 Production Checklist

Before going live:
- [ ] Update all company information
- [ ] Add real logo and images
- [ ] Configure production SMS provider
- [ ] Add privacy policy and terms
- [ ] Set up analytics (Google Analytics)
- [ ] Test all features thoroughly
- [ ] Create admin accounts
- [ ] Add initial content (services, FAQs, etc.)
- [ ] Set up domain and SSL
- [ ] Configure email notifications
- [ ] Test on mobile devices

---

**Ready to go! 🚀**

Your solar referral platform is now set up and ready to help grow your business!





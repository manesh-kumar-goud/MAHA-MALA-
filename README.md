# Mahalaxmi Solar Energies - Complete Web Application

A professional, full-featured solar energy referral and management platform built with Next.js 14, Supabase, and modern UI components.

## 🌟 Features

### User Features
- **OTP Authentication** - Secure phone-based login with Supabase Auth
- **Lead Submission** - Easy referral submission with validation
- **Lead Tracking** - Real-time status tracking of referrals
- **Reward Wallet** - View earned rewards and withdrawal history
- **Bank Details** - Secure bank account management
- **Leaderboard** - Gamified ranking system
- **Dashboard** - Comprehensive user dashboard

### Public Features
- **Homepage** - Beautiful, PM Surya Ghar-inspired design
- **About Us** - Company information and values
- **Services** - Detailed service offerings
- **Subsidy Information** - Complete government subsidy details
- **Photo & Video Gallery** - Showcase installations
- **Blog & News** - Latest updates and articles
- **Contact Form** - Easy inquiry submission
- **FAQs** - Common questions answered

### Admin Features
- **Admin Dashboard** - Complete system overview
- **Lead Management** - Review and update lead status
- **User Management** - Manage user accounts
- **Withdrawal Processing** - Handle reward withdrawals
- **Announcement Management** - Create and manage announcements
- **Gallery Management** - Add/edit photos and videos
- **Blog CMS** - Content management system
- **Service Management** - Update services and offerings
- **Analytics** - View platform statistics

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: Custom components with Shadcn/UI patterns
- **Backend**: Supabase (PostgreSQL database + Auth)
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Notifications**: React Hot Toast

## 📋 Prerequisites

- Node.js 18+ installed
- Supabase account
- Basic understanding of Next.js and React

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
cd mahalakshmi-solar-web
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project on [Supabase](https://supabase.com)
2. Go to SQL Editor and run the entire `database/schema.sql` file
3. Enable Phone Authentication:
   - Go to Authentication → Settings
   - Enable Phone provider
   - Configure your SMS provider (or use Supabase's default)
4. Get your project credentials:
   - Go to Settings → API
   - Copy the Project URL and anon/public key

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Mahalaxmi Solar Energies
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Database Schema

The complete database schema is in `database/schema.sql`. It includes:

- **users** - User accounts and profiles
- **leads** - Customer referrals
- **bank_details** - Bank account information
- **withdrawals** - Withdrawal requests
- **rewards_history** - Transaction history
- **gallery** - Photos and videos
- **blog_posts** - Blog content
- **announcements** - Platform announcements
- **faqs** - Frequently asked questions
- **testimonials** - Customer reviews
- **services** - Service offerings
- **subsidy_info** - Government subsidy information
- **contact_inquiries** - Contact form submissions
- **notifications** - User notifications
- **system_settings** - Platform configuration

## 🎨 UI Components

Custom UI components are in the `components/ui/` directory:

- Button, Input, Textarea, Select
- Card, Badge, Label
- Dialog, Loading Spinner
- Navbar, Footer

## 📱 Pages Structure

```
/                       - Homepage
/about                  - About Us
/services               - Services
/subsidy                - Subsidy Information
/gallery                - Photo & Video Gallery
/blog                   - Blog & News
/contact                - Contact Us
/auth/login             - Login Page

/dashboard              - User Dashboard
/dashboard/leads/new    - Submit New Lead
/dashboard/wallet       - Wallet & Rewards
/dashboard/wallet/bank-details - Bank Details
/dashboard/leaderboard  - Leaderboard

/admin                  - Admin Dashboard
/admin/leads            - Manage Leads
/admin/announcements    - Manage Announcements
/admin/...             - Other Admin Pages
```

## 🔒 Security Features

- Row Level Security (RLS) enabled on all tables
- Secure authentication with Supabase Auth
- Encrypted bank details storage
- Duplicate lead detection
- Role-based access control (User, Admin, Super Admin)

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## 📊 Features Checklist

- ✅ OTP-based authentication
- ✅ User dashboard with statistics
- ✅ Lead submission and tracking
- ✅ Reward wallet system
- ✅ Bank details management
- ✅ Withdrawal system
- ✅ Leaderboard & gamification
- ✅ Admin panel
- ✅ Lead management
- ✅ Announcement system
- ✅ Gallery (photos & videos)
- ✅ Blog/News section
- ✅ About, Services, Contact pages
- ✅ Subsidy information
- ✅ Responsive design
- ✅ SEO optimization
- ✅ Beautiful UI inspired by PM Surya Ghar

## 🎯 Next Steps

1. **Add your logo**: Replace logo in Navbar and Footer
2. **Update company info**: Edit contact details in Footer and Contact page
3. **Add real images**: Upload actual photos to gallery
4. **Create initial content**: Add services, FAQs, testimonials
5. **Test OTP**: Verify phone authentication works
6. **Create admin account**: Use Supabase dashboard to set user role to 'admin'
7. **Deploy**: Push to production

## 📝 Creating First Admin User

After setting up:

1. Register a new account through the app
2. Go to Supabase Dashboard → Table Editor → users
3. Find your user record
4. Change `role` from 'user' to 'admin' or 'super_admin'
5. Log out and log back in
6. You'll now see the Admin panel option

## 🤝 Support

For issues or questions:
- Email: info@mahalakshmisolarpower.com
- Website: https://mahalakshmisolarpower.com

## 📄 License

Copyright © 2024 Mahalaxmi Solar Energies. All rights reserved.

---

**Built with ❤️ for a sustainable future**

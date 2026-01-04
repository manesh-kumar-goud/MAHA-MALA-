# New Supabase Project Setup Guide

## Step-by-Step Instructions

### Step 1: Create New Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Click **"New Project"**
3. Fill in the details:
   - **Name**: Mahalaxmi Solar Energies
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to India (e.g., `ap-south-1` - Mumbai)
4. Click **"Create new project"**
5. Wait for project creation (~2 minutes)

### Step 2: Get Your Supabase Credentials

1. Once project is created, go to **Settings** (gear icon) → **API**
2. Copy the following:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

### Step 3: Run the SQL Schema

1. In Supabase Dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Open the file `COMPLETE_DATABASE_SCHEMA.sql` from your project
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click **"Run"** (or press `Ctrl+Enter`)
7. Wait for execution to complete (should see "Success" message)

### Step 4: Update Environment Variables

1. Create or update `.env.local` file in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-new-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-new-anon-key-here

# Gmail SMTP (Optional - for email notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
RECIPIENT_EMAIL=your-email@gmail.com

# Firebase (if using phone OTP)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

**Important:**
- Replace `your-new-project-id` with your actual project ID
- Replace `your-new-anon-key-here` with your actual anon key
- Make sure URL starts with `https://`
- No quotes or spaces around values

### Step 5: Create Your First Admin User

**Option A: Through Supabase Dashboard**
1. Go to **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Enter email or phone number
4. Set a password (or use magic link)
5. Click **"Create user"**
6. Note the user's UUID (from the users list)

**Option B: Through Your App**
1. Start your app: `npm run dev`
2. Go to `/auth/login`
3. Sign up with email or phone
4. Note your user ID from the browser console or Supabase dashboard

**Then update the user role:**
1. Go to **Table Editor** → **users**
2. Find your user
3. Click to edit
4. Change `role` from `user` to `admin` or `super_admin`
5. Save

### Step 6: Restart Your Development Server

```bash
# Stop current server (Ctrl+C)
# Delete .next folder (optional but recommended)
rm -rf .next
# Or on Windows:
rmdir /s .next

# Restart server
npm run dev
```

### Step 7: Verify Everything Works

1. **Test Contact Form:**
   - Go to your website
   - Submit a contact form or subsidy inquiry
   - Check Supabase Dashboard → **Table Editor** → `contact_inquiries`
   - You should see the new entry

2. **Test Admin Panel:**
   - Go to `/admin` (login with your admin account)
   - You should see the admin dashboard

3. **Check Browser Console:**
   - Open DevTools (F12)
   - Should see no Supabase connection errors

## ✅ Checklist

- [ ] Supabase project created
- [ ] Project URL and anon key copied
- [ ] SQL schema executed successfully
- [ ] `.env.local` file updated with new credentials
- [ ] First admin user created
- [ ] User role set to `admin` or `super_admin`
- [ ] Development server restarted
- [ ] Contact form tested and working
- [ ] No errors in browser console

## 🐛 Troubleshooting

### If SQL execution fails:
- Make sure you're copying the entire SQL file
- Check for any error messages in SQL Editor
- Try running sections one at a time if needed

### If connection still fails:
- Verify `.env.local` file exists in project root
- Check that URL starts with `https://`
- Make sure no quotes around values
- Restart server after changing `.env.local`

### If admin panel doesn't work:
- Verify user role is set to `admin` or `super_admin`
- Check browser console for errors
- Make sure you're logged in with the admin account

## 📝 Files You Need

1. **`COMPLETE_DATABASE_SCHEMA.sql`** - The complete database schema
2. **`.env.local`** - Your environment variables (create this)

## 🎉 You're All Set!

Once everything is working, you can:
- Start using the contact forms
- Manage content through admin panel
- Set up email notifications (if configured)
- Start collecting leads and inquiries

---

**Need Help?**
- Check `SUPABASE_CONNECTION_FIX.md` for connection issues
- Check `GMAIL_SMTP_SETUP.md` for email setup
- Supabase Docs: https://supabase.com/docs




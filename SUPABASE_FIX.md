# Supabase Connection Error Fix

## Error: `ENOTFOUND vqznrnxssexbncfbwecg.supabase.co`

This error means your Supabase project URL is incorrect or the project doesn't exist.

## ✅ Quick Fix

### Option 1: Update Supabase URL (If Project Exists)

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **Project URL** (should look like: `https://xxxxx.supabase.co`)
5. Update your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
```

### Option 2: Create New Supabase Project

If the project doesn't exist:

1. Go to [Supabase](https://supabase.com/)
2. Click **New Project**
3. Fill in:
   - **Name**: Mahalaxmi Solar Energies
   - **Database Password**: (choose a strong password)
   - **Region**: Choose closest to India
4. Wait for project to be created (~2 minutes)
5. Go to **Settings** → **API**
6. Copy **Project URL** and **anon/public key**
7. Update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-new-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-new-anon-key
```

8. Run the database schema:
   - Go to **SQL Editor** in Supabase
   - Copy contents of `database/schema.sql`
   - Paste and run it

### Option 3: Use Firebase Only (Temporary)

If you want to test Firebase phone OTP without Supabase:

1. The app will show warnings but Firebase phone OTP will still work
2. Email OTP won't work without Supabase
3. User data won't be stored in database

## 🔍 Verify Your Supabase Project

1. Check if project exists:
   - Go to [Supabase Dashboard](https://app.supabase.com/)
   - Look for your project in the list
   - If not found, create a new one

2. Check project status:
   - Project should be **Active** (not paused)
   - If paused, click **Resume** or create new project

3. Verify URL format:
   - Correct: `https://xxxxx.supabase.co`
   - Wrong: `vqznrnxssexbncfbwecg.supabase.co` (missing https://)

## 📝 Complete .env.local Template

Create/update `.env.local` in project root:

```env
# Supabase Configuration (REQUIRED for Email OTP)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Firebase Configuration (REQUIRED for Phone OTP)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDZy5OPQIdtNx0twbbEKJC9fVNljYaWumE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mahalakshmi-solar-enegies.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mahalakshmi-solar-enegies
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mahalakshmi-solar-enegies.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=78868777804
NEXT_PUBLIC_FIREBASE_APP_ID=1:78868777804:web:77e8b2a85e4d715f591de9
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-W60G2Q2VWB

# Site Configuration (Optional)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Mahalaxmi Solar Energies
```

## 🚀 After Fixing

1. **Restart dev server**:
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. **Test connection**:
   - Go to `/auth/login`
   - Try email OTP (requires Supabase)
   - Try phone OTP (requires Firebase)

## ⚠️ Important Notes

- **Supabase is required** for:
  - Email OTP authentication
  - User data storage
  - Database operations
  - Admin panel functionality

- **Firebase is required** for:
  - Phone OTP authentication
  - SMS delivery

- **Both are needed** for full functionality

## 🐛 Still Having Issues?

1. **Check Supabase Status**: https://status.supabase.com/
2. **Verify Project URL**: Must include `https://` prefix
3. **Check Project Status**: Ensure project is not paused
4. **Verify API Keys**: Copy fresh keys from Supabase dashboard
5. **Clear .next cache**: Delete `.next` folder and restart

---

**Quick Checklist:**
- [ ] Supabase project exists and is active
- [ ] `.env.local` file exists in project root
- [ ] `NEXT_PUBLIC_SUPABASE_URL` starts with `https://`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- [ ] Database schema has been run
- [ ] Dev server restarted after changes

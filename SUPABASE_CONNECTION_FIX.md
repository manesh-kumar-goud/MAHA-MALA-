# Supabase Connection Error Fix

## Error: `ERR_NAME_NOT_RESOLVED` for `vqznrnxssexbncfbwecg.supabase.co`

This error means your Supabase project URL cannot be resolved. This usually happens when:

1. **Supabase project doesn't exist** or was deleted
2. **Incorrect URL** in environment variables
3. **Missing `https://` prefix** in the URL
4. **Project is paused** or inactive

## ✅ Quick Fix Steps

### Step 1: Check Your Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Check if your project exists in the project list
3. If the project doesn't exist or was deleted, you need to create a new one

### Step 2: Get Correct Supabase Credentials

1. Go to your Supabase project (or create a new one)
2. Click on **Settings** (gear icon) → **API**
3. Copy the following:
   - **Project URL** (should look like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

### Step 3: Update Environment Variables

Create or update `.env.local` file in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here

# Make sure the URL starts with https://
# Make sure there are no spaces or quotes around the values
```

**Important:**
- ✅ URL must start with `https://`
- ✅ No trailing slashes
- ✅ No quotes around the values
- ✅ No spaces before or after the values

### Step 4: Restart Development Server

After updating `.env.local`:

1. **Stop the current server** (Press `Ctrl+C` in terminal)
2. **Delete `.next` folder** (optional, but recommended):
   ```bash
   rm -rf .next
   # Or on Windows:
   rmdir /s .next
   ```
3. **Restart the server**:
   ```bash
   npm run dev
   ```

### Step 5: Verify Connection

1. Open your browser console (F12)
2. Look for any Supabase warnings or errors
3. Try submitting a form again
4. Check if data is saved to Supabase database

## 🔍 Troubleshooting

### If Project Doesn't Exist

1. **Create New Supabase Project**:
   - Go to [Supabase](https://supabase.com/)
   - Click **New Project**
   - Fill in:
     - **Name**: Mahalaxmi Solar Energies
     - **Database Password**: (choose a strong password - save it!)
     - **Region**: Choose closest to India (e.g., `ap-south-1`)
   - Wait for project creation (~2 minutes)

2. **Set Up Database Schema**:
   - Go to **SQL Editor** in Supabase
   - Check if you have a `database/schema.sql` file
   - If yes, copy its contents and run it in SQL Editor
   - If no, create the `contact_inquiries` table:
     ```sql
     CREATE TABLE IF NOT EXISTS contact_inquiries (
       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
       name TEXT NOT NULL,
       email TEXT,
       phone TEXT,
       subject TEXT,
       message TEXT NOT NULL,
       status TEXT DEFAULT 'new',
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
     );
     ```

3. **Update `.env.local`** with new project credentials

### If URL Format is Wrong

**Wrong formats:**
```
vqznrnxssexbncfbwecg.supabase.co          ❌ Missing https://
https://vqznrnxssexbncfbwecg.supabase.co/ ❌ Trailing slash
"https://vqznrnxssexbncfbwecg.supabase.co" ❌ Quotes
```

**Correct format:**
```
https://vqznrnxssexbncfbwecg.supabase.co   ✅
```

### If Project is Paused

1. Go to Supabase Dashboard
2. Find your project
3. If it shows "Paused", click **Resume** or **Restore**
4. Wait for project to be active
5. Try again

## 📝 Complete .env.local Template

```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

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

## 🚀 After Fixing

1. **Test the connection**:
   - Submit a form on your website
   - Check Supabase dashboard → **Table Editor** → `contact_inquiries`
   - You should see the new entry

2. **Check browser console**:
   - Open DevTools (F12)
   - Look for any errors
   - Should see no Supabase connection errors

## ⚠️ Important Notes

- **Never commit `.env.local`** to Git (it's already in `.gitignore`)
- **Restart server** after changing environment variables
- **Clear browser cache** if issues persist
- **Check Supabase status**: https://status.supabase.com/

## 🆘 Still Having Issues?

1. **Verify Supabase project is active**:
   - Go to Supabase Dashboard
   - Check project status

2. **Test Supabase connection manually**:
   - Go to Supabase Dashboard → **Table Editor**
   - Try inserting a row manually
   - If that works, the issue is with your app configuration

3. **Check network connectivity**:
   - Try accessing `https://your-project-id.supabase.co` in browser
   - Should show Supabase API documentation

4. **Contact Support**:
   - Supabase Support: https://supabase.com/support
   - Check Supabase Discord: https://discord.supabase.com/

---

**Quick Checklist:**
- [ ] Supabase project exists and is active
- [ ] `.env.local` file exists in project root
- [ ] `NEXT_PUBLIC_SUPABASE_URL` starts with `https://`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- [ ] No quotes or spaces in environment variables
- [ ] Development server restarted after changes
- [ ] `.next` folder cleared (optional)




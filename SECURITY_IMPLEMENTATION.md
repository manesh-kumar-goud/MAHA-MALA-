# 🔒 Security Implementation Guide

## ✅ Security Layers Implemented

Your application now has **5 layers of security**:

### **Layer 1: Server-Side Middleware** ✅
- **File**: `middleware.ts`
- **Protection Level**: Server-side (cannot be bypassed)
- **What it does**:
  - Blocks unauthenticated users from `/dashboard/*`
  - Blocks non-admins from `/admin/*`
  - Redirects to login with return URL
  - Validates user session with Supabase
  - Checks user role from database

### **Layer 2: Client-Side Layout Protection** ✅
- **File**: `components/DashboardLayout.tsx`
- **Protection Level**: Client-side (backup layer)
- **What it does**:
  - Checks authentication on component mount
  - Redirects if not authenticated
  - Shows loading state during check
  - Hides admin links from regular users

### **Layer 3: Page-Level Auth Checks** ✅
- **Files**: All admin pages (`/app/admin/*`)
- **Protection Level**: Component-level
- **What it does**:
  - Validates user role (admin/super_admin)
  - Redirects non-admins to dashboard
  - Shows toast notifications for access denied

### **Layer 4: Row Level Security (RLS)** ✅
- **Database**: Supabase PostgreSQL
- **Protection Level**: Database-level (most secure)
- **What it does**:
  - Users can only see their own data
  - Admins can see all data
  - Automatic enforcement on all queries
  - Cannot be bypassed even with direct API access

### **Layer 5: API Route Protection** ✅
- **Via**: Supabase Auth
- **Protection Level**: API-level
- **What it does**:
  - All API calls require valid session
  - User context automatically injected
  - RLS policies apply to all operations

---

## 🛠️ Required Setup

### **Step 1: Install Required Package**

The middleware requires `@supabase/ssr` package:

```bash
cd MAHA-MALA-
npm install @supabase/ssr
```

### **Step 2: Restart Dev Server**

```bash
npm run dev
```

### **Step 3: Test Security**

1. **Try accessing dashboard without login:**
   - Visit: `http://localhost:3000/dashboard`
   - Should redirect to `/auth/login?redirect=/dashboard`

2. **Try accessing admin without admin role:**
   - Login as regular user
   - Try to visit: `http://localhost:3000/admin`
   - Should redirect to `/dashboard`

3. **Test as admin:**
   - Login as admin user
   - Should be able to access all admin routes

---

## 🔐 Route Protection Matrix

| Route Pattern | Access Level | Protection |
|--------------|--------------|------------|
| `/` | Public | None |
| `/about` | Public | None |
| `/services` | Public | None |
| `/subsidy` | Public | None |
| `/gallery` | Public | None |
| `/blog` | Public | None |
| `/contact` | Public | None |
| `/auth/login` | Public | None |
| `/leads-dashboard` | Public | None (intentionally public) |
| `/dashboard/*` | Authenticated Users | Middleware + Layout |
| `/admin/*` | Admin Only | Middleware + Page + RLS |

---

## 👥 User Roles

### **user** (Default)
- ✅ Can submit leads
- ✅ Can view own leads
- ✅ Can manage wallet
- ✅ Can view leaderboard
- ❌ Cannot access admin panel

### **admin**
- ✅ All user permissions
- ✅ Can manage leads
- ✅ Can process withdrawals
- ✅ Can manage content
- ✅ Can view analytics
- ❌ Cannot change system settings (super_admin only)

### **super_admin**
- ✅ All admin permissions
- ✅ Can manage other admins
- ✅ Can change system settings
- ✅ Full database access

---

## 🗄️ Database Security (RLS Policies)

### **Users Table**
```sql
-- Users can view their own profile
✅ SELECT: auth.uid() = id

-- Admins can view all users
✅ SELECT (admin): role IN ('admin', 'super_admin')

-- Users can update their own profile (name, bank details)
✅ UPDATE: auth.uid() = id

-- Only admins can change user roles
❌ UPDATE (role field): Restricted to admins
```

### **Leads Table**
```sql
-- Users can view their own leads
✅ SELECT: referrer_id = auth.uid()

-- Admins can view all leads
✅ SELECT (admin): role IN ('admin', 'super_admin')

-- Users can create leads
✅ INSERT: referrer_id = auth.uid()

-- Only admins can update lead status
✅ UPDATE (status): Admins only
```

### **Bank Details Table**
```sql
-- Users can view only their own bank details
✅ SELECT: user_id = auth.uid()

-- Users can update their own bank details
✅ UPDATE: user_id = auth.uid()

-- Admins can view all (for verification)
✅ SELECT (admin): role IN ('admin', 'super_admin')
```

### **Withdrawals Table**
```sql
-- Users can view their own withdrawals
✅ SELECT: user_id = auth.uid()

-- Users can create withdrawal requests
✅ INSERT: user_id = auth.uid()

-- Only admins can update withdrawal status
✅ UPDATE: Admins only
```

### **Rewards History Table**
```sql
-- Users can view their own reward history
✅ SELECT: user_id = auth.uid()

-- Only system/admins can add rewards
✅ INSERT: Admins only
```

### **Admin-Only Tables**
```sql
-- Gallery, Blog, Announcements, FAQs, Services, etc.
✅ SELECT: Public (everyone can view active items)
✅ INSERT/UPDATE/DELETE: Admins only
```

---

## 🔑 Authentication Flow

### **1. Login Process**
```
User enters phone/email
    ↓
OTP sent via Supabase Auth
    ↓
User enters OTP
    ↓
Supabase verifies OTP
    ↓
Session created (stored in cookies)
    ↓
User profile fetched from database
    ↓
Redirected to dashboard
```

### **2. Protected Route Access**
```
User visits /dashboard
    ↓
Middleware checks session cookie
    ↓
If no session → Redirect to /auth/login
    ↓
If session valid → Check user in database
    ↓
If user exists → Allow access
    ↓
Dashboard Layout loads
    ↓
Client-side check (backup)
    ↓
Content rendered
```

### **3. Admin Route Access**
```
User visits /admin
    ↓
Middleware checks session cookie
    ↓
If no session → Redirect to /auth/login
    ↓
If session valid → Query user role
    ↓
If role !== 'admin' or 'super_admin' → Redirect to /dashboard
    ↓
If admin → Allow access
    ↓
Admin page loads
    ↓
Page-level check (backup)
    ↓
Admin content rendered
```

---

## 🚨 Security Best Practices

### **1. Never Expose Secrets**
- ✅ Use environment variables (`.env.local`)
- ✅ Never commit `.env.local` to git (already in `.gitignore`)
- ✅ Use different credentials for dev/production

### **2. Validate All Input**
- ✅ Use Zod schemas for form validation
- ✅ Sanitize user input
- ✅ Check data types and lengths

### **3. Implement Rate Limiting**
For production, add rate limiting to:
- Login attempts
- OTP requests
- API calls

### **4. Use HTTPS in Production**
- ✅ Always use HTTPS
- ✅ Set secure cookie flags
- ✅ Enable HSTS headers

### **5. Regular Security Audits**
- Review user permissions quarterly
- Check for unused accounts
- Update dependencies regularly
- Monitor Supabase logs

---

## 🧪 Testing Security

### **Test 1: Unauthenticated Access**
```bash
# Clear cookies and try:
curl http://localhost:3000/dashboard
# Should redirect to login
```

### **Test 2: Non-Admin Accessing Admin**
```bash
# Login as regular user, then try:
curl http://localhost:3000/admin \
  -H "Cookie: your-session-cookie"
# Should redirect to dashboard
```

### **Test 3: RLS Policies**
```sql
-- Login as user A
-- Try to access user B's data:
SELECT * FROM leads WHERE referrer_id = 'user-b-id';
-- Should return empty (RLS blocks it)
```

### **Test 4: Bypassing Middleware**
```bash
# Try direct API call without auth:
curl https://your-project.supabase.co/rest/v1/users \
  -H "apikey: your-anon-key"
# Should return empty due to RLS
```

---

## 🛡️ Middleware Configuration

### **Protected Patterns**
```typescript
// Middleware runs on these paths:
matcher: [
  '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4)$).*)',
]
```

### **Public Routes**
```typescript
[
  '/',           // Homepage
  '/about',      // About page
  '/services',   // Services
  '/subsidy',    // Subsidy info
  '/gallery',    // Gallery
  '/blog',       // Blog
  '/contact',    // Contact
  '/auth/login', // Login page
  '/leads-dashboard', // Public lead dashboard
  '/faq',        // FAQs
]
```

### **Protected Routes**
```typescript
'/dashboard/*'  // Requires authentication
'/admin/*'      // Requires admin role
```

---

## 📊 Security Monitoring

### **What to Monitor**

1. **Failed Login Attempts**
   - Track in Supabase Auth logs
   - Set up alerts for multiple failures

2. **Unauthorized Access Attempts**
   - Monitor middleware redirects
   - Log blocked admin access

3. **Database Queries**
   - Check Supabase logs for suspicious queries
   - Monitor RLS policy violations

4. **API Usage**
   - Track API call frequency
   - Identify unusual patterns

### **Setting Up Monitoring**

In Supabase Dashboard:
1. Go to **Logs** section
2. Enable **Auth Logs**
3. Enable **Database Logs**
4. Set up **Log Drains** for production

---

## 🔧 Troubleshooting

### **Issue: Middleware not working**
```bash
# Check if @supabase/ssr is installed:
npm list @supabase/ssr

# If not installed:
npm install @supabase/ssr

# Restart server:
npm run dev
```

### **Issue: Always redirected to login**
```bash
# Check if session exists:
1. Open browser DevTools
2. Go to Application → Cookies
3. Look for Supabase session cookies
4. If missing, try logging in again
```

### **Issue: Admin can't access admin panel**
```sql
-- Check user role in Supabase:
SELECT id, name, role, is_active FROM users WHERE id = 'your-user-id';

-- Update role if needed:
UPDATE users SET role = 'admin' WHERE id = 'your-user-id';
```

### **Issue: RLS blocking admin**
```sql
-- Check if RLS is properly configured:
SELECT tablename, policyname, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';

-- If needed, re-run schema files
```

---

## ✅ Security Checklist

Before deploying to production:

- [ ] `@supabase/ssr` package installed
- [ ] Middleware.ts file created
- [ ] Environment variables set in production
- [ ] HTTPS enabled
- [ ] RLS policies verified in Supabase
- [ ] Admin user created and tested
- [ ] Regular user tested (ensure can't access admin)
- [ ] Unauthenticated access tested (redirects work)
- [ ] Session timeout configured
- [ ] Rate limiting implemented (production)
- [ ] Error logging set up
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] Supabase API keys kept secret
- [ ] Regular security audits scheduled

---

## 🆘 Emergency Procedures

### **If Compromised**

1. **Immediate Actions:**
   ```bash
   # Revoke all sessions in Supabase:
   # Go to Auth → Users → Select all → Sign out
   
   # Rotate API keys:
   # Go to Settings → API → Generate new keys
   
   # Update .env with new keys
   ```

2. **Investigate:**
   - Check Supabase logs
   - Review recent database changes
   - Identify compromised accounts

3. **Recover:**
   - Reset passwords for affected users
   - Restore from backup if needed
   - Implement additional security measures

---

## 📞 Support

For security issues:
- **Critical**: Contact immediately
- **Non-critical**: Create issue in repo
- **Questions**: Check Supabase docs

---

## 🎓 Additional Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Next.js Middleware Docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)

---

**Your application is now secured with industry-standard practices!** 🔒✨

*Last Updated: December 3, 2024*















# Deployment Guide

## 🚀 Vercel Deployment (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- Supabase project set up

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Mahalaxmi Solar Energies platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mahalakshmi-solar-web.git
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Step 3: Environment Variables

Add these in Vercel Project Settings → Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SITE_NAME=Mahalaxmi Solar Energies
```

### Step 4: Deploy

Click "Deploy" and wait ~2 minutes. Your site will be live! 🎉

### Step 5: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain (e.g., mahalakshmisolarpower.com)
3. Update DNS records as instructed
4. SSL certificate will be automatically provisioned

---

## 🌐 Alternative Deployment Options

### Option 1: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod
```

Configuration:
- Build command: `npm run build`
- Publish directory: `.next`

### Option 2: Railway

1. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

2. Login and deploy:
   ```bash
   railway login
   railway init
   railway up
   ```

3. Add environment variables in Railway dashboard

### Option 3: DigitalOcean App Platform

1. Go to [DigitalOcean Apps](https://cloud.digitalocean.com/apps)
2. Create New App → From GitHub
3. Select your repository
4. Configure:
   - Environment: Node.js
   - Build Command: `npm run build`
   - Run Command: `npm start`
5. Add environment variables
6. Deploy!

### Option 4: Self-Hosted (VPS)

#### Prerequisites
- Ubuntu 22.04 VPS
- Domain pointed to VPS
- SSH access

#### Setup Steps

```bash
# 1. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Install PM2
sudo npm install -g pm2

# 3. Clone repository
git clone https://github.com/YOUR_USERNAME/mahalakshmi-solar-web.git
cd mahalakshmi-solar-web

# 4. Install dependencies
npm install

# 5. Create .env.local
nano .env.local
# Add your environment variables

# 6. Build
npm run build

# 7. Start with PM2
pm2 start npm --name "mahalakshmi-solar" -- start
pm2 save
pm2 startup

# 8. Install Nginx
sudo apt update
sudo apt install nginx

# 9. Configure Nginx
sudo nano /etc/nginx/sites-available/mahalakshmi-solar
```

Nginx configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/mahalakshmi-solar /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Install SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## 🔒 Security Considerations

### Before Production

1. **Enable RLS**: Ensure Row Level Security is enabled on all Supabase tables
2. **API Keys**: Never expose service role key
3. **Environment Variables**: Keep .env.local out of git
4. **CORS**: Configure allowed origins in Supabase
5. **Rate Limiting**: Enable in Supabase settings
6. **SSL**: Always use HTTPS in production

### Supabase Production Settings

1. Go to Supabase Dashboard → Settings → API
2. Enable email confirmations
3. Set up email templates
4. Configure redirects for auth
5. Enable 2FA for admin accounts

---

## 📊 Performance Optimization

### Enable Caching

In `next.config.ts`:
```typescript
const nextConfig = {
  images: {
    domains: ['your-supabase-project.supabase.co'],
  },
  // Enable compression
  compress: true,
};
```

### Image Optimization

1. Use Next.js Image component
2. Store images in Supabase Storage
3. Enable CDN in Vercel

### Database Indexing

Already included in schema.sql, but verify:
```sql
-- Check indexes
SELECT * FROM pg_indexes WHERE schemaname = 'public';
```

---

## 🧪 CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 📱 Mobile App (Future)

The Flutter mobile app code structure is ready in `frontend/mobile/`.

To deploy mobile app:

### Android
1. Build APK: `flutter build apk`
2. Upload to Google Play Console

### iOS
1. Build IPA: `flutter build ios`
2. Upload to App Store Connect

---

## 🔄 Updates & Maintenance

### Regular Updates

```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Rebuild
npm run build

# Restart (if using PM2)
pm2 restart mahalakshmi-solar
```

### Database Migrations

For schema changes:
1. Create migration SQL file
2. Run in Supabase SQL Editor
3. Test thoroughly
4. Deploy

### Backup Strategy

1. **Database**: Supabase has automatic backups
2. **Manual Backup**:
   ```bash
   # Export database
   pg_dump -h your-db-host -U postgres your-db > backup.sql
   ```

---

## 📞 Post-Deployment Checklist

- [ ] All pages load correctly
- [ ] SSL certificate is active
- [ ] OTP authentication works
- [ ] Admin panel accessible
- [ ] Email notifications working
- [ ] Mobile responsive
- [ ] SEO meta tags present
- [ ] Analytics configured
- [ ] Error tracking set up (Sentry)
- [ ] Performance monitoring
- [ ] Backup strategy in place
- [ ] Domain configured
- [ ] Social media links work

---

## 🎯 Monitoring

### Vercel Analytics (Built-in)

Automatic in Vercel deployment

### Google Analytics

Add to `app/layout.tsx`:
```tsx
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_ID"
  strategy="afterInteractive"
/>
```

### Error Tracking (Sentry)

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

---

## 🚨 Troubleshooting

### Build Failures
- Check Node.js version
- Clear `.next` directory
- Verify all environment variables

### Runtime Errors
- Check Vercel logs
- Verify Supabase connection
- Check browser console

### Performance Issues
- Enable caching
- Optimize images
- Use CDN
- Check database indexes

---

**Your application is now live and ready to handle users! 🎉**

For support: info@mahalakshmisolarpower.com





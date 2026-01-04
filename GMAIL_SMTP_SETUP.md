# Gmail SMTP Setup Guide

This guide will help you set up Gmail SMTP to receive email notifications when customers submit subsidy inquiries or contact forms.

## 📧 Step 1: Enable 2-Step Verification

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** in the left sidebar
3. Under "Signing in to Google", find **2-Step Verification**
4. Click on it and follow the prompts to enable 2-Step Verification
   - You'll need to verify your phone number
   - Google will send you a verification code

## 🔑 Step 2: Generate App Password

1. After enabling 2-Step Verification, go back to **Security** settings
2. Look for **App passwords** (it appears after 2-Step Verification is enabled)
3. Click on **App passwords**
4. You may need to sign in again
5. Select **Mail** as the app
6. Select **Other (Custom name)** as the device
7. Enter a name like "Mahalaxmi Solar Website" and click **Generate**
8. **Copy the 16-character password** that appears (you won't see it again!)
   - It will look like: `abcd efgh ijkl mnop`
   - Remove spaces when using it: `abcdefghijklmnop`

## ⚙️ Step 3: Configure Environment Variables

Add these variables to your `.env.local` file (create it if it doesn't exist):

```env
# Gmail SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-character-app-password
RECIPIENT_EMAIL=your-email@gmail.com
```

### Explanation:
- **SMTP_HOST**: Gmail's SMTP server (usually `smtp.gmail.com`)
- **SMTP_PORT**: Port for TLS encryption (587) or SSL (465)
- **SMTP_USER**: Your Gmail address (e.g., `yourname@gmail.com`)
- **SMTP_PASSWORD**: The 16-character App Password you generated (no spaces)
- **RECIPIENT_EMAIL**: Where you want to receive emails (can be same as SMTP_USER or different)

## 🔒 Step 4: Security Notes

### Important:
- **Never commit `.env.local` to Git** - it's already in `.gitignore`
- **App Passwords are safer** than using your regular Gmail password
- If you change your Gmail password, you'll need to generate a new App Password
- You can revoke App Passwords anytime from Google Account settings

### Alternative: Use a Different Email Service

If you prefer not to use Gmail, you can use:
- **Outlook/Hotmail**: `smtp-mail.outlook.com` (port 587)
- **Yahoo**: `smtp.mail.yahoo.com` (port 587)
- **Custom SMTP**: Any email service that supports SMTP

Just update the `SMTP_HOST` and `SMTP_PORT` accordingly.

## ✅ Step 5: Test the Setup

1. Start your development server: `npm run dev`
2. Go to your website and submit a subsidy inquiry or contact form
3. Check your email inbox (and spam folder) for the notification

## 🐛 Troubleshooting

### Error: "Invalid login"
- Make sure you're using the **App Password**, not your regular Gmail password
- Verify the password has no spaces
- Check that 2-Step Verification is enabled

### Error: "Connection timeout"
- Check your firewall/antivirus isn't blocking port 587
- Try using port 465 with `secure: true` in the code (change `SMTP_PORT=465`)

### Error: "Authentication failed"
- Regenerate the App Password
- Make sure you copied the full 16-character password
- Verify your Gmail address is correct

### Emails going to spam
- Check your spam/junk folder
- Mark the email as "Not Spam"
- Add the sender email to your contacts

## 📝 Example .env.local File

```env
# Database
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key

# Gmail SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=yourname@gmail.com
SMTP_PASSWORD=abcdefghijklmnop
RECIPIENT_EMAIL=yourname@gmail.com
```

## 🚀 Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Add the same environment variables in your hosting platform's dashboard
2. Go to **Settings** → **Environment Variables**
3. Add each variable:
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASSWORD`
   - `RECIPIENT_EMAIL`
4. Redeploy your application

### Vercel Example:
1. Go to your project on Vercel
2. Click **Settings** → **Environment Variables**
3. Add each variable with the appropriate value
4. Click **Save**
5. Redeploy from **Deployments** tab

## 📧 Email Format

The emails you receive will include:
- **For Subsidy Inquiries**: Name, Phone, Email, City, Property Type, Notes
- **For Contact Forms**: Name, Email, Phone, Subject, Message
- Timestamp of submission
- Professional HTML formatting

## 🎉 You're All Set!

Once configured, you'll automatically receive email notifications whenever someone:
- Submits a subsidy inquiry through the popup modal
- Submits a contact form on your website

The emails will be sent to the address specified in `RECIPIENT_EMAIL`.




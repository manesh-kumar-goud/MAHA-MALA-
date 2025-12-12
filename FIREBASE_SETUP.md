# Firebase Phone OTP Setup Guide

This guide will help you set up Firebase Authentication for phone number OTP verification.

## 📋 Prerequisites

1. A Firebase account (free tier is sufficient)
2. A Firebase project created
3. Phone Authentication enabled in Firebase Console

## 🚀 Step-by-Step Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard
4. Enable Google Analytics (optional)

### 2. Enable Phone Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Phone** provider
3. Click **Enable**
4. For production, you'll need to verify your app domain
5. Click **Save**

### 3. Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click on the **Web** icon (`</>`) to add a web app
4. Register your app with a nickname (e.g., "Mahalaxmi Solar Web")
5. Copy the Firebase configuration object

You'll get something like:
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 4. Configure Environment Variables

Add these to your `.env.local` file:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 5. Install Firebase (if not already installed)

```bash
npm install firebase
```

### 6. Configure reCAPTCHA Domain

For phone authentication, Firebase uses reCAPTCHA. You need to:

1. Go to Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Add your domain (e.g., `localhost` for development, your production domain)
3. For localhost, it's usually added automatically

### 7. Test Phone Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/auth/login`
3. Click on **Phone** tab
4. Enter a phone number (format: 9876543210)
5. Click "Send Code"
6. Enter the OTP received via SMS
7. Complete registration

## 🔧 Troubleshooting

### Issue: "reCAPTCHA not loaded"

**Solution:**
- Make sure your domain is authorized in Firebase Console
- Check browser console for errors
- Try clearing browser cache
- Ensure Firebase config is correct

### Issue: "Phone number format invalid"

**Solution:**
- Phone numbers should be 10 digits (without country code)
- The app automatically adds +91 (India) country code
- For other countries, modify the format in `lib/auth.ts`

### Issue: "OTP not received"

**Solution:**
- Check if phone number is correct
- Verify Firebase Phone Authentication is enabled
- Check Firebase Console → Authentication → Users for verification status
- For testing, Firebase provides test phone numbers (check Firebase docs)

### Issue: "Firebase Auth not initialized"

**Solution:**
- Verify all environment variables are set correctly
- Check `lib/firebase/config.ts` for proper initialization
- Ensure Firebase SDK is installed: `npm install firebase`

## 📱 Testing Phone Numbers

Firebase provides test phone numbers for development:

1. Go to Firebase Console → **Authentication** → **Sign-in method** → **Phone**
2. Scroll to **Phone numbers for testing**
3. Add test phone numbers with test OTP codes
4. Use these numbers during development (no actual SMS sent)

Example test number:
- Phone: `+91 9876543210`
- Code: `123456`

## 🚀 Production Setup

### 1. Verify App Domain

1. In Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Add your production domain
3. Remove `localhost` if not needed

### 2. Enable App Check (Recommended)

1. Go to Firebase Console → **App Check**
2. Register your app
3. Configure reCAPTCHA v3
4. This helps prevent abuse

### 3. Set Up Billing (if needed)

- Firebase Phone Authentication has a free tier
- After free tier, charges apply per SMS
- Check Firebase pricing for details

## 🔐 Security Best Practices

1. **Enable App Check** to prevent abuse
2. **Set up rate limiting** in Firebase Console
3. **Monitor usage** in Firebase Console → Usage
4. **Use test numbers** during development
5. **Verify phone numbers** before allowing access

## 📚 Additional Resources

- [Firebase Phone Auth Documentation](https://firebase.google.com/docs/auth/web/phone-auth)
- [Firebase Pricing](https://firebase.google.com/pricing)
- [reCAPTCHA Setup](https://firebase.google.com/docs/auth/web/phone-auth#recaptcha-setup)

## ✅ Verification Checklist

- [ ] Firebase project created
- [ ] Phone Authentication enabled
- [ ] Environment variables configured
- [ ] Firebase SDK installed
- [ ] Domain authorized in Firebase Console
- [ ] Test phone number added (optional)
- [ ] Tested phone OTP flow
- [ ] Production domain configured (for deployment)

---

**Note:** Phone OTP via Firebase requires actual SMS delivery, which may incur costs after the free tier. For development, use Firebase test phone numbers to avoid charges.




# Firebase Billing Error Fix Guide

## Error: `auth/billing-not-enabled`

Even if billing is enabled, this error can occur. Here's how to fix it:

## ✅ Step-by-Step Fix

### 1. **Verify Blaze Plan (Pay-as-you-go)**

Firebase Phone Authentication requires the **Blaze plan** (not just billing enabled):

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** (gear icon) → **Usage and billing**
4. Click **Modify plan**
5. Select **Blaze Plan** (Pay-as-you-go)
6. Complete the upgrade process

### 2. **Link Billing Account**

1. In Firebase Console → **Project Settings** → **Usage and billing**
2. Click **Link billing account**
3. Select or create a Google Cloud billing account
4. Ensure the billing account is **active** and **verified**

### 3. **Verify Billing Account Status**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **Billing** → **Account management**
3. Check that:
   - ✅ Billing account status is **Active**
   - ✅ Payment method is valid
   - ✅ Account is linked to your Firebase project

### 4. **Enable Phone Authentication API**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Navigate to **APIs & Services** → **Library**
4. Search for **Identity Toolkit API**
5. Click **Enable** if not already enabled

### 5. **Wait for Propagation**

After enabling billing:
- Wait **5-15 minutes** for changes to propagate
- Clear browser cache
- Try again

### 6. **Check Firebase Console**

1. Go to Firebase Console → **Authentication** → **Sign-in method**
2. Click on **Phone** provider
3. Verify it shows **Enabled** (not just configured)
4. Check for any error messages

## 🔍 Troubleshooting

### Issue: "Billing account not found"

**Solution:**
- Create a new billing account in Google Cloud Console
- Link it to your Firebase project
- Wait 5-10 minutes

### Issue: "Payment method invalid"

**Solution:**
- Update payment method in Google Cloud Console
- Ensure card is not expired
- Verify billing address matches card

### Issue: "Project not upgraded"

**Solution:**
- Go to Firebase Console → Project Settings → Usage and billing
- Click **Upgrade to Blaze**
- Complete the upgrade process

### Issue: "API not enabled"

**Solution:**
- Enable Identity Toolkit API in Google Cloud Console
- Wait a few minutes for activation
- Try again

## 📋 Verification Checklist

- [ ] Project is on **Blaze Plan** (not Spark/Free)
- [ ] Billing account is **linked** to Firebase project
- [ ] Billing account status is **Active**
- [ ] Payment method is **valid** and not expired
- [ ] **Identity Toolkit API** is enabled
- [ ] Phone Authentication is **enabled** in Firebase Console
- [ ] Waited **5-15 minutes** after changes
- [ ] Cleared browser cache

## 🧪 Test After Fix

1. Go to `/auth/login`
2. Select **Phone** tab
3. Enter a test phone number
4. Click **Send Code**
5. Should receive OTP without billing error

## 💡 Alternative: Use Test Phone Numbers

While fixing billing, you can use Firebase test phone numbers:

1. Go to Firebase Console → **Authentication** → **Sign-in method** → **Phone**
2. Scroll to **Phone numbers for testing**
3. Add test number: `+91 9876543210` with code: `123456`
4. Use this number during development (no SMS sent, no billing required)

## 📞 Still Having Issues?

If billing is enabled but error persists:

1. **Check Firebase Status**: https://status.firebase.google.com/
2. **Contact Firebase Support**: https://firebase.google.com/support
3. **Check Google Cloud Billing**: Ensure account is not suspended
4. **Verify Project Permissions**: Ensure you have Owner/Billing Admin role

## ⚠️ Important Notes

- **Blaze Plan** is required (not just billing enabled)
- Free tier has **limited** phone authentication
- After upgrading, wait **5-15 minutes** for activation
- Test phone numbers work without billing (for development only)

---

**Last Updated**: $(date)

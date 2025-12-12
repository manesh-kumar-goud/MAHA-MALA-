// Client-side only Firebase auth functions
import { getFirebaseAuth } from './config';

export async function sendPhoneOTP(phoneNumber: string) {
  if (typeof window === 'undefined') {
    throw new Error('Phone OTP can only be sent from the client side.');
  }

  const { signInWithPhoneNumber, RecaptchaVerifier } = await import('firebase/auth');
  const auth = await getFirebaseAuth();

  if (!auth) {
    throw new Error('Firebase Auth is not initialized. Please check your Firebase configuration.');
  }

  // Format phone number (ensure +91 country code)
  const formattedPhone = phoneNumber.startsWith('+91') 
    ? phoneNumber 
    : phoneNumber.startsWith('91') 
    ? `+${phoneNumber}`
    : `+91${phoneNumber.replace(/\D/g, '')}`;

  // Set up reCAPTCHA verifier
  const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved, allow sendOTP
    },
    'expired-callback': () => {
      // Response expired, ask user to solve reCAPTCHA again
      throw new Error('reCAPTCHA expired. Please try again.');
    }
  });

  try {
    // Send OTP via Firebase
    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
    
    // Clean up recaptcha verifier
    recaptchaVerifier.clear();
    
    return confirmationResult;
  } catch (error: any) {
    // Clean up recaptcha verifier on error
    recaptchaVerifier.clear();
    
    // Handle specific Firebase errors
    if (error.code === 'auth/billing-not-enabled') {
      throw new Error('Firebase billing is not properly configured. Please check: 1) Billing account is linked to Firebase project, 2) Project is on Blaze plan, 3) Billing account is verified and active.');
    } else if (error.code === 'auth/invalid-phone-number') {
      throw new Error('Invalid phone number format. Please enter a valid 10-digit phone number.');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many requests. Please try again later.');
    } else if (error.code === 'auth/quota-exceeded') {
      throw new Error('SMS quota exceeded. Please check your Firebase billing and quotas.');
    }
    
    // Re-throw with original message
    throw error;
  }
}

export async function verifyPhoneOTP(confirmationResult: any, otp: string) {
  if (typeof window === 'undefined') {
    throw new Error('Phone OTP can only be verified from the client side.');
  }

  if (!confirmationResult) {
    throw new Error('No OTP session found. Please request a new OTP.');
  }

  // Verify OTP with Firebase
  const userCredential = await confirmationResult.confirm(otp);
  const firebaseUser = userCredential.user;
  
  if (!firebaseUser || !firebaseUser.phoneNumber) {
    throw new Error('Phone verification failed.');
  }

  return firebaseUser;
}

export async function getFirebaseCurrentUser() {
  if (typeof window === 'undefined') {
    return null;
  }

  const auth = await getFirebaseAuth();
  return auth?.currentUser || null;
}

export async function signOutFirebase() {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const auth = await getFirebaseAuth();
    const { signOut: firebaseSignOut } = await import('firebase/auth');
    
    if (auth) {
      await firebaseSignOut(auth);
    }
    // Clear Firebase auth from localStorage
    localStorage.removeItem('firebase_auth_phone');
    localStorage.removeItem('firebase_auth_uid');
  } catch (error) {
    console.log('Firebase sign out error:', error);
    // Clear localStorage anyway
    localStorage.removeItem('firebase_auth_phone');
    localStorage.removeItem('firebase_auth_uid');
  }
}




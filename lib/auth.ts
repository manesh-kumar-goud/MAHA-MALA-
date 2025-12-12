import { supabase } from './supabase/client';

export interface AuthUser {
  id: string;
  phone: string;
  email?: string;
}

// Store confirmation result for phone OTP (will be typed dynamically)
let phoneConfirmationResult: any = null;

export async function sendOTP(emailOrPhone: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if input is email or phone
    const isEmail = emailOrPhone.includes('@');
    
    if (isEmail) {
      // Use Supabase email OTP (free, works immediately)
      if (!supabase) {
        throw new Error('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
      }
      
      const { error } = await supabase.auth.signInWithOtp({
        email: emailOrPhone,
      });
      if (error) throw error;
      return { success: true };
    } else {
      // Use Firebase phone OTP (client-side only)
      if (typeof window === 'undefined') {
        throw new Error('Phone OTP can only be sent from the client side.');
      }

      // Dynamically import client-side Firebase auth functions
      const { sendPhoneOTP } = await import('./firebase/auth-client');
      const confirmationResult = await sendPhoneOTP(emailOrPhone);
      phoneConfirmationResult = confirmationResult;

    return { success: true };
    }
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    return { success: false, error: error.message || 'Failed to send OTP. Please try again.' };
  }
}

export async function verifyOTP(
  emailOrPhone: string,
  otp: string
): Promise<{ success: boolean; error?: string; userId?: string }> {
  try {
    const isEmail = emailOrPhone.includes('@');

    if (isEmail) {
      // Verify email OTP with Supabase
      const { data, error } = await supabase.auth.verifyOtp({
        email: emailOrPhone,
        token: otp,
        type: 'email',
      });
      if (error) throw error;
      
      // Log session info for debugging
      console.log('Session created:', data.session ? 'YES' : 'NO');
      if (data.session) {
        console.log('Session expires:', data.session.expires_at);
      }
      
      return { success: true, userId: data.user?.id };
    } else {
      // Verify phone OTP with Firebase (client-side only)
      if (typeof window === 'undefined') {
        throw new Error('Phone OTP can only be verified from the client side.');
      }

      if (!phoneConfirmationResult) {
        throw new Error('No OTP session found. Please request a new OTP.');
      }

      // Dynamically import client-side Firebase auth functions
      const { verifyPhoneOTP } = await import('./firebase/auth-client');
      const firebaseUser = await verifyPhoneOTP(phoneConfirmationResult, otp);
      
      if (!firebaseUser || !firebaseUser.phoneNumber) {
        throw new Error('Phone verification failed.');
      }

      // Create or get user in Supabase using Firebase UID
      const phoneNumber = firebaseUser.phoneNumber;
      
      // Check if user exists in Supabase by phone number
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('phone_number', phoneNumber)
        .maybeSingle();

      let userId: string;
      
      if (existingUser) {
        userId = existingUser.id;
        // Update user ID to Firebase UID if different (for consistency)
        if (existingUser.id !== firebaseUser.uid) {
          await supabase
            .from('users')
            .update({ id: firebaseUser.uid })
            .eq('id', existingUser.id);
          userId = firebaseUser.uid;
        }
      } else {
        // Create new user in Supabase with Firebase UID
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            id: firebaseUser.uid,
            phone_number: phoneNumber,
            name: '', // Will be filled in name step
          })
          .select('id')
          .single();

        if (insertError) {
          // If insert fails (maybe duplicate), try to get existing user
          const { data: userData } = await supabase
            .from('users')
            .select('id')
            .eq('phone_number', phoneNumber)
            .maybeSingle();
          
          if (!userData) {
            throw new Error('Failed to create user profile: ' + insertError.message);
          }
          userId = userData.id;
        } else {
          userId = newUser.id;
        }
      }
      
      // Store Firebase auth state in localStorage for session persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('firebase_auth_phone', phoneNumber);
        localStorage.setItem('firebase_auth_uid', firebaseUser.uid);
      }
      
      // Clear confirmation result
      phoneConfirmationResult = null;
      
      return { success: true, userId };
    }
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    return { success: false, error: error.message || 'Invalid OTP. Please try again.' };
  }
}

export async function getCurrentUser() {
  try {
    // Check Firebase auth first (for phone users) - client-side only
    if (typeof window !== 'undefined') {
      const { getFirebaseCurrentUser } = await import('./firebase/auth-client');
      const firebaseUser = await getFirebaseCurrentUser();
      
      // Also check localStorage for Firebase auth state
      const firebasePhone = localStorage.getItem('firebase_auth_phone');
      const firebaseUid = localStorage.getItem('firebase_auth_uid');
      
      if ((firebaseUser && firebaseUser.phoneNumber) || firebasePhone) {
        const phoneNumber = firebaseUser?.phoneNumber || firebasePhone;
        
        if (phoneNumber) {
          // User authenticated via Firebase phone
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('phone_number', phoneNumber)
            .maybeSingle();

          if (error) {
            console.error('Error fetching Firebase user:', error);
          }

          if (userData) {
            return userData;
          }
        }
      }
    }

    // Check Supabase auth (for email users)
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return null;
    }

    // Get user details from database
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    if (!userData) {
      console.log('User profile not found in database');
      return null;
    }

    return userData;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function createOrUpdateUser(userId: string, name: string, emailOrPhone: string) {
  try {
    const isEmail = emailOrPhone.includes('@');
    
    // First, check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (existingUser) {
      // User exists, update it
      const { data, error } = await supabase
        .from('users')
        .update({
          name: name,
          email: isEmail ? emailOrPhone : null,
          phone_number: !isEmail ? emailOrPhone : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Update error:', error);
        throw error;
      }
      return { success: true, user: data };
    } else {
      // User doesn't exist, insert new one
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: userId,
          name: name,
          email: isEmail ? emailOrPhone : null,
          phone_number: !isEmail ? emailOrPhone : null,
        })
        .select()
        .single();

      if (error) {
        console.error('Insert error:', error);
        throw error;
      }
      return { success: true, user: data };
    }
  } catch (error: any) {
    console.error('Error creating/updating user:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return { success: false, error: error.message || 'Failed to create user profile' };
  }
}

export async function signOut() {
  try {
    // Sign out from Firebase if authenticated (client-side only)
    if (typeof window !== 'undefined') {
      try {
        const { signOutFirebase } = await import('./firebase/auth-client');
        await signOutFirebase();
      } catch (firebaseError) {
        console.log('Firebase sign out error (may not be signed in):', firebaseError);
      }
    }

    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error('Error signing out:', error);
    return { success: false, error: error.message };
  }
}

export async function checkUserExists(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, phone_number')
      .eq('id', userId)
      .maybeSingle();

    // User exists if we got data and has a name
    if (data && data.name) {
      console.log('User exists:', data.name);
      return true;
    }
    
    console.log('User not found or incomplete profile');
    return false;
  } catch (error) {
    console.error('Error checking user:', error);
    return false;
  }
}


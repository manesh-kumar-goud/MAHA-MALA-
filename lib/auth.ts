import { supabase } from './supabase/client';

export interface AuthUser {
  id: string;
  phone: string;
  email?: string;
}

export async function sendOTP(emailOrPhone: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if input is email or phone
    const isEmail = emailOrPhone.includes('@');
    
    if (isEmail) {
      // Use email OTP (free, works immediately)
      const { error } = await supabase.auth.signInWithOtp({
        email: emailOrPhone,
      });
      if (error) throw error;
    } else {
      // Use phone OTP (requires SMS provider configuration)
      const formattedPhone = emailOrPhone.startsWith('+91') ? emailOrPhone : `+91${emailOrPhone}`;
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });
      if (error) throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    return { success: false, error: error.message };
  }
}

export async function verifyOTP(
  emailOrPhone: string,
  otp: string
): Promise<{ success: boolean; error?: string; userId?: string }> {
  try {
    const isEmail = emailOrPhone.includes('@');

    if (isEmail) {
      // Verify email OTP
      const { data, error } = await supabase.auth.verifyOtp({
        email: emailOrPhone,
        token: otp,
        type: 'email',
      });
      if (error) throw error;
      return { success: true, userId: data.user?.id };
    } else {
      // Verify phone OTP
      const formattedPhone = emailOrPhone.startsWith('+91') ? emailOrPhone : `+91${emailOrPhone}`;
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms',
      });
      if (error) throw error;
      return { success: true, userId: data.user?.id };
    }
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    return { success: false, error: error.message };
  }
}

export async function getCurrentUser() {
  try {
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


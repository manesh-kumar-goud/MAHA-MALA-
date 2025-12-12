import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate Supabase configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase configuration missing. Email OTP will not work.');
  console.warn('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  console.warn('Get your credentials from: https://supabase.com/dashboard/project/_/settings/api');
}

// Only create client if we have valid credentials
// This prevents connection errors when Supabase is not configured
let supabase: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your-project-url.supabase.co') {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        storage: typeof window !== 'undefined' ? window.sessionStorage : undefined,
        storageKey: 'supabase-auth-token',
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  } catch (error) {
    console.error('❌ Error creating Supabase client:', error);
    console.warn('⚠️ Supabase client not initialized. Please check your configuration.');
  }
} else {
  console.warn('⚠️ Supabase not configured. Using placeholder client (features will be limited).');
  // Create a dummy client that won't make network requests
  supabase = createClient('https://placeholder.supabase.co', 'placeholder-key', {
    auth: {
      persistSession: false,
    }
  }) as any;
}

export { supabase };





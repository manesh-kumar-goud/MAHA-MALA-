// Firebase config - only loads on client side
let app: any = undefined;
let auth: any = null;

export async function getFirebaseAuth() {
  // Only initialize on client side
  if (typeof window === 'undefined') {
    return null;
  }

  // Return cached auth if already initialized
  if (auth) {
    return auth;
  }

  try {
    const { initializeApp, getApps } = await import('firebase/app');
    const { getAuth } = await import('firebase/auth');

const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDZy5OPQIdtNx0twbbEKJC9fVNljYaWumE",
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mahalakshmi-solar-enegies.firebaseapp.com",
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mahalakshmi-solar-enegies",
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mahalakshmi-solar-enegies.firebasestorage.app",
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "78868777804",
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:78868777804:web:77e8b2a85e4d715f591de9",
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-W60G2Q2VWB",
    };

    if (getApps().length === 0) {
      if (firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId) {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
      } else {
        console.warn('Firebase configuration incomplete. Phone OTP will not work.');
        return null;
      }
    } else {
      app = getApps()[0];
      auth = getAuth(app);
    }

    return auth;
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    return null;
  }
}
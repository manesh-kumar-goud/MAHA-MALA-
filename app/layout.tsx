import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mahalaxmi Solar Energies - Leading Solar Power Solutions',
  description:
    'Mahalaxmi Solar Energies provides top-quality solar power solutions for homes and businesses. Get government subsidies, professional installation, and join our referral program to earn rewards.',
  keywords:
    'solar power, solar panels, renewable energy, government subsidy, solar installation, Mahalaxmi Solar, PM Surya Ghar',
  authors: [{ name: 'Mahalaxmi Solar Energies' }],
  openGraph: {
    title: 'Mahalaxmi Solar Energies - Leading Solar Power Solutions',
    description:
      'Professional solar power solutions with government subsidies. Join our referral program and earn rewards!',
    url: 'https://mahalakshmisolarpower.com',
    siteName: 'Mahalaxmi Solar Energies',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mahalaxmi Solar Energies',
    description: 'Leading Solar Power Solutions Provider',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}

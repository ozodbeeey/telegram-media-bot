
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GoTV - Online TV Platform',
  description: 'Watch Live TV and Movies in HD quality.',
};

import { AuthProvider } from '@/lib/auth';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="pt-16 min-h-screen">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}

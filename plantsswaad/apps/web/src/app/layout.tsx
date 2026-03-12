import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PlanetsSwaad | Swad Jo Dil Ko Chhoo Jaye',
  description: 'A cloud kitchen from Bhagalpur delivering fresh, wholesome, and delicious vegetarian meals.',
};

import { CartDrawer } from '@/components/CartDrawer';
import { Navbar } from '@/components/Navbar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased min-h-screen flex flex-col font-sans selection:bg-nature-500 selection:text-white">
        <Navbar />
        <main className="flex-grow pt-24">
          {children}
        </main>
        <CartDrawer />
      </body>
    </html>
  );
}

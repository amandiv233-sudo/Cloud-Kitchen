import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import Script from 'next/script';
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
  metadataBase: new URL('https://planetsswaad.netlify.app'),
  title: {
    default: 'PlanetsSwaad | Best Cloud Kitchen & Food Delivery in Bhagalpur Bihar',
    template: '%s | PlanetsSwaad — Cloud Kitchen Bhagalpur',
  },
  description:
    'Order delicious food online from PlanetsSwaad, Bhagalpur\'s top cloud kitchen. Fast delivery, 100% pure veg North Indian meals, biryani, thali & more. Swad jo dil ko chhoo jaye!',
  keywords: [
    'cloud kitchen Bhagalpur',
    'online food delivery Bhagalpur',
    'food delivery Bhagalpur Bihar',
    'best cloud kitchen Bhagalpur',
    'PlanetsSwaad Bhagalpur',
    'home delivery food Bhagalpur',
    'biryani delivery Bhagalpur',
    'tiffin service Bhagalpur',
    'veg food delivery Bhagalpur',
    'North Indian food delivery Bhagalpur',
    'fast food delivery Bhagalpur',
    'ghost kitchen Bhagalpur',
    'food delivery Nathnagar',
    'food delivery Adampur Bhagalpur',
  ],
  authors: [{ name: 'PlanetsSwaad', url: 'https://planetsswaad.netlify.app' }],
  creator: 'PlanetsSwaad',
  publisher: 'PlanetsSwaad',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://planetsswaad.netlify.app',
    siteName: 'PlanetsSwaad',
    title: 'PlanetsSwaad | Best Cloud Kitchen & Food Delivery in Bhagalpur Bihar',
    description:
      'Order delicious food online from PlanetsSwaad, Bhagalpur\'s #1 cloud kitchen. Fast delivery, 100% pure veg North Indian meals. Swad jo dil ko chhoo jaye!',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PlanetsSwaad — Cloud Kitchen Bhagalpur Bihar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PlanetsSwaad | Cloud Kitchen Bhagalpur',
    description: 'Fast food delivery in Bhagalpur Bihar. 100% pure veg. Order now!',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://planetsswaad.netlify.app',
  },
  category: 'food',
  verification: {
    google: 'google7097484d9b59deef',
  },
};

import { CartDrawer } from '@/components/CartDrawer';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Restaurant', 'LocalBusiness', 'FoodEstablishment'],
        '@id': 'https://planetsswaad.netlify.app/#organization',
        name: 'PlanetsSwaad',
        alternateName: 'Planets Swaad',
        url: 'https://planetsswaad.netlify.app',
        logo: 'https://planetsswaad.netlify.app/logo.png',
        image: 'https://planetsswaad.netlify.app/og-image.jpg',
        description:
          'PlanetsSwaad is Bhagalpur\'s top cloud kitchen offering fast delivery of 100% pure veg North Indian food including biryani, thali, and daily tiffin service.',
        slogan: 'Swad Jo Dil Ko Chhoo Jaye',
        telephone: '+91-XXXXXXXXXX',
        servesCuisine: ['North Indian', 'Vegetarian', 'Indian'],
        hasMenu: 'https://planetsswaad.netlify.app/menu',
        priceRange: '₹₹',
        currenciesAccepted: 'INR',
        paymentAccepted: 'Cash, UPI, Credit Card, Debit Card',
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            opens: '09:00',
            closes: '23:00',
          },
        ],
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Bhagalpur',
          addressRegion: 'Bihar',
          postalCode: '812001',
          addressCountry: 'IN',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: '25.2425',
          longitude: '86.9842',
        },
        areaServed: [
          { '@type': 'City', name: 'Bhagalpur' },
          { '@type': 'AdministrativeArea', name: 'Bihar' },
        ],
        sameAs: [
          'https://www.zomato.com',
          'https://www.facebook.com',
          'https://www.instagram.com',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://planetsswaad.netlify.app/#website',
        url: 'https://planetsswaad.netlify.app',
        name: 'PlanetsSwaad',
        description: 'Cloud Kitchen & Food Delivery in Bhagalpur Bihar',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://planetsswaad.netlify.app/menu?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col font-sans selection:bg-nature-500 selection:text-white">
        {/* Google Analytics 4 — G-PST1WK4X7M */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PST1WK4X7M"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PST1WK4X7M', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        <Navbar />
        <main className="flex-grow pt-24">
          {children}
        </main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}

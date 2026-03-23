import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CategoryOrbit } from '@/components/CategoryOrbit';
import { FeaturedItems } from '@/components/FeaturedItems';

export const metadata: Metadata = {
  title: 'Online Food Delivery in Bhagalpur | PlanetsSwaad Cloud Kitchen',
  description:
    'Order food online from PlanetsSwaad — Bhagalpur\'s fastest cloud kitchen. 100% pure veg North Indian meals, biryani, thali & tiffin delivered to your door. Swad jo dil ko chhoo jaye!',
  alternates: { canonical: 'https://planetsswaad.netlify.app/' },
  openGraph: {
    title: 'PlanetsSwaad | #1 Cloud Kitchen Food Delivery Bhagalpur Bihar',
    description: 'Bhagalpur\'s favourite cloud kitchen. Order hot, fresh, 100% veg food delivered fast!',
    url: 'https://planetsswaad.netlify.app/',
  },
};


export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[65vh] md:h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-12 md:pt-0">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0 after:content-[''] after:absolute after:inset-0 after:bg-nature-900/60 after:z-10">
          <Image
            src="https://images.unsplash.com/photo-1543362906-acfc16c67564?q=80&w=2600&auto=format&fit=crop"
            alt="Authentic Indian Food Background"
            fill
            className="object-cover object-center animate-pulse duration-1000"
            priority
          />
        </div>

        <div className="relative z-20 max-w-4xl mx-auto flex flex-col items-center space-y-6 animate-fade-in-up mt-8 md:mt-0">
          <h1 className="text-5xl md:text-8xl font-display font-bold text-white tracking-tight drop-shadow-lg">
            PlanetsSwaad
          </h1>
          <p className="text-lg md:text-4xl text-nature-100 font-medium italic mb-8 md:mb-12 drop-shadow-md">
            "Swad Jo Dil Ko Chhoo Jaye"
          </p>
          <div className="pt-8">
            <Link
              href="/menu"
              className="px-8 py-4 md:px-10 md:py-5 bg-nature-500 hover:bg-nature-400 text-white rounded-full font-bold text-lg md:text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-nature-500/50 backdrop-blur-sm border border-nature-400/30 ring-4 ring-white/10"
            >
              Order Now
            </Link>
          </div>
        </div>
      </section>

      {/* Orbiting Category Animation */}
      <CategoryOrbit />

      {/* Featured Items Grid */}
      <section className="py-20 bg-earth-100 px-4 pattern-clouds">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-nature-900 mb-2">Popular Right Now</h2>
              <p className="text-nature-600 text-sm md:text-base">Loved by students across Bhagalpur</p>
            </div>
            <Link href="/menu" className="hidden md:flex items-center text-nature-600 hover:text-nature-800 font-semibold transition-colors">
              View All <span className="ml-2">→</span>
            </Link>
          </div>

          <FeaturedItems />

          <div className="mt-8 text-center md:hidden">
            <Link href="/menu" className="inline-block px-8 py-3 bg-earth-200 text-nature-800 rounded-full font-semibold">
              View All Menu Items
            </Link>
          </div>
        </div>
      </section>

      {/* Gamification & Subscriptions */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* 5-Day Gamification Banner */}
          <div className="bg-nature-50 border-2 border-nature-200 rounded-3xl p-8 md:p-12 relative overflow-hidden group hover:border-nature-400 transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform">
              <span className="text-9xl">🎫</span>
            </div>
            <span className="inline-block px-3 py-1 bg-nature-800 text-white text-xs font-bold uppercase tracking-wider rounded-md mb-4">
              Gamified Rewards
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-nature-900 mb-4">The 5-Day Loyalty Ticket</h2>
            <p className="text-nature-700 text-lg mb-6 leading-relaxed">
              Order daily and collect PlanetsSwaad stamps! After your 5th order, unlock a massive discount code automatically.
            </p>
            <div className="bg-white p-4 rounded-xl border border-nature-100 flex items-start gap-4 shadow-sm">
              <span className="text-2xl mt-1">💬</span>
              <div>
                <p className="text-nature-900 font-bold mb-1">WhatsApp Motivation</p>
                <p className="text-sm text-nature-600 italic">"You're only 2 stamps away from your 50% discount! What's for dinner tonight?"</p>
              </div>
            </div>
          </div>

          {/* Subscription / Weekly Plan Banner */}
          <div className="bg-earth-100 border-2 border-earth-300 rounded-3xl p-8 md:p-12 relative overflow-hidden group hover:border-earth-400 transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform">
              <span className="text-9xl">🍱</span>
            </div>
            <span className="inline-block px-3 py-1 bg-earth-800 text-white text-xs font-bold uppercase tracking-wider rounded-md mb-4">
              For Students & Pros
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-nature-900 mb-4">Weekly Meal Plans</h2>
            <p className="text-nature-700 text-lg mb-6 leading-relaxed">
              Tired of deciding what to eat? Subscribe to our automated delivery! <strong className="text-nature-900">Pay for 6 days upfront, and get the 7th day absolutely FREE.</strong>
            </p>
            <div className="bg-white p-4 rounded-xl border border-earth-200 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-nature-900 font-bold">Locks in your discount 🔒</p>
                <p className="text-sm text-nature-600">Guaranteed hot food for your whole week.</p>
              </div>
              <Link href="/menu" className="px-4 py-2 bg-earth-800 text-white rounded-lg text-sm font-bold hover:bg-earth-700">
                Subscribe
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Trust Badges / Footer Info */}
      <section className="bg-nature-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="w-16 h-16 bg-nature-800 rounded-2xl flex items-center justify-center shadow-inner">
              <span className="text-3xl">🛵</span>
            </div>
            <h4 className="text-xl font-bold">Fast Delivery</h4>
            <p className="text-nature-300">Hot food delivered to your hostel or home within 30-45 minutes across Bhagalpur.</p>
          </div>
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="w-16 h-16 bg-nature-800 rounded-2xl flex items-center justify-center shadow-inner">
              <span className="text-3xl">🌿</span>
            </div>
            <h4 className="text-xl font-bold">100% Pure Veg</h4>
            <p className="text-nature-300">Authentic vegetarian cloud kitchen maintaining strictly clean and hygienic cooking standards.</p>
          </div>
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="w-16 h-16 bg-nature-800 rounded-2xl flex items-center justify-center shadow-inner">
              <span className="text-3xl">👨‍🎓</span>
            </div>
            <h4 className="text-xl font-bold">Student Friendly</h4>
            <p className="text-nature-300">Pocket-friendly combos and meal boxes designed specifically for daily student lives.</p>
          </div>
        </div>

        {/* Hyper-Local SEO Keywords Section (Subdued for design, highly visible for crawlers) */}
        <div className="max-w-7xl mx-auto border-t border-nature-800 mt-16 pt-8 text-[10px] text-nature-500/40 text-justify leading-tight">
          <p>
            <strong>PlanetsSwaad - Your Local Food Partner in Bhagalpur:</strong> Best Pizza delivery in Tilkamanji • Healthy meals in Bhagalpur • Order food online Bhagalpur • Best fast food Nathnagar • Cloud kitchen near Zero Mile • Pure veg restaurant Bhagalpur • Tiffin service Tilkamanji • Burger delivery Sabour • Best biryani in Bhagalpur • Affordable meals for students Bhagalpur Bihar • Late night food delivery Bhagalpur • Fresh meal subscription Bhagalpur • Top rated cloud kitchen Bihar • Online thali delivery • Office lunch delivery Bhagalpur • Bhagalpur famous food online • Cheap fast food near TMBU • Veg combo meals Bhagalpur • Best pasta in Tilkamanji • Hot food delivery Adampur • Family dinner delivery • Party orders Bhagalpur cloud kitchen • Best momos home delivery • Premium vegetarian food Bhagalpur • Weekly student meal plan Bihar • Order paneer dishes online • Chinese food delivery Tilkamanji • Order North Indian curries • Tandoori roti delivery • Hygiene certified cloud kitchen • Quick bite delivery Nathnagar • Healthy dinner subscription zero mile • Zero mile food delivery • Best cafe delivery Bhagalpur • Affordable student tiffin • Office food box delivery • Fast sandwich delivery • Bhagalpur night cravings • Top Zomato alternative Bhagalpur • Best homemade style food delivery • Best fast food restaurant Tilkamanji • Best local delivery app Bhagalpur • Premium quality pizza delivery • Fresh salads delivery Bhagalpur • No minimum order food delivery • Quick food delivery near me • Best vegetarian restaurant delivery • Bhagalpur street food online.
          </p>
        </div>
      </section>
    </div>
  );
}

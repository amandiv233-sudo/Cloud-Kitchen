import Image from 'next/image';
import Link from 'next/link';
import { CategoryOrbit } from '@/components/CategoryOrbit';
import { FeaturedItems } from '@/components/FeaturedItems';

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
      </section>
    </div>
  );
}

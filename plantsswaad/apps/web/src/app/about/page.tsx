import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'About PlanetsSwaad — Cloud Kitchen Bhagalpur Bihar',
    description:
        'Learn about PlanetsSwaad, Bhagalpur\'s favourite cloud kitchen. Our story, mission, 100% pure veg kitchen, and why Bhagalpur loves us. Swad jo dil ko chhoo jaye!',
    alternates: { canonical: 'https://planetsswaad.netlify.app/about' },
    openGraph: {
        title: 'About PlanetsSwaad | Our Story',
        description: 'Bhagalpur\'s #1 cloud kitchen — our journey, values, and what makes us different.',
        url: 'https://planetsswaad.netlify.app/about',
    },
};

const values = [
    { icon: '🌿', title: '100% Pure Vegetarian', desc: 'Every dish is prepared in a strictly vegetarian kitchen with the freshest ingredients — no compromises, ever.' },
    { icon: '⚡', title: 'Lightning-Fast Delivery', desc: 'We deliver across Bhagalpur within 30–45 minutes. Your food arrives hot, fresh, and exactly as you ordered.' },
    { icon: '💰', title: 'Student-Friendly Pricing', desc: 'Quality food shouldn\'t break the bank. Our combos and tiffin plans are designed for everyday affordability.' },
    { icon: '🧑‍🍳', title: 'Hygiene-First Kitchen', desc: 'Our cloud kitchen follows strict hygiene protocols — regular sanitisation, gloves, masks, and quality inspections.' },
    { icon: '❤️', title: 'Made with Love', desc: 'Every thali, biryani, and curry is prepared with the same care and love as homemade food. That\'s our promise.' },
    { icon: '📍', title: 'Proudly From Bhagalpur', desc: 'We\'re not a national chain. We\'re your neighbour — born in Bhagalpur, built for Bhagalpur.' },
];

const milestones = [
    { year: '2024', event: 'PlanetsSwaad was born — a dream to bring wholesome food to Bhagalpur\'s students and families.' },
    { year: '2025', event: 'Launched online ordering, expanded delivery to 12+ areas across Bhagalpur.' },
    { year: 'Next', event: 'Mobile app launch, tiffin subscriptions, and becoming Bihar\'s most loved cloud kitchen.' },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-earth-50">

            {/* Hero */}
            <section className="relative bg-nature-900 text-white py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-nature-900 via-nature-800 to-nature-950 opacity-90"></div>
                <div className="relative z-10 max-w-3xl mx-auto text-center">
                    <span className="inline-block bg-nature-700/50 text-nature-200 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase border border-nature-600/30">
                        Our Story
                    </span>
                    <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
                        Swad Jo Dil Ko <br className="hidden md:block" />Chhoo Jaye 🍃
                    </h1>
                    <p className="text-nature-200 text-lg md:text-xl leading-relaxed max-w-xl mx-auto">
                        PlanetsSwaad is Bhagalpur&apos;s homegrown cloud kitchen — delivering authentic, 
                        100% vegetarian North Indian food with love, speed, and heart.
                    </p>
                </div>
            </section>

            {/* Mission */}
            <section className="py-16 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-display font-bold text-nature-900 mb-6">Why We Started</h2>
                    <p className="text-nature-700 text-lg leading-relaxed mb-4">
                        Bhagalpur deserves better than soggy deliveries and overpriced meals. We saw students eating 
                        the same stale food every day, families waiting an hour for cold biryani, and nobody offering 
                        genuinely fresh, home-style vegetarian food with fast delivery.
                    </p>
                    <p className="text-nature-700 text-lg leading-relaxed">
                        So we built <strong className="text-nature-900">PlanetsSwaad</strong> — a cloud kitchen that 
                        cooks everything fresh to order, delivers in under 45 minutes, and keeps prices pocket-friendly. 
                        No dine-in overhead, no middlemen — just great food, straight to your door.
                    </p>
                </div>
            </section>

            {/* Values Grid */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-display font-bold text-nature-900 text-center mb-12">What We Stand For</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {values.map((v) => (
                            <div key={v.title} className="bg-earth-50 border border-nature-100 rounded-2xl p-6 hover:shadow-lg hover:border-nature-300 transition-all duration-300">
                                <div className="text-4xl mb-4">{v.icon}</div>
                                <h3 className="text-lg font-bold text-nature-900 mb-2">{v.title}</h3>
                                <p className="text-nature-600 text-sm leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-16 px-4">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl font-display font-bold text-nature-900 text-center mb-12">Our Journey</h2>
                    <div className="space-y-8">
                        {milestones.map((m, i) => (
                            <div key={i} className="flex gap-5">
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 bg-nature-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                                        {m.year}
                                    </div>
                                    {i < milestones.length - 1 && (
                                        <div className="w-0.5 flex-grow bg-nature-200 mt-2"></div>
                                    )}
                                </div>
                                <div className="pt-2.5 pb-8">
                                    <p className="text-nature-800 text-base leading-relaxed">{m.event}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-4 bg-nature-900 text-white text-center">
                <div className="max-w-xl mx-auto">
                    <h2 className="text-3xl font-display font-bold mb-4">Hungry? Let&apos;s Fix That 🍛</h2>
                    <p className="text-nature-300 mb-8">
                        Browse our menu, pick your favourites, and we&apos;ll have it at your door in under 45 minutes.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/menu"
                            className="px-8 py-3.5 bg-nature-500 hover:bg-nature-400 text-white rounded-full font-bold transition-all duration-300 hover:scale-105"
                        >
                            Order Now
                        </Link>
                        <Link
                            href="/faq"
                            className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold border border-white/20 transition-all duration-300"
                        >
                            Read FAQ
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

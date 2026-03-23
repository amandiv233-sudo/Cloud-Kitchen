'use client';

import { useState } from 'react';
import { useCartStore } from '@plantsswaad/shared';
import Link from 'next/link';
import { ProfileButton } from '@/components/ProfileButton';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '/areas', label: 'Delivery Areas' },
    { href: '/faq', label: 'FAQ' },
    { href: '/about', label: 'About Us' },
];

export function Navbar() {
    const items = useCartStore((state: any) => state.items);
    const cartCount = items.reduce((acc: number, item: any) => acc + item.quantity, 0);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md shadow-sm border-b border-earth-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center">
                            <Link href="/" className="flex-shrink-0 flex items-center">
                                <span className="text-xl md:text-2xl font-display font-bold text-nature-800">PlanetsSwaad</span>
                                <span className="ml-1 md:ml-2 text-xl md:text-2xl">🍃</span>
                            </Link>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center space-x-6">
                            {navLinks.map(({ href, label }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className="text-nature-600 font-medium hover:text-nature-800 transition"
                                >
                                    {label}
                                </Link>
                            ))}
                            <ProfileButton />
                        </div>

                        {/* Mobile: Profile + Hamburger */}
                        <div className="flex items-center gap-3 md:hidden">
                            <ProfileButton />
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-nature-50 transition-colors"
                                aria-label="Toggle menu"
                            >
                                <span className={`block w-5 h-0.5 bg-nature-700 transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[4px]' : ''}`} />
                                <span className={`block w-5 h-0.5 bg-nature-700 transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
                                <span className={`block w-5 h-0.5 bg-nature-700 transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[4px]' : ''}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile Slide-in Menu */}
            <div
                className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
                    mobileOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-nature-100">
                    <span className="text-lg font-display font-bold text-nature-800">Menu</span>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-nature-50 text-nature-600"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                        </svg>
                    </button>
                </div>

                {/* Links */}
                <div className="flex-grow overflow-y-auto py-4">
                    {navLinks.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center px-6 py-4 text-nature-700 hover:bg-nature-50 hover:text-nature-900 font-medium transition-colors border-b border-nature-50"
                        >
                            {label}
                        </Link>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="p-6 border-t border-nature-100">
                    <Link
                        href="/menu"
                        onClick={() => setMobileOpen(false)}
                        className="block w-full py-3 bg-nature-500 hover:bg-nature-600 text-white text-center font-bold rounded-xl transition-colors"
                    >
                        🍛 Order Now
                    </Link>
                    <p className="text-xs text-nature-500 text-center mt-3">
                        Swad Jo Dil Ko Chhoo Jaye 🍃
                    </p>
                </div>
            </div>
        </>
    );
}

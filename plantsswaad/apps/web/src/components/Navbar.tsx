'use client';

import { useCartStore } from '@plantsswaad/shared';
import Link from 'next/link';
import { ProfileButton } from '@/components/ProfileButton';

export function Navbar() {
    const items = useCartStore((state: any) => state.items);
    const cartCount = items.reduce((acc: number, item: any) => acc + item.quantity, 0);

    return (
        <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md shadow-sm border-b border-earth-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <span className="text-xl md:text-2xl font-display font-bold text-nature-800">PlanetsSwaad</span>
                            <span className="ml-1 md:ml-2 text-xl md:text-2xl">🍃</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-2 md:space-x-6">
                        <Link href="/" className="hidden md:block text-nature-600 font-medium hover:text-nature-800 transition">Home</Link>
                        <Link href="/menu" className="hidden md:block text-nature-600 font-medium hover:text-nature-800 transition">Menu</Link>
                        <Link href="/areas" className="hidden md:block text-nature-600 font-medium hover:text-nature-800 transition">Delivery Areas</Link>
                        <Link href="/faq" className="hidden md:block text-nature-600 font-medium hover:text-nature-800 transition">FAQ</Link>
                        <ProfileButton />
                    </div>
                </div>
            </div>
        </nav>
    );
}

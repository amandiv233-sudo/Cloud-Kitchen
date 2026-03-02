'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useCartStore } from '@plantsswaad/shared';

type MenuItem = {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
};

export function FeaturedItems() {
    const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const addItem = useCartStore((state) => state.addItem);

    useEffect(() => {
        const fetchFeatured = async () => {
            const { data } = await supabase
                .from('menu_items')
                .select('*')
                .eq('is_available', true)
                .eq('is_featured', true)
                .limit(4);

            if (data) setFeaturedItems(data as MenuItem[]);
            setLoading(false);
        };
        fetchFeatured();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-earth-200 h-80 rounded-2xl w-full"></div>
                ))}
            </div>
        );
    }

    if (featuredItems.length === 0) {
        return <p className="text-nature-600 text-center py-10">Check back soon for our special featured items!</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredItems.map((item) => (
                <div key={item.id} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-earth-200">
                    <div className="relative h-56 w-full overflow-hidden">
                        {item.image_url ? (
                            <Image
                                src={item.image_url}
                                alt={item.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full bg-earth-100 flex items-center justify-center text-3xl">🍲</div>
                        )}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg text-nature-600 cursor-pointer hover:bg-nature-500 hover:text-white transition">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-nature-900 group-hover:text-nature-600 transition-colors line-clamp-1">
                                {item.name}
                            </h3>
                            <span className="bg-earth-100 text-nature-800 text-xs font-bold px-2 py-1 rounded">BESTSELLER</span>
                        </div>
                        <p className="text-nature-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
                            {item.description || 'Prepared fresh with love and authentic spices.'}
                        </p>
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-nature-800">
                                ₹{item.price}
                            </span>
                            <button onClick={() => addItem(item as any)} className="bg-nature-50 text-nature-700 hover:bg-nature-500 hover:text-white p-3 rounded-full transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-nature-500 focus:ring-offset-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

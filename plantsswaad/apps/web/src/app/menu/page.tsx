'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCartStore } from '@plantsswaad/shared';
import { supabase } from '@/lib/supabase';

type Category = {
    id: string;
    name: string;
    sort_order: number;
    is_active: boolean;
};

type MenuItem = {
    id: string;
    category_id: string;
    name: string;
    description: string | null;
    price: number;
    is_available: boolean;
    image_url: string | null;
};

export default function MenuPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [items, setItems] = useState<MenuItem[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('');
    const [loading, setLoading] = useState(true);

    const addItem = useCartStore((state) => state.addItem);

    useEffect(() => {
        fetchMenuData();
    }, []);

    const fetchMenuData = async () => {
        setLoading(true);
        // Fetch active categories
        const { data: catData } = await supabase
            .from('categories')
            .select('*')
            .eq('is_active', true)
            .order('sort_order');

        // Fetch available items
        const { data: itemData } = await supabase
            .from('menu_items')
            .select('*')
            .eq('is_available', true)
            .order('name');

        if (catData && catData.length > 0) {
            setCategories(catData as Category[]);
            setActiveCategory(catData[0].id);
        }

        if (itemData) {
            setItems(itemData as MenuItem[]);
        }
        setLoading(false);
    };

    const filteredItems = items.filter(item => item.category_id === activeCategory);

    return (
        <div className="min-h-screen bg-earth-50 pt-24 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-center mb-12 text-nature-800">
                    Our Menu
                </h1>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-12 h-12 rounded-full border-4 border-nature-200 border-t-nature-600 animate-spin"></div>
                    </div>
                ) : (
                    <>
                        {/* Category Filter Tabs */}
                        <div className="flex overflow-x-auto hide-scrollbar gap-4 justify-center mb-12 pb-4">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 whitespace-nowrap ${activeCategory === cat.id
                                        ? 'bg-nature-500 text-white shadow-lg shadow-nature-500/30'
                                        : 'bg-white text-nature-600 hover:bg-nature-50 hover:text-nature-700 shadow-sm border border-nature-200'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                            {categories.length === 0 && (
                                <p className="text-nature-500">No categories found in the database.</p>
                            )}
                        </div>

                        {/* Menu Items Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group perspective-1000 border border-nature-100"
                                >
                                    {/* Card Flip Container */}
                                    <div className="relative w-full h-full preserve-3d transition-transform duration-700 hover:rotate-y-180 min-h-[440px]">

                                        {/* Front side */}
                                        <div className="backface-hidden w-full h-full bg-white relative z-10 flex flex-col absolute inset-0">
                                            <div className="h-56 bg-nature-100 relative">
                                                {item.image_url ? (
                                                    <Image
                                                        src={item.image_url}
                                                        alt={item.name}
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-5xl">🍲</div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                            </div>
                                            <div className="p-6 flex-grow flex flex-col justify-between bg-white relative">
                                                <div>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="text-xl font-bold text-earth-800 font-display">{item.name}</h3>
                                                        <span className="text-xl font-bold text-nature-600 bg-nature-50 px-3 py-1 rounded-lg">₹{item.price}</span>
                                                    </div>
                                                    <p className="text-earth-600 text-sm mb-6 line-clamp-2">
                                                        {item.description || "Fresh and delicious"}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // prevent flipping
                                                        addItem(item as any);
                                                    }}
                                                    className="w-full py-3.5 bg-nature-50 hover:bg-nature-500 hover:text-white text-nature-700 font-bold rounded-xl transition-colors duration-300 border border-nature-200 hover:border-nature-500 shadow-sm"
                                                >
                                                    Quick Add
                                                </button>
                                            </div>
                                        </div>

                                        {/* Back side (Description revealed on flip) */}
                                        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-nature-800 text-white p-8 rounded-3xl flex flex-col justify-center items-center text-center shadow-inner">
                                            <h3 className="text-3xl font-bold mb-4 font-display text-nature-100">{item.name}</h3>
                                            <p className="text-earth-100 text-lg mb-8 leading-relaxed italic">
                                                {item.description || "A wonderful meal to enjoy with your family."}
                                            </p>
                                            <div className="mt-auto w-full">
                                                <button
                                                    onClick={() => addItem(item as any)}
                                                    className="w-full py-4 bg-white text-nature-900 hover:bg-earth-200 font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                                                >
                                                    Add to Cart — ₹{item.price}
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            ))}
                            {filteredItems.length === 0 && categories.length > 0 && (
                                <div className="col-span-full text-center py-12 text-nature-500">
                                    No items found in this category.
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

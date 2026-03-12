'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useAnimationFrame } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

type Category = {
    id: string;
    name: string;
    slug: string;
    image_url: string;
    description: string;
};

// Map categories to dynamic brand colors since colors aren't in the DB schema
const CAT_COLORS = ["#4ade80", "#fb923c", "#fbbf24", "#a78bfa", "#fca5a5", "#38bdf8", "#34d399", "#ef4444"];

export function CategoryOrbit() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeIdx, setActiveIdx] = useState<number | null>(null);
    const rotationRef = useRef(0);
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        const fetchCats = async () => {
            const { data } = await supabase.from('categories').select('*').eq('is_active', true).order('sort_order');
            if (data) setCategories(data as Category[]);
        };
        fetchCats();
    }, []);

    // High performance animation loop using Framer Motion (only active on Desktop anyway)
    useAnimationFrame((_, delta) => {
        if (activeIdx === null && typeof window !== 'undefined' && window.innerWidth >= 768) {
            rotationRef.current += (delta * 0.015); // Adjust speed
            setRotation(rotationRef.current);
        }
    });

    return (
        <section className="w-full bg-earth-50 border-y border-earth-200 overflow-hidden">

            {/* ---------------- MOBILE VIEW: Horizontal Snap Carousel ---------------- */}
            <div className="md:hidden py-12 px-4 shadow-inner bg-gradient-to-b from-earth-100 to-earth-50">
                <div className="mb-6 px-2">
                    <h2 className="text-3xl font-display font-bold text-nature-900 mb-1">
                        Fresh Categories
                    </h2>
                    <p className="text-nature-600 text-sm">
                        Swipe to explore our delicious Indian flavors!
                    </p>
                </div>

                <div className="flex overflow-x-auto hide-scrollbar gap-6 pb-6 px-2 snap-x snap-mandatory">
                    {categories.map((cat, i) => (
                        <Link href="/menu" key={cat.id} className="snap-start shrink-0 flex flex-col items-center group w-[85px]">
                            <div
                                className="relative w-20 h-20 rounded-full overflow-hidden border-[3px] bg-white shadow-md transform transition-transform group-hover:scale-105"
                                style={{ borderColor: CAT_COLORS[i % CAT_COLORS.length] }}
                            >
                                {cat.image_url ? (
                                    <Image
                                        src={cat.image_url}
                                        alt={cat.name}
                                        fill
                                        sizes="80px"
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-earth-200 flex items-center justify-center text-earth-800 border-none">📷</div>
                                )}
                            </div>
                            <span className="mt-3 text-[13px] font-bold text-nature-800 text-center leading-tight">
                                {cat.name}
                            </span>
                        </Link>
                    ))}
                    {categories.length === 0 && (
                        <div className="text-nature-500 py-4 w-full text-center text-sm">
                            Loading categories...
                        </div>
                    )}
                </div>
            </div>

            {/* ---------------- DESKTOP VIEW: Orbiting Animation ---------------- */}
            <div className="hidden md:flex relative h-[650px] lg:h-[800px] w-full items-center justify-center">

                {/* Left-aligned descriptive text */}
                <div className="absolute top-1/2 left-8 md:left-16 lg:left-32 transform -translate-y-1/2 max-w-sm z-20 pointer-events-none">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-nature-900 mb-6 drop-shadow-sm">
                        Fresh from our Kitchen
                    </h2>
                    <p className="text-lg text-nature-700 font-medium">
                        Hover over our delicious categories to see what's cooking. A world of real Indian flavor waiting to be explored!
                    </p>
                </div>

                {/* Orbit Container positioned to the right side, cutting off into a half-circle */}
                <div className="absolute top-1/2 right-[-150px] md:right-[-50px] lg:right-10 transform -translate-y-1/2 w-[500px] h-[500px] md:w-[600px] md:h-[600px]">

                    {/* Core center logo/orb */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-48 md:h-48 rounded-full bg-nature-600 shadow-2xl flex flex-col items-center justify-center text-white z-10 border-4 border-nature-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><path d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2z" /><path d="M12 6v6l4 2" /></svg>
                        <span className="font-bold text-lg font-display tracking-wide">PlantsSwaad</span>
                        <span className="text-xs opacity-80 uppercase tracking-widest mt-1">Categories</span>
                    </div>

                    {/* Decorative Orbit Rings */}
                    <div className="absolute inset-4 rounded-full border border-dashed border-nature-400/40" />
                    <div className="absolute inset-16 rounded-full border border-dashed border-nature-500/20" />

                    {/* Rotating Container for Categories */}
                    <motion.div
                        className="absolute inset-0"
                        style={{ rotate: rotation }}
                    >
                        {categories.map((cat, i) => {
                            const angle = (i * 360) / categories.length;
                            const rad = (angle * Math.PI) / 180;
                            const radius = 300; // Fixed radius for md+
                            const x = radius * Math.cos(rad);
                            const y = radius * Math.sin(rad);
                            const isActive = activeIdx === i;

                            const catColor = CAT_COLORS[i % CAT_COLORS.length];

                            return (
                                <Link
                                    href="/menu"
                                    key={cat.id}
                                    className="absolute top-1/2 left-1/2 flex flex-col items-center justify-center cursor-pointer group"
                                    style={{
                                        transform: `translate(${x - 50}px, ${y - 50}px)`,
                                        width: 100,
                                        height: 100,
                                    }}
                                    onMouseEnter={() => setActiveIdx(i)}
                                    onMouseLeave={() => setActiveIdx(null)}
                                >
                                    {/* Counter-rotate the image so it always stays upright facing the user */}
                                    <div
                                        style={{ transform: `rotate(${-rotation}deg)`, transition: 'transform 0.1s linear' }}
                                        className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 transition-all duration-300 ${isActive ? 'scale-125 z-50 shadow-2xl' : 'scale-100 z-20 shadow-md view-offset'}`}
                                    >
                                        {cat.image_url ? (
                                            <Image
                                                src={cat.image_url}
                                                alt={cat.name}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                                className="object-cover bg-white"
                                                style={{ borderColor: catColor }}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-earth-200 flex items-center justify-center text-earth-800" style={{ borderColor: catColor }}>📷</div>
                                        )}
                                        {/* Hover dark overlay so the image pops when active, dims when not */}
                                        <div className={`absolute inset-0 transition-colors duration-300 ${isActive ? 'bg-transparent' : 'bg-black/20 group-hover:bg-transparent'}`} />
                                    </div>

                                    {/* Label - Counter rotate as well to stay upright */}
                                    <div
                                        style={{ transform: `rotate(${-rotation}deg)` }}
                                        className={`absolute -bottom-8 md:-bottom-10 pointer-events-none transition-all duration-300 ${isActive ? 'opacity-100 translate-y-2 z-50' : 'opacity-0 z-10'}`}
                                    >
                                        <span className="bg-nature-900 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-xl whitespace-nowrap">
                                            {cat.name}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </motion.div>
                </div>
            </div>

        </section>
    );
}

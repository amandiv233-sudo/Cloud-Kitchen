'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function PizzaAssembly() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Track scroll progress through this component's container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Background color transitions optionally
    const bg = useTransform(scrollYProgress, [0, 1], ["#faf7f3", "#f2eee9"]); // earth-50 to slightly darker

    // 1. Plate fading & scaling in
    const plateScale = useTransform(scrollYProgress, [0, 0.1], [0.5, 1]);
    const plateOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

    // 2. Crust sliding up and dropping
    const crustY = useTransform(scrollYProgress, [0.05, 0.2], [-500, 0]);
    const crustOpacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1]);
    const crustScale = useTransform(scrollYProgress, [0.15, 0.25], [1.1, 1]);

    // 3. Sauce spreading (Scale up from center)
    const sauceScale = useTransform(scrollYProgress, [0.25, 0.4], [0, 1]);
    const sauceOpacity = useTransform(scrollYProgress, [0.25, 0.35], [0, 1]);

    // 4. Cheese layer melting (Fade and drop)
    const cheeseScale = useTransform(scrollYProgress, [0.35, 0.5], [0.8, 1]);
    const cheeseOpacity = useTransform(scrollYProgress, [0.4, 0.5], [0, 1]);

    // 5. Toppings (Tomatoes & Paneer)
    const toppingsY = useTransform(scrollYProgress, [0.5, 0.65], [-800, 0]);
    const toppingsOpacity = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);
    const toppingsRotate = useTransform(scrollYProgress, [0.5, 0.65], [-45, 0]);

    // 6. Leaves dropping
    const leavesY = useTransform(scrollYProgress, [0.65, 0.8], [-800, 0]);
    const leavesOpacity = useTransform(scrollYProgress, [0.65, 0.75], [0, 1]);
    const leavesRotate = useTransform(scrollYProgress, [0.65, 0.8], [90, 0]);

    // 7. Spices raining down
    const spicesY = useTransform(scrollYProgress, [0.8, 0.95], [-400, 0]);
    const spicesOpacity = useTransform(scrollYProgress, [0.8, 0.9], [0, 1]);

    // Topping positions
    const tomatoPositions = [
        { top: '15%', left: '40%' }, { top: '30%', left: '70%' }, { top: '60%', left: '20%' },
        { top: '70%', left: '60%' }, { top: '40%', left: '30%' }, { top: '50%', left: '80%' }
    ];

    const paneerPositions = [
        { top: '25%', left: '25%' }, { top: '20%', left: '55%' }, { top: '50%', left: '45%' },
        { top: '45%', left: '15%' }, { top: '80%', left: '40%' }, { top: '65%', left: '75%' }
    ];

    const leafPositions = [
        { top: '10%', left: '50%', rot: 45 }, { top: '50%', left: '60%', rot: -20 },
        { top: '75%', left: '25%', rot: 75 }, { top: '60%', left: '85%', rot: 10 },
        { top: '30%', left: '10%', rot: -60 }, { top: '85%', left: '55%', rot: -45 }
    ];

    // Raining spices dots
    const createSpices = () => {
        let dots = [];
        for (let i = 0; i < 60; i++) {
            const size = Math.random() * 6 + 2;
            const top = Math.random() * 80 + 10;
            const left = Math.random() * 80 + 10;
            const isRed = Math.random() > 0.5;
            dots.push(
                <div
                    key={i}
                    className={`absolute rounded-full shadow-sm ${isRed ? 'bg-red-600' : 'bg-green-800'}`}
                    style={{
                        width: size, height: size, top: `${top}%`, left: `${left}%`,
                        opacity: 0.8
                    }}
                />
            );
        }
        return dots;
    };

    return (
        <motion.section
            ref={containerRef}
            className="relative h-[400vh] w-full"
            style={{ backgroundColor: bg }}
        >
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden perspective-1000">

                {/* Descriptive Text overlaying the scroll */}
                <div className="absolute top-1/4 left-10 md:left-24 z-50 text-left pointer-events-none max-w-sm">
                    <motion.h2 className="text-4xl md:text-5xl font-display font-bold text-earth-900 mb-4 shadow-white drop-shadow-md">
                        Crafted with Passion
                    </motion.h2>
                    <motion.p className="text-xl text-earth-700 font-medium drop-shadow-sm">
                        Scroll to see how we prepare our signature Farmhouse Pizza fresh from scratch.
                    </motion.p>
                </div>

                {/* 3D Scene Container */}
                <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] preserve-3d rotate-x-12">

                    {/* 1. Plate */}
                    <motion.div
                        className="absolute inset-[-10%] bg-white rounded-full shadow-2xl border border-gray-100"
                        style={{ scale: plateScale, opacity: plateOpacity }}
                    />

                    {/* 2. Crust / Base */}
                    <motion.div
                        className="absolute inset-[0%] rounded-full shadow-inner border-[15px] md:border-[25px] border-amber-500 bg-amber-400"
                        style={{ y: crustY, opacity: crustOpacity, scale: crustScale }}
                    />

                    {/* 3. Red Sauce */}
                    <motion.div
                        className="absolute inset-[12%] md:inset-[10%] rounded-full bg-red-600 shadow-inner"
                        style={{ scale: sauceScale, opacity: sauceOpacity }}
                    />

                    {/* 4. Melted Cheese */}
                    <motion.div
                        className="absolute inset-[15%] md:inset-[12%] rounded-full bg-yellow-100 opacity-90 backdrop-blur-sm blob-shape mask-image-cheese"
                        style={{
                            scale: cheeseScale,
                            opacity: cheeseOpacity,
                            boxShadow: 'inset 0 0 40px rgba(250, 204, 21, 0.4)'
                        }}
                    />

                    {/* 5. Toppings (Tomatoes) */}
                    <motion.div className="absolute inset-0" style={{ y: toppingsY, opacity: toppingsOpacity, rotate: toppingsRotate }}>
                        {tomatoPositions.map((pos, i) => (
                            <div key={`tom-${i}`} className="absolute w-12 h-12 md:w-16 md:h-16 bg-red-500 rounded-full border-4 border-red-700 shadow-md flex items-center justify-center" style={{ top: pos.top, left: pos.left }}>
                                <div className="w-6 h-6 rounded-full border-2 border-red-800 opacity-50" />
                            </div>
                        ))}
                    </motion.div>

                    {/* 5b. Toppings (Paneer Cubes) */}
                    <motion.div className="absolute inset-0" style={{ y: toppingsY, opacity: toppingsOpacity, rotate: toppingsRotate }}>
                        {paneerPositions.map((pos, i) => (
                            <div key={`pan-${i}`} className="absolute w-10 h-10 md:w-12 md:h-12 bg-white rounded-md shadow-sm border border-gray-200" style={{ top: pos.top, left: pos.left, transform: `rotate(${i * 15}deg)` }} />
                        ))}
                    </motion.div>

                    {/* 6. Basil Leaves */}
                    <motion.div className="absolute inset-0" style={{ y: leavesY, opacity: leavesOpacity, rotate: leavesRotate }}>
                        {leafPositions.map((pos, i) => (
                            <div key={`leaf-${i}`} className="absolute w-8 h-12 md:w-10 md:h-16 bg-green-500 rounded-full rounded-tr-none shadow-md" style={{ top: pos.top, left: pos.left, transform: `rotate(${pos.rot}deg)` }}>
                                <div className="w-[1px] h-full bg-green-700 mx-auto" />
                            </div>
                        ))}
                    </motion.div>

                    {/* 7. Falling Spices (Oregano/Chilli flakes) */}
                    <motion.div className="absolute inset-0" style={{ y: spicesY, opacity: spicesOpacity }}>
                        {createSpices()}
                    </motion.div>

                </div>
            </div>
        </motion.section>
    );
}

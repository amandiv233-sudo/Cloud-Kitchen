'use client';

import { useState, useEffect } from 'react';
import { useNotifications } from '@/hooks/useNotifications';

export function NotificationBanner() {
    const { permission, isSupported, requestPermission } = useNotifications();
    const [showBanner, setShowBanner] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // Show banner after 5 seconds if notifications aren't granted yet
        if (!isSupported || permission === 'granted' || permission === 'denied') return;

        // Check if user has previously dismissed
        const dismissed = localStorage.getItem('ps-notif-dismissed');
        if (dismissed) {
            const dismissedAt = parseInt(dismissed, 10);
            // Show again after 3 days
            if (Date.now() - dismissedAt < 3 * 24 * 60 * 60 * 1000) return;
        }

        const timer = setTimeout(() => {
            setIsAnimating(true);
            setTimeout(() => setShowBanner(true), 50);
        }, 5000);

        return () => clearTimeout(timer);
    }, [isSupported, permission]);

    const handleAllow = async () => {
        await requestPermission();
        setShowBanner(false);
    };

    const handleDismiss = () => {
        setShowBanner(false);
        localStorage.setItem('ps-notif-dismissed', Date.now().toString());
    };

    if (!isAnimating || !showBanner) return null;

    return (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-md animate-fade-in-up">
            <div className="bg-white border border-nature-200 rounded-2xl shadow-2xl p-5 relative overflow-hidden">
                {/* Accent strip */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-nature-400 via-nature-500 to-nature-600"></div>

                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-nature-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 mt-0.5">
                        🔔
                    </div>
                    <div className="flex-grow">
                        <h3 className="font-bold text-nature-900 text-base mb-1">
                            Get Order Updates
                        </h3>
                        <p className="text-nature-600 text-sm leading-relaxed mb-4">
                            Know instantly when your food is being prepared, out for delivery, or at your door!
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleAllow}
                                className="flex-1 py-2.5 bg-nature-500 hover:bg-nature-600 text-white text-sm font-bold rounded-xl transition-colors"
                            >
                                Yes, Notify Me
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="px-4 py-2.5 text-nature-500 hover:text-nature-700 text-sm font-medium transition-colors"
                            >
                                Not Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

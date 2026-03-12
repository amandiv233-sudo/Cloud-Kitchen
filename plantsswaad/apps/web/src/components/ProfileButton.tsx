'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function ProfileButton() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsLoggedIn(!!session?.user);
            if (session?.user) {
                const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
                if (data) setRole(data.role);
            }
        };

        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsLoggedIn(!!session?.user);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (!isLoggedIn) {
        return (
            <Link
                href="/login"
                className="bg-white text-nature-800 px-4 md:px-5 py-2 rounded-full shadow-sm hover:shadow-md font-semibold transition-all border border-nature-200 text-xs md:text-sm md:ml-4 whitespace-nowrap"
            >
                Login / Sign Up
            </Link>
        );
    }

    return (
        <div className="flex gap-3 items-center ml-4">
            {role === 'admin' && (
                <Link
                    href="/admin/categories"
                    className="bg-nature-700 text-white px-4 py-2 rounded-full shadow-sm hover:bg-nature-800 font-semibold transition-all border border-nature-800 text-sm"
                >
                    ⚙️ Admin
                </Link>
            )}
            {role === 'chef' && (
                <Link
                    href="/kitchen"
                    className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full shadow-sm hover:bg-amber-200 hover:shadow-md font-semibold transition-all border border-amber-200 text-sm"
                >
                    🍳 Kitchen
                </Link>
            )}
            <Link
                href="/profile"
                className="bg-emerald-100 text-emerald-800 px-3 md:px-4 py-2 rounded-full shadow-sm hover:bg-emerald-200 hover:shadow-md font-semibold transition-all flex items-center gap-2 border border-emerald-200 text-xs md:text-sm whitespace-nowrap"
            >
                <span role="img" aria-label="profile" className="hidden md:inline">👤</span> Profile
            </Link>
        </div>
    );
}

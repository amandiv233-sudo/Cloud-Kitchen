'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { cva } from "class-variance-authority"
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
                className="fixed top-8 right-8 bg-white/90 backdrop-blur text-nature-800 px-6 py-2 rounded-full shadow-lg hover:shadow-xl font-semibold transition-all z-50 border border-nature-100"
            >
                Login / Sign Up
            </Link>
        );
    }

    return (
        <div className="fixed top-8 right-8 flex gap-3 z-50 items-center">
            {role === 'admin' && (
                <Link
                    href="/admin/categories"
                    className="bg-nature-700 text-white px-6 py-2 rounded-full shadow-lg hover:bg-nature-800 font-semibold transition-all border border-nature-800"
                >
                    ⚙️ Admin
                </Link>
            )}
            {role === 'chef' && (
                <Link
                    href="/kitchen"
                    className="bg-amber-100 text-amber-800 px-6 py-2 rounded-full shadow-lg hover:bg-amber-200 hover:shadow-xl font-semibold transition-all border border-amber-200"
                >
                    🍳 Kitchen
                </Link>
            )}
            <Link
                href="/profile"
                className="bg-emerald-100 text-emerald-800 px-6 py-2 rounded-full shadow-lg hover:bg-emerald-200 hover:shadow-xl font-semibold transition-all flex items-center gap-2 border border-emerald-200"
            >
                <span role="img" aria-label="profile">👤</span> My Profile
            </Link>
        </div>
    );
}

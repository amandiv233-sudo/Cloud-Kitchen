'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type AllowedRoles = 'admin' | 'chef' | 'sales' | 'delivery' | 'customer';

export function AuthGuard({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: AllowedRoles[] }) {
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push(`/login?next=${pathname}`);
                return;
            }

            if (allowedRoles && allowedRoles.length > 0) {
                // Fetch user role
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();

                if (!profile || !allowedRoles.includes(profile.role as AllowedRoles)) {
                    // Not authorized for this role
                    router.push('/unauthorized');
                    return;
                }
            }

            setAuthorized(true);
            setLoading(false);
        };

        checkAuth();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT') {
                router.push('/login');
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [router, pathname, allowedRoles]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-nature-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nature-600"></div>
            </div>
        );
    }

    if (!authorized) return null;

    return <>{children}</>;
}

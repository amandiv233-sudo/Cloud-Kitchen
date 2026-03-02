'use client';

import Link from 'next/link';
import { AuthGuard } from '@/components/AuthGuard';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };
    return (
        <AuthGuard allowedRoles={['admin']}>
            <div className="min-h-screen bg-nature-50 flex flex-col md:flex-row">
                <aside className="w-full md:w-64 bg-nature-900 text-white flex flex-col min-h-[auto] md:min-h-screen sticky top-0">
                    <div className="p-6 border-b border-nature-800">
                        <h2 className="text-2xl font-display font-bold text-nature-100">PlanetsSwaad</h2>
                        <span className="text-sm text-nature-400">Admin Dashboard</span>
                    </div>
                    <nav className="flex-1 p-4 space-y-2">
                        <Link href="/admin" className="block px-4 py-3 rounded-lg bg-nature-800 text-white font-medium hover:bg-nature-700 transition">
                            Overview
                        </Link>
                        <Link href="/admin/categories" className="block px-4 py-3 rounded-lg text-nature-300 font-medium hover:bg-nature-800 hover:text-white transition">
                            Categories
                        </Link>
                        <Link href="/admin/menu-items" className="block px-4 py-3 rounded-lg text-nature-300 font-medium hover:bg-nature-800 hover:text-white transition">
                            Menu Items
                        </Link>
                        <Link href="/admin/orders" className="block px-4 py-3 rounded-lg text-nature-300 font-medium hover:bg-nature-800 hover:text-white transition">
                            Live Orders
                        </Link>
                        <Link href="/admin/staff" className="block px-4 py-3 rounded-lg text-nature-300 font-medium hover:bg-nature-800 hover:text-white transition">
                            Staff Management
                        </Link>
                    </nav>
                    <div className="p-4 border-t border-nature-800">
                        <button onClick={handleSignOut} className="w-full text-left px-4 py-3 rounded-lg text-red-400 font-medium hover:bg-red-950/30 transition">
                            Sign Out
                        </button>
                    </div>
                </aside>

                <main className="flex-1 p-8 md:p-12 overflow-y-auto w-full">
                    {children}
                </main>
            </div>
        </AuthGuard>
    );
}

'use client';

import { AuthGuard } from '@/components/AuthGuard';
import { supabase } from '@/lib/supabase';

export default function SalesDashboard() {
    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = '/login';
    };

    return (
        <AuthGuard allowedRoles={['sales', 'admin']}>
            <div className="min-h-screen bg-nature-50 p-8">
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 border border-nature-200">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-display font-bold text-nature-900">Sales Dashboard</h1>
                        <button onClick={handleSignOut} className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium transition">
                            Sign Out
                        </button>
                    </div>

                    <div className="p-8 border-2 border-dashed border-gray-200 rounded-lg text-center text-gray-500 bg-gray-50">
                        Sales analytics, reports, and marketing campaigns will be available here soon.
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}

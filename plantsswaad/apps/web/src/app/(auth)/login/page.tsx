'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handlePhoneLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // We simulate a phone login by appending a fake domain that will pass MX record checks.
        const simulatedEmail = `${phone}.swaad@gmail.com`;

        const { data, error } = await supabase.auth.signInWithPassword({
            email: simulatedEmail,
            password,
        });

        if (error) {
            // Mask the "email" part of the error so the user only sees their phone number in the error message
            let msg = error.message;
            msg = msg.replace(simulatedEmail, phone);
            msg = msg.replace('Email address', 'Phone number');
            msg = msg.replace('email address', 'phone number');
            msg = msg.replace('Email', 'Phone number');
            msg = msg.replace('email', 'phone number');
            setError(msg);
        } else if (data.user) {
            // Fetch user's role to determine redirect path
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single();

            if (profile?.role === 'admin') {
                router.push('/admin/categories'); // Admin goes to admin panel
            } else if (profile?.role === 'chef') {
                router.push('/kitchen'); // Chef goes directly to kitchen
            } else if (profile?.role === 'sales') {
                router.push('/sales'); // Sales goes to sales
            } else if (profile?.role === 'delivery') {
                router.push('/delivery'); // Delivery goes to delivery
            } else {
                router.push('/'); // Customers go back to home page
            }
        }
        setLoading(false);
    };



    return (
        <div className="min-h-screen bg-nature-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-nature-900 font-display">
                    Sign in to your account
                </h2>
                <p className="mt-2 text-center text-sm text-nature-600">
                    Or{' '}
                    <Link href="/signup" className="font-medium text-nature-600 hover:text-nature-500">
                        create a new account
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">

                    {error && (
                        <div className="mb-4 bg-red-50 p-3 rounded-md text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handlePhoneLogin}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                            <div className="mt-1">
                                <input type="tel" placeholder="e.g. 9876543210" required value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 15))} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-nature-500 focus:border-nature-500 sm:text-sm" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1">
                                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-nature-500 focus:border-nature-500 sm:text-sm" />
                            </div>
                        </div>

                        <div>
                            <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-nature-600 hover:bg-nature-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nature-500 disabled:opacity-50">
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}

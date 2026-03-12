'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        // We simulate a phone signup by appending a fake domain that will pass MX checks.
        const simulatedEmail = `${phone}.swaad@gmail.com`;

        const { data, error } = await supabase.auth.signUp({
            email: simulatedEmail,
            password,
            options: {
                data: {
                    full_name: fullName,
                    phone: phone, // Storing phone in user_metadata
                },
                emailRedirectTo: `${window.location.origin}/auth/callback`
            }
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
        } else {
            setMessage('Account created successfully! If email confirmation is enabled on your backend, please check your inbox.');
            // Go to home right away since user may be logged in automatically (if confirm not required)
            if (data.session) {
                router.push('/');
            } else {
                // otherwise fallback push to login
                setTimeout(() => router.push('/login'), 2000);
            }
        }
        setLoading(false);
    };



    return (
        <div className="min-h-screen bg-nature-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-nature-900 font-display">
                    Create a new account
                </h2>
                <p className="mt-2 text-center text-sm text-nature-600">
                    Already have an account?{' '}
                    <Link href="/login" className="font-medium text-nature-600 hover:text-nature-500">
                        Sign in here
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
                    {message && (
                        <div className="mb-4 bg-green-50 p-3 rounded-md text-sm text-green-700">
                            {message}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSignup}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <div className="mt-1">
                                <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-nature-500 focus:border-nature-500 sm:text-sm text-gray-900 placeholder:text-gray-400 bg-white" placeholder="John Doe" />
                            </div>
                        </div>



                        <div>
                            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                            <div className="mt-1">
                                <input type="tel" required value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 15))} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-nature-500 focus:border-nature-500 sm:text-sm text-gray-900 placeholder:text-gray-400 bg-white" placeholder="9876543210" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1">
                                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-nature-500 focus:border-nature-500 sm:text-sm text-gray-900 placeholder:text-gray-400 bg-white" />
                            </div>
                        </div>

                        <div>
                            <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-nature-600 hover:bg-nature-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nature-500 disabled:opacity-50">
                                {loading ? 'Creating account...' : 'Create Account'}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchUserLoyaltyInfo } from '@/lib/loyalty';
import { DownloadInvoiceButton } from '@/components/DownloadInvoiceButton';

interface UserProfile {
    id: string;
    full_name: string | null;
    phone: string | null;
    address: string | null;
}

interface Order {
    id: string;
    created_at: string;
    total_amount: number;
    status: string;
    items: any[];
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loyalty, setLoyalty] = useState<{ total_stamps: number, consecutive_streak: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchProfileAndOrders();
    }, []);

    const fetchProfileAndOrders = async () => {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) {
            router.push('/login');
            return;
        }

        // Fetch Profile
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (profileData) setProfile(profileData);

        // Fetch Orders
        const { data: ordersData, error: ordersError } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });

        if (ordersData) setOrders(ordersData as any[]);

        // Fetch Loyalty
        const loyaltyData = await fetchUserLoyaltyInfo(session.user.id);
        if (loyaltyData) setLoyalty(loyaltyData);

        setLoading(false);
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        if (!profile) return;
        setUpdating(true);

        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: profile.full_name,
                phone: profile.phone,
                address: profile.address,
            })
            .eq('id', profile.id);

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        }
        setUpdating(false);
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
    }

    if (!profile) return null;

    return (
        <div className="min-h-screen bg-earth-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">

                <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-earth-100">
                    <h1 className="text-3xl font-display font-bold text-nature-900">Your Account</h1>
                    <button onClick={handleSignOut} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors">
                        Sign Out
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Profile Form */}
                    <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-earth-100 h-fit">
                        <h2 className="text-xl font-bold mb-6 border-b pb-4 text-gray-900">Profile Details</h2>

                        {message && (
                            <div className={`p-3 rounded-md text-sm mb-4 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={profile.full_name || ''}
                                    onChange={e => setProfile({ ...profile, full_name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-nature-500 focus:border-nature-500 text-gray-900 bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    value={profile.phone || ''}
                                    onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-nature-500 focus:border-nature-500 bg-gray-50 text-gray-900"
                                    disabled // Phone updates usually require reverification
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Default Delivery Address</label>
                                <textarea
                                    value={profile.address || ''}
                                    onChange={e => setProfile({ ...profile, address: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-nature-500 focus:border-nature-500 text-gray-900 bg-white"
                                    rows={3}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={updating}
                                className="w-full py-2 bg-nature-600 text-white rounded-md font-medium hover:bg-nature-700 transition disabled:opacity-50"
                            >
                                {updating ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>

                        {/* Loyalty Ticket Display */}
                        {loyalty && (
                            <div className="mt-8 border border-nature-300 bg-nature-50/50 rounded-2xl p-6 mb-10 flex flex-col items-center text-center">
                                <h3 className="font-display font-bold text-nature-800 text-2xl mb-1 flex items-center gap-2">
                                    Loyalty Ticket 🎟️
                                </h3>
                                <p className="text-sm text-nature-700 mb-2 font-medium">
                                    Collect 5 Stamps! Get a special deal on your next order! 🎁
                                </p>
                                <p className="text-xs text-nature-600 mb-6 max-w-lg leading-relaxed">
                                    One official PlanetsSwaad stamp is added to this ticket for each unique order placed on a different day. Earn all 5 to unlock a major offer!
                                </p>
                                
                                {/* Total Slots */}
                                <div className="flex gap-4">
                                    {[1, 2, 3, 4, 5].map((slot) => {
                                        const isStamped = slot <= loyalty.total_stamps;
                                        return (
                                            <div 
                                                key={slot} 
                                                className={`w-16 h-16 rounded-full flex items-center justify-center border-[3px] shadow-sm relative overflow-hidden transition-all duration-300 ${isStamped ? 'border-nature-600 bg-nature-50' : 'bg-white border-dashed border-gray-300'}`}
                                            >
                                                {isStamped ? (
                                                    <div className="absolute inset-0 flex flex-col justify-center items-center text-nature-700 opacity-90" style={{ transform: `rotate(${Math.random() * 20 - 10}deg)` }}>
                                                        <span className="text-2xl leading-none">🍃</span>
                                                        <span className="text-[8px] font-bold uppercase tracking-widest mt-0.5 border-t border-nature-400 pt-0.5">Verified</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-300 text-sm font-bold">{slot}</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                <p className="text-[10px] text-gray-500 italic mt-4 uppercase tracking-wide">
                                    * Stamps reset after the 5th stamp is earned and a reward is claimed.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Order History */}
                    <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-earth-100">
                        <h2 className="text-xl font-bold mb-6 border-b pb-4 text-gray-900">Order History</h2>

                        {orders.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <p>You haven't placed any orders yet.</p>
                                <Link href="/menu" className="text-nature-600 font-medium hover:underline mt-2 inline-block">Browse Menu</Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map(order => (
                                    <div key={order.id} className="border rounded-xl p-4 hover:shadow-md transition">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className="font-semibold text-gray-900">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                                                <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg text-gray-900">₹{order.total_amount}</p>
                                                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mt-1 ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'Placed' ? 'bg-gray-100 text-gray-800' :
                                                        order.status === 'Out for Delivery' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-end">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Items:</h4>
                                                <ul className="text-sm text-gray-600 space-y-1">
                                                    {order.items.map((item: any, idx: number) => (
                                                        <li key={idx}>
                                                            {item.quantity}x {item.name} <span className="text-gray-400 text-xs">(₹{item.price})</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <DownloadInvoiceButton order={order} stamps={loyalty?.total_stamps || 0} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

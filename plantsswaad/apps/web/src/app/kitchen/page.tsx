'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthGuard } from '@/components/AuthGuard';

// Typical Order type based on the schema
type Order = {
    id: string;
    status: 'Placed' | 'Confirmed' | 'Preparing' | 'Out for Delivery' | 'Delivered';
    items: any; // jsonb array of items
    created_at: string;
};

export default function KitchenDashboard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();

        // Subscribe to real-time order updates
        const channel = supabase.channel('kitchen-orders')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => {
                fetchOrders(); // Re-fetch on any change
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        // Chefs only need to see Confirmed (needs to be prepared) and Preparing (currently making)
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .in('status', ['Confirmed', 'Preparing'])
            .order('created_at', { ascending: true }); // Oldest first

        if (data) setOrders(data as Order[]);
        setLoading(false);
    };

    const updateOrderStatus = async (id: string, newStatus: string) => {
        const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
        if (error) {
            alert('Error updating status: ' + error.message);
        } else {
            fetchOrders();
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = '/login';
    };

    return (
        <AuthGuard allowedRoles={['chef', 'admin']}>
            <div className="min-h-screen bg-nature-50 p-4 md:p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-nature-200">
                        <div>
                            <h1 className="text-3xl font-display font-bold text-nature-900">Kitchen Dashboard</h1>
                            <p className="text-nature-600">Active Cooking Queue</p>
                        </div>
                        <button onClick={handleSignOut} className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium transition">
                            Sign Out
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center p-12">Loading tickets...</div>
                    ) : orders.length === 0 ? (
                        <div className="bg-white p-12 rounded-xl border border-dashed border-gray-300 text-center">
                            <h3 className="text-xl font-medium text-gray-500">No active orders to prepare!</h3>
                            <p className="text-gray-400 mt-2">The kitchen is clear. Take a breather.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {orders.map(order => (
                                <div key={order.id} className={`bg-white rounded-xl shadow-sm border-t-4 border-x border-b p-6 ${order.status === 'Preparing' ? 'border-t-nature-500' : 'border-t-earth-500'}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="text-xs font-mono text-gray-400">Order #{order.id.split('-')[0]}</div>
                                        <div className={`text-xs font-bold px-2 py-1 rounded ${order.status === 'Preparing' ? 'bg-nature-100 text-nature-700' : 'bg-earth-100 text-earth-700'}`}>
                                            {order.status}
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-6 min-h-[120px]">
                                        {/* Assuming items is an array of objects: { name: string, quantity: number } */}
                                        {Array.isArray(order.items) && order.items.map((item: any, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                                <span className="font-medium text-nature-900">{item.name || 'Unknown Item'}</span>
                                                <span className="font-bold text-nature-600">x{item.quantity || 1}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-4 border-t border-gray-100">
                                        {order.status === 'Confirmed' && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'Preparing')}
                                                className="w-full bg-nature-500 text-white font-bold py-3 rounded-lg hover:bg-nature-600 transition shadow-sm"
                                            >
                                                Start Preparing
                                            </button>
                                        )}
                                        {order.status === 'Preparing' && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'Out for Delivery')}
                                                className="w-full bg-earth-500 text-white font-bold py-3 rounded-lg hover:bg-earth-600 transition shadow-sm"
                                            >
                                                Mark as Food Ready
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthGuard>
    );
}

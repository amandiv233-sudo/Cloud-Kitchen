'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type Profile = {
    id: string;
    full_name: string;
    phone: string;
};

type Order = {
    id: string;
    user_id: string;
    items: any;
    total_amount: number;
    status: string;
    payment_status: string;
    created_at: string;
    customer?: Profile | null;
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();

        // Subscribe to real-time changes
        const ordersSubscription = supabase
            .channel('public:orders')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
            .subscribe();

        return () => {
            supabase.removeChannel(ordersSubscription);
        };
    }, []);

    const fetchOrders = async () => {
        const { data: ordersData } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        // Fetch associated customer profiles manually since join might be tricky if profiles isn't exposed properly without a view
        if (ordersData && ordersData.length > 0) {
            const userIds = [...new Set(ordersData.map(o => o.user_id))];
            const { data: profilesData } = await supabase
                .from('profiles')
                .select('id, full_name, phone')
                .in('id', userIds);

            const profileMap = new Map(profilesData?.map(p => [p.id, p]) || []);

            const enrichedOrders = ordersData.map(order => ({
                ...order,
                customer: profileMap.get(order.user_id) || { full_name: 'Guest User', phone: 'Unknown' }
            })) as Order[];

            setOrders(enrichedOrders);
        } else {
            setOrders([]);
        }
        setLoading(false);
    };

    const updateOrderStatus = async (id: string, newStatus: string) => {
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', id);
        if (!error) {
            fetchOrders();
        } else {
            alert('Failed to update order status');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Placed': return 'bg-blue-100 text-blue-800';
            case 'Confirmed': return 'bg-purple-100 text-purple-800';
            case 'Preparing': return 'bg-amber-100 text-amber-800';
            case 'Out for Delivery': return 'bg-orange-100 text-orange-800';
            case 'Delivered': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-nature-900 mb-2">Live Orders</h1>
                    <p className="text-nature-600">Manage incoming kitchen orders in real-time.</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="w-8 h-8 rounded-full border-4 border-nature-200 border-t-nature-600 animate-spin"></div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-nature-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-nature-50 text-nature-700 border-b border-nature-200 text-sm">
                            <tr>
                                <th className="p-4 font-bold">Order Details</th>
                                <th className="p-4 font-bold">Customer</th>
                                <th className="p-4 font-bold">Items</th>
                                <th className="p-4 font-bold">Total</th>
                                <th className="p-4 font-bold">Status</th>
                                <th className="p-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-nature-100">
                            {orders.map(order => (
                                <tr key={order.id} className="hover:bg-nature-50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-mono text-xs text-nature-500 mb-1">#{order.id.split('-')[0]}</div>
                                        <div className="text-sm text-nature-600">
                                            {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-nature-900">{order.customer?.full_name}</div>
                                        <div className="text-sm text-nature-600">{order.customer?.phone}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm text-nature-800 max-w-[200px] line-clamp-2">
                                            {/* Assuming items is an array of objects like { name: string, quantity: number } */}
                                            {Array.isArray(order.items)
                                                ? order.items.map((i: any) => `${i.quantity}x ${i.name}`).join(', ')
                                                : 'Order details...'}
                                        </div>
                                    </td>
                                    <td className="p-4 font-bold text-nature-800">
                                        ₹{order.total_amount}
                                        <div className={`text-xs mt-1 ${order.payment_status === 'Paid' ? 'text-green-600' : 'text-amber-600'}`}>
                                            {order.payment_status}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-bold border-none cursor-pointer outline-none appearance-none ${getStatusColor(order.status)}`}
                                        >
                                            <option value="Placed">Placed</option>
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="Preparing">Preparing</option>
                                            <option value="Out for Delivery">Out For Delivery</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-nature-600 hover:text-nature-900 text-sm font-medium">View Details</button>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-nature-500 text-lg">
                                        No live orders currently active. Waiting for new orders...
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Order = {
    id: string;
    total_amount: number;
    status: string;
    created_at: string;
    items: any;
    user_id: string;
    customer_name?: string;
};

export default function AdminOverviewPage() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        revenue: 0,
        mostOrderedItem: 'None',
        mostOrderedCount: 0
    });
    const [chartData, setChartData] = useState<any[]>([]);
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();

        // Subscribe to live order updates
        const subscription = supabase
            .channel('public:orders:dashboard')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchDashboardData)
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const fetchDashboardData = async () => {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // Fetch today's orders
        const { data: todayOrders } = await supabase
            .from('orders')
            .select('*')
            .gte('created_at', startOfDay.toISOString());

        let totalOrders = 0;
        let revenue = 0;
        const itemCounts: Record<string, number> = {};
        
        // Prepare graph data
        const hourlyData = Array.from({ length: 24 }, (_, i) => ({
            time: `${i === 0 ? 12 : i > 12 ? i - 12 : i} ${i >= 12 ? 'PM' : 'AM'}`,
            originalHour: i,
            total: 0
        }));

        if (todayOrders) {
            totalOrders = todayOrders.length;
            todayOrders.forEach(order => {
                if (order.status !== 'Failed') {
                    revenue += Number(order.total_amount);
                    
                    const orderHour = new Date(order.created_at).getHours();
                    hourlyData[orderHour].total += Number(order.total_amount);
                }

                if (Array.isArray(order.items)) {
                    order.items.forEach((item: any) => {
                        const name = item.name || 'Unknown';
                        itemCounts[name] = (itemCounts[name] || 0) + (item.quantity || 1);
                    });
                }
            });
        }
        
        let mostOrderedItem = 'None';
        let mostOrderedCount = 0;
        for (const [name, count] of Object.entries(itemCounts)) {
            if (count > mostOrderedCount) {
                mostOrderedCount = count;
                mostOrderedItem = name;
            }
        }

        setStats({ totalOrders, revenue, mostOrderedItem, mostOrderedCount });
        
        // Only show up to current hour to make graph look alive
        const currentHour = new Date().getHours();
        setChartData(hourlyData.filter(d => d.originalHour <= currentHour));

        // Fetch 5 most recent orders
        const { data: recent } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);

        if (recent && recent.length > 0) {
            const userIds = Array.from(new Set(recent.map(o => o.user_id)));
            const { data: profiles } = await supabase
                .from('profiles')
                .select('id, full_name')
                .in('id', userIds);

            const profileMap = new Map((profiles || []).map(p => [p.id, p.full_name || 'Guest User']));

            setRecentOrders(recent.map(o => ({
                ...o,
                customer_name: profileMap.get(o.user_id) || 'Guest User'
            })));
        } else {
            setRecentOrders([]);
        }

        setLoading(false);
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
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-nature-900 mb-2">Dashboard Overview</h1>
                <p className="text-nature-600">Welcome back, Admin. Here's what's happening today.</p>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="w-8 h-8 rounded-full border-4 border-nature-200 border-t-nature-600 animate-spin"></div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-nature-100 flex flex-col justify-center">
                            <span className="text-nature-500 font-medium text-sm mb-1">Today's Total Orders</span>
                            <span className="text-4xl font-bold text-nature-800">{stats.totalOrders}</span>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-nature-100 flex flex-col justify-center">
                            <span className="text-nature-500 font-medium text-sm mb-1">Today's Revenue</span>
                            <span className="text-4xl font-bold text-nature-800">₹{stats.revenue}</span>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-nature-100 flex flex-col justify-center">
                            <span className="text-nature-500 font-medium text-sm mb-1">Most Ordered Item</span>
                            <span className="text-2xl font-bold text-nature-800 leading-tight mt-1 truncate">{stats.mostOrderedItem}</span>
                            <span className="text-nature-400 text-sm mt-2">{stats.mostOrderedCount} orders today</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-nature-100 mb-12 h-96">
                        <h3 className="text-lg font-bold text-nature-800 mb-6">Today's Revenue Trend</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#468f71" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#468f71" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: number) => [`₹${value}`, 'Revenue']}
                                    labelStyle={{ fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}
                                />
                                <Area type="monotone" dataKey="total" stroke="#468f71" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-nature-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-nature-100 flex justify-between items-center bg-nature-50/50">
                            <h3 className="font-bold text-nature-800 text-lg">Recent Orders</h3>
                            <Link href="/admin/orders" className="text-sm font-medium text-nature-600 hover:text-nature-800">View All →</Link>
                        </div>
                        <div className="p-0 overflow-x-auto">
                            <table className="w-full text-left min-w-[600px]">
                                <thead>
                                    <tr className="bg-nature-50 text-nature-500 text-xs uppercase tracking-wider">
                                        <th className="px-6 py-4 font-medium">Order ID</th>
                                        <th className="px-6 py-4 font-medium">Customer</th>
                                        <th className="px-6 py-4 font-medium">Amount</th>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                        <th className="px-6 py-4 font-medium">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-nature-100">
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-nature-50/50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-nature-900 border-l-4 border-l-nature-500">
                                                #{order.id.split('-')[0]}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-nature-700">{order.customer_name}</td>
                                            <td className="px-6 py-4 text-sm text-nature-700 font-bold">₹{order.total_amount}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-nature-500">
                                                {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                        </tr>
                                    ))}
                                    {recentOrders.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-nature-500 text-sm">
                                                No orders received yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

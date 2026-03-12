'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type Profile = {
    id: string;
    full_name: string | null;
    phone: string | null;
    role: string;
};

export default function AdminStaff() {
    const [staff, setStaff] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('profiles').select('*').order('role');
        if (data) setStaff(data as Profile[]);
        setLoading(false);
    };

    const handleRoleChange = async (id: string, newRole: string) => {
        const { error } = await supabase.from('profiles').update({ role: newRole as any }).eq('id', id);
        if (error) {
            alert('Error updating role: ' + error.message);
        } else {
            fetchStaff();
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-nature-900">Staff Management</h1>
            </div>

            {loading ? (
                <p>Loading staff...</p>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-nature-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-nature-50 text-nature-700 border-b border-nature-200">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Phone / Email</th>
                                <th className="p-4">UserID</th>
                                <th className="p-4">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staff.map(user => (
                                <tr key={user.id} className="border-b border-nature-100 hover:bg-nature-50">
                                    <td className="p-4 font-bold text-nature-900">
                                        {user.full_name || 'Unknown'}
                                    </td>
                                    <td className="p-4 text-nature-600">
                                        {user.phone || 'N/A'}
                                    </td>
                                    <td className="p-4 text-xs font-mono text-gray-400">
                                        {user.id}
                                    </td>
                                    <td className="p-4">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            className="border border-gray-300 rounded-md p-2 bg-white text-sm cursor-pointer"
                                        >
                                            <option value="customer">Customer</option>
                                            <option value="chef">Chef (Kitchen)</option>
                                            <option value="sales">Sales</option>
                                            <option value="delivery">Delivery</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                            {staff.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-nature-500">No users found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

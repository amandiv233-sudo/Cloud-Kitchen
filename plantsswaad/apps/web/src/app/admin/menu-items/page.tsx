'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

type Category = { id: string; name: string };
type MenuItem = {
    id: string;
    category_id: string;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
    is_available: boolean;
    is_featured: boolean;
};

export default function AdminMenuItems() {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [form, setForm] = useState({
        category_id: '', name: '', description: '', price: 0, image_url: '', is_available: true, is_featured: false
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const [itemsRes, catsRes] = await Promise.all([
            supabase.from('menu_items').select('*').order('name'),
            supabase.from('categories').select('id, name')
        ]);
        if (itemsRes.data) setItems(itemsRes.data as MenuItem[]);
        if (catsRes.data) {
            setCategories(catsRes.data as Category[]);
            if (catsRes.data.length > 0) setForm(curr => ({ ...curr, category_id: (catsRes.data[0] as Category).id }));
        }
        setLoading(false);
    };

    const handleEdit = (item: MenuItem) => {
        setEditingId(item.id);
        setForm({
            category_id: item.category_id,
            name: item.name,
            description: item.description || '',
            price: item.price,
            image_url: item.image_url || '',
            is_available: item.is_available,
            is_featured: item.is_featured
        });
        setIsAdding(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let error;
        if (editingId) {
            const { error: updateError } = await supabase.from('menu_items').update(form).eq('id', editingId);
            error = updateError;
        } else {
            const { error: insertError } = await supabase.from('menu_items').insert([form]);
            error = insertError;
        }

        if (!error) {
            setIsAdding(false);
            setEditingId(null);
            fetchData();
            setForm({ ...form, name: '', description: '', price: 0, image_url: '', is_featured: false });
        } else {
            alert(error.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this menu item?')) {
            const { error } = await supabase.from('menu_items').delete().eq('id', id);
            if (error) {
                alert(error.message);
            } else {
                fetchData();
            }
        }
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingId(null);
        setForm({ ...form, name: '', description: '', price: 0, image_url: '', is_featured: false });
    };

    const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Unknown';

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-nature-900">Menu Items</h1>
                <button
                    onClick={isAdding ? handleCancel : () => setIsAdding(true)}
                    className="bg-nature-500 text-white px-4 py-2 rounded-lg hover:bg-nature-600 transition"
                >
                    {isAdding ? 'Cancel' : '+ Add Item'}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-nature-200 mb-8 max-w-2xl">
                    <h2 className="text-xl font-bold text-nature-800 mb-4">{editingId ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-nature-700 mb-1">Name</label>
                            <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-300 rounded-md p-2 bg-white text-gray-900 placeholder-gray-400" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-nature-700 mb-1">Category</label>
                            <select required value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} className="w-full border border-gray-300 rounded-md p-2 bg-white text-gray-900 placeholder-gray-400">
                                <option value="" disabled>Select Category</option>
                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-nature-700 mb-1">Price (₹)</label>
                            <input required type="number" value={form.price} onChange={e => setForm({ ...form, price: parseFloat(e.target.value) })} className="w-full border border-gray-300 rounded-md p-2 bg-white text-gray-900 placeholder-gray-400" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-nature-700 mb-1">Image URL</label>
                            <input type="text" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} className="w-full border border-gray-300 rounded-md p-2 bg-white text-gray-900 placeholder-gray-400" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-nature-700 mb-1">Description</label>
                            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border border-gray-300 rounded-md p-2 bg-white text-gray-900 placeholder-gray-400" />
                        </div>
                        <div className="flex items-center gap-6 col-span-2">
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={form.is_available} onChange={e => setForm({ ...form, is_available: e.target.checked })} id="is_avail" />
                                <label htmlFor="is_avail" className="text-sm font-medium text-nature-700">Available</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} id="is_feat" />
                                <label htmlFor="is_feat" className="text-sm font-medium text-nature-700">Featured (Home Page)</label>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button type="submit" className="bg-nature-500 text-white px-6 py-2 rounded-md hover:bg-nature-600 transition">
                            {editingId ? 'Update Item' : 'Save Item'}
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <p>Loading items...</p>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-nature-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-nature-50 text-nature-700 border-b border-nature-200">
                            <tr>
                                <th className="p-4">Image</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Badges</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id} className="border-b border-nature-100 hover:bg-nature-50">
                                    <td className="p-4">
                                        {item.image_url ? (
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border">
                                                <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">📷</div>
                                        )}
                                    </td>
                                    <td className="p-4 font-bold text-nature-900">
                                        {item.name}
                                        {item.description && <div className="font-normal text-xs text-nature-500 line-clamp-1 max-w-[200px]">{item.description}</div>}
                                    </td>
                                    <td className="p-4 text-nature-600">{getCategoryName(item.category_id)}</td>
                                    <td className="p-4 font-bold text-nature-800">₹{item.price}</td>
                                    <td className="p-4 space-x-2">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${item.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {item.is_available ? 'Available' : 'Out of Stock'}
                                        </span>
                                        {item.is_featured && (
                                            <span className="px-2 py-1 rounded text-xs font-bold bg-amber-100 text-amber-800">Featured</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right space-x-4">
                                        <button onClick={() => handleEdit(item)} className="text-blue-500 hover:text-blue-700 font-medium">Edit</button>
                                        <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-nature-500">No menu items found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

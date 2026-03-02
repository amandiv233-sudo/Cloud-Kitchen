'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

type Category = {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
    description: string | null;
    is_active: boolean;
    sort_order: number;
};

export default function AdminCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [form, setForm] = useState({
        name: '', slug: '', image_url: '', description: '', is_active: true, sort_order: 0
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('categories').select('*').order('sort_order');
        if (data) setCategories(data as Category[]);
        setLoading(false);
    };

    const handleEdit = (category: Category) => {
        setEditingId(category.id);
        setForm({
            name: category.name,
            slug: category.slug,
            image_url: category.image_url || '',
            description: category.description || '',
            is_active: category.is_active,
            sort_order: category.sort_order
        });
        setIsAdding(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let error;
        if (editingId) {
            const { error: updateError } = await supabase.from('categories').update(form).eq('id', editingId);
            error = updateError;
        } else {
            const { error: insertError } = await supabase.from('categories').insert([form]);
            error = insertError;
        }

        if (!error) {
            setIsAdding(false);
            setEditingId(null);
            setForm({ name: '', slug: '', image_url: '', description: '', is_active: true, sort_order: 0 });
            fetchCategories();
        } else {
            alert(error.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this category?')) {
            const { error } = await supabase.from('categories').delete().eq('id', id);
            if (error) {
                alert(error.message);
            } else {
                fetchCategories();
            }
        }
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingId(null);
        setForm({ name: '', slug: '', image_url: '', description: '', is_active: true, sort_order: 0 });
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-nature-900">Categories</h1>
                <button
                    onClick={isAdding ? handleCancel : () => setIsAdding(true)}
                    className="bg-nature-500 text-white px-4 py-2 rounded-lg hover:bg-nature-600 transition"
                >
                    {isAdding ? 'Cancel' : '+ Add Category'}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-nature-200 mb-8 max-w-2xl">
                    <h2 className="text-xl font-bold text-nature-800 mb-4">{editingId ? 'Edit Category' : 'Add New Category'}</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-nature-700 mb-1">Name</label>
                            <input required type="text" value={form.name} onChange={e => {
                                const newName = e.target.value;
                                setForm({ ...form, name: newName, slug: editingId ? form.slug : newName.toLowerCase().replace(/[^a-z0-9]+/g, '-') })
                            }} className="w-full border border-gray-300 rounded-md p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-nature-700 mb-1">Slug</label>
                            <input required type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full border border-gray-300 rounded-md p-2" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-nature-700 mb-1">Image URL</label>
                            <input type="text" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} className="w-full border border-gray-300 rounded-md p-2" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-nature-700 mb-1">Description</label>
                            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border border-gray-300 rounded-md p-2" />
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} id="is_active" />
                            <label htmlFor="is_active" className="text-sm font-medium text-nature-700">Active</label>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-nature-700 mb-1">Sort Order</label>
                            <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) })} className="w-full border border-gray-300 rounded-md p-2" />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button type="submit" className="bg-nature-500 text-white px-6 py-2 rounded-md hover:bg-nature-600 transition">
                            {editingId ? 'Update Category' : 'Save Category'}
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <p>Loading categories...</p>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-nature-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-nature-50 text-nature-700 border-b border-nature-200">
                            <tr>
                                <th className="p-4">Image</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Slug</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Order</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(cat => (
                                <tr key={cat.id} className="border-b border-nature-100 hover:bg-nature-50">
                                    <td className="p-4">
                                        {cat.image_url ? (
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border">
                                                <Image src={cat.image_url} alt={cat.name} fill className="object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">📷</div>
                                        )}
                                    </td>
                                    <td className="p-4 font-bold text-nature-900">{cat.name}</td>
                                    <td className="p-4 text-nature-600 font-mono text-sm">{cat.slug}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${cat.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {cat.is_active ? 'Active' : 'Hidden'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-nature-600">{cat.sort_order}</td>
                                    <td className="p-4 text-right space-x-4">
                                        <button onClick={() => handleEdit(cat)} className="text-blue-500 hover:text-blue-700 font-medium">Edit</button>
                                        <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-nature-500">No categories found in database.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

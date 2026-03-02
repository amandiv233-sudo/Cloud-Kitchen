'use client';

import { useState } from 'react';
import { useCartStore } from '@plantsswaad/shared';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export function CartDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    const { items, removeItem, getTotal, clearCart } = useCartStore();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [address, setAddress] = useState('Bhagalpur');
    const router = useRouter();

    const handleCheckout = async () => {
        setIsCheckingOut(true);

        try {
            // 1. Check if user is logged in
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError || !session?.user) {
                alert('Please sign in or create an account to place an order.');
                setIsOpen(false);
                router.push('/login');
                return;
            }

            // 2. Insert the real order into Supabase
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert([
                    {
                        user_id: session.user.id,
                        items: items as unknown as any,
                        total_amount: getTotal(),
                        status: 'Placed',
                        delivery_address: { full_address: address },
                        payment_status: 'Pending' // Would integrate Razorpay here later
                    }
                ])
                .select()
                .single();

            if (orderError) throw orderError;

            // 3. Complete checkout
            alert(`Order Placed Successfully!\nTotal: ₹${getTotal()}`);
            clearCart();
            setIsOpen(false);

            // Redirect to their new profile/orders page
            router.push('/profile');

        } catch (error: any) {
            console.error('Checkout error:', error);
            alert('Failed to place order: ' + error.message);
        } finally {
            setIsCheckingOut(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 bg-nature-600 text-white p-4 rounded-full shadow-2xl hover:bg-nature-700 transition-all z-50 flex items-center justify-center group"
            >
                <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
                    {items.length > 0 && (
                        <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                            {items.reduce((acc, item) => acc + item.quantity, 0)}
                        </span>
                    )}
                </div>
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="p-6 bg-nature-50 border-b border-nature-100 flex justify-between items-center">
                    <h2 className="text-2xl font-display font-bold text-nature-800">Your Cart</h2>
                    <button onClick={() => setIsOpen(false)} className="text-nature-500 hover:text-nature-800">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-nature-400">
                            <span className="text-6xl mb-4">🛒</span>
                            <p>Your cart is empty</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map(item => (
                                <div key={item.id} className="flex justify-between items-center p-4 bg-white border border-nature-100 rounded-2xl shadow-sm">
                                    <div>
                                        <h3 className="font-bold text-nature-800">{item.name}</h3>
                                        <p className="text-sm text-nature-500">₹{item.price} x {item.quantity}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold text-nature-700">₹{item.price * item.quantity}</span>
                                        <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-6 bg-earth-50 border-t border-earth-100">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-earth-700 mb-1">Delivery Address</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full p-3 rounded-xl border border-earth-200 focus:outline-none focus:ring-2 focus:ring-nature-500"
                                placeholder="Enter full address"
                            />
                        </div>
                        <div className="flex justify-between items-center mb-6 text-xl font-bold text-earth-900">
                            <span>Total Amount:</span>
                            <span>₹{getTotal()}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={isCheckingOut || address.trim() === ''}
                            className="w-full py-4 bg-nature-600 hover:bg-nature-700 disabled:bg-nature-300 text-white rounded-xl font-bold text-lg transition-colors flex justify-center items-center"
                        >
                            {isCheckingOut ? (
                                <span className="animate-pulse">Processing Payment...</span>
                            ) : (
                                'Proceed to Pay via Razorpay'
                            )}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

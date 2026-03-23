'use client';

import { useState } from 'react';
import { useCartStore } from '@plantsswaad/shared';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useNotifications } from '@/hooks/useNotifications';
import { processOrderLoyalty } from '@/lib/loyalty';

declare global {
    interface Window {
        Razorpay: any;
    }
}

export function CartDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    const { items, removeItem, getTotal, clearCart } = useCartStore();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [address, setAddress] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
    const { sendLocalNotification } = useNotifications();
    const router = useRouter();

    const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';

    const openRazorpayPopup = (orderId: string, totalAmount: number) => {
        return new Promise<{ paymentId: string; orderId: string }>((resolve, reject) => {
            if (!window.Razorpay) {
                reject(new Error('Razorpay SDK not loaded. Please refresh and try again.'));
                return;
            }

            const options = {
                key: RAZORPAY_KEY_ID,
                amount: totalAmount * 100, // Razorpay expects amount in paise
                currency: 'INR',
                name: 'PlanetsSwaad',
                description: `Order #${orderId.split('-')[0]}`,
                image: '/logo.png',
                handler: function (response: any) {
                    resolve({
                        paymentId: response.razorpay_payment_id,
                        orderId: orderId,
                    });
                },
                prefill: {
                    name: fullName,
                    contact: phone,
                },
                notes: {
                    order_id: orderId,
                    delivery_address: address,
                },
                theme: {
                    color: '#468f71', // nature-500 brand green
                },
                modal: {
                    ondismiss: function () {
                        reject(new Error('Payment cancelled by user'));
                    },
                },
            };

            const rzp = new window.Razorpay(options);

            rzp.on('payment.failed', function (response: any) {
                reject(new Error(response.error?.description || 'Payment failed'));
            });

            rzp.open();
        });
    };

    const handleCheckout = async () => {
        if (!address || !fullName || !phone) {
            alert('Please fill out all delivery details.');
            return;
        }

        if (!RAZORPAY_KEY_ID) {
            alert('Payment gateway is not configured. Please contact support.');
            return;
        }

        if (!razorpayLoaded || !window.Razorpay) {
            alert('Payment gateway is still loading. Please wait a moment and try again.');
            return;
        }

        setIsCheckingOut(true);

        try {
            // 1. Check if user is logged in
            let { data: { session }, error: sessionError } = await supabase.auth.getSession();

            // 2. Perform Guest SILENT Login/Signup if no session
            if (sessionError || !session?.user) {
                const simulatedEmail = `${phone}.swaad@gmail.com`;
                const dummyPassword = 'GuestOrder2024!';

                let authResult = await supabase.auth.signUp({
                    email: simulatedEmail,
                    password: dummyPassword,
                    options: { data: { full_name: fullName, phone: phone } }
                });

                if (authResult.error && authResult.error.message.includes('already registered')) {
                    authResult = await supabase.auth.signInWithPassword({
                        email: simulatedEmail,
                        password: dummyPassword,
                    });
                }

                if (authResult.error) {
                    throw new Error("Could not process guest checkout authentication.");
                }

                session = authResult.data.session;
            }

            if (!session?.user?.id) throw new Error("Authentication failed");

            // 3. Insert the order into Supabase with 'Pending' payment
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert([
                    {
                        user_id: session.user.id,
                        items: items as unknown as any,
                        total_amount: getTotal(),
                        status: 'Placed',
                        delivery_address: { full_address: address, recipient: fullName, phone: phone },
                        payment_status: 'Pending'
                    }
                ])
                .select()
                .single();

            if (orderError) throw orderError;

            // 4. Handle Payment Route
            try {
                let finalPaymentId = `COD_${orderData.id.split('-')[0]}`;
                
                if (paymentMethod === 'online') {
                    const paymentResult = await openRazorpayPopup(orderData.id, getTotal());
                    finalPaymentId = paymentResult.paymentId;
                }

                // 5. Order successfully confirmed (either COD placed or Paid via Razorpay)
                await supabase
                    .from('orders')
                    .update({
                        payment_status: paymentMethod === 'online' ? 'Paid' : 'Pending',
                        payment_id: finalPaymentId,
                    })
                    .eq('id', orderData.id);

                // Process Loyalty Validation
                const loyaltyResult = await processOrderLoyalty(session.user.id);
                const rewardText = loyaltyResult?.reward 
                    ? `\n🎉 LOYALTY REWARD UNLOCKED: ${loyaltyResult.reward.percentage}% OFF!\nUse code ${loyaltyResult.reward.code} on your next order.` 
                    : loyaltyResult?.stampEarned 
                        ? `\n🎟️ You earned a Loyalty Stamp today! (Stamps: ${loyaltyResult.currentStamps}, Streak: ${loyaltyResult.currentStreak})` 
                        : '';

                alert(
                    `✅ Order Placed Successfully!\n` +
                    `Order ID: ${orderData.id.split('-')[0]}\n` +
                    `Payment Method: ${paymentMethod === 'online' ? 'Razorpay (' + finalPaymentId + ')' : 'Cash on Delivery'}\n` +
                    `Total Amount: ₹${getTotal()}` +
                    rewardText
                );

                // Send push notification
                sendLocalNotification('🎉 Order Placed Successfully!', {
                    body: `Your order #${orderData.id.split('-')[0]} of ₹${getTotal()} is confirmed. We're preparing your food now!`,
                    tag: 'order-placed',
                    data: { url: '/profile' },
                });

                clearCart();
                setIsOpen(false);
                setAddress('');
                setFullName('');
                setPhone('');
                router.push('/profile');

            } catch (paymentError: any) {
                // Payment failed or was cancelled
                if (paymentError.message === 'Payment cancelled by user') {
                    // User closed the popup — mark as cancelled
                    await supabase
                        .from('orders')
                        .update({ payment_status: 'Cancelled' })
                        .eq('id', orderData.id);
                    alert('Payment was cancelled. Your order has been saved — you can retry anytime.');
                } else {
                    // Actual payment failure
                    await supabase
                        .from('orders')
                        .update({ payment_status: 'Failed' })
                        .eq('id', orderData.id);
                    alert(`❌ Payment Failed: ${paymentError.message}`);
                }
            }

        } catch (error: any) {
            console.error('Checkout error:', error);
            alert('Failed to place order: ' + error.message);
        } finally {
            setIsCheckingOut(false);
        }
    };

    return (
        <>
            {/* Load Razorpay SDK */}
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="lazyOnload"
                onLoad={() => setRazorpayLoaded(true)}
            />

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
                        <div className="space-y-3 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-earth-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full p-2 rounded-lg border border-earth-200 focus:outline-none focus:ring-2 focus:ring-nature-500 text-gray-900 bg-white"
                                    placeholder="e.g. Aman"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-earth-700 mb-1">Contact Number</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 15))}
                                    className="w-full p-2 rounded-lg border border-earth-200 focus:outline-none focus:ring-2 focus:ring-nature-500 text-gray-900 bg-white"
                                    placeholder="e.g. 9876543210"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-earth-700 mb-1">Delivery Address</label>
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full p-2 rounded-lg border border-earth-200 focus:outline-none focus:ring-2 focus:ring-nature-500 text-gray-900 bg-white"
                                    placeholder="Enter full address or landmark"
                                />
                            </div>

                            <div className="pt-2 border-t border-earth-100">
                                <label className="block text-sm font-medium text-earth-700 mb-2">Payment Method</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setPaymentMethod('online')}
                                        className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${paymentMethod === 'online' ? 'border-nature-600 bg-nature-50 text-nature-800 ring-1 ring-nature-600 shadow-sm' : 'border-earth-200 text-earth-600 hover:bg-earth-50'}`}
                                    >
                                        <span className="text-xl">💳</span>
                                        <span className="text-sm font-bold">Pay Online</span>
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('cod')}
                                        className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${paymentMethod === 'cod' ? 'border-nature-600 bg-nature-50 text-nature-800 ring-1 ring-nature-600 shadow-sm' : 'border-earth-200 text-earth-600 hover:bg-earth-50'}`}
                                    >
                                        <span className="text-xl">💵</span>
                                        <span className="text-sm font-bold text-center leading-tight">Pay on Delivery</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mb-6 text-xl font-bold text-earth-900">
                            <span>Total Amount:</span>
                            <span>₹{getTotal()}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={isCheckingOut || address.trim() === '' || !fullName.trim() || !phone.trim()}
                            className="w-full py-4 bg-nature-600 hover:bg-nature-700 disabled:bg-nature-300 text-white rounded-xl font-bold text-lg transition-colors flex justify-center items-center gap-2"
                        >
                            {isCheckingOut ? (
                                <span className="animate-pulse">Processing...</span>
                            ) : (
                                <>
                                    <span>{paymentMethod === 'cod' ? `Place Order (₹${getTotal()})` : `Pay ₹${getTotal()} via Razorpay`}</span>
                                    {paymentMethod === 'online' ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                    ) : (
                                        <span className="text-xl leading-none">🛵</span>
                                    )}
                                </>
                            )}
                        </button>
                        <p className="text-xs text-center text-nature-500 mt-3">
                            🔒 Secured by Razorpay · UPI, Cards, NetBanking accepted
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}

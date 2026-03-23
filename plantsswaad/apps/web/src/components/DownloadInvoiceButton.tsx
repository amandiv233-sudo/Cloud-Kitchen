'use client';

import { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export function DownloadInvoiceButton({ order, stamps = 0 }: { order: any, stamps?: number }) {
    const invoiceRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const generatePDF = async () => {
        setIsGenerating(true);
        try {
            // Dynamically import html2pdf to avoid Next.js SSR document is not defined errors
            const html2pdf = (await import('html2pdf.js')).default;
            const element = invoiceRef.current;

            const opt = {
                margin:       10,
                filename:     `PlanetsSwaad-Invoice-${(order.id || '').split('-')[0]}.pdf`,
                image:        { type: 'jpeg' as const, quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
            };

            await html2pdf().set(opt).from(element!).save();
        } catch (error) {
            console.error('PDF generation failed:', error);
            alert('Failed to generate invoice.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div>
            <button 
                onClick={generatePDF}
                disabled={isGenerating}
                className="px-4 py-2 bg-nature-600 hover:bg-nature-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                {isGenerating ? 'Generating PDF...' : 'Download Invoice'}
            </button>

            {/* Hidden Invoice Template - specifically styled for A4 exact dimensions */}
            <div className="hidden">
                <div ref={invoiceRef} className="w-[800px] bg-white p-10 font-sans text-gray-800" style={{ minHeight: '1120px' }}>
                    
                    {/* Header: Logo and Details */}
                    <div className="flex justify-between items-start border-b-2 border-nature-500 pb-6 mb-8">
                        <div>
                            <h1 className="text-4xl font-display font-bold text-nature-800 tracking-tight">PlanetsSwaad <span className="text-3xl">🍃</span></h1>
                            <p className="text-nature-600 italic mt-1 text-sm">"Swad Jo Dil Ko Chhoo Jaye"</p>
                            <p className="text-gray-500 text-sm mt-3">Bhagalpur, Bihar — 812001</p>
                            <p className="text-gray-500 text-sm">GSTIN: 10AXCXXXX000Z1</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">INVOICE</h2>
                            <p className="text-sm"><span className="font-semibold text-gray-600">Order ID:</span> #{order?.id?.split('-')[0]}</p>
                            <p className="text-sm"><span className="font-semibold text-gray-600">Date:</span> {new Date(order?.created_at || Date.now()).toLocaleDateString('en-IN')}</p>
                            <span className="inline-block mt-3 px-3 py-1 bg-green-100 text-green-800 font-bold text-xs rounded-md border border-green-300">
                                PAID
                            </span>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="mb-10 p-5 bg-nature-50 rounded-xl border border-nature-100">
                        <h3 className="text-sm font-bold text-nature-800 uppercase tracking-widest mb-3">Billed To:</h3>
                        <p className="font-semibold text-lg text-gray-900">{order?.delivery_address?.recipient || 'Customer'}</p>
                        <p className="text-gray-600 mt-1 max-w-sm">{order?.delivery_address?.full_address || 'N/A'}</p>
                        <p className="text-gray-600 mt-1">📞 +91 {order?.delivery_address?.phone || 'N/A'}</p>
                    </div>

                    {/* Items Table */}
                    <table className="w-full text-left mb-10 border-collapse">
                        <thead>
                            <tr className="border-b-2 border-gray-200">
                                <th className="py-3 px-2 text-nature-800 font-bold uppercase text-sm tracking-wider w-1/2">Item Description</th>
                                <th className="py-3 px-2 text-nature-800 font-bold uppercase text-sm tracking-wider text-center">Qty</th>
                                <th className="py-3 px-2 text-nature-800 font-bold uppercase text-sm tracking-wider text-right">Price</th>
                                <th className="py-3 px-2 text-nature-800 font-bold uppercase text-sm tracking-wider text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order?.items?.map((item: any, i: number) => (
                                <tr key={i} className="border-b border-gray-100">
                                    <td className="py-4 px-2">
                                        <p className="font-medium text-gray-900">{item.name}</p>
                                    </td>
                                    <td className="py-4 px-2 text-center text-gray-700">{item.quantity}</td>
                                    <td className="py-4 px-2 text-right text-gray-700">₹{item.price}</td>
                                    <td className="py-4 px-2 text-right font-bold text-gray-900">₹{item.price * item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Totals */}
                    <div className="flex justify-end mb-12">
                        <div className="w-1/3">
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">₹{order?.total_amount}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">GST (5%)</span>
                                <span className="font-medium">Inclusive</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Delivery</span>
                                <span className="font-medium text-green-600">Free</span>
                            </div>
                            <div className="flex justify-between py-4 mt-2 border-t-2 border-nature-800 text-xl font-bold">
                                <span className="text-nature-900">Total</span>
                                <span className="text-nature-900">₹{order?.total_amount}</span>
                            </div>
                        </div>
                    </div>

                    {/* 5-Day Loyalty Ticket Visual */}
                    <div className="border-2 border-dashed border-earth-300 bg-earth-50 rounded-2xl p-6 mb-10 flex items-center justify-between">
                        <div className="w-1/3">
                            <h3 className="font-display font-bold text-earth-800 text-xl mb-1">Loyalty Ticket 🎟️</h3>
                            <p className="text-xs text-earth-600 mb-2">
                                ✅ 5 consecutive days = <strong>50% OFF</strong>!<br/>
                                ✅ 5 non-consecutive days = <strong>20% OFF</strong>!
                            </p>
                            <p className="text-[10px] text-earth-500 italic">One stamp per day. Stamps rest after reward.</p>
                        </div>
                        
                        {/* 5 Stamp Slots */}
                        <div className="flex gap-3">
                            {[1, 2, 3, 4, 5].map((slot) => {
                                const isStamped = slot <= stamps;
                                return (
                                    <div 
                                        key={slot} 
                                        className={`w-14 h-14 rounded-full flex items-center justify-center border-2 border-earth-400 ${isStamped ? 'bg-earth-200' : 'bg-white border-dashed'}`}
                                    >
                                        {isStamped ? (
                                            <span className="text-2xl opacity-80" style={{ transform: `rotate(${Math.random() * 30 - 15}deg)` }}>
                                                🍃
                                            </span>
                                        ) : (
                                            <span className="text-earth-300 text-xs font-bold">{slot}</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-end pt-10 border-t border-gray-200">
                        <div>
                            <p className="text-nature-800 font-bold mb-1">Handcrafted with Love from the Planets</p>
                            <p className="text-xs text-gray-500">For issues or feedback, scan the QR or email us at amandiv2345@gmail.com</p>
                        </div>
                        <div>
                            {/* QR Code linking to support/menu */}
                            <QRCodeSVG 
                                value={`https://planetsswaad.netlify.app/order-support/${order?.id}`} 
                                size={70} 
                                fgColor="#1e3d33" 
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

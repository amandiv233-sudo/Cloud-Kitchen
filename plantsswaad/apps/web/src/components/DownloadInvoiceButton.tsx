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
                margin:       0,
                filename:     `PlanetsSwaad-Invoice-${(order.id || '').split('-')[0]}.pdf`,
                image:        { type: 'jpeg' as const, quality: 1 },
                html2canvas:  { scale: 2, useCORS: true, windowWidth: 794 },
                jsPDF:        { unit: 'px', format: [794, 1123] as [number, number], orientation: 'portrait' as const }
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

            {/* Off-screen Invoice Template - forces layout rendering without displaying it on screen */}
            <div className="absolute -left-[9999px] top-0 opacity-0 pointer-events-none">
                <div ref={invoiceRef} className="w-[794px] h-[1123px] bg-white p-10 font-sans text-gray-800 flex flex-col mx-auto shrink-0 border-box">
                    
                    {/* Header: Logo and Details */}
                    <div className="flex flex-row justify-between items-start border-b-2 border-nature-500 pb-6 mb-8 w-full">
                        <div className="flex-1">
                            <h1 className="text-5xl font-display font-bold text-nature-800 tracking-tight flex items-center gap-2">
                                PlanetsSwaad <span className="text-4xl">🍃</span>
                            </h1>
                            <p className="text-nature-600 italic mt-2 text-sm">"Swad Jo Dil Ko Chhoo Jaye"</p>
                            <p className="text-gray-500 text-sm mt-4">Bhagalpur, Bihar — 812001</p>
                            <p className="text-gray-500 text-sm">GSTIN: 10AXCXXXX000Z1</p>
                        </div>
                        <div className="text-right flex-1 pt-1">
                            <h2 className="text-3xl font-bold text-gray-800 mb-3 tracking-widest uppercase">INVOICE</h2>
                            <p className="text-sm mb-1 text-gray-800">
                                <span className="font-semibold text-gray-500 mr-2">Order ID:</span> 
                                <span className="font-mono bg-gray-100 px-1 py-0.5 rounded">#{order?.id?.split('-')[0]?.toUpperCase()}</span>
                            </p>
                            <p className="text-sm text-gray-800">
                                <span className="font-semibold text-gray-500 mr-2">Date:</span> 
                                {new Date(order?.created_at || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </p>
                            <div className="mt-4">
                                <span className="inline-block px-4 py-1.5 bg-green-100 text-green-800 font-bold text-xs rounded-md border border-green-300 tracking-wider">
                                    PAID
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="mb-10 p-5 bg-nature-50 rounded-xl border border-nature-100 w-full">
                        <h3 className="text-sm font-bold text-nature-800 uppercase tracking-widest mb-3">Billed To:</h3>
                        <p className="font-bold text-lg text-gray-900">{order?.delivery_address?.recipient || 'Customer'}</p>
                        <p className="text-gray-700 mt-1 max-w-sm leading-relaxed">{order?.delivery_address?.full_address || 'N/A'}</p>
                        <p className="text-gray-700 mt-2 font-medium flex items-center gap-2">
                            <span>📞</span> 
                            {order?.delivery_address?.phone ? `+91 ${order.delivery_address.phone}` : 'N/A'}
                        </p>
                    </div>

                    {/* Items Table */}
                    <table className="w-full text-left mb-6 border-collapse font-sans table-fixed">
                        <thead>
                            <tr className="border-b-2 border-gray-300 text-nature-800">
                                <th className="py-3 px-2 font-bold uppercase text-xs tracking-wider w-1/2">Item Description</th>
                                <th className="py-3 px-2 font-bold uppercase text-xs tracking-wider text-center w-[15%]">Qty</th>
                                <th className="py-3 px-2 font-bold uppercase text-xs tracking-wider text-right w-[15%]">Price</th>
                                <th className="py-3 px-2 font-bold uppercase text-xs tracking-wider text-right w-[20%]">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order?.items?.map((item: any, i: number) => {
                                const qty = Number(item.quantity) || 1;
                                const price = Number(item.price) || 0;
                                const amount = qty * price;
                                return (
                                    <tr key={i} className="border-b border-gray-100">
                                        <td className="py-4 px-2">
                                            <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                                        </td>
                                        <td className="py-4 px-2 text-center text-gray-700 text-sm">{qty}</td>
                                        <td className="py-4 px-2 text-right text-gray-700 text-sm">₹{price.toFixed(2)}</td>
                                        <td className="py-4 px-2 text-right font-bold text-gray-900 text-sm">₹{amount.toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {/* Totals */}
                    <div className="flex justify-end mb-12 w-full">
                        <div className="w-[40%] pl-6">
                            <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
                                <span className="text-gray-600 font-medium">Subtotal</span>
                                <span className="font-semibold text-gray-900">₹{(Number(order?.total_amount) || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
                                <span className="text-gray-600 font-medium">GST (5%)</span>
                                <span className="font-semibold text-gray-900">Inclusive</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
                                <span className="text-gray-600 font-medium">Delivery</span>
                                <span className="font-semibold text-green-600">₹0.00 (Free)</span>
                            </div>
                            <div className="flex justify-between py-4 mt-2 border-t-2 border-nature-800 text-xl font-bold">
                                <span className="text-nature-900 tracking-wide uppercase">Total</span>
                                <span className="text-nature-900 tracking-widest">₹{(Number(order?.total_amount) || 0).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* 5-Day Loyalty Ticket Visual */}
                    <div className="border border-nature-300 bg-nature-50/50 rounded-2xl p-6 mb-10 flex flex-col items-center text-center w-full">
                        <h3 className="font-display font-bold text-nature-800 text-2xl mb-1 flex items-center gap-2">
                            Loyalty Ticket 🎟️
                        </h3>
                        <p className="text-sm text-nature-700 mb-2 font-medium">
                            Collect 5 Stamps! Get a special deal on your next order! 🎁
                        </p>
                        <p className="text-xs text-nature-600 mb-6 max-w-lg leading-relaxed">
                            One official PlanetsSwaad stamp is added to this ticket for each unique order placed on a different day. Earn all 5 to unlock a major offer!
                        </p>
                        
                        {/* 5 Stamp Slots */}
                        <div className="flex gap-4 mb-4">
                            {[1, 2, 3, 4, 5].map((slot) => {
                                const isStamped = slot <= stamps;
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
                        <p className="text-[10px] text-gray-500 italic mt-2 uppercase tracking-wide">
                            * Stamps reset after the 5th stamp is earned and a reward is claimed.
                        </p>
                        {stamps === 5 && (
                            <p className="mt-4 px-4 py-2 bg-nature-800 text-white rounded-lg text-sm font-bold tracking-wider">
                                Ticket Complete! Check your email/SMS for your reward code!
                            </p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center pt-8 border-t-2 border-gray-200 mt-auto">
                        <div>
                            <p className="text-nature-900 font-bold text-lg mb-1 tracking-tight">Handcrafted with Love from the Planets</p>
                            <p className="text-xs text-gray-600 mt-2 font-medium">Thank you for choosing PlanetsSwaad! 🌍💖</p>
                            <p className="text-xs text-gray-500 mt-1">For issues or feedback, scan the QR or email us at amandiv2345@gmail.com</p>
                        </div>
                        <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 flex-shrink-0">
                            {/* Enlarged QR Code linking to support/menu */}
                            <QRCodeSVG 
                                value={`https://planetsswaad.netlify.app/order-support/${order?.id || 'none'}`} 
                                size={90} 
                                fgColor="#2b5b49" 
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

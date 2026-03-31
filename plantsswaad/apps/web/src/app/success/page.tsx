import Link from 'next/link';

export const metadata = {
  title: 'Order Successful | PlanetsSwaad',
  robots: {
    index: false,
    follow: false, // Hide this page from Google Search to prevent accidental organic conversions
  }
};

export default function SuccessPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-earth-50 text-center">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full border border-nature-100 animate-fade-in-up">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-display font-bold text-nature-900 mb-4">
          Order Successful!
        </h1>
        <p className="text-nature-600 mb-8 text-lg">
          Thank you for choosing PlanetsSwaad. Your order has been placed and we are preparing your food. 
          <br /><br />
          <span className="text-sm">You should be redirected to WhatsApp to confirm your order details shortly. If you are not redirected automatically, please check your WhatsApp.</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/profile" 
            className="px-6 py-3 bg-nature-600 text-white font-bold rounded-full hover:bg-nature-700 transition"
          >
            Track Order
          </Link>
          <Link 
            href="/menu" 
            className="px-6 py-3 bg-earth-200 text-nature-800 font-bold rounded-full hover:bg-earth-300 transition"
          >
            Back to Menu
          </Link>
        </div>
      </div>
    </div>
  );
}

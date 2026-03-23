import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center bg-earth-50">
            <div className="text-8xl mb-6">🍽️</div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-nature-900 mb-3">
                Page Not Found
            </h1>
            <p className="text-nature-600 text-lg max-w-md mb-10 leading-relaxed">
                Looks like this dish isn&apos;t on the menu! The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    href="/"
                    className="px-8 py-3.5 bg-nature-500 hover:bg-nature-400 text-white rounded-full font-bold transition-all duration-300 hover:scale-105 shadow-lg shadow-nature-500/20"
                >
                    Go Home
                </Link>
                <Link
                    href="/menu"
                    className="px-8 py-3.5 bg-white border border-nature-200 text-nature-700 hover:bg-nature-50 rounded-full font-bold transition-all duration-300"
                >
                    View Menu 🍛
                </Link>
            </div>
        </div>
    );
}

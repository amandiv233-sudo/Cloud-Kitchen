import Link from 'next/link';

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen bg-nature-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h1 className="text-3xl font-display font-bold text-nature-900">Access Denied</h1>
                <p className="text-nature-600">
                    You do not have the required permissions to view this page. If you believe this is an error, please contact your administrator.
                </p>
                <div className="pt-4">
                    <Link href="/" className="inline-block bg-nature-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-nature-600 transition">
                        Return Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

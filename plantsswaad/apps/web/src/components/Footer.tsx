import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-nature-950 text-white mt-auto">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

                    {/* Brand Column */}
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <span className="text-2xl font-display font-bold text-white">PlanetsSwaad</span>
                            <span className="text-2xl">🍃</span>
                        </Link>
                        <p className="text-nature-300 text-sm leading-relaxed mb-5 italic">
                            &quot;Swad Jo Dil Ko Chhoo Jaye&quot;
                        </p>
                        <p className="text-nature-400 text-sm leading-relaxed">
                            Bhagalpur&apos;s premier cloud kitchen serving 100% pure veg North Indian food with fast delivery.
                        </p>
                        <div className="flex gap-3 mt-6">
                            <a
                                href="https://www.instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 bg-nature-800 hover:bg-nature-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                                aria-label="Instagram"
                            >📸</a>
                            <a
                                href="https://www.facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 bg-nature-800 hover:bg-nature-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                                aria-label="Facebook"
                            >📘</a>
                            <a
                                href="https://www.zomato.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 bg-nature-800 hover:bg-nature-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                                aria-label="Zomato"
                            >🍽️</a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Quick Links</h3>
                        <ul className="space-y-3">
                            {[
                                { href: '/', label: 'Home' },
                                { href: '/menu', label: 'Menu' },
                                { href: '/areas', label: 'Delivery Areas' },
                                { href: '/faq', label: 'FAQ' },
                                { href: '/profile', label: 'My Profile' },
                            ].map(({ href, label }) => (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        className="text-nature-400 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-nature-600 group-hover:bg-nature-400 transition-colors"></span>
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Delivery Info */}
                    <div>
                        <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">We Deliver To</h3>
                        <ul className="space-y-3">
                            {['Nathnagar', 'Adampur', 'Barari', 'Sabour', 'Champanagar', 'TDC College Area', 'Tilkamanjhi'].map((area) => (
                                <li key={area}>
                                    <Link
                                        href="/areas"
                                        className="text-nature-400 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-nature-600 group-hover:bg-nature-400 transition-colors"></span>
                                        {area}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & Hours */}
                    <div>
                        <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Contact & Hours</h3>
                        <ul className="space-y-4 text-sm text-nature-400">
                            <li className="flex items-start gap-3">
                                <span className="mt-0.5">📍</span>
                                <span>Bhagalpur, Bihar — 812001</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span>🕘</span>
                                <span>Mon – Sun: 9:00 AM – 11:00 PM</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span>🛵</span>
                                <span>Free delivery above ₹199</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span>🌿</span>
                                <span>100% Pure Vegetarian Kitchen</span>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-nature-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                        <p className="text-nature-500 text-xs text-center md:text-left">
                            © {new Date().getFullYear()} PlanetsSwaad. All rights reserved. | Bhagalpur, Bihar
                        </p>
                        <div className="flex items-center gap-4 text-xs text-nature-500">
                            <Link href="/faq" className="hover:text-nature-300 transition-colors">FAQ</Link>
                            <span>·</span>
                            <Link href="/areas" className="hover:text-nature-300 transition-colors">Delivery Areas</Link>
                            <span>·</span>
                            <Link href="/sitemap.xml" className="hover:text-nature-300 transition-colors">Sitemap</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Developer Credit ── subtle, elegant, non-intrusive */}
            <div className="border-t border-nature-900 bg-nature-950/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-[11px] text-nature-700">
                        <span className="flex items-center gap-1.5">
                            <span className="text-nature-600">⚙</span>
                            Designed &amp; Developed by
                            <span className="font-semibold text-nature-500">Aman Kumar</span>
                        </span>
                        <span className="hidden sm:inline text-nature-800">·</span>
                        <a
                            href="tel:+917061545199"
                            className="text-nature-600 hover:text-nature-400 transition-colors duration-200"
                        >
                            +91 70615 45199
                        </a>
                        <span className="hidden sm:inline text-nature-800">·</span>
                        <a
                            href="mailto:amandiv2345@gmail.com"
                            className="text-nature-600 hover:text-nature-400 transition-colors duration-200"
                        >
                            amandiv2345@gmail.com
                        </a>
                    </div>
                </div>
            </div>

        </footer>
    );
}

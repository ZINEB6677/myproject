// ============================================================
// Footer Component
// ============================================================

import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-950 border-t border-gray-800/50 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                B
                            </div>
                            <span className="font-bold text-xl gradient-text">BookVerse</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            Your AI-powered gateway to the world of books. Discover, explore, and find your next favorite read with personalized recommendations.
                        </p>
                        <div className="flex gap-4 mt-6">
                            {/* Social links */}
                            {['twitter', 'github', 'instagram'].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-indigo-500/20 hover:border-indigo-500/50 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-indigo-400 transition-all"
                                    aria-label={social}
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-gray-200 mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {[
                                { label: 'Home', href: '/' },
                                { label: 'Browse Books', href: '/' },
                                { label: 'My Orders', href: '/orders' },
                                { label: 'Login', href: '/login' },
                                { label: 'Register', href: '/register' },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-indigo-400 text-sm transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="font-semibold text-gray-200 mb-4">Categories</h3>
                        <ul className="space-y-2">
                            {['Fiction', 'Technology', 'Self-Help', 'Science', 'History', 'Biography'].map(
                                (cat) => (
                                    <li key={cat}>
                                        <Link
                                            href={`/?category=${cat}`}
                                            className="text-gray-400 hover:text-indigo-400 text-sm transition-colors"
                                        >
                                            {cat}
                                        </Link>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-sm">
                        © {currentYear} BookVerse. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-sm">Powered by</span>
                        <span className="badge badge-primary text-xs">AI Recommendations</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

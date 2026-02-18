'use client';

// ============================================================
// Navbar Component
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const { totalItems } = useCart();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/?search=${encodeURIComponent(searchQuery.trim())}`;
        }
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-gray-950/95 backdrop-blur-md shadow-lg shadow-black/20 border-b border-gray-800/50'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform">

                        </div>
                        <span className="font-bold text-xl gradient-text">Kunooz</span>
                    </Link>

                    {/* Desktop Search */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search books, authors..."
                                className="w-full bg-gray-900/80 border border-gray-700 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                            />
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </form>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-2">
                        <Link
                            href="/"
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === '/' ? 'text-indigo-400 bg-indigo-500/10' : 'text-gray-400 hover:text-gray-100'
                                }`}
                        >
                            Books
                        </Link>

                        {isAdmin && (
                            <Link
                                href="/admin"
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname.startsWith('/admin') ? 'text-indigo-400 bg-indigo-500/10' : 'text-gray-400 hover:text-gray-100'
                                    }`}
                            >
                                Admin
                            </Link>
                        )}

                        {/* Cart */}
                        <Link
                            href="/checkout"
                            className="relative p-2 text-gray-400 hover:text-gray-100 transition-colors"
                            aria-label="Shopping cart"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-9H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                    {totalItems > 9 ? '9+' : totalItems}
                                </span>
                            )}
                        </Link>

                        {/* Auth */}
                        {isAuthenticated ? (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-400 hidden lg:block">
                                    Hi, {user?.name?.split(' ')[0]}
                                </span>
                                <button
                                    onClick={logout}
                                    className="px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-100 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-100 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="btn-primary !py-2 !px-4 !text-sm"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 text-gray-400 hover:text-gray-100"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden bg-gray-950/98 backdrop-blur-md border-t border-gray-800 px-4 py-4 space-y-2">
                    <form onSubmit={handleSearch} className="mb-4">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search books..."
                                className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                            />
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </form>
                    <Link href="/" className="block px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800" onClick={() => setMobileOpen(false)}>Books</Link>
                    <Link href="/checkout" className="block px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800" onClick={() => setMobileOpen(false)}>
                        Cart {totalItems > 0 && <span className="ml-2 badge badge-primary">{totalItems}</span>}
                    </Link>
                    {isAdmin && <Link href="/admin" className="block px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800" onClick={() => setMobileOpen(false)}>Admin</Link>}
                    {isAuthenticated ? (
                        <button onClick={() => { logout(); setMobileOpen(false); }} className="block w-full text-left px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800">
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link href="/login" className="block px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800" onClick={() => setMobileOpen(false)}>Login</Link>
                            <Link href="/register" className="block px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800" onClick={() => setMobileOpen(false)}>Sign Up</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}

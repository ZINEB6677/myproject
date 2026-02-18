'use client';

// ============================================================
// Order Success Page
// ============================================================

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('id');
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        setShowConfetti(true);
        const timer = setTimeout(() => setShowConfetti(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center pt-16 px-4">
            <div className="max-w-md w-full text-center">
                {/* Success Animation */}
                <div className="relative mb-8">
                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto pulse-glow">
                        <div className="w-16 h-16 bg-green-500/30 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                    {showConfetti && (
                        <div className="absolute inset-0 pointer-events-none">
                            {['🎉', '📚', '✨', '🎊', '⭐'].map((emoji, i) => (
                                <span
                                    key={i}
                                    className="absolute text-2xl animate-bounce"
                                    style={{
                                        left: `${20 + i * 15}%`,
                                        top: `${Math.random() * 50}%`,
                                        animationDelay: `${i * 0.1}s`,
                                    }}
                                >
                                    {emoji}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <h1 className="text-3xl font-bold text-gray-100 mb-3">
                    Order Confirmed! 🎉
                </h1>
                <p className="text-gray-400 mb-2">
                    Thank you for your purchase. Your books are on their way!
                </p>
                {orderId && (
                    <p className="text-gray-500 text-sm mb-8">
                        Order ID: <span className="text-indigo-400 font-mono">{orderId.slice(0, 20)}...</span>
                    </p>
                )}

                <div className="glass-card p-6 mb-8 text-left space-y-3">
                    {[
                        { icon: '📧', text: 'Confirmation email sent to your inbox' },
                        { icon: '📦', text: 'Estimated delivery: 3-5 business days' },
                        { icon: '🔍', text: 'Track your order in My Orders section' },
                    ].map((item) => (
                        <div key={item.text} className="flex items-center gap-3 text-sm text-gray-400">
                            <span className="text-xl">{item.icon}</span>
                            <span>{item.text}</span>
                        </div>
                    ))}
                </div>

                <div className="flex gap-4">
                    <Link href="/" className="btn-secondary flex-1 justify-center">
                        Continue Shopping
                    </Link>
                    <Link href="/orders" className="btn-primary flex-1 justify-center">
                        My Orders
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center pt-16"><div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent"></div></div>}>
            <OrderSuccessContent />
        </Suspense>
    );
}

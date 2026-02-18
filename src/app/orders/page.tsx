'use client';

// ============================================================
// My Orders Page
// ============================================================

import { useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GET_MY_ORDERS } from '@/graphql/queries';
import { useAuth } from '@/context/AuthContext';
import { TableSkeleton } from '@/components/Skeletons';
import Link from 'next/link';

export default function OrdersPage() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login?redirect=/orders');
        }
    }, [isAuthenticated, isLoading, router]);

    const { data, loading } = useQuery(GET_MY_ORDERS, {
        skip: !isAuthenticated,
    });

    const orders = data?.getMyOrders ?? [];

    if (isLoading || loading) {
        return (
            <div className="min-h-screen pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="skeleton h-8 w-48 rounded mb-8" />
                    <TableSkeleton rows={4} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-100 mb-8">My Orders</h1>

                {orders.length === 0 ? (
                    <div className="glass-card p-16 text-center">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-semibold text-gray-200 mb-2">No orders yet</h3>
                        <p className="text-gray-400 mb-6">Start shopping to see your orders here.</p>
                        <Link href="/" className="btn-primary">Browse Books</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order: {
                            _id: string;
                            books: { title: string; price: number; quantity: number }[];
                            totalAmount: number;
                            paymentStatus: string;
                            createdAt: string;
                            shippingAddress: { fullName: string; address: string };
                        }) => (
                            <div key={order._id} className="glass-card p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                    <div>
                                        <p className="text-gray-400 text-xs font-mono">Order #{order._id.slice(-12)}</p>
                                        <p className="text-gray-500 text-xs mt-0.5">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric', month: 'long', day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`badge text-xs ${order.paymentStatus === 'paid' ? 'badge-success' :
                                                order.paymentStatus === 'failed' ? 'badge-error' : 'badge-warning'
                                            }`}>
                                            {order.paymentStatus}
                                        </span>
                                        <span className="text-indigo-400 font-bold">${order.totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="space-y-2 border-t border-gray-800 pt-4">
                                    {order.books.map((book, idx) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                            <span className="text-gray-400">{book.title} × {book.quantity}</span>
                                            <span className="text-gray-300">${(book.price * book.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-800 text-xs text-gray-500">
                                    Shipped to: {order.shippingAddress.fullName}, {order.shippingAddress.address}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

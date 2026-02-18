'use client';

// ============================================================
// Admin Dashboard — Manage Books & Orders — Antique Library Theme
// ============================================================

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    GET_BOOKS,
    GET_ALL_ORDERS,
    CREATE_BOOK,
    UPDATE_BOOK,
    DELETE_BOOK,
} from '@/graphql/queries';
import { useAuth } from '@/context/AuthContext';
import { Book } from '@/types';
import { TableSkeleton } from '@/components/Skeletons';
import StarRating from '@/components/StarRating';

const CATEGORIES = [
    'Fiction', 'Non-Fiction', 'Technology', 'Science', 'History',
    'Biography', 'Self-Help', 'Fantasy', 'Mystery', 'Romance',
    'Thriller', 'Children', 'Education', 'Business', 'Art',
];

const emptyBookForm = {
    title: '', author: '', description: '', price: 0,
    category: 'Fiction', image: '', rating: 4.0, stock: 10,
};

type Tab = 'books' | 'orders';

export default function AdminPage() {
    const { isAdmin, isLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('books');
    const [showForm, setShowForm] = useState(false);
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [formData, setFormData] = useState(emptyBookForm);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        if (!isLoading && !isAdmin) router.push('/');
    }, [isAdmin, isLoading, router]);

    const { data: booksData, loading: booksLoading, refetch: refetchBooks } =
        useQuery(GET_BOOKS, { variables: { limit: 100 } });

    const { data: ordersData, loading: ordersLoading } =
        useQuery(GET_ALL_ORDERS);

    const [createBook, { loading: creating }] = useMutation(CREATE_BOOK, {
        onCompleted: () => {
            setShowForm(false);
            setFormData(emptyBookForm);
            refetchBooks();
            showSuccess('Book created successfully!');
        },
    });

    const [updateBook, { loading: updating }] = useMutation(UPDATE_BOOK, {
        onCompleted: () => {
            setShowForm(false);
            setEditingBook(null);
            setFormData(emptyBookForm);
            refetchBooks();
            showSuccess('Book updated successfully!');
        },
    });

    const [deleteBook] = useMutation(DELETE_BOOK, {
        onCompleted: () => {
            setDeleteConfirm(null);
            refetchBooks();
            showSuccess('Book deleted successfully!');
        },
    });

    const showSuccess = (msg: string) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div
                    className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: '#4B3621 #4B3621 #4B3621 transparent' }}
                />
            </div>
        );
    }

    const books: Book[] = booksData?.getBooks ?? [];
    const orders = ordersData?.getAllOrders ?? [];

    return (
        <div className="min-h-screen pt-20 pb-16" style={{ backgroundColor: '#F3E9D2' }}>
            <div className="max-w-7xl mx-auto px-4 py-10">

                {/* Header */}
                <div className="flex justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold" style={{ color: '#4B3621' }}>
                            Admin Dashboard
                        </h1>
                        <p style={{ color: '#6E6259' }}>Manage your bookstore</p>
                    </div>
                </div>

                {/* Success Message */}
                {successMsg && (
                    <div
                        className="border rounded-xl p-4 mb-6 text-sm"
                        style={{
                            backgroundColor: 'rgba(75,54,33,0.1)',
                            borderColor: 'rgba(75,54,33,0.3)',
                            color: '#4B3621',
                        }}
                    >
                        ✓ {successMsg}
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {(['books', 'orders'] as Tab[]).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className="px-4 py-2 rounded-lg text-sm font-medium capitalize"
                            style={{
                                backgroundColor: activeTab === tab ? '#4B3621' : '#EFE4C8',
                                color: activeTab === tab ? '#F3E9D2' : '#6E6259',
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content Card */}
                <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                        background: '#EFE4C8',
                        border: '1px solid #D6C8A8',
                        boxShadow: '0 4px 12px rgba(75,54,33,0.15)',
                    }}
                >
                    {activeTab === 'books' && (
                        booksLoading ? (
                            <div className="p-6"><TableSkeleton rows={5} /></div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #D6C8A8' }}>
                                            <th className="p-4 text-left text-sm" style={{ color: '#6E6259' }}>Book</th>
                                            <th className="p-4 text-left text-sm" style={{ color: '#6E6259' }}>Price</th>
                                            <th className="p-4 text-right text-sm" style={{ color: '#6E6259' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {books.map(book => (
                                            <tr key={book._id} style={{ borderBottom: '1px solid #D6C8A8' }}>
                                                <td className="p-4">
                                                    <p style={{ color: '#2B2B2B' }}>{book.title}</p>
                                                    <p className="text-xs" style={{ color: '#6E6259' }}>{book.author}</p>
                                                </td>
                                                <td className="p-4 font-semibold" style={{ color: '#6B2F2F' }}>
                                                    ${book.price.toFixed(2)}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        className="px-3 py-1 rounded"
                                                        style={{
                                                            backgroundColor: '#6B2F2F',
                                                            color: '#F3E9D2',
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    )}

                    {activeTab === 'orders' && (
                        ordersLoading ? (
                            <div className="p-6"><TableSkeleton rows={5} /></div>
                        ) : (
                            <div className="p-6 text-sm" style={{ color: '#6E6259' }}>
                                Orders table (colors updated only)
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

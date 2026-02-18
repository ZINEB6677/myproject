'use client';

// ============================================================
// Book Detail Page — /book/[id]
// ============================================================

import { useQuery } from '@apollo/client';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { GET_BOOK_BY_ID, GET_RELATED_BOOKS } from '@/graphql/queries';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import StarRating from '@/components/StarRating';
import BookCard from '@/components/BookCard';
import { BookDetailSkeleton, BookCardSkeleton } from '@/components/Skeletons';
import { useState } from 'react';

export default function BookDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    const { data, loading, error } = useQuery(GET_BOOK_BY_ID, {
        variables: { id },
    });

    const { data: relatedData, loading: relatedLoading } = useQuery(GET_RELATED_BOOKS, {
        variables: { bookId: id, limit: 4 },
        skip: !id,
    });

    const book = data?.getBookById;
    const relatedBooks = relatedData?.getRelatedBooks ?? [];

    const handleAddToCart = () => {
        if (!book) return;
        addToCart(book, quantity);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleBuyNow = () => {
        if (!book) return;
        addToCart(book, quantity);
        if (!isAuthenticated) {
            router.push('/login?redirect=/checkout');
        } else {
            router.push('/checkout');
        }
    };

    if (loading) return <BookDetailSkeleton />;

    if (error || !book) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-16">
                <div className="glass-card p-12 text-center max-w-md">
                    <div className="text-6xl mb-4">📖</div>
                    <h2 className="text-2xl font-bold text-gray-200 mb-2">Book Not Found</h2>
                    <p className="text-gray-400 mb-6">This book doesn&apos;t exist or has been removed.</p>
                    <Link href="/" className="btn-primary">Browse Books</Link>
                </div>
            </div>
        );
    }

    const stockStatus =
        book.stock === 0
            ? { label: 'Out of Stock', color: 'badge-error' }
            : book.stock < 5
                ? { label: `Only ${book.stock} left!`, color: 'badge-warning' }
                : { label: 'In Stock', color: 'badge-success' };

    return (
        <div className="min-h-screen pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                    <Link href="/" className="hover:text-indigo-400 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href={`/?category=${book.category}`} className="hover:text-indigo-400 transition-colors">{book.category}</Link>
                    <span>/</span>
                    <span className="text-gray-300 truncate max-w-xs">{book.title}</span>
                </nav>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Book Cover */}
                    <div className="flex justify-center lg:justify-start">
                        <div className="relative w-full max-w-sm aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/10 glow-primary">
                            <Image
                                src={book.image}
                                alt={`Cover of ${book.title}`}
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        </div>
                    </div>

                    {/* Book Info */}
                    <div className="flex flex-col justify-center">
                        {/* Category */}
                        <span className="badge badge-primary mb-4 self-start">{book.category}</span>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-3 leading-tight">
                            {book.title}
                        </h1>

                        {/* Author */}
                        <p className="text-xl text-gray-400 mb-4">by <span className="text-indigo-400">{book.author}</span></p>

                        {/* Rating */}
                        <div className="flex items-center gap-3 mb-6">
                            <StarRating rating={book.rating} size="lg" />
                            <span className="text-gray-300 font-semibold">{book.rating.toFixed(1)}</span>
                            <span className="text-gray-500 text-sm">/ 5.0</span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-400 leading-relaxed mb-6">{book.description}</p>

                        {/* Stock Status */}
                        <div className="flex items-center gap-3 mb-6">
                            <span className={`badge ${stockStatus.color}`}>{stockStatus.label}</span>
                            {book.stock > 0 && (
                                <span className="text-gray-500 text-sm">{book.stock} copies available</span>
                            )}
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3 mb-8">
                            <span className="text-4xl font-bold gradient-text">${book.price.toFixed(2)}</span>
                            <span className="text-gray-500 line-through text-lg">
                                ${(book.price * 1.2).toFixed(2)}
                            </span>
                            <span className="badge badge-success text-xs">20% OFF</span>
                        </div>

                        {/* Quantity & Actions */}
                        {book.stock > 0 && (
                            <div className="space-y-4">
                                {/* Quantity Selector */}
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-400 text-sm">Quantity:</span>
                                    <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-8 h-8 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 flex items-center justify-center transition-colors"
                                            aria-label="Decrease quantity"
                                        >
                                            −
                                        </button>
                                        <span className="w-8 text-center font-semibold text-gray-100">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(book.stock, quantity + 1))}
                                            className="w-8 h-8 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 flex items-center justify-center transition-colors"
                                            aria-label="Increase quantity"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleAddToCart}
                                        className={`btn-secondary flex-1 ${addedToCart ? 'border-green-500 text-green-400' : ''}`}
                                    >
                                        {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
                                    </button>
                                    <button
                                        onClick={handleBuyNow}
                                        className="btn-primary flex-1"
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Features */}
                        <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-800">
                            {[
                                { icon: '🚚', label: 'Free Shipping', sub: 'Orders over $30' },
                                { icon: '🔄', label: 'Easy Returns', sub: '30-day policy' },
                                { icon: '🔒', label: 'Secure Payment', sub: 'SSL encrypted' },
                            ].map((feat) => (
                                <div key={feat.label} className="text-center">
                                    <div className="text-2xl mb-1">{feat.icon}</div>
                                    <div className="text-xs font-semibold text-gray-300">{feat.label}</div>
                                    <div className="text-xs text-gray-500">{feat.sub}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Related Books */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-6 bg-indigo-500 rounded-full" />
                        <h2 className="text-2xl font-bold text-gray-100">AI Recommended</h2>
                        <span className="badge badge-primary text-xs">Based on this book</span>
                    </div>

                    {relatedLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((i) => <BookCardSkeleton key={i} />)}
                        </div>
                    ) : relatedBooks.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedBooks.map((related) => (
                                <BookCard key={related._id} book={related} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No related books found.</p>
                    )}
                </section>
            </div>
        </div>
    );
}

// ============================================================
// Book Card Component
// ============================================================

import Link from 'next/link';
import Image from 'next/image';
import { Book } from '@/types';
import StarRating from './StarRating';

interface BookCardProps {
    book: Book;
}

export default function BookCard({ book }: BookCardProps) {
    return (
        <div className="book-card glass-card overflow-hidden group">
            {/* Book Cover */}
            <div className="relative aspect-[2/3] overflow-hidden bg-gray-800">
                <Image
                    src={book.image}
                    alt={`Cover of ${book.title}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                    <span className="badge badge-primary text-xs">{book.category}</span>
                </div>
                {/* Stock Badge */}
                {book.stock === 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="badge badge-error text-sm">Out of Stock</span>
                    </div>
                )}
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Book Info */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-100 text-sm leading-tight line-clamp-2 mb-1 group-hover:text-indigo-300 transition-colors">
                    {book.title}
                </h3>
                <p className="text-gray-400 text-xs mb-3">{book.author}</p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                    <StarRating rating={book.rating} size="sm" />
                    <span className="text-gray-400 text-xs">({book.rating.toFixed(1)})</span>
                </div>

                {/* Price & Button */}
                <div className="flex items-center justify-between">
                    <span className="text-indigo-400 font-bold text-lg">
                        ${book.price.toFixed(2)}
                    </span>
                    <Link
                        href={`/book/${book._id}`}
                        className="btn-primary !py-1.5 !px-3 !text-xs"
                        aria-label={`View details for ${book.title}`}
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}

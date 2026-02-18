'use client';

// ============================================================
// Home Page — Book Listing with Search & Filter
// ============================================================

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useSearchParams } from 'next/navigation';
import { GET_BOOKS, SEARCH_BOOKS } from '@/graphql/queries';
import BookCard from '@/components/BookCard';
import { BookGridSkeleton } from '@/components/Skeletons';
import { Book } from '@/types';

const CATEGORIES = [
  'All',
  'Fiction',
  'Non-Fiction',
  'Technology',
  'Science',
  'History',
  'Biography',
  'Self-Help',
  'Fantasy',
  'Mystery',
  'Romance',
  'Thriller',
  'Business',
];

export default function HomePage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');
  const [sortBy, setSortBy] = useState('newest');

  // Fetch books
  const { data, loading, error } = useQuery(GET_BOOKS, {
    variables: {
      category: selectedCategory === 'All' ? undefined : selectedCategory,
      limit: 50,
    },
    skip: !!searchQuery,
  });

  // Search books
  const { data: searchData, loading: searchLoading } = useQuery(SEARCH_BOOKS, {
    variables: { query: searchQuery },
    skip: !searchQuery,
  });

  const rawBooks: Book[] = searchQuery
    ? (searchData?.searchBooks ?? [])
    : (data?.getBooks ?? []);

  // Client-side sorting
  const books = [...rawBooks].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc': return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const isLoading = loading || searchLoading;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {!searchQuery && (
        <section className="relative pt-24 pb-16 hero-gradient overflow-hidden">
          {/* Decorative orbs */}
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            {/* CHANGE 1: REMOVED the AI-Powered Recommendations badge (lines 48-50 were deleted) */}

            {/* CHANGE 2: Added treasure icon and changed title to "كنوز" */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-6xl mr-3">💰</span> Kunooz
              <br />
              <span className="gradient-text">Discover Your Next Favorite Book</span>
            </h1>

            {/* CHANGE 3: Description text (optional - changed slightly) */}
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
              Explore thousands of titles. From bestsellers to hidden gems.
            </p>

            {/* Stats - KEPT IN ENGLISH */}
            <div className="flex items-center justify-center gap-8 sm:gap-16">
              {[
                { value: '10K+', label: 'Books' },
                { value: '50K+', label: 'Readers' },
                { value: '4.9★', label: 'Rating' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-gray-500 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search Results Header */}
        {searchQuery && (
          <div className="mb-8 pt-20">
            <h2 className="text-2xl font-bold text-gray-100">
              Search results for{' '}
              <span className="gradient-text">&ldquo;{searchQuery}&rdquo;</span>
            </h2>
            <p className="text-gray-400 mt-1">
              {books.length} book{books.length !== 1 ? 's' : ''} found
            </p>
          </div>
        )}

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap flex-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedCategory === cat
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-gray-800/80 text-gray-400 hover:text-gray-100 hover:bg-gray-700'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort - KEPT IN ENGLISH */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-input !w-auto !py-2 text-sm"
            aria-label="Sort books by"
          >
            <option value="newest">Newest First</option>
            <option value="rating">Top Rated</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {/* Error State */}
        {error && (
          <div className="glass-card p-8 text-center border-red-500/20">
            <div className="text-red-400 text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-200 mb-2">Failed to load books</h3>
            <p className="text-gray-400">{error.message}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && <BookGridSkeleton count={8} />}

        {/* Books Grid */}
        {!isLoading && !error && (
          <>
            {books.length === 0 ? (
              <div className="glass-card p-16 text-center">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-200 mb-2">No books found</h3>
                <p className="text-gray-400">
                  {searchQuery
                    ? `No results for "${searchQuery}". Try a different search.`
                    : 'No books in this category yet.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 fade-in">
                {books.map((book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
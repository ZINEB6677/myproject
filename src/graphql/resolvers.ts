// ============================================================
// GraphQL Resolvers
// ============================================================

import { GraphQLError } from 'graphql';
import { connectDB } from '@/lib/db';
import { signToken } from '@/lib/auth';
import Book from '@/models/Book';
import User from '@/models/User';
import Order from '@/models/Order';
import { GraphQLContext } from '@/types';

// Helper: Check if user is authenticated
function requireAuth(context: GraphQLContext) {
    if (!context.user) {
        throw new GraphQLError('You must be logged in to perform this action', {
            extensions: { code: 'UNAUTHENTICATED' },
        });
    }
    return context.user;
}

// Helper: Check if user is admin
function requireAdmin(context: GraphQLContext) {
    const user = requireAuth(context);
    if (user.role !== 'admin') {
        throw new GraphQLError('You do not have permission to perform this action', {
            extensions: { code: 'FORBIDDEN' },
        });
    }
    return user;
}

export const resolvers = {
    // ---- Queries ----
    Query: {
        /**
         * Get all books with optional filtering
         */
        getBooks: async (
            _: unknown,
            { category, limit = 20, offset = 0 }: { category?: string; limit?: number; offset?: number }
        ) => {
            await connectDB();
            const filter = category ? { category } : {};
            return Book.find(filter)
                .sort({ createdAt: -1 })
                .skip(offset)
                .limit(limit)
                .lean();
        },

        /**
         * Get a single book by ID
         */
        getBookById: async (_: unknown, { id }: { id: string }) => {
            await connectDB();
            const book = await Book.findById(id).lean();
            if (!book) {
                throw new GraphQLError('Book not found', {
                    extensions: { code: 'NOT_FOUND' },
                });
            }
            return book;
        },

        /**
         * AI Recommendation: Get related books based on category and price range
         */
        getRelatedBooks: async (
            _: unknown,
            { bookId, limit = 4 }: { bookId: string; limit?: number }
        ) => {
            await connectDB();
            const book = await Book.findById(bookId).lean();
            if (!book) return [];

            // Find books in same category or similar price range (±30%)
            const priceMin = book.price * 0.7;
            const priceMax = book.price * 1.3;

            const related = await Book.find({
                _id: { $ne: bookId },
                $or: [
                    { category: book.category },
                    { price: { $gte: priceMin, $lte: priceMax } },
                ],
            })
                .sort({ rating: -1 })
                .limit(limit)
                .lean();

            return related;
        },

        /**
         * Full-text search for books
         */
        searchBooks: async (_: unknown, { query }: { query: string }) => {
            await connectDB();
            return Book.find({ $text: { $search: query } })
                .sort({ score: { $meta: 'textScore' } })
                .limit(20)
                .lean();
        },

        /**
         * Get current authenticated user
         */
        getMe: async (_: unknown, __: unknown, context: GraphQLContext) => {
            const user = requireAuth(context);
            await connectDB();
            return User.findById(user.userId).select('-password').lean();
        },

        /**
         * Get all users (admin only)
         */
        getUsers: async (_: unknown, __: unknown, context: GraphQLContext) => {
            requireAdmin(context);
            await connectDB();
            return User.find().select('-password').lean();
        },

        /**
         * Get orders for the current user
         */
        getMyOrders: async (_: unknown, __: unknown, context: GraphQLContext) => {
            const user = requireAuth(context);
            await connectDB();
            return Order.find({ userId: user.userId }).sort({ createdAt: -1 }).lean();
        },

        /**
         * Get all orders (admin only)
         */
        getAllOrders: async (_: unknown, __: unknown, context: GraphQLContext) => {
            requireAdmin(context);
            await connectDB();
            return Order.find().sort({ createdAt: -1 }).lean();
        },
    },

    // ---- Mutations ----
    Mutation: {
        /**
         * Register a new user
         */
        register: async (
            _: unknown,
            { input }: { input: { name: string; email: string; password: string } }
        ) => {
            await connectDB();

            const existingUser = await User.findOne({ email: input.email });
            if (existingUser) {
                throw new GraphQLError('Email already in use', {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }

            const user = await User.create(input);
            const token = signToken({
                userId: user._id.toString(),
                email: user.email,
                role: user.role,
            });

            return {
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    createdAt: user.createdAt,
                },
            };
        },

        /**
         * Login an existing user
         */
        login: async (
            _: unknown,
            { input }: { input: { email: string; password: string } }
        ) => {
            await connectDB();

            const user = await User.findOne({ email: input.email });
            if (!user) {
                throw new GraphQLError('Invalid email or password', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }

            const isValid = await user.comparePassword(input.password);
            if (!isValid) {
                throw new GraphQLError('Invalid email or password', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }

            const token = signToken({
                userId: user._id.toString(),
                email: user.email,
                role: user.role,
            });

            return {
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    createdAt: user.createdAt,
                },
            };
        },

        /**
         * Create a new book (admin only)
         */
        createBook: async (
            _: unknown,
            { input }: { input: Record<string, unknown> },
            context: GraphQLContext
        ) => {
            requireAdmin(context);
            await connectDB();
            return Book.create(input);
        },

        /**
         * Update an existing book (admin only)
         */
        updateBook: async (
            _: unknown,
            { id, input }: { id: string; input: Record<string, unknown> },
            context: GraphQLContext
        ) => {
            requireAdmin(context);
            await connectDB();
            const book = await Book.findByIdAndUpdate(id, input, {
                new: true,
                runValidators: true,
            }).lean();
            if (!book) {
                throw new GraphQLError('Book not found', {
                    extensions: { code: 'NOT_FOUND' },
                });
            }
            return book;
        },

        /**
         * Delete a book (admin only)
         */
        deleteBook: async (
            _: unknown,
            { id }: { id: string },
            context: GraphQLContext
        ) => {
            requireAdmin(context);
            await connectDB();
            const result = await Book.findByIdAndDelete(id);
            return !!result;
        },

        /**
         * Create a new order (authenticated users)
         */
        createOrder: async (
            _: unknown,
            {
                input,
            }: {
                input: {
                    books: { bookId: string; quantity: number }[];
                    totalAmount: number;
                    shippingAddress: {
                        fullName: string;
                        email: string;
                        phone: string;
                        address: string;
                    };
                    paymentIntentId: string;
                };
            },
            context: GraphQLContext
        ) => {
            const user = requireAuth(context);
            await connectDB();

            // Fetch book details and build order books array
            const orderBooks = await Promise.all(
                input.books.map(async ({ bookId, quantity }) => {
                    const book = await Book.findById(bookId).lean();
                    if (!book) throw new GraphQLError(`Book ${bookId} not found`);
                    if (book.stock < quantity) {
                        throw new GraphQLError(`Insufficient stock for "${book.title}"`);
                    }
                    // Decrement stock
                    await Book.findByIdAndUpdate(bookId, { $inc: { stock: -quantity } });
                    return {
                        bookId,
                        title: book.title,
                        price: book.price,
                        quantity,
                    };
                })
            );

            const order = await Order.create({
                userId: user.userId,
                books: orderBooks,
                totalAmount: input.totalAmount,
                paymentStatus: 'paid',
                paymentIntentId: input.paymentIntentId,
                shippingAddress: input.shippingAddress,
            });

            return order;
        },

        /**
         * Update order payment status (admin only)
         */
        updateOrderStatus: async (
            _: unknown,
            { orderId, status }: { orderId: string; status: string },
            context: GraphQLContext
        ) => {
            requireAdmin(context);
            await connectDB();
            const order = await Order.findByIdAndUpdate(
                orderId,
                { paymentStatus: status },
                { new: true }
            ).lean();
            if (!order) throw new GraphQLError('Order not found');
            return order;
        },
    },
};

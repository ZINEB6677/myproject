// ============================================================
// Core TypeScript Types for the AI Bookstore
// ============================================================

export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  stock: number;
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface OrderBook {
  bookId: string;
  title: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  userId: string;
  books: OrderBook[];
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingAddress: ShippingAddress;
  createdAt: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

// GraphQL Input Types
export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface CreateBookInput {
  title: string;
  author: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  stock: number;
}

export interface UpdateBookInput extends Partial<CreateBookInput> {
  id: string;
}

export interface CreateOrderInput {
  books: { bookId: string; quantity: number }[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentIntentId: string;
}

// Context type for GraphQL resolvers
export interface GraphQLContext {
  user?: {
    userId: string;
    email: string;
    role: string;
  } | null;
}

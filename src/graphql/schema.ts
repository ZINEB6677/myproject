// ============================================================
// GraphQL Type Definitions (Schema)
// ============================================================

export const typeDefs = `#graphql
  # ---- Scalar Types ----
  scalar DateTime

  # ---- Book Types ----
  type Book {
    _id: ID!
    title: String!
    author: String!
    description: String!
    price: Float!
    category: String!
    image: String!
    rating: Float!
    stock: Int!
    createdAt: DateTime!
  }

  # ---- User Types ----
  type User {
    _id: ID!
    name: String!
    email: String!
    role: String!
    createdAt: DateTime!
  }

  # ---- Auth Types ----
  type AuthPayload {
    token: String!
    user: User!
  }

  # ---- Order Types ----
  type OrderBook {
    bookId: ID!
    title: String!
    price: Float!
    quantity: Int!
  }

  type ShippingAddress {
    fullName: String!
    email: String!
    phone: String!
    address: String!
  }

  type Order {
    _id: ID!
    userId: ID!
    books: [OrderBook!]!
    totalAmount: Float!
    paymentStatus: String!
    paymentIntentId: String!
    shippingAddress: ShippingAddress!
    createdAt: DateTime!
  }

  # ---- Input Types ----
  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input CreateBookInput {
    title: String!
    author: String!
    description: String!
    price: Float!
    category: String!
    image: String!
    rating: Float
    stock: Int!
  }

  input UpdateBookInput {
    title: String
    author: String
    description: String
    price: Float
    category: String
    image: String
    rating: Float
    stock: Int
  }

  input OrderBookInput {
    bookId: ID!
    quantity: Int!
  }

  input ShippingAddressInput {
    fullName: String!
    email: String!
    phone: String!
    address: String!
  }

  input CreateOrderInput {
    books: [OrderBookInput!]!
    totalAmount: Float!
    shippingAddress: ShippingAddressInput!
    paymentIntentId: String!
  }

  # ---- Queries ----
  type Query {
    # Book queries
    getBooks(category: String, limit: Int, offset: Int): [Book!]!
    getBookById(id: ID!): Book
    getRelatedBooks(bookId: ID!, limit: Int): [Book!]!
    searchBooks(query: String!): [Book!]!

    # User queries (admin only)
    getUsers: [User!]!
    getMe: User

    # Order queries
    getMyOrders: [Order!]!
    getAllOrders: [Order!]!  # admin only
  }

  # ---- Mutations ----
  type Mutation {
    # Auth mutations
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!

    # Book mutations (admin only)
    createBook(input: CreateBookInput!): Book!
    updateBook(id: ID!, input: UpdateBookInput!): Book!
    deleteBook(id: ID!): Boolean!

    # Order mutations
    createOrder(input: CreateOrderInput!): Order!
    updateOrderStatus(orderId: ID!, status: String!): Order!  # admin only
  }
`;

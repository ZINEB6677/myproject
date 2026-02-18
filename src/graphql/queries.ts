// ============================================================
// GraphQL Queries & Mutations (Client-side)
// ============================================================

import { gql } from '@apollo/client';

// ---- Book Fragments ----
export const BOOK_FRAGMENT = gql`
  fragment BookFields on Book {
    _id
    title
    author
    description
    price
    category
    image
    rating
    stock
    createdAt
  }
`;

// ---- Queries ----
export const GET_BOOKS = gql`
  query GetBooks($category: String, $limit: Int, $offset: Int) {
    getBooks(category: $category, limit: $limit, offset: $offset) {
      ...BookFields
    }
  }
  ${BOOK_FRAGMENT}
`;

export const GET_BOOK_BY_ID = gql`
  query GetBookById($id: ID!) {
    getBookById(id: $id) {
      ...BookFields
    }
  }
  ${BOOK_FRAGMENT}
`;

export const GET_RELATED_BOOKS = gql`
  query GetRelatedBooks($bookId: ID!, $limit: Int) {
    getRelatedBooks(bookId: $bookId, limit: $limit) {
      ...BookFields
    }
  }
  ${BOOK_FRAGMENT}
`;

export const SEARCH_BOOKS = gql`
  query SearchBooks($query: String!) {
    searchBooks(query: $query) {
      ...BookFields
    }
  }
  ${BOOK_FRAGMENT}
`;

export const GET_ME = gql`
  query GetMe {
    getMe {
      _id
      name
      email
      role
      createdAt
    }
  }
`;

export const GET_MY_ORDERS = gql`
  query GetMyOrders {
    getMyOrders {
      _id
      books {
        bookId
        title
        price
        quantity
      }
      totalAmount
      paymentStatus
      shippingAddress {
        fullName
        email
        phone
        address
      }
      createdAt
    }
  }
`;

export const GET_ALL_ORDERS = gql`
  query GetAllOrders {
    getAllOrders {
      _id
      userId
      books {
        bookId
        title
        price
        quantity
      }
      totalAmount
      paymentStatus
      shippingAddress {
        fullName
        email
      }
      createdAt
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      _id
      name
      email
      role
      createdAt
    }
  }
`;

// ---- Mutations ----
export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        _id
        name
        email
        role
      }
    }
  }
`;

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        _id
        name
        email
        role
      }
    }
  }
`;

export const CREATE_BOOK = gql`
  mutation CreateBook($input: CreateBookInput!) {
    createBook(input: $input) {
      ...BookFields
    }
  }
  ${BOOK_FRAGMENT}
`;

export const UPDATE_BOOK = gql`
  mutation UpdateBook($id: ID!, $input: UpdateBookInput!) {
    updateBook(id: $id, input: $input) {
      ...BookFields
    }
  }
  ${BOOK_FRAGMENT}
`;

export const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id)
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      _id
      totalAmount
      paymentStatus
      createdAt
    }
  }
`;

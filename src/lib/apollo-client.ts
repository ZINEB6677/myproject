// ============================================================
// Apollo Client Setup (Client-side)
// ============================================================

import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// HTTP link pointing to our GraphQL API route
const httpLink = createHttpLink({
    uri: '/api/graphql',
});

// Auth link: attaches JWT token to every request
const authLink = setContext((_, { headers }) => {
    const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});

// Error link: handles GraphQL and network errors globally
const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, extensions }) => {
            console.error(`[GraphQL error]: ${message}`);
            // Auto-logout on auth errors
            if (
                extensions?.code === 'UNAUTHENTICATED' &&
                typeof window !== 'undefined'
            ) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        });
    }
    if (networkError) {
        console.error(`[Network error]: ${networkError}`);
    }
});

// Create the Apollo Client instance
const client = new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    getBooks: {
                        // Merge paginated results
                        keyArgs: ['category'],
                        merge(existing = [], incoming) {
                            return [...existing, ...incoming];
                        },
                    },
                },
            },
        },
    }),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
        },
    },
});

export default client;

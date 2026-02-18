// ============================================================
// GraphQL API Route Handler (Next.js App Router)
// ============================================================

import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from '@/graphql/schema';
import { resolvers } from '@/graphql/resolvers';
import { extractToken, verifyToken } from '@/lib/auth';
import { GraphQLContext } from '@/types';
import { NextRequest } from 'next/server';

// Create Apollo Server instance
const server = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
    introspection: process.env.NODE_ENV !== 'production',
});

// Create the Next.js handler with context
const handler = startServerAndCreateNextHandler<NextRequest, GraphQLContext>(
    server,
    {
        context: async (req) => {
            // Extract and verify JWT from Authorization header
            const authHeader = req.headers.get('authorization') ?? undefined;
            const token = extractToken(authHeader);
            const user = token ? verifyToken(token) : null;

            return {
                user: user
                    ? {
                        userId: user.userId,
                        email: user.email,
                        role: user.role,
                    }
                    : null,
            };
        },
    }
);

export { handler as GET, handler as POST };

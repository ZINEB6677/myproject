import { NextRequest } from 'next/server';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { gql } from 'graphql-tag';

// Your GraphQL schema
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Your resolvers
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Create handler with Next.js App Router compatibility
const handler = startServerAndCreateNextHandler(server);

// Export GET and POST methods for App Router
export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}
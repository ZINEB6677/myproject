import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ApolloWrapper from '@/components/ApolloWrapper';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Kunooz',
    template: '%s | Kunooz',
  },
  description:
    'Discover your next favorite book with AI-powered recommendations. Shop thousands of titles across all genres with fast delivery.',
  keywords: ['bookstore', 'books', 'AI recommendations', 'online shopping', 'ebooks'],
  openGraph: {
    title: 'kunooz',
    description: 'Discover your next favorite book with AI-powered recommendations.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-gray-950 text-gray-100 min-h-screen flex flex-col antialiased">
        <ApolloWrapper>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </CartProvider>
          </AuthProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}

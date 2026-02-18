// ============================================================
// Database Seed Script
// Run: npx ts-node --project tsconfig.json src/lib/seed.ts
// Or add to package.json: "seed": "npx tsx src/lib/seed.ts"
// ============================================================

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookstore';

const books = [
    {
        title: 'The Pragmatic Programmer',
        author: 'David Thomas & Andrew Hunt',
        description:
            'A guide to becoming a better programmer. Covers topics from personal responsibility and career development to architectural techniques for keeping your code flexible and easy to adapt and reuse.',
        price: 39.99,
        category: 'Technology',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop',
        rating: 4.8,
        stock: 50,
    },
    {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        description:
            'A handbook of agile software craftsmanship. Even bad code can function, but if code isn\'t clean, it can bring a development organization to its knees.',
        price: 34.99,
        category: 'Technology',
        image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop',
        rating: 4.7,
        stock: 35,
    },
    {
        title: 'Atomic Habits',
        author: 'James Clear',
        description:
            'An easy and proven way to build good habits and break bad ones. Tiny changes, remarkable results.',
        price: 27.99,
        category: 'Self-Help',
        image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop',
        rating: 4.9,
        stock: 80,
    },
    {
        title: 'Dune',
        author: 'Frank Herbert',
        description:
            'Set in the distant future amidst a feudal interstellar society, Dune tells the story of young Paul Atreides, whose family accepts the stewardship of the planet Arrakis.',
        price: 19.99,
        category: 'Fiction',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
        rating: 4.8,
        stock: 60,
    },
    {
        title: 'Sapiens: A Brief History of Humankind',
        author: 'Yuval Noah Harari',
        description:
            'A brief history of humankind, from the Stone Age to the twenty-first century. How did our species succeed in the battle for dominance?',
        price: 24.99,
        category: 'History',
        image: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=400&h=600&fit=crop',
        rating: 4.6,
        stock: 45,
    },
    {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        description:
            'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, of lavish parties on Long Island at a time when The New York Times noted "gin was the national drink and sex the national obsession."',
        price: 14.99,
        category: 'Fiction',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
        rating: 4.3,
        stock: 100,
    },
    {
        title: 'Deep Work',
        author: 'Cal Newport',
        description:
            'Rules for focused success in a distracted world. The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable in our economy.',
        price: 22.99,
        category: 'Self-Help',
        image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=600&fit=crop',
        rating: 4.5,
        stock: 55,
    },
    {
        title: 'The Design of Everyday Things',
        author: 'Don Norman',
        description:
            'A powerful primer on how—and why—some products satisfy customers while others only frustrate them. Revised and expanded edition.',
        price: 29.99,
        category: 'Technology',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
        rating: 4.4,
        stock: 30,
    },
];

const adminUser = {
    name: 'Admin User',
    email: 'admin@bookstore.com',
    password: 'admin123456',
    role: 'admin',
};

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Import models
        const { default: Book } = await import('./src/models/Book.js' as string);
        const { default: User } = await import('./src/models/User.js' as string);

        // Clear existing data
        await Book.deleteMany({});
        await User.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Insert books
        await Book.insertMany(books);
        console.log(`📚 Inserted ${books.length} books`);

        // Create admin user
        await User.create(adminUser);
        console.log('👤 Created admin user: admin@bookstore.com / admin123456');

        console.log('✅ Seed completed successfully!');
    } catch (error) {
        console.error('❌ Seed failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

seed();

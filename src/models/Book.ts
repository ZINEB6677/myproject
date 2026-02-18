// ============================================================
// Book Model - MongoDB Schema
// ============================================================

import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IBook extends Document {
    title: string;
    author: string;
    description: string;
    price: number;
    category: string;
    image: string;
    rating: number;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
}

const BookSchema = new Schema<IBook>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        author: {
            type: String,
            required: [true, 'Author is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            maxlength: [5000, 'Description cannot exceed 5000 characters'],
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: [
                'Fiction',
                'Non-Fiction',
                'Science',
                'Technology',
                'History',
                'Biography',
                'Self-Help',
                'Fantasy',
                'Mystery',
                'Romance',
                'Thriller',
                'Children',
                'Education',
                'Business',
                'Art',
            ],
        },
        image: {
            type: String,
            required: [true, 'Image URL is required'],
        },
        rating: {
            type: Number,
            default: 0,
            min: [0, 'Rating cannot be less than 0'],
            max: [5, 'Rating cannot exceed 5'],
        },
        stock: {
            type: Number,
            required: [true, 'Stock is required'],
            min: [0, 'Stock cannot be negative'],
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Index for search and filtering
BookSchema.index({ title: 'text', author: 'text', description: 'text' });
BookSchema.index({ category: 1 });
BookSchema.index({ price: 1 });
BookSchema.index({ rating: -1 });

const Book: Model<IBook> =
    mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);

export default Book;
